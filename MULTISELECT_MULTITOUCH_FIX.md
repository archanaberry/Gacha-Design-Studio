# Multi-Select, Multi-Touch, Multi-Drag FIX
## Comprehensive Solution untuk Touchscreen & Multi-Layer Handling

### PROBLEM ANALYSIS

#### 1. **Input Text tidak terbaca saat Multi-Touch Drag**
- **Penyebab**: Event handler touchmove/mousemove tidak properly sync semua properties
- **Current State**: Hanya X, Y yang ter-update, attribute lain (name, rotation, dll) tidak sync
- **Solution**: Revamp input synchronization untuk handle multi-touch state properly

#### 2. **Layer Name hanya Single String**
- **Penyebab**: `layerName` di Layer class adalah simple string
- **Support Needed**: Multiple layer names (a, b, c, d atau kepala, kaki, badan, dst)
- **Solution**: Support array format dengan separator (misal: "kepala, kaki, badan")

#### 3. **Single-Select Only**
- **Penyebab**: selector.js + studiopose.js mixing multi-select state dengan single-select logic
- **Current Issue**: Selector.selectedLayers[] ada tapi drag handler masih force single
- **Solution**: True multi-select dengan multi-drag support

#### 4. **Touchscreen Single Layer Drag tidak maintain full functionality**
- **Penyebab**: onLayerPointerMove() hanya update X, Y - bukan semua input fields
- **Solution**: Enhanced updateCoordInput() untuk single & multi-select scenarios

### TECHNICAL DETAILS

#### Current Issues in Detail:

**Issue #1: updateCoordInput() function (dalam key.js)**
```javascript
// ❌ CURRENT (key.js line 26)
function updateCoordInput() {
    if (!selected) return;
    const xCoordInput = document.getElementById('xCoord');
    const yCoordInput = document.getElementById('yCoord');
    let displayX = selected.x || 0;
    let displayY = selected.y || 0;
    if (typeof getDisplayCoord === 'function') {
        const disp = getDisplayCoord(displayX, displayY);
        displayX = disp.x;
        displayY = disp.y;
    }
    if (xCoordInput) xCoordInput.value = displayX;
    if (yCoordInput) yCoordInput.value = displayY;
    // ❌ NOT UPDATING: rotation, scale, width, height, layerName, opacity, flip, skew, dll!
}
```

**Issue #2: handleLayerName() function (dalam studiopose.js)**
```javascript
// ❌ CURRENT (studiopose.js line 1500+)
function handleLayerName(value) {
    const selectedLayers = getSelectedLayers();
    // Incomplete implementation for multi-select
}
```

**Issue #3: Multi-touch event tracking (dalam studiopose.js)**
```javascript
// ❌ CURRENT (studiopose.js line 60+)
if (isTouch) {
    // Touch mode tapi activeIndependentTouches logic tidak
    // properly sync dengan updateCoordInput()
}
```

### SOLUTION ARCHITECTURE

#### Phase 1: Enhanced updateCoordInput() Function
```javascript
✅ Handle single-select display (1 layer selected)
✅ Handle multi-select display (N layers selected)
   - Show "multiple" or "different" untuk different values
   - Show average/sum untuk position
   - Show concatenated names untuk layer names
✅ Sync ALL layer properties: x, y, rotation, scale, width, height, 
   opacity, flipX, flipY, skewX, skewY, layerName
```

#### Phase 2: Layer Name Array Support
```javascript
✅ Change Layer.#name dari string ke array-capable
   - Store: ["kepala", "kaki", "badan"] 
   - Display in input: "kepala, kaki, badan"
✅ Parsing: "kepala, kaki, badan" → split by ","
✅ Support mixed: single layer | multi-select multiple layers
```

#### Phase 3: True Multi-Select with Multi-Drag
```javascript
✅ Proper selector state management
   - selector.selectedLayers[] = real array of Layer instances
   - NOT mixing with single selection
✅ Multi-drag calculation:
   - Track all dragged layers individually
   - Update ALL properties, not just x/y
✅ Maintain backward compatibility with single-drag
```

#### Phase 4: Touchscreen Multi-Touch Handling
```javascript
✅ Per-pointer state tracking (PointerEvent API)
✅ Independent layer drag per pointer
✅ Proper event prevention pada input fields
✅ Touch action management untuk scroll vs drag
```

### IMPLEMENTATION PLAN

#### File Changes Required:

1. **key.js**: Replace updateCoordInput() with comprehensive version
2. **studiopose.js**: 
   - Update handleLayerName() for array support
   - Update handleXCoord(), handleYCoord() for multi-select
   - Fix getSelectedLayers() function
   - Enhance onLayerPointerMove() to update all properties
3. **layer.js**:
   - Support #name as string or array
   - Getter/setter untuk name property dengan parsing
4. **selector.js**:
   - Keep multi-select logic pure
   - Remove mixing dengan single-select in drag handler

#### Backward Compatibility:
- ✅ Single layer drag: works exactly like before
- ✅ Input sync: now works on drag + on selection change
- ✅ Multi-select: toggle-able dengan selector button
- ✅ Touch: both single & multi-touch supported

### PROPERTY DISPLAY LOGIC FOR MULTI-SELECT

```javascript
Single-Select (1 layer):
  - xCoord: show exact value (e.g., 100)
  - layerName: show name (e.g., "Kepala")
  - rotation: show exact value
  
Multi-Select (N layers, same property):
  - xCoord: show exact value (e.g., all 100)
  - layerName: show concatenated (e.g., "Kepala, Badan, Kaki")
  - rotation: show exact value (e.g., all 45)
  
Multi-Select (N layers, different property):
  - xCoord: show "mixed" or average
  - layerName: show concatenated with separator (e.g., "Head, Body, Foot")
  - rotation: show "mixed" if different
```

### TESTING CHECKLIST

- [ ] Single layer selection & drag works
- [ ] Input fields update on drag (all properties, not just x/y)
- [ ] Multi-select toggle button works
- [ ] Multiple layers can be selected
- [ ] Drag multiple selected layers together (group drag)
- [ ] Each pointer touches different layer independently
- [ ] Layer name accepts multiple values (comma-separated)
- [ ] Input displays show correct values for multi-select
- [ ] Touchscreen single-tap doesn't trigger drag
- [ ] Can still interact with input fields while drag mode active
- [ ] All attribute editing works (rotation, scale, flip, skew, opacity, width, height)

---

## NEXT STEPS:
1. Implement Phase 1: updateCoordInput() enhancement
2. Implement Phase 2: Layer name array support
3. Implement Phase 3: Multi-select drag improvements
4. Implement Phase 4: Touch event refinements
5. Test all scenarios
