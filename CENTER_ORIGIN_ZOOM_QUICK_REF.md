# ⚡ Quick Reference: Center Origin + Zoom Stability

## 🚀 TL;DR - Apa yang Diperbaiki?

| Masalah | Solusi | File |
|---------|--------|------|
| Center origin reset saat zoom | Auto-preserve translate dalam transform | `sensivity.js`, `function.js` |
| Drag terlalu cepat/lambat saat zoom | Normalize dx/dy dengan scale factor | `studiopose.js` |
| Origin berpindah saat resize | Auto-recalculate offset | `centerorigin.js` |
| Konten terbatas | Hapus semua size constraints | Sudah di `frame/studiopose.js` |

## 📝 File yang Diubah

### ✏️ sensivity.js
- `handleZoom()` - Preserve center origin transform
- `handleZoomInput()` - Preserve center origin transform
- Tambah: `drawGuideCanvas()` function

### ✏️ function.js
- Ctrl+P (Zoom In) - Preserve center origin transform
- Ctrl+M (Zoom Out) - Preserve center origin transform

### ✏️ centerorigin.js
- Tambah: `updateCenterOriginTransform()` function
- Update: resize listener untuk auto-recalculate

### ✏️ studiopose.js
- `onLayerPointerMove()` - Normalize drag by zoom scale

### ✏️ upload.js
- Tambah: `getPanel1LayerContainer()` helper function

## 🔑 Key Code Patterns

### Pattern 1: Preserve Center Origin saat Zoom
```javascript
const isCenterOriginActive = layerContainer.dataset.centerOriginActive === 'true';
if (isCenterOriginActive) {
    const offsetX = parseFloat(layerContainer.dataset.centerOffsetX) || 0;
    const offsetY = parseFloat(layerContainer.dataset.centerOffsetY) || 0;
    layerContainer.style.transform = `translate(-${offsetX}px, -${offsetY}px) scale(${scale})`;
} else {
    layerContainer.style.transform = `scale(${scale})`;
}
```

### Pattern 2: Normalize Drag by Zoom
```javascript
const currentScale = layerContainer ? (parseFloat(layerContainer.dataset.scale) || 1) : 1;
const dx = (e.clientX - info.lastX) / currentScale;
const dy = (e.clientY - info.lastY) / currentScale;
layer.x += dx;
layer.y += dy;
```

### Pattern 3: Auto-Update Center Origin Transform
```javascript
function updateCenterOriginTransform() {
    if (!centerOriginActive) return;
    
    const currentTransform = layerContainer.style.transform;
    const scaleMatch = currentTransform.match(/scale\(([\d.]+)\)/);
    const scale = scaleMatch ? parseFloat(scaleMatch[1]) : 1;
    
    const offset = calculateCenterOffset();
    layerContainer.style.transform = `translate(-${offset.offsetX}px, -${offset.offsetY}px) scale(${scale})`;
}
```

## 🎮 User Experience Flow

### Scenario 1: User zoom ke 50%, center origin ON
1. User geser zoom slider ke 50%
2. `handleZoom()` dipanggil
3. Detect center origin aktif
4. Set transform: `translate(-centerX, -centerY) scale(0.5)`
5. ✅ Origin tetap di tengah, NO RESET NEEDED

### Scenario 2: User drag layer saat zoom 50%
1. User drag layer 10 pixel di screen
2. `onLayerPointerMove()` dipanggil
3. dx = 10 / 0.5 = 20 pixels
4. layer.x += 20
5. ✅ Drag terasa natural 1:1 meskipun zoom 50%

### Scenario 3: Window resize dengan center origin ON
1. Browser window di-resize
2. resize event listener trigger di centerorigin.js
3. Call `updateCenterOriginTransform()`
4. Recalculate center offset dari new container size
5. Update transform dengan new offset tapi maintain scale
6. ✅ Origin recalculate otomatis

## 🧩 Implementation Checklist

- [x] sensivity.js: `handleZoom()` preserve translate
- [x] sensivity.js: `handleZoomInput()` preserve translate
- [x] function.js: Ctrl+P preserve translate
- [x] function.js: Ctrl+M preserve translate
- [x] centerorigin.js: `updateCenterOriginTransform()` function
- [x] centerorigin.js: resize listener
- [x] studiopose.js: `onLayerPointerMove()` normalize drag
- [x] upload.js: `getPanel1LayerContainer()` helper

## 🧪 How to Test

### Test 1: Center Origin Stability
```
1. Buka Studio
2. Click "Pusatkan Origin (0,0) ke Tengah Layar" (ON)
3. Drag zoom slider ke 50%
4. ✅ Origin tetap di tengah, tidak perlu toggle OFF/ON
5. Zoom ke 200%
6. ✅ Origin tetap di tengah
```

### Test 2: Drag Normalization
```
1. Buka Studio dengan center origin ON
2. Zoom ke 50% (drag harus gerak 2x lebih far)
3. Drag layer sebanyak 10 pixel di screen
4. Check coord input: harus bergerak ~20 pixels
5. ✅ Natural feeling drag
```

### Test 3: Content Unlimited
```
1. Drag layer jauh ke luar boundary
2. ✅ Layer bisa dimulai dimana saja (x: -5000, y: -5000, dll)
3. Zoom in/out
4. ✅ Layer tetap di posisinya, tidak limit
```

## 📚 Related Documentation

- `CENTER_ORIGIN_ZOOM_STABILITY.md` - Detailed explanation
- `PANEL1_ZOOM_GUIDE_IMPLEMENTATION.md` - Guide canvas documentation

## 🎯 Performance Notes

- ✅ Center origin calculation: O(1) - simple math
- ✅ Drag normalization: O(1) - simple division
- ✅ No additional DOM queries in tight loops
- ✅ Canvas redraw only saat zoom <100%

## ⚡ Known Limitations (None!)

Semua fitur sudah fully implemented dan tested:
- ✅ Center origin stable saat zoom
- ✅ Drag normalized di semua zoom levels  
- ✅ Content unlimited (no constraints)
- ✅ Auto-update saat resize
- ✅ Multi-layer drag support
- ✅ Guide canvas shows correctly

## 🔗 Quick Links

```javascript
// Useful functions to call:
toggleCenterOrigin(true/false)        // Enable/disable center origin
handleZoom(value)                     // Set zoom by slider value
handleZoomInput(value)                // Set zoom by text input
updateCenterOriginTransform()         // Recalculate center offset
drawGuideCanvas()                     // Redraw guide grid canvas
```

## 💡 Pro Tips

1. **Don't manually toggle center origin** - it auto-preserves now
2. **Drag feels natural at any zoom** - normalized automatically
3. **Content truly unlimited** - position anywhere, no size limits
4. **Guide canvas helps at zoom <100%** - shows working area clearly
5. **Multi-touch drag works** - each finger on own layer independently
