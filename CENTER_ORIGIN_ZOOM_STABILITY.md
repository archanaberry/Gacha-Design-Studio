# Center Origin + Zoom Stability Fix

## 🎯 Problem Statement

Sebelumnya:
- ❌ Saat zoom berubah, center origin reset dan perlu di-toggle ulang
- ❌ Drag tidak stable saat zoom, layer tergerak terlalu cepat/lambat
- ❌ Content limit dan tidak properly responsive

Sekarang:
- ✅ Center origin **auto-preserve** saat zoom berubah
- ✅ Drag **normalized by zoom scale** - tetap smooth di semua zoom level
- ✅ Content **unlimited** - tidak ada limit atau constraint
- ✅ Origin tetap di tengah meskipun zoom/resize

## 📋 Perubahan yang Dilakukan

### 1. **sensivity.js** (Zoom Handler)

**Sebelum**: Zoom langsung set scale tanpa memperhatikan center origin
```javascript
layerContainer.style.transform = `scale(${scale})`;
```

**Sesudah**: Preserve translate dari center origin
```javascript
// Preserve center origin translate jika aktif
const isCenterOriginActive = layerContainer.dataset.centerOriginActive === 'true';
if (isCenterOriginActive) {
    const centerOffsetX = parseFloat(layerContainer.dataset.centerOffsetX) || 0;
    const centerOffsetY = parseFloat(layerContainer.dataset.centerOffsetY) || 0;
    layerContainer.style.transform = `translate(-${centerOffsetX}px, -${centerOffsetY}px) scale(${scale})`;
} else {
    layerContainer.style.transform = `scale(${scale})`;
}
```

**Diterapkan di**:
- `handleZoom(value)` - zoom slider
- `handleZoomInput(value)` - manual input

### 2. **function.js** (Keyboard Zoom Shortcuts)

**Update Ctrl+P (Zoom In) dan Ctrl+M (Zoom Out)**:
- Preserve center origin transform seperti sensivity.js
- Tetap call `drawGuideCanvas()` untuk guide update

### 3. **centerorigin.js** (Center Origin Handler)

**Fungsi Baru: `updateCenterOriginTransform()`**
- Recalculate center offset saat zoom atau resize
- Memastikan origin tetap di center meskipun scale berubah
- Dipanggil oleh resize event listener

### 4. **studiopose.js** (Drag Handler)

**Update `onLayerPointerMove()`**:
- **Sebelum**: `dx = e.clientX - info.lastX` (raw pixel)
- **Sesudah**: `dx = (e.clientX - info.lastX) / currentScale` (normalized)

```javascript
// Get current zoom scale untuk normalize drag distance
const layerContainer = document.getElementById('panel1-layercontainer');
const currentScale = layerContainer ? (parseFloat(layerContainer.dataset.scale) || 1) : 1;

// Normalize drag delta by zoom scale
// Ketika zoom 50%, user drag 10px tapi gerakan actual harus 20px (10 / 0.5 = 20)
const dx = (e.clientX - info.lastX) / currentScale;
const dy = (e.clientY - info.lastY) / currentScale;
```

## 🔄 Data Flow

### Zoom Flow
```
User: Slide zoom slider / Keyboard Ctrl+P/M
    ↓
handleZoom() atau handleZoomInput() atau keyboard handler
    ↓
Read: isCenterOriginActive & centerOffset dari layerContainer.dataset
    ↓
Update: layerContainer.style.transform
    ├─ Jika active: translate(-offsetX, -offsetY) scale(newScale)
    └─ Jika inactive: scale(newScale)
    ↓
Call: drawGuideCanvas() untuk guide update
    ↓
Update: zoom slider & input display
```

### Drag Flow
```
User: Drag layer dengan mouse/touch
    ↓
onLayerPointerDown(): Store lastX, lastY
    ↓
onLayerPointerMove()
    ├─ Read: currentScale dari layerContainer.dataset.scale
    ├─ Calculate: dx/dy = raw pixel delta / scale
    ├─ Apply: layer.x += dx, layer.y += dy
    └─ Update: coord inputs & visual render
    ↓
onLayerPointerUp(): Cleanup drag state
```

### Resize Flow
```
Window resize event triggered
    ↓
centerorigin.js resize listener
    ├─ Check: if centerOriginActive?
    └─ Yes: Call updateCenterOriginTransform()
        ├─ Recalculate: center offset dari new container size
        ├─ Get: current scale dari transform
        └─ Update: transform = translate + scale with new offset
```

## 💾 State Management

### layerContainer.dataset Properties
```javascript
layerContainer.dataset.scale = "0.5"              // Current zoom (0.5 = 50%)
layerContainer.dataset.centerOriginActive = "true" // Boolean: center origin enabled?
layerContainer.dataset.centerOffsetX = "960"       // Center offset X in pixels
layerContainer.dataset.centerOffsetY = "540"       // Center offset Y in pixels
```

### Transform Pattern
```javascript
// Center origin INACTIVE
transform: scale(0.8)

// Center origin ACTIVE
transform: translate(-960px, -540px) scale(0.8)

// The translate moves (0,0) visual position to the center
// The scale applies AFTER translate in the transform chain
```

## ✨ Key Features

1. **Auto-Preserve**: Center origin automatically maintained during zoom
2. **Normalized Drag**: Drag distance automatically adjusted for zoom level
3. **Unlimited Content**: No size limits or constraints
4. **Responsive Origin**: Origin recalculates on window resize
5. **Stable Transform Order**: translate → scale (order matters!)

## 🧪 Testing Checklist

- [x] Toggle center origin ON/OFF - no reset needed
- [x] Zoom with center origin active - origin stays centered
- [x] Zoom slider + center origin - stable
- [x] Keyboard zoom + center origin - stable
- [x] Drag at 100% zoom - moves 1:1 with mouse
- [x] Drag at 50% zoom - moves 2:1 with mouse (normalized)
- [x] Drag at 200% zoom - moves 0.5:1 with mouse (normalized)
- [x] Multi-layer drag - all move same amount
- [x] Window resize with center origin - origin recalculates
- [x] Zoom + drag combination - both work together

## 📊 Formula Explanation

### Drag Normalization
```
User drags 10 pixels on screen with zoom at 50% (scale = 0.5)

Without normalization:
  layer.x += 10  ← Only 10 pixel in data, looks sluggish

With normalization:
  dx = 10 / 0.5 = 20
  layer.x += 20  ← 20 pixels in data, natural 1:1 feel on screen
```

### Center Offset Calculation
```
Container: 1920px wide × 1080px tall

Center position:
  offsetX = 1920 / 2 = 960px
  offsetY = 1080 / 2 = 540px

Transform:
  translate(-960px, -540px) ← Move origin to center
  scale(0.5)                ← Then zoom
```

## 🔧 Future Improvements

- [ ] Snap-to-grid during drag at specific zoom levels
- [ ] Smooth zoom animation (easing)
- [ ] Zoom history/undo
- [ ] Custom origin position (not just center)
- [ ] Zoom constraints (min/max)
- [ ] Zoom presets (50%, 100%, 200%, fit-to-screen)

## ⚠️ Important Notes

1. **Transform Order Matters**: Always `translate` BEFORE `scale`
   - CORRECT: `translate(-offsetX, -offsetY) scale(scale)`
   - WRONG: `scale(scale) translate(-offsetX, -offsetY)`

2. **Drag Normalization Only for Pan**: Don't normalize arrow key movement
   - Arrow keys should use sensitivity value, not scale
   - Only pointer drag (mouse/touch) needs normalization

3. **Center Offset is Visual Only**: Doesn't affect layer.x/layer.y storage
   - Storage values are always in "absolute space"
   - Visual rendering includes render offset + center offset

4. **Content is Truly Unlimited**:
   - No `max-width`, `max-height` on panel1-layercontainer
   - Layers can be positioned anywhere (positive/negative coordinates)
   - Zoom can go from 0.1x to 100x without issues
