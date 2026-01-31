# Center Origin Fix - Implementation Complete

## Status: ✅ FIXED & IMPLEMENTED

### What Was Fixed
1. **Canvas Bounding Box** - Guide outline canvas sekarang menggunakan `scrollWidth/scrollHeight/offsetWidth` untuk akurat sesuai resolusi layar maksimal
2. **Center Origin Toggle** - Checkbox untuk memposisikan origin (0,0) di tengah layar dengan transform translate

---

## Center Origin Feature

### How It Works
```
DISABLED (Normal):
Origin (0,0) di top-left
X: 0 → 100% (0px → containerWidth)
Y: 0 → 100% (0px → containerHeight)

ENABLED (Center):
Origin (0,0) di center
X: -50% → 50% (-centerX px → +centerX px)
Y: -50% → 50% (-centerY px → +centerY px)
```

### Implementation Details

#### CSS Transform (layer1-layercontainer)
- **Normal**: `transform: scale(1)`
- **Center**: `transform: translate(-centerX px, -centerY px) scale(1)`

#### Layer Positioning
- Automatic conversion saat toggle
- All layers repositioned ke center-based coordinates
- UI input menampilkan display coordinate (center-based saat aktif)

### API Functions

```javascript
// Main toggle function
toggleCenterOrigin(enabled)  // true/false

// Helper functions
calculateCenterOffset()      // Returns { offsetX, offsetY, offsetXPercent, offsetYPercent }
convertToCenterOriginCoord(x, y)     // Normal → Center coords
convertFromCenterOriginCoord(x, y)   // Center → Normal coords
getDisplayCoord(x, y)        // Get display coord (respects origin mode)
getStorageCoord(displayX, displayY)  // Get storage coord (respects origin mode)
updateAllLayersForCenterOrigin(toCenterOrigin)  // Batch update all layers
```

---

## Canvas Guide Outline Fix

### Before
```javascript
const rect = container.getBoundingClientRect();
canvas.width = rect.width;
canvas.height = rect.height;
```
**Problem**: viewport size, tidak actual content size

### After
```javascript
const width = container.scrollWidth || container.offsetWidth || container.clientWidth;
const height = container.scrollHeight || container.offsetHeight || container.clientHeight;
canvas.width = width;
canvas.height = height;
```
**Solution**: Uses actual content size dengan fallback

---

## Files Modified

| File | Changes |
|------|---------|
| js/studiocharacter/centerorigin.js | **NEW** - Center origin logic |
| studiopose.html | Added centerorigin.js script include + CSS overflow/max-size |
| js/frame/studiopose.js | Added centerorigin.js script include + CSS + Event listener for resize |
| js/studiocharacter/sensivity.js | Updated canvas size calculation (scrollWidth/Height) |
| js/studiocharacter/studiopose.js | Updated handleXCoord/handleYCoord + updateCoordInput |

---

## UI Control

### Checkbox in Panel2
```html
<label for="centerOriginToggle">
    <input type="checkbox" id="centerOriginToggle" onchange="toggleCenterOrigin(this.checked)">
    Pusatkan Origin (0,0) ke Tengah Layar
</label>
```

### When Enabled
- ✅ Origin (0,0) moves to center of screen
- ✅ All layers reposition automatically
- ✅ UI coordinates show center-based values (negative/positive)
- ✅ Background stays fixed (unaffected)

### When Disabled
- ✅ Origin (0,0) returns to top-left
- ✅ All layers reposition back to normal
- ✅ UI coordinates show normal values (0-100%)

---

## Testing Checklist

- [ ] Canvas guide outline shows correct bounds at any zoom level
- [ ] Center origin checkbox visible and functional
- [ ] Toggle center origin - layers reposition correctly
- [ ] Coordinate inputs show correct values per mode
- [ ] Drag layers saat center origin aktif
- [ ] Zoom in/out saat center origin aktif
- [ ] Window resize saat center origin aktif - offset recalculated
- [ ] Undo/redo bekerja dengan center origin
- [ ] Save/load state dengan center origin

---

## Coordinate Systems

### Storage (Internal)
- Always stored in normal coordinates (top-left origin)
- Used for save/load, undo/redo
- Layer.x dan layer.y selalu dalam normal space

### Display (UI)
- Shown in current origin mode
- Normal mode: 0 to container size
- Center mode: -center to +center (negative to positive)

### Conversion
```javascript
// Normal → Center Display
displayCoord = storageCoord - centerOffset

// Center Display → Normal
storageCoord = displayCoord + centerOffset
```

---

## Example: Moving a Layer

### Normal Mode
```
Storage: layer.x = 100, layer.y = 200
UI Shows: X: 100, Y: 200
User drags to X: 150, Y: 250
→ Storage becomes: 150, 250
```

### Center Mode
Container width = 1366, height = 768
Center = 683, 384

```
Storage: layer.x = 100, layer.y = 200
Display = 100-683, 200-384 = -583, -184
UI Shows: X: -583, Y: -184
User changes to X: 0, Y: 0 (center)
→ Storage becomes: 0+683, 0+384 = 683, 384
```

---

## Performance Notes

- ✅ No significant performance impact
- ✅ Transform translate is hardware-accelerated (GPU)
- ✅ Layer repositioning done only on toggle/resize
- ✅ Canvas redraw only at zoom <100%

---

## Known Limitations

1. **Persisten State** - Center origin state not saved
   - Future: Save to localStorage

2. **Framework Panel** - Origin offset not considered
   - Future: Sync framework display with origin mode

3. **Grid/Guides** - Not adjusted for origin mode
   - Future: Add origin-aware grid

---

## Troubleshooting

### Layers out of bounds
- Check: Is panel1-layercontainer properly sized?
- Check: scrollWidth/offsetWidth returning correct value?
- Solution: Ensure container has proper overflow: hidden

### Center origin not working
- Check: centerOriginActive flag in console
- Check: calculateCenterOffset() returns correct value
- Check: Checkbox wired correctly

### Coordinates don't match
- Check: Which origin mode is active?
- Check: Display vs storage coord conversion
- Solution: Use getDisplayCoord() function

---

## Code Quality

- ✅ Modular functions
- ✅ Comprehensive comments
- ✅ Error handling
- ✅ Backward compatible (fallback to normal mode)
- ✅ Responsive to window resize

---

**Status**: ✅ READY FOR TESTING
