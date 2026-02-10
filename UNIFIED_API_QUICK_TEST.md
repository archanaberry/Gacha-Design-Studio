# ⚡ UNIFIED API - QUICK TEST NOW!

## What Was Fixed 🔧

**Before**: Text shapes, ungrouped layers, duplicates → single-drag only ❌
**After**: ALL layer types → true multi-drag support ✅

---

## Test in 5 Minutes ⏱️

### Setup (30 seconds)
```
1. Reload page (Ctrl+R)
2. Wait for canvas to load
3. Have 2+ touchscreen fingers ready (or use DevTools touch emulation)
```

---

## Test #1: Ungroup Src Layers (1.5 minutes)

**Scenario**: "Pisahkan Src" button now should support multi-drag

```
1. Import image dengan multiple sources (or use existing multi-src layer)
2. Select the layer
3. Click "Pisahkan Src" button
4. 2+ new ungrouped layers appear

5. 🔥 Multi-drag test:
   - Touch layer 1 dengan jari 1
   - SAMBIL MASIH MEMEGANG jari 1, touch layer 2 dengan jari 2
   - Panel2 Layer input harus show: "2: ungrouped_0, ungrouped_1" (BLUE)
   - Drag jari 1: layer 1 bergerak ✅
   - Drag jari 2: layer 2 bergerak ✅

Expected: ✅ Both layers drag independently
```

**Console Check**:
```javascript
console.log('Selected:', getSelectedLayers().length);  // Should be 2
console.log('Pointers:', window.multiDragState?.size);  // Should be 2
```

---

## Test #2: Text Shapes (1.5 minutes)

**Scenario**: Text shapes now integrated dengan pointer system

```
1. Click "Buat Teks" button
2. Enter text "Hello"
3. Click "Buat Teks"
4. New text layer appears (auto-selected)

5. 🔥 Multi-drag test:
   - Ensure layer menu updated (should show text layer)
   - Touch text dengan jari 1
   - Touch any image layer dengan jari 2
   - Panel2 should show: "2: Hello, imageName" (BLUE)
   - Drag both: both layers move ✅

Expected: ✅ Text + image dapat drag bersama-sama
```

**Console Check**:
```javascript
// Verify text layer has pointer handler
const textLayer = layers.find(l => l.name.includes('TextShape'));
console.log('Text layer ready:', !!textLayer?.element?.__pointerDownHandler);
```

---

## Test #3: Duplicate Layers (1 minute)

**Scenario**: Duplicated layers now support multi-drag

```
1. Select any layer
2. Click "Duplikasi"
3. New layer_copy appears

4. 🔥 Multi-drag test:
   - Multi-select original + copy
   - Touch both dengan 2 fingers
   - Panel2 shows: "2: layer, layer_copy" (BLUE)
   - Drag: both move ✅

Expected: ✅ Original + copy dapat multi-drag
```

---

## Test #4: Paste Layers (1 minute)

**Scenario**: Pasted layers support multi-drag

```
1. Copy layer (Ctrl+C)
2. Paste (Ctrl+V, Ctrl+V)
3. 3 copies of same layer exist

4. 🔥 Multi-drag test:
   - Select all 3 layers
   - Touch all 3 dengan different fingers
   - Panel2 shows: "3: layer_paste, ..." (BLUE)
   - Drag any: all move ✅

Expected: ✅ Multiple pasted layers move together
```

---

## Test #5: Unified API Verification (30 seconds)

**Console Diagnostic**:
```javascript
// Check unified API exists
console.log('1. Unified API exists:', typeof attachLayerToPointerSystem === 'function');

// Check all layers have pointer handler
let allReady = true;
layers.forEach(layer => {
    if (!layer.element.__pointerDownHandler) {
        console.log('❌ Missing pointer handler:', layer.name);
        allReady = false;
    }
});
console.log('2. All layers ready:', allReady);

// Test API on new layer
const testLayer = layers[0];
console.log('3. Calling API on existing layer...');
attachLayerToPointerSystem(testLayer);
console.log('   ✅ API callable without errors');
```

**Expected Output**:
```
1. Unified API exists: true ✅
2. All layers ready: true ✅
3. API callable without errors ✅
```

---

## Success Criteria ✅

- [ ] Ungroup Src: 2+ layers can multi-drag
- [ ] Text Shapes: text layer draggable with images
- [ ] Duplicate: copy+original can multi-drag
- [ ] Paste: multiple pasted layers work
- [ ] Console checks all pass
- [ ] Panel2 shows blue bounding box on multi-select

---

## If Something Fails ❌

### Symptom: "Still single-drag only"
**Check**:
```javascript
// Is API loaded?
console.log('API loaded:', typeof attachLayerToPointerSystem);

// Do new layers have pointer handler?
const newestLayer = layers[layers.length - 1];
console.log('Pointer handler:', !!newestLayer?.element?.__pointerDownHandler);

// Is pointer event listener attached?
newestLayer.element.addEventListener('pointerdown', () => {});
```

### Symptom: "Text shapes still not working"
**Check**:
```javascript
// Is textshape.js using unified API?
// Look at console during text creation
// Should see: "✅ Layer" TextShape" attached to unified pointer system"
```

### Symptom: "Some operations still old behavior"
**Check which operation**:
```javascript
// Test each operation's new layer
// 1. Ungroup - ungroupSrcLayers()
// 2. Duplicate - duplicateSelectedLayers()
// 3. Paste - pasteCopiedLayers()
// 4. Merge - mergeSelectedLayersSrc()
// 5. Text - textShapeManager.createTextLayer()

// For each:
const lastLayer = layers[layers.length - 1];
console.log(`${lastLayer.name} has unified setup:`, !!lastLayer?.element?.__pointerDownHandler);
```

---

## Quick Reference

### What Changed (7 locations):
1. ✅ New unified API function: `attachLayerToPointerSystem()`
2. ✅ DOMContentLoaded: use unified API for initial layers
3. ✅ ungroupSrcLayers(): use unified API
4. ✅ mergeSelectedLayersSrc(): use unified API
5. ✅ ungroupSelectedLayer(): use unified API
6. ✅ duplicateSelectedLayers(): use unified API
7. ✅ pasteCopiedLayers(): use unified API
8. ✅ textshape.js: use unified API for text creation

### Result:
ALL layer types now share same pointer system = **true multi-drag everywhere** 🎉

---

## Time Budget

| Test | Time |
|------|------|
| Setup | 30 sec |
| Test 1 (Ungroup) | 1.5 min |
| Test 2 (Text) | 1.5 min |
| Test 3 (Duplicate) | 1 min |
| Test 4 (Paste) | 1 min |
| Test 5 (Verify) | 30 sec |
| **TOTAL** | **~6 min** |

**Lakukan sekarang dan report!** ✅

---

## Expected Console Output During Tests

```
✅ Layer "text_0" attached to unified pointer system
✅ Layer "image_0_copy" attached to unified pointer system
✅ Layer "image_0_paste" attached to unified pointer system
✅ Layer "merged_group" attached to unified pointer system

✋ Touch #1: Added {layername} to multi-select. Total: 1
✋ Touch #2: Added {layername} to multi-select. Total: 2
✋ Touch released: Removed {layername}. Remaining: 1
```

If you see these messages + multi-drag works = **SUCCESS!** 🚀
