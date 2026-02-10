# 🔧 MULTISELECT DEBUG & FIX GUIDE

## STEP 1: Run Diagnostic di Browser Console

**Copy-paste ini ke browser console (F12) lalu tekan Enter:**

```javascript
// ===== QUICK DIAGNOSTIC =====
console.log('📊 MULTISELECT STATUS:');
console.log('1. calculateBoundingBox:', typeof calculateBoundingBox === 'function' ? '✅ OK' : '❌ MISSING');
console.log('2. getSelectedLayers:', typeof getSelectedLayers === 'function' ? '✅ OK' : '❌ MISSING');
console.log('3. updateCoordInput:', typeof updateCoordInput === 'function' ? '✅ OK' : '❌ MISSING');
console.log('4. selectorInstance:', !!window.selectorInstance ? '✅ OK' : '❌ MISSING');
const sel = getSelectedLayers ? getSelectedLayers() : [];
console.log('5. Selected layers count:', sel.length);
if (sel.length > 0) {
    console.log('   ├─ Layer 0:', sel[0].name, 'x=' + sel[0].x, 'y=' + sel[0].y, 'element=' + !!sel[0].element);
    sel.forEach((l, i) => {
        if (l.element) console.log(`   ├─ Layer ${i} element:`, {
            width: l.element.clientWidth,
            height: l.element.clientHeight,
            computed: window.getComputedStyle(l.element).display
        });
    });
}
```

---

## STEP 2: Identify Penyebab Masalah

### **ISSUE A: `calculateBoundingBox` return null karena `layer.element.clientWidth = 0`**

**Penyebab**: Layer element ada tapi tidak punya ukuran (display: none atau width/height = auto tanpa content)

**Fix**: Update calculateBoundingBox untuk handle edge case:

```javascript
// Replace calculateBoundingBox() function di key.js dengan ini:
function calculateBoundingBox(layers) {
    if (!layers || layers.length === 0) return null;
    
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    let hasValidLayer = false;
    
    for (const layer of layers) {
        if (!layer) continue;
        
        // Allow undefined x/y (default to 0)
        const x = (typeof layer.x === 'number') ? layer.x : 0;
        const y = (typeof layer.y === 'number') ? layer.y : 0;
        
        // Try to get width/height - multiple fallbacks
        let width = 0;
        let height = 0;
        
        // Priority 1: element.clientWidth/Height
        if (layer.element && layer.element.clientWidth > 0) {
            width = layer.element.clientWidth;
            height = layer.element.clientHeight;
        } 
        // Priority 2: layer.width/height properties
        else if (typeof layer.width === 'number' && layer.width > 0) {
            width = layer.width;
            height = layer.height || 0;
        }
        // Priority 3: Try getBoundingClientRect if element exists
        else if (layer.element && typeof layer.element.getBoundingClientRect === 'function') {
            const rect = layer.element.getBoundingClientRect();
            width = rect.width;
            height = rect.height;
        }
        // Priority 4: Default to 50x50 untuk placeholder
        else {
            width = 50;
            height = 50;
        }
        
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x + width);
        maxY = Math.max(maxY, y + height);
        
        hasValidLayer = true;
    }
    
    // Return null hanya jika TIDAK ada layer valid sama sekali
    if (!hasValidLayer) return null;
    
    // Safety check
    if (!isFinite(minX) || !isFinite(minY) || !isFinite(maxX) || !isFinite(maxY)) {
        console.warn('⚠️ calculateBoundingBox: Invalid coordinates calculated', {
            minX, minY, maxX, maxY
        });
        return null;
    }
    
    return {
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY
    };
}
```

---

### **ISSUE B: `updateCoordInput()` tidak terpanggil saat multi-select**

**Penyebab**: Hanya di-call dari `onLayerPointerMove()` (drag), tidak dari `onPointerDown` atau selector change

**Fix**: Add listener untuk selector change events:

```javascript
// Add ini di bagian bawah key.js:
document.addEventListener('DOMContentLoaded', function() {
    // Listen untuk selector changes
    document.addEventListener('selector:changed', function() {
        console.log('📊 Selector changed - updating display');
        updateCoordInput();
    });
    
    // Listen untuk single layer click
    document.addEventListener('layer:selected', function() {
        console.log('📊 Layer selected - updating display');
        updateCoordInput();
    });
    
    console.log('✅ Selector event listeners initialized');
});
```

Lalu di **selector.js**, tambah event dalam function `selectLayersInBox()`:

```javascript
// Di akhir selectLayersInBox() function (sekitar line 160), add:
if (typeof updateCoordInput === 'function') {
    updateCoordInput();  // Immediate update display
    console.log('📊 Triggered updateCoordInput from selectLayersInBox()');
}
// And dispatch event
document.dispatchEvent(new CustomEvent('selector:changed', {
    detail: { selectedCount: this.selectedLayers.length }
}));
```

---

### **ISSUE C: `selector.selectedLayers` tidak populated saat box select**

**Penyebab**: Box selection logic mungkin tidak push ke selectedLayers dengan benar

**Verification**:
```javascript
// Run ini di console SAAT box selection active:
console.log('Selector instance:', window.selectorInstance);
console.log('Selected layers:', window.selectorInstance?.selectedLayers);

// Check per-layer jika selectedLayers ada element dengan .selected class:
const els = document.querySelectorAll('.layer-element.selected');
console.log('DOM elements dengan .selected class:', els.length);
```

**Fix**: Verifikasi selector.js logic:
- Cek apakah `selectLayersInBox()` properly loop through visible layers
- Cek apakah layer element punya visual feedback (.selected class)
- Cek apakah selectedLayers array properly push item

---

## STEP 3: Apply FIX

### **Option A: Replace calculateBoundingBox function (RECOMMENDED)**

Buka file: `js/studiocharacter/key.js`

Cari function `calculateBoundingBox()` (line ~250-290)

Replace dengan kode di ISSUE A section di atas

---

### **Option B: Add Missing Event Listeners**

Buka file: `js/studiocharacter/key.js`

Add ke akhir file (sebelum closing brace paling akhir):

```javascript
// Auto-update display saat selector/layer selection changes
document.addEventListener('DOMContentLoaded', function() {
    // Update when any multiselect happens
    const observer = new MutationObserver(function() {
        const selected = getSelectedLayers();
        if (selected.length > 0) {
            updateCoordInput();
        }
    });
    
    // Observe selector state changes
    if (window.selectorInstance) {
        observer.observe(window.selectorInstance, {
            properties: ['selectedLayers']
        });
    }
    
    console.log('✅ MutationObserver for selector changes initialized');
});
```

---

### **Option C: Force update after selector button click**

Buka file: `js/studiocharacter/selector.js`

Cari function `selectLayersInBox()` (line ~140)

Add di akhir function (sebelum closing brace):

```javascript
// Force update Panel2 display
if (typeof updateCoordInput === 'function') {
    setTimeout(() => updateCoordInput(), 10);  // Delay sedikit untuk ensure state updated
    console.log('📊 Multi-select: Updated ' + this.selectedLayers.length + ' layers');
}
```

---

## STEP 4: TEST AFTER FIX

1. **Reload page (Ctrl+R)**
2. **Click "Nyalakan Seleksi" button**
3. **Drag box select 3 layers (kepala, kaki, badan)**
4. **Check Panel2:**
   - ✅ xCoord, yCoord berubah ke BLUE
   - ✅ layerName menunjukkan "3: kepala, kaki, badan" BLUE
   - ✅ width, height menunjukkan bounding box BLUE

5. **Drag salah satu layer yang selected:**
   - ✅ Semua 3 layers move bersama
   - ✅ Position update real-time di xCoord, yCoord

---

## STEP 5: Verify Console Output

**Open DevTools Console (F12)**

Cari log messages:
- `✅ updateCoordInput: MULTI-SELECT dengan BOUNDING BOX display updated` ← seharusnya muncul
- `📦 Bounding Box: { count: 3, ... }` ← seharusnya show bounding box data
- `📊 Selector changed - updating display` ← seharusnya fire saat multi-select

Jika tidak muncul:
- calculateBoundingBox() mungkin return null (check log dalam updateCoordInput)
- selector.selectedLayers kosong (verify di console: `window.selectorInstance.selectedLayers`)
- updateCoordInput() tidak di-call dari selector (no event listener)

---

## COMMON ISSUES & SOLUTIONS

### ❌ "calculateBoundingBox is not defined"
**Solution**: Verifikasi line 220+ di key.js ada function `calculateBoundingBox()`

### ❌ "selectedLayers empty pada multi-select"
**Solution**: 
1. Click "Nyalakan Seleksi" button
2. Verify button text change ke "Matikan Seleksi" 
3. Check console: `window.selectorInstance.isActive === true`

### ❌ "Width/Height show as NaN atau 0"
**Solution**: Apply Option A fix untuk calculateBoundingBox() dengan multiple fallbacks

### ❌ "Position tidak update saat drag multi-select"
**Solution**: Add Option B event listeners untuk auto-update saat changes

---

## STATUS CHECKLIST

Run ini di console untuk verify all components:
```javascript
console.log('COMPONENT STATUS:');
console.log('✅ calculateBoundingBox:', typeof calculateBoundingBox);
console.log('✅ updateCoordInput:', typeof updateCoordInput);  
console.log('✅ getSelectedLayers:', typeof getSelectedLayers);
console.log('✅ selectorInstance exists:', !!window.selectorInstance);
console.log('✅ multiDragState type:', window.multiDragState?.constructor.name);
const layers = getSelectedLayers();
console.log('✅ Selected layers count:', layers.length, layers.length > 1 ? '(MULTI-SELECT READY)' : '(need > 1)');
if (layers.length > 1 && typeof calculateBoundingBox === 'function') {
    const bbox = calculateBoundingBox(layers);
    console.log('✅ Bounding Box result:', bbox ? '✅ VALID' : '❌ NULL');
}
```

Semua harus ✅ untuk multi-select berfungsi!

