# Quick Reference: Multi-Select & Multi-Touch Implementation
## For Fast Understanding & Debugging

---

## KEY ENTRY POINTS

### 1. Input Synchronization
**Function:** `updateCoordInput()` dalam `key.js`  
**Called:** After every layer property change (drag, input modification, etc)  
**Purpose:** Sync ALL input fields to reflect current layer selection state

```javascript
// Handles:
updateCoordInput();
→ Reads: window.selected, selector.selectedLayers[], multiDragState
→ Writes: ALL input elements (xCoord, yCoord, rotation, scale, etc)
→ Logic: Single vs Multi-select display different values ("mixed" indicator)
```

### 2. Get Currently Selected Layers
**Function:** `getSelectedLayers()` dalam `studiopose.js`  
**Returns:** `Array<Layer>` of currently selected layers

```javascript
const selected = getSelectedLayers();
// Returns array with 1 to N layers depending on:
// 1. Multi-select via selector.selectedLayers[]
// 2. Independent touch drag via multiDragState
// 3. Single selection via window.selected (fallback)
```

### 3. Multi-Select Toggle
**Button:** "Nyalakan Seleksi" dalam Panel2  
**Handler:** `Selector.toggleSelector()` dalam `selector.js`  
**Result:** Enable/disable multi-select mode with drag selection

---

## PROPERTY UPDATE FLOW

### Single Layer Edit (e.g., change name):
```
User Input: "Kepala" pada layerName field
    ↓
handleLayerName("Kepala")
    ↓
selected.name = "Kepala"
    ↓
updateCoordInput()
    ↓
Input Fields Updated
    ↓
Panel2 menulayer synchronized
```

### Multi-Select Edit (e.g., change rotation):
```
User Input: "45" pada rotation slider
    ↓
handleRotation("45")
    ↓
for (const layer of getSelectedLayers()) {
    layer.rotation = 45;
}
    ↓
updateCoordInput()
    ↓
Input Fields Show: "45" (all same) or "mixed" (different)
    ↓
All Panels Synchronized
```

### Layer Drag Update:
```
User drags layer on Panel1
    ↓
onLayerPointerMove(e)
    ↓
multiDragState[pointerId].layer.x += dx
multiDragState[pointerId].layer.y += dy
    ↓
updateCoordInput()  // Called at end of onLayerPointerMove
    ↓
Input Fields: xCoord, yCoord updated
    ↓
If multi-select: shows average position
```

---

## MULTI-SELECT DISPLAY LOGIC

### Input Display Rules:

```javascript
if (selectedLayers.length === 1) {
    // Single-select: Show exact value
    xCoordInput.value = "100";
    xCoordInput.style.color = "inherit";
}
else {
    // Multi-select: Check if all same
    const allSame = selectedLayers.every(l => l.x === selectedLayers[0].x);
    
    if (allSame) {
        xCoordInput.value = "100";  // Exact value (all same)
        xCoordInput.style.color = "inherit";
    } else {
        xCoordInput.value = "mixed (125)";  // Average position
        xCoordInput.style.color = "#ff9800";  // Orange = mixed
    }
}
```

### Layer Name Display:
```javascript
// Single layer
layerNameInput.value = "Kepala";  // String atau array item

// Multi-select: concatenate all names
const allNames = selectedLayers.flatMap(l => {
    return Array.isArray(l.name) ? l.name : [l.name];
});
layerNameInput.value = allNames.join(', ');  
// Result: "Head, Body, Foot"
```

---

## TOUCHSCREEN HANDLING

### Multi-Touch Independent Drag:

```javascript
// In onLayerPointerDown(e, layer):

if (isTouch) {
    multiDragState.set(e.pointerId, {
        type: 'independent',
        layer: layer,  // Each pointer has its OWN layer
        lastX: e.clientX,
        lastY: e.clientY
    });
}

// Result: Multiple fingers can drag DIFFERENT layers simultaneously
```

### Touch Event Flow:
```
1. touchstart → onLayerPointerDown()
   ↓ Create multiDragState entry for this pointerId

2. touchmove → onLayerPointerMove()
   ↓ Update layer position based on pointerId's state
   ↓ Call updateCoordInput()

3. touchend → onLayerPointerUp()
   ↓ Remove multiDragState entry for this pointerId
```

---

## HANDLER FUNCTIONS CHECKLIST

All these functions now:
- ✅ Support multi-select (apply to ALL selected)
- ✅ Call `updateCoordInput()` at end
- ✅ Record history for undo/redo

```javascript
✅ handleLayerName(value)
   → Split by comma if needed
   → Apply to all selected layers
   → Concatenate in display

✅ handleXCoord(value)
   → Support center origin conversion
   → Multi-select: relative move

✅ handleYCoord(value)
   → Support center origin conversion
   → Multi-select: relative move

✅ handleRotation(value)
   → Apply to all
   → Parse modulo 360

✅ handleScale(value)
   → Apply to all

✅ handleSkewX/Y(value)
   → Apply to all
   → Sync slider ↔ input

✅ handleFlipHorizontal/Vertical(value)
   → Apply to all
   → Show indeterminate if mixed

✅ handleOpacity(value)
   → Apply to all selected layers
```

---

## COMMON DEBUGGING SCENARIOS

### Scenario 1: Inputs not updating when dragging
**Check:**
```javascript
// In browser console:
console.log(getSelectedLayers()); // Should have layers
// In studiopose.js onLayerPointerMove, verify updateCoordInput() called
```

### Scenario 2: Multi-select button not working
**Check:**
```javascript
// Verify selector exists:
window.selectorInstance  // Should be defined
window.__selectorActive  // Should toggle between true/false
```

### Scenario 3: Layer names not showing array format
**Check:**
```javascript
// Get a layer:
layers[0].name  // Could be "Kepala" (string) or ["Kepala", "Body"] (array)
// Both supported! Display concatenates them
```

### Scenario 4: Properties show mixed but shouldn't
**Check:**
```javascript
// Verify comparison logic:
const allSame = selectedLayers.every(l => l.x === selectedLayers[0].x);
// If allSame = false but values look same, might be float precision issue
```

---

## QUICK FIX RECIPES

### Fix: Inputs not syncing on drag
```javascript
// Add this to onLayerPointerMove():
console.log('Before updateCoordInput');
updateCoordInput();
console.log('After updateCoordInput');
```

### Fix: Multi-select not detecting all selected layers
```javascript
// In getSelectedLayers():
console.log('selector.selectedLayers:', window.selectorInstance?.selectedLayers);
console.log('window.selected:', window.selected);
console.log('Result:', getSelectedLayers());
```

### Fix: Rotation not applying to all layers
```javascript
// In handleRotation():
const allLayers = getSelectedLayers();
console.log('Rotating', allLayers.length, 'layers');
for (const layer of allLayers) {
    console.log('Setting', layer.name, 'rotation to', value);
    layer.rotation = value;
}
```

### Fix: Layer name not showing array format
```javascript
// In updateCoordInput():
const names = Array.isArray(layer.name) ? layer.name : [layer.name];
console.log('Names:', names);
layerNameInput.value = names.join(', ');
console.log('Display:', layerNameInput.value);
```

---

## FILE LOCATIONS QUICK MAP

```
Key Files Modified:

1. js/studiocharacter/key.js
   → updateCoordInput() - CENTRAL SYNC POINT
   → getSelectedLayers() - GET SELECTION
   
2. js/studiocharacter/studiopose.js
   → handleLayerName()
   → handleXCoord(), handleYCoord()
   → handleRotation(), handleScale()
   → handleSkewX/Y(), handleFlipX/Y()
   → onLayerPointerMove() - ALREADY GOOD
   → getSelectedLayers() - ALREADY EXISTS
   
3. js/studiocharacter/layer.js
   → No changes needed (already supports array name)
   
4. js/studiocharacter/selector.js
   → No changes needed (already supports multi-select)
```

---

## TESTING ONE FEATURE AT A TIME

### Test 1: Basic Single-Select (5 min)
```
1. Click layer → highlight
2. Drag layer → position updates
3. Type rotation value → applies
4. All inputs reflect layer state ✓
```

### Test 2: Multi-Select (5 min)
```
1. Click "Nyalakan Seleksi"
2. Draw box around 3 layers
3. Drag one → all move
4. Panel2 shows: "Layer1, Layer2, Layer3" ✓
```

### Test 3: Layer Name Array (3 min)
```
1. Select layer
2. Type "Head, Body, Foot"
3. Split and apply ✓
4. Display shows all names ✓
```

### Test 4: Touchscreen (5 min)
```
1. Two fingers on canvas
2. Drag first finger → layer1 moves
3. Drag second finger → layer2 moves
4. Both move independently ✓
```

---

## PROPERTY SHORTCUT REFERENCE

```javascript
// Quick access to properties:

layer.name              // String or array
layer.x, layer.y        // Position (handles parent relative)
layer.rotation          // 0-360
layer.scale             // Multiplier (1 = normal size)
layer.isFlipX           // Boolean
layer.isFlipY           // Boolean
layer.skewX, layer.skewY // Skew values
layer.opacity           // 0-1 (1 = fully opaque)
layer.element           // DOM reference
layer.element.clientWidth, .clientHeight  // Size

// Selection:
window.selected         // Single selected layer
window.selectorInstance.selectedLayers[]  // Multi-selected

// Input elements:
document.getElementById('xCoord')       // X position input
document.getElementById('yCoord')       // Y position input
document.getElementById('layerName')    // Layer name input
document.getElementById('rotation')     // Rotation slider
document.getElementById('scale')        // Scale input
// ... etc for all properties
```

---

## PERFORMANCE TIPS

### If updateCoordInput() called too frequently:
```javascript
// Debounce approach:
let updateTimeout;
function updateCoordInputDebounced() {
    clearTimeout(updateTimeout);
    updateTimeout = setTimeout(updateCoordInput, 50);  // 50ms delay
}
```

### If multi-select large number of layers is slow:
```javascript
// Cache selected layers:
let selectedCache = [];
let selectedCacheDirty = true;

function getSelectedLayersCached() {
    if (selectedCacheDirty) {
        selectedCache = getSelectedLayers();
        selectedCacheDirty = false;
    }
    return selectedCache;
}

// Mark cache dirty when selection changes:
// In selector.toggleSelector(), addLayerClickHandler(), etc:
selectedCacheDirty = true;
```

---

## COMPATIBILITY NOTES

- ✅ Works with existing history system
- ✅ Works with existing export functions
- ✅ Works with center origin mode
- ✅ Works with opacity/background settings  
- ✅ Backward compatible (single-select still works)
- ⚠️  Multi-select requires selector button to toggle ON

---

## SUMMARY TABLE

| Feature | Before | After | Notes |
|---------|--------|-------|-------|
| Single-layer drag | ✅ | ✅ | All properties update |
| Multi-layer drag | ❌ | ✅ | Group drag & independent touch |
| Input sync (X, Y) | ✅ | ✅ | Plus all other properties |
| Input sync (all props) | ❌ | ✅ | Rotation, scale, flip, skew, opacity |
| Multi-select | Limited | ✅ | Proper toggle with visual feedback |
| Layer name array | ❌ | ✅ | "Head, Body, Foot" format |
| Touchscreen multi-touch | ❌ | ✅ | Independent pointer drag |
| Mixed value display | ❌ | ✅ | Shows "mixed" when different |
| History recording | ✅ | ✅ | All operations logged |

---

## NEXT DEBUG STEP IF STILL BROKEN

1. Check browser console for JS errors
2. Check that files saved correctly
3. Reload page (Ctrl+R or Cmd+R)
4. Clear browser cache (F12 → Storage → Clear All)
5. Test in incognito/private mode
6. Check Network tab to verify JS files loaded
7. Set breakpoints in key.js updateCoordInput()

---

**Last Updated:** 2025-02-09
**Status:** Ready for testing
