# 🔄 Zoom Auto-Detection & Center Origin Fix - QUICK START

## ✅ Apa yang Diperbaiki

| Masalah | Solusi |
|---------|--------|
| `centerOriginActive is not defined` error | Dideklarasikan sebagai global variable |
| Center origin shift saat Chrome zoom | Menggunakan `calc()` formula bukan pure pixels |
| Tidak following Chrome zoom 25%-500% | Auto-detection setiap 100ms + manual refresh button |
| Panel zoom tidak stabil | Responsive centering dengan percentage + offset |

## 🚀 Cara Menggunakan

### 1. Default Behavior (Sudah Aktif)
- ✅ Default 0,0 sudah centered di layar
- ✅ Auto-detection zoom browser berjalan di background
- ✅ Works dari 25% hingga 500% Chrome zoom

### 2. Manual Refresh (Jika Perlu)
**Opsi A - Via Tombol UI:**
- Klik tombol **"🔄 Refresh Origin"** (di sebelah Center Origin checkbox)

**Opsi B - Via Keyboard:**
- Tekan **Ctrl+Alt+R**

**Opsi C - Via Console:**
```javascript
refreshCenterOrigin();
```

### 3. Monitor Zoom Detection
Lihat console (F12) untuk log messages:
```
✅ Zoom detection initialized - akan follow Chrome zoom 25%-500%
🔍 Browser zoom changed to: 50.0%
🔄 Center origin refreshed untuk follow zoom
```

## 🧪 Testing

### Test 1: Default Centering (25% Zoom)
```
1. Buka studio
2. Zoom Chrome ke 25% (Ctrl+Minus)
3. Verifikasi: 0,0 harus di tengah layar
4. Verify: Console log shows zoom change detection
```

### Test 2: Auto-Detection
```
1. Buka studio pada zoom 100%
2. Ubah zoom Chrome (25%, 50%, 75%, 100%, 200%, 300%, 500%)
3. Verifikasi: Center origin otomatis follow zoom
4. Verify: Console menunjukkan zoom change messages
```

### Test 3: Manual Refresh
```
1. Klik "🔄 Refresh Origin" button
2. Atau tekan Ctrl+Alt+R
3. Verifikasi: Console menunjukkan refresh message
4. Verify: Center origin menyesuaikan dengan zoom saat ini
```

### Test 4: Toggle Center Origin
```
1. Check/Uncheck "Pusatkan Origin (0,0)" checkbox
2. Lakukan pada berbagai zoom level (25%, 100%, 200%, 500%)
3. Verifikasi: Transform update correctly
4. Verify: 0,0 selalu di lokasi yang benar
```

## 📊 Key Features

### Auto-Detection Engine
- ✅ Berjalan setiap 100ms
- ✅ Detects zoom changes dari 25% hingga 500%
- ✅ Triggers saat: Ctrl++, Ctrl+-, atau browser zoom settings
- ✅ Automatically refresh center origin jika active

### Transform Formula (calc-based)
```css
/* Centering dengan responsiveness */
translate(calc(-50% - offsetX), calc(-50% - offsetY)) scale(scale)
```

### Browser Compatibility
- ✅ Chrome/Chromium
- ✅ Firefox
- ✅ Safari
- ✅ Edge

## 🐛 Troubleshooting

### Kalau center origin bergeser
```javascript
// Via console:
refreshCenterOrigin();

// Atau:
// Klik tombol "🔄 Refresh Origin"
// Atau tekan Ctrl+Alt+R
```

### Kalau konsol error
```javascript
// Check status:
console.log('centerOriginActive:', window.centerOriginActive);
console.log('browserZoom:', getBrowserZoom());

// Manual restart detection:
initZoomDetection();
```

### Kalau auto-detection tidak jalan
```javascript
// Check if interval is running:
console.log('zoomCheckInterval:', window.zoomCheckInterval);

// If null, restart:
initZoomDetection();
```

## 📁 Files Modified

1. **js/studiocharacter/centerorigin.js**
   - Global variables added
   - getBrowserZoom() improved
   - NEW: initZoomDetection(), stopZoomDetection(), refreshCenterOrigin()

2. **js/frame/studiopose.js**
   - CSS transform updated to calc() formula
   - NEW: "🔄 Refresh Origin" button
   - Initialization of zoom detection

3. **js/studiocharacter/key.js**
   - NEW: Ctrl+Alt+R keyboard shortcut

4. **js/studiocharacter/sensivity.js**
   - Updated with calc() formula (already done)

## 📝 Console Commands Reference

```javascript
// STATUS
window.centerOriginActive                    // true/false
getBrowserZoom()                            // current zoom (0.25 - 5)
document.getElementById('panel1-layercontainer').style.transform

// ACTIONS
toggleCenterOrigin(true)                    // Enable center origin
toggleCenterOrigin(false)                   // Disable center origin
refreshCenterOrigin()                       // Manual refresh
initZoomDetection()                         // Start detection
stopZoomDetection()                         // Stop detection
calculateCenterOffset()                     // Get current offsets
updateCenterOriginTransform()               // Update transform
```

---

**Version**: 1.0  
**Status**: ✅ READY FOR TESTING  
**Support Zoom Range**: 25% - 500% (Chrome/Firefox/Safari/Edge)
