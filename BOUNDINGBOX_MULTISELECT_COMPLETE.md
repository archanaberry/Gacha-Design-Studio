# 🎯 BOUNDING BOX MULTI-SELECT ENHANCEMENT - COMPLETE
> Fitur Multi-Select dengan Bounding Box Calculation untuk Multi-Drag

**Status**: ✅ COMPLETE & READY FOR TESTING  
**Last Updated**: 2024  
**Version**: 2.0 - Bounding Box Edition

---

## 📋 FITUR BARU

### 1. **Bounding Box Calculation**
```javascript
✅ calculateBoundingBox(layers) - NEW FUNCTION
   - Hitung min/max posisi dari semua selected layers
   - Return: { x, y, width, height } dari bounding box
   - Support unlimited layers
```

### 2. **Multi-Select Display dengan Bounding Box**

**SINGLE-SELECT** (1 layer):
- Position X, Y: Exact position dari layer tersebut
- Layer Name: Nama layer (atau array jika ada)
- Color: Default (inherit)

**MULTI-SELECT** (N layers):
- Position X, Y: **Bounding box top-left corner** (Blue #2196F3)
- Layer Names: `N: kepala, kaki, badan` (Blue #2196F3)
- Width, Height: **Bounding box size** (Blue #2196F3)
- Rotation, Scale, Opacity: "mixed" jika berbeda (Orange #ff9800)
- Title: Hover untuk lihat layer count

### 3. **Multi-Drag dengan Bounding Box Update**
```
Saat drag multiple layers:
1. onLayerPointerMove() apply delta ke semua selected layers
2. calculateBoundingBox() hitung bounding box baru
3. updateCoordInput() display bounding box position baru
4. Panel2 real-time update position aggregate + names
```

---

## 🔧 IMPLEMENTASI TEKNIS

### File: `js/studiocharacter/key.js`

#### NEW: `calculateBoundingBox(layers)`
```javascript
/**
 * Calculate bounding box dari array of layers
 * @param {Array<Layer>} layers - array of Layer instances
 * @returns {Object} { x, y, width, height } atau null
 */
function calculateBoundingBox(layers) {
    // Get min/max coordinates dari semua layers
    let minX = Infinity, minY = Infinity;
    let maxX = -Infinity, maxY = -Infinity;
    
    for (const layer of layers) {
        const x = layer.x || 0;
        const y = layer.y || 0;
        const width = (layer.element?.clientWidth) || layer.width || 0;
        const height = (layer.element?.clientHeight) || layer.height || 0;
        
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x + width);
        maxY = Math.max(maxY, y + height);
    }
    
    return {
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY
    };
}
```

#### ENHANCED: `updateCoordInput()`
```javascript
// MULTI-SELECT section (else branch):
else {
    // Calculate bounding box
    const bbox = calculateBoundingBox(selectedLayers);
    
    // Display X, Y = bounding box top-left
    xCoord.value = Math.round(bbox.x);  // Blue color
    yCoord.value = Math.round(bbox.y);  // Blue color
    
    // Display Names = "N: kepala, kaki, badan"
    layerName.value = selectedLayers.length + ': ' + allNames.join(', ');
    
    // Display Width, Height = bounding box size
    width.value = Math.round(bbox.width);   // Blue
    height.value = Math.round(bbox.height); // Blue
    
    // Log bounding box position
    console.log('📦 Bounding Box:', {
        count: selectedLayers.length,
        x: bbox.x,
        y: bbox.y,
        width: bbox.width,
        height: bbox.height,
        names: allNames.join(', ')
    });
}
```

### File: `js/studiocharacter/studiopose.js`

#### EXISTING: `onLayerPointerMove()`
✅ Already calls `updateCoordInput()` at line 229
- Support single + multi-drag
- Apply delta ke semua selected layers
- Real-time display update

#### ENHANCED: `handleXCoord()` & `handleYCoord()`
```javascript
// Multi-select: move semua relative ke bounding box position
function handleXCoord(value) {
    const selectedLayers = getSelectedLayers();
    
    if (selectedLayers.length === 1) {
        // Single: absolute position
        selectedLayers[0].x = value;
    } else {
        // Multi: relative movement
        // Calculate dari bounding box min position
        const bbox = calculateBoundingBox(selectedLayers);
        const offset = value - bbox.x;
        
        for (const layer of selectedLayers) {
            layer.x += offset;
        }
    }
    
    updateCoordInput();  // Display update
}
```

---

## ✅ TESTING CHECKLIST

### TEST 1: Bounding Box Display - Single Select
**Step**: Klik satu layer → drag ke posisi baru  
**Expected**:
- xCoord, yCoord show exact position (black/normal color)
- Layer name show single name
- No blue color indicator

**Command**: 
```javascript
// In browser console:
console.log('Selected:', getSelectedLayers());
console.log('Display X:', document.getElementById('xCoord').value);
console.log('Color:', document.getElementById('xCoord').style.color);
// Expected: color = 'inherit' (tidak ada color override)
```

---

### TEST 2: Bounding Box Display - Multi Select (Box Select)
**Step**: 
1. Click "Nyalakan Seleksi" button
2. Drag box selection untuk select 3 layers (misal: kepala, kaki, badan)
3. Lihat Panel2 input fields

**Expected**:
- xCoord = top-left X dari bounding box (BLUE #2196F3)
- yCoord = top-left Y dari bounding box (BLUE #2196F3)
- layerName = `3: kepala, kaki, badan` (BLUE)
- width = bounding box width (BLUE)
- height = bounding box height (BLUE)
- title attribute = "3 layers selected"

**Command**:
```javascript
// Verify bounding box calculation
const selected = getSelectedLayers();
const bbox = calculateBoundingBox(selected);
console.log('🎯 Bounding Box:', {
    count: selected.length,
    position: { x: bbox.x, y: bbox.y },
    size: { width: bbox.width, height: bbox.height },
    names: selected.map(l => l.name)
});
```

---

### TEST 3: Multi-Drag dengan Bounding Box Update
**Step**:
1. Select 3 layers via box selection
2. Drag satu dari layer yang selected (atau drag dari bounding box area)
3. Observe Panel2 position update real-time

**Expected**:
- xCoord, yCoord berubah sesuai bounding box position baru
- Semua 3 layers move bersama (group drag)
- Display selalu show bounding box, bukan individual layer position
- Console log: `📦 Bounding Box:` dengan position baru

**Verification**:
```javascript
// Monitor bounding box during drag
setInterval(() => {
    const selected = getSelectedLayers();
    if (selected.length > 1) {
        const bbox = calculateBoundingBox(selected);
        console.log(`📦 BBox: x=${bbox.x}, y=${bbox.y}, w=${bbox.width}, h=${bbox.height}`);
    }
}, 100); // Every 100ms during drag
```

---

### TEST 4: Layer Names Concatenation
**Step**:
1. Select layers dengan nama: "Kepala", "Badan", "Kaki"
2. Check layerName input field

**Expected**:
- Display: `3: Kepala, Badan, Kaki`
- Atau jika array per layer: `3: Kepala, Body, Kaki`
- Semua names concatenated dengan ", " separator
- Blue color

**Verification**:
```javascript
const names = getSelectedLayers().map(l => 
    Array.isArray(l.name) ? l.name.join(',') : l.name
);
console.log('👤 Layer Names:', names.join(', '));
// Expected output: "Kepala, Badan, Kaki" untuk 3 selected layers
```

---

### TEST 5: Bounding Box Position Calculation Accuracy
**Step**:
1. Create 2 layers:
   - Layer A: position (100, 100), size 50x50
   - Layer B: position (200, 200), size 60x60
2. Select both
3. Check Panel2 position & size

**Expected Bounding Box**:
- X = 100 (min X)
- Y = 100 (min Y)
- Width = 160 (200 + 60 - 100 = 160)
- Height = 160 (200 + 60 - 100 = 160)

**Calculation**:
```javascript
// Verify calculation
const L_A = { x: 100, y: 100, width: 50, height: 50 };
const L_B = { x: 200, y: 200, width: 60, height: 60 };

const minX = Math.min(L_A.x, L_B.x); // 100
const maxX = Math.max(L_A.x + L_A.width, L_B.x + L_B.width); // max(150, 260) = 260
const width = maxX - minX; // 260 - 100 = 160 ✓

console.log('✅ Bounding Box Calculation:', {
    x: minX,
    width: width,
    expected: { x: 100, width: 160 }
});
```

---

### TEST 6: Bounding Box Update Saat Drag
**Step**:
1. Select 3 layers dengan bounding box (100, 100) - (300, 300)
2. Drag semua layers ke kanan 50px
3. Observe position input update

**Expected**:
- X berubah dari 100 → 150 (tambah 50)
- Y tetap 100 (tidak drag vertical)
- All 3 layers move bersama (offset +50px per layer)
- Bounding box size tetap sama (160x160)

**Console Verification**:
```javascript
// Before drag
console.log('Before:', {
    x: parseInt(document.getElementById('xCoord').value),
    colors: {
        x: document.getElementById('xCoord').style.color,
        name: document.getElementById('layerName').style.color
    }
});

// After drag 50px right
// Expected: x berubah +50, color tetap #2196F3 (blue)
```

---

### TEST 7: Touch Multi-Drag (Touchscreen)
**Device**: Tablet/Touchscreen  
**Step**:
1. Select 3 layers
2. Touch drag 2 jari sekaligus (atau 1 jari drag layer yang selected)
3. Observe bounding box update

**Expected**:
- Bounding box position update real-time
- Layout names tetap menunjukkan concatenated names
- Support independent touch (masing-masing jari bisa drag layer berbeda)

**Debug Log**:
```javascript
// In console during touch drag
console.log('👆 Multi-touch drag:', {
    pointers: Array.from(window.multiDragState?.entries() || []),
    selected: getSelectedLayers().length,
    bbox: calculateBoundingBox(getSelectedLayers())
});
```

---

### TEST 8: Color Coding Verification
**Visual Check**:

| Property | Single-Select | Multi-Select (Same) | Multi-Select (Differ) |
|----------|---|---|---|
| **Position X, Y** | Black | 🔵 Blue | 🔵 Blue |
| **Layer Names** | Black | 🔵 Blue | 🔵 Blue |
| **Size W, H** | Black | 🔵 Blue | 🔵 Blue |
| **Scale** | Black | Black | 🟠 Orange |
| **Rotation** | Black | Black | 🟠 Orange |
| **Opacity** | Black | Black | 🟠 Orange |

**Expected**:
- Single-select: all normal (black)
- Multi-select same values: blue position/names only
- Multi-select different: orange "mixed" indicators for properties yang tidak sama

**Command**:
```javascript
// Check color of X coordinate input
const xInput = document.getElementById('xCoord');
console.log('Color of xCoord:', xInput.style.color);
// Expected:
// - Single: 'inherit' (or empty string)
// - Multi-select: '#2196F3' (blue)
```

---

### TEST 9: Bounding Box dengan Mixed Properties
**Step**:
1. Select 2 layers dengan:
   - Sama rotation (45 deg)
   - Beda opacity (Layer A = 100%, Layer B = 50%)
2. Check Panel2

**Expected**:
- rotationControl = 45 (black, same value)
- opacitySlider = average 75% (orange, "mixed")
- xCoord, yCoord = bounding box (blue)
- layerName = `2: Layer A, Layer B` (blue)

**Verification**:
```javascript
const layers = getSelectedLayers();
console.log('Properties check:', {
    count: layers.length,
    rotation: layers.map(l => l.rotation),
    opacity: layers.map(l => l.opacity),
    bbox: calculateBoundingBox(layers)
});
```

---

### TEST 10: Bounding Box Size Accuracy
**Step**:
1. Create 3 layers dalam grid:
   ```
   A (0,0)  B (100,0)  C (200,0)
   Size: 50x50 each
   ```
2. Select all 3
3. Check bounding box width

**Expected**:
```
Bounding Box:
  Min X = 0 (dari layer A)
  Max X = 250 (200 + 50 dari layer C)
  Width = 250 - 0 = 250 ✓
```

**Test**:
```javascript
// Verify width calculation
const bbox = calculateBoundingBox(getSelectedLayers());
const expected = 3 * 50 + 0 + 100 + 100; // A.width + 100gap + 100gap + C.width
console.log('Width calculation:', {
    actual: bbox.width,
    expected: 250,
    match: bbox.width === 250
});
```

---

## 🐛 DEBUGGING TIPS

### Issue: Position tidak update saat multi-select
**Cause**: `updateCoordInput()` tidak dipanggil atau `calculateBoundingBox()` return null  
**Fix**:
```javascript
// Add debug log di updateCoordInput
const bbox = calculateBoundingBox(selectedLayers);
console.log('🔍 calculateBoundingBox result:', bbox);
if (!bbox) {
    console.error('❌ Bounding box calculation failed!');
    return;
}
```

---

### Issue: Bounding box width/height tidak akurat
**Cause**: Layer width/height tidak terbaca (null/undefined)  
**Fix**:
```javascript
// Verify layer.element exists
for (const layer of selectedLayers) {
    console.log('Layer:', {
        name: layer.name,
        x: layer.x,
        y: layer.y,
        elementWidth: layer.element?.clientWidth,
        layerWidth: layer.width,
        hasElement: !!layer.element
    });
}
```

---

### Issue: Color tidak berubah ke blue
**Cause**: `xCoordInput.style.color` tidak di-set atau CSS override  
**Fix**:
```javascript
// Force color set
const xInput = document.getElementById('xCoord');
xInput.style.color = '#2196F3';
console.log('Color set to:', xInput.style.color);
```

---

### Issue: Multi-drag tidak work
**Cause**: `multiDragState` kosong atau handler tidak loop selected layers  
**Fix**:
```javascript
// Check multiDragState
console.log('multiDragState entries:',
    Array.from(window.multiDragState?.entries() || [])
        .map(([pid, info]) => ({ 
            pointerId: pid, 
            type: info.type,
            layersCount: Array.isArray(info.layers) ? info.layers.length : 1
        }))
);
```

---

## 📊 PERFORMANCE NOTES

- **calculateBoundingBox()**: O(n) complexity - iterate through all layers once
- **Called at**: updateCoordInput() - pada setiap move event
- **Frequency**: ~60fps during drag (16ms interval)
- **Impact**: Minimal - simple loop calculation, no DOM manipulation

---

## 🎓 SUMMARY

### Apa yang berubah:
1. ✅ `calculateBoundingBox()` - NEW function untuk hitung bounding box  
2. ✅ `updateCoordInput()` - ENHANCED untuk display bounding box saat multi-select
3. ✅ Display format: `N: kepala, kaki, badan` untuk layer names
4. ✅ Color indicator: Blue untuk bounding box property, Orange untuk "mixed"
5. ✅ Position accuracy: Top-left corner dari bounding box

### Apa yang tetap sama:
- ✅ `onLayerPointerMove()` - already working, just better display now
- ✅ `handleXCoord()`, `handleYCoord()` - already support multi-select
- ✅ Touch event handling - no changes
- ✅ Backward compatibility - single-select still works exact same way

### End Result:
**True Multi-Select Support dengan Real-Time Bounding Box Display** 🎯

---

## 📞 SUPPORT

Jika ada issue, check:
1. Browser console untuk error messages
2. QUICK_REFERENCE_MULTISELECT.md untuk debugging recipes
3. Verify `getSelectedLayers()` return correct array
4. Verify `calculateBoundingBox()` return valid object with x, y, width, height

