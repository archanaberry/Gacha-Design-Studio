# DIAGNOSA & SOLUSI: Panel1-LayerContainer Centering & Responsiveness

## 📋 Ringkasan Masalah

`panel1-layercontainer` tidak selalu **ke-tengah layar** dan **tidak responsif** saat window di-resize atau zoom diubah.

---

## 🔍 ANALISIS GIT HISTORY

### Commit Terakhir yang Relevan
**Commit:** `0d548b6` (Jan 31, 2026, 04:10)  
**Message:** "Make more stable drag and new feature zoom panel1 with bounding box scereen"

**File yang berubah:**
- `studiopose.html` - Tambah panel1-layercontainer dengan CSS baru
- `js/studiocharacter/sensivity.js` - Tambah zoom handler  
- `js/studiocharacter/centerorigin.js` - Baru, untuk center origin logic
- `js/studiocharacter/layerrenderoffset.js` - Baru, untuk offset calculation

**Status:** Fitur zoom & center origin sudah ditambahkan tapi **belum robust terhadap responsiveness**.

---

## 🎯 ROOT CAUSE (Penyebab Utama)

### 1. **CSS Layout Tidak Responsive**
```css
/* MASALAH: hard-coded position dengan top:0, left:0 */
.panel1-layercontainer {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    transform: scale(1);  /* scale tanpa preserving center */
}
```

**Issue:**
- `position: absolute` relatif ke parent (`panel1.container`)
- Tidak ada `transform: translate(-50%, -50%)` untuk centering sebelum scale
- Saat `scale()` diaplikasikan, visual center **bergeser**
- `top:0, left:0, right:0, bottom:0` stretched tapi **bukan centered**

### 2. **Responsiveness Tidak Dipunyai**
- **Tidak ada event listener** untuk `window.resize` atau `ResizeObserver`
- Saat window di-resize, `panel1-layercontainer` tetap size lama
- Saat orientasi device berubah (mobile), layout jebol

### 3. **Zoom dengan Scale Menggeser Center**
```javascript
// Saat zoom slider berubah:
layerContainer.style.transform = `scale(${scale})`;
// Ini membuat scale dari top-left (0,0), bukan dari center!
```

**Problem:** 
- Seharusnya `scale()` + `translate()` bersamaan untuk maintain center
- Sekarang scale murni dari top-left → object bergeser ke arah top-left saat di-zoom

### 4. **Logic Offset Calculation Ada tapi Tidak Diaplikasikan**
- `layerrenderoffset.js` menghitung offset yang benar  
- `centerorigin.js` ada logic untuk translate  
- **TAPI** sensivity.js (zoom handler) **tidak menggunakan offset ini saat apply transform**

---

## 🔧 SOLUSI LENGKAP

### BAGIAN A: FIX CSS (Centering yang Robust)

**Edit `studiopose.html` line 32-44:**

```css
/* BEFORE (BUGGY) */
.panel1-layercontainer {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
    transform-origin: center center;
    transform: scale(1);
    overflow: hidden;
    max-width: 100%;
    max-height: 100%;
}

/* AFTER (FIXED) */
.panel1-layercontainer {
    position: absolute;
    top: 50%;                          /* BARU: 50% untuk center */
    left: 50%;                         /* BARU: 50% untuk center */
    width: 100%;                       /* UBAH: dari right:0, bottom:0 */
    height: 100%;                      /* UBAH: dari right:0, bottom:0 */
    z-index: 1;
    transform-origin: center center;
    transform: translate(-50%, -50%) scale(1);  /* BARU: translate(-50%, -50%) */
    overflow: hidden;
    max-width: 100%;
    max-height: 100%;
}
```

**Penjelasan:**
- `left: 50%; top: 50%` → posisi top-left corner ke center
- `transform: translate(-50%, -50%)` → geser elemen setengah size-nya ke belakang → center visual
- `width: 100%; height: 100%` → tetap fill parent (panel1)
- Sekarang scale() akan berasal dari center, bukan top-left!

---

### BAGIAN B: FIX JAVASCRIPT (Responsiveness & Zoom)

**Edit `js/studiocharacter/sensivity.js` - replace `handleZoom()` function:**

```javascript
function handleZoom(value) {
    const zoomValue = parseFloat(value);
    const layerContainer = document.getElementById('panel1-layercontainer');
    
    if (layerContainer) {
        const scale = zoomValue / 100;
        layerContainer.dataset.scale = scale;
        
        // PENTING: Preserve center origin jika aktif, dan maintain centering
        const isCenterOriginActive = layerContainer.dataset.centerOriginActive === 'true';
        
        if (isCenterOriginActive) {
            const centerOffsetX = parseFloat(layerContainer.dataset.centerOffsetX) || 0;
            const centerOffsetY = parseFloat(layerContainer.dataset.centerOffsetY) || 0;
            // FIXED: translate(-50%, -50%) TETAP ada, baru tambah center offset
            layerContainer.style.transform = `translate(calc(-50% - ${centerOffsetX}px), calc(-50% - ${centerOffsetY}px)) scale(${scale})`;
        } else {
            // FIXED: SELALU gunakan translate(-50%, -50%) untuk center
            layerContainer.style.transform = `translate(-50%, -50%) scale(${scale})`;
        }
        
        drawGuideCanvas();
        document.getElementById('zoomInput').value = zoomValue + '%';
        
        if (typeof window.HistoryManager !== 'undefined') {
          window.HistoryManager.recordAction('zoom', {
            scale: scale,
            action: 'Zoom via slider'
          });
        }
    }
}

function handleZoomInput(value) {
    let zoomValue = parseFloat(value.replace('%', ''));
    if (isNaN(zoomValue)) return;
    zoomValue = Math.max(0, Math.min(10000, zoomValue));
    
    const layerContainer = document.getElementById('panel1-layercontainer');
    if (layerContainer) {
        const scale = zoomValue / 100;
        layerContainer.dataset.scale = scale;
        
        const isCenterOriginActive = layerContainer.dataset.centerOriginActive === 'true';
        if (isCenterOriginActive) {
            const centerOffsetX = parseFloat(layerContainer.dataset.centerOffsetX) || 0;
            const centerOffsetY = parseFloat(layerContainer.dataset.centerOffsetY) || 0;
            // FIXED: sama seperti handleZoom
            layerContainer.style.transform = `translate(calc(-50% - ${centerOffsetX}px), calc(-50% - ${centerOffsetY}px)) scale(${scale})`;
        } else {
            // FIXED: SELALU gunakan translate(-50%, -50%) untuk center
            layerContainer.style.transform = `translate(-50%, -50%) scale(${scale})`;
        }
        
        document.getElementById('zoomSlider').value = zoomValue;
        drawGuideCanvas();
        
        if (typeof window.HistoryManager !== 'undefined') {
          window.HistoryManager.recordAction('zoom', {
            scale: scale,
            action: 'Zoom via input'
          });
        }
    }
}
```

---

### BAGIAN C: TAMBAH RESPONSIVENESS LISTENER (Auto-Recenter saat Resize)

**Tambah di akhir file `js/studiocharacter/sensivity.js` (sebelum closing):**

```javascript
/**
 * Auto-recenter panel1-layercontainer saat window resize atau orientation change
 * Pastikan panel tetap centered setelah window size berubah
 */
function initPanelResponsiveness() {
    const layerContainer = document.getElementById('panel1-layercontainer');
    if (!layerContainer) return;
    
    // Handler untuk window resize
    const handleResize = () => {
        // Trigger redraw guide canvas
        const scale = parseFloat(layerContainer.dataset.scale) || 1;
        // Re-apply zoom untuk memastikan centering
        if (scale !== 1) {
            const zoomValue = scale * 100;
            // Get current transform state
            const isCenterOriginActive = layerContainer.dataset.centerOriginActive === 'true';
            if (isCenterOriginActive) {
                const centerOffsetX = parseFloat(layerContainer.dataset.centerOffsetX) || 0;
                const centerOffsetY = parseFloat(layerContainer.dataset.centerOffsetY) || 0;
                layerContainer.style.transform = `translate(calc(-50% - ${centerOffsetX}px), calc(-50% - ${centerOffsetY}px)) scale(${scale})`;
            } else {
                layerContainer.style.transform = `translate(-50%, -50%) scale(${scale})`;
            }
        }
        drawGuideCanvas();
    };
    
    // Debounce resize handler (prevent excessive redraws)
    let resizeTimeout;
    const debouncedResize = () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(handleResize, 150);
    };
    
    // Add event listeners
    window.addEventListener('resize', debouncedResize);
    window.addEventListener('orientationchange', debouncedResize);
    
    // Optional: ResizeObserver untuk detect perubahan size elemen (tidak hanya window)
    if (typeof ResizeObserver !== 'undefined') {
        const resizeObserver = new ResizeObserver(() => {
            handleResize();
        });
        // Observe panel-group (parent container)
        const panelGroup = document.getElementById('panelGroup');
        if (panelGroup) {
            resizeObserver.observe(panelGroup);
        }
        resizeObserver.observe(layerContainer);
    }
}

// Initialize responsiveness saat document loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPanelResponsiveness);
} else {
    initPanelResponsiveness();
}
```

---

## 📝 PATCH RINGKAS

### File 1: `studiopose.html` (Line 32-44)
**Change CSS untuk `.panel1-layercontainer`:**
```diff
- .panel1-layercontainer {
-     position: absolute;
-     top: 0;
-     left: 0;
-     right: 0;
-     bottom: 0;
+ .panel1-layercontainer {
+     position: absolute;
+     top: 50%;
+     left: 50%;
+     width: 100%;
+     height: 100%;
      z-index: 1;
      transform-origin: center center;
-     transform: scale(1);
+     transform: translate(-50%, -50%) scale(1);
      overflow: hidden;
      max-width: 100%;
      max-height: 100%;
  }
```

### File 2: `js/studiocharacter/sensivity.js` (Function `handleZoom` dan `handleZoomInput`)
**Change transform application:**
- Dari: `scale(${scale})`  
- Menjadi: `translate(-50%, -50%) scale(${scale})`
- (dengan preserve center origin jika aktif)

### File 3: `js/studiocharacter/sensivity.js` (Tambah di akhir)
**Tambah:** `initPanelResponsiveness()` function + event listeners

---

## ✅ CHECKLIST SETELAH FIX

- [ ] Buka `studiopose.html` di browser (F12 devtools)
- [ ] Inspect `#panel1-layercontainer` → Computed style
  - Pastikan `transform` menunjukkan `translate(-50%, -50%) scale(...)`
  - Pastikan tidak ada ancestor dengan `transform` (jika ada, gunakan `position: fixed` pada panel1-layercontainer)
- [ ] Drag zoom slider → panel tidak bergeser, tetap center
- [ ] Resize window (F12 → toggle device toolbar) → panel tetap center
- [ ] Zoom <100% → guide canvas muncul dengan grid
- [ ] Zoom >100% → guide canvas hilang

---

## 🐛 DEBUGGING TIPS (Jika masih ada issue)

**1. Cek ancestor transform:**
```javascript
let el = document.querySelector('#panel1-layercontainer');
let p = el.parentElement;
while (p) {
    console.log(p.tagName, getComputedStyle(p).transform);
    p = p.parentElement;
}
// Jika ada transform != 'none', itu masalahnya
```

**2. Cek computed transform:**
```javascript
const el = document.querySelector('#panel1-layercontainer');
console.log('Computed transform:', getComputedStyle(el).transform);
console.log('Position:', getComputedStyle(el).position);
console.log('Transform-origin:', getComputedStyle(el).transformOrigin);
```

**3. Cek bounding rect saat zoom:**
```javascript
const el = document.querySelector('#panel1-layercontainer');
const rect = el.getBoundingClientRect();
console.log('Bounding rect:', { 
    x: rect.x, y: rect.y, 
    width: rect.width, height: rect.height,
    centerX: rect.x + rect.width/2,
    centerY: rect.y + rect.height/2
});
// Center harus di tengah parent (#panel1)
```

**4. Test manual di console:**
```javascript
const el = document.getElementById('panel1-layercontainer');
el.style.transform = 'translate(-50%, -50%) scale(0.5)';
// Harusnya center dan zoom 50%
```

---

## 📌 COMMIT MESSAGE YANG DISARANKAN

```
fix(panel1): center layer container properly and add responsiveness

- Fix panel1-layercontainer CSS: use left:50%, top:50% + translate(-50%, -50%)
- Update zoom handlers to preserve centering with translate transform
- Add ResizeObserver and window.resize listener for auto-recenter
- Fix zoom slider responsiveness: now stays centered when resizing window

Fixes issue where panel1-layercontainer was not centered and not responsive
to window resize or orientation change.
```

---

## 🔗 RELATED FILES

- **PRIMARY:** studiopose.html (CSS)
- **SECONDARY:** js/studiocharacter/sensivity.js (JS zoom handler)
- **REFERENCE:** js/studiocharacter/centerorigin.js (center origin logic)
- **REFERENCE:** js/studiocharacter/layerrenderoffset.js (offset calculation)

---

## 📚 DOKUMENTASI TERKAIT

- `CENTER_ORIGIN_ZOOM_QUICK_REF.md` - transform handling
- `PANEL1_ZOOM_GUIDE_IMPLEMENTATION.md` - zoom implementation details
- `PANEL1_FIX_SUMMARY.md` - previous panel1 fixes

