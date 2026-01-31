# Panel1 Refactor - Implementation Guide

## Overview
Panel1 telah dipisahkan menjadi 2 layer terpisah untuk mengoptimalkan pengalaman zoom:
1. **panel1-root**: Background/wallpaper (fixed, tidak zoom)
2. **panel1-layercontainer**: Layer objects (dapat zoom)

---

## Struktur HTML

### Sebelumnya:
```html
<div class="panel1 container" id="panel1">
    <!-- Background + Layers dijadikan satu -->
</div>
```

### Sesudah:
```html
<div class="panel1 container" id="panel1">
    <div class="panel1-root" id="panel1-root">
        <!-- Background/Wallpaper tetap full size -->
    </div>
    
    <div class="panel1-layercontainer" id="panel1-layercontainer">
        <!-- Semua layer objects -->
        <canvas id="guideCanvas" class="panel1-guide-canvas"></canvas>
    </div>
</div>
```

---

## CSS Properties

### panel1 (parent container)
```css
.panel1.container {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0; left: 0;
    display: flex;
    flex-direction: column;
}
```

### panel1-root (background layer)
```css
.panel1-root {
    position: absolute;
    top: 0; left: 0;
    right: 0; bottom: 0;
    background-size: cover;
    background-position: center;
    background-attachment: fixed;  /* PENTING: Tidak ikut scroll/zoom */
    z-index: 0;
}
```

### panel1-layercontainer (layer objects)
```css
.panel1-layercontainer {
    position: absolute;
    top: 0; left: 0;
    right: 0; bottom: 0;
    z-index: 1;
    transform-origin: center center;
    transform: scale(1);  /* Akan diubah oleh zoom */
}
```

### panel1-guide-canvas (guide overlay)
```css
.panel1-guide-canvas {
    position: absolute;
    top: 0; left: 0;
    z-index: 0;
    pointer-events: none;
    display: none;  /* Tampil saat zoom < 100% */
}
```

---

## JavaScript Functions

### Zoom Control

#### handleZoom(value)
Dipanggil saat zoom slider berubah.
```javascript
// Input: value dari slider (0-10000, 100 = 100%)
// Target: panel1-layercontainer
// Actions:
// - Set transform scale ke layerContainer
// - Update zoomInput display
// - Call updateGuideCanvasVisibility()
// - Record ke history
```

#### handleZoomInput(value)
Dipanggil saat user mengetik di zoom input field.
```javascript
// Input: string nilai zoom (misal "50%")
// Target: panel1-layercontainer
// Actions:
// - Parse value, clamp 0-10000
// - Set transform scale
// - Update slider
// - Call updateGuideCanvasVisibility()
```

### Guide Outline Functions

#### updateGuideCanvasVisibility(zoomScale)
Show/hide guide berdasarkan zoom level.
```javascript
// Input: zoomScale (dari zoom slider, 1.0 = 100%)
// Logic:
// - Jika zoomScale < 1 (zoom out): tampilkan guide
// - Jika zoomScale >= 1 (zoom normal/in): sembunyikan guide
// - Call drawGuideOutline() saat tampil
```

#### drawGuideOutline(canvas, container)
Menggambar outline garis biru langit pada canvas.
```javascript
// Input: canvas element, layer container element
// Features:
// - Warna: Sky Blue (#87CEEB)
// - Style: Garis dash (5px dash, 5px gap)
// - Spacing: 10% dari tepi
// - Responsive: Otomatis fit ke container size
// - Geometry: Rectangle outline di tengah-tengah
```

---

## Layer Attachment

### Old Way:
```javascript
const container = document.getElementById('panel1');
layer.attach(container, null);
```

### New Way:
```javascript
const container = document.getElementById('panel1-layercontainer') || 
                  document.getElementById('panel1') || 
                  document.querySelector('.container');
layer.attach(container, null);
```

**Note**: Fallback dibuat untuk backward compatibility jika panel1-layercontainer tidak ditemukan.

---

## Background Management

### setBackground(panelId)
Mengatur background image untuk panel.

#### Untuk panel1:
```javascript
const targetElement = document.getElementById('panel1-root') || 
                      document.getElementById('panel1');
targetElement.style.backgroundImage = `url('${imageUrl}')`;
```

#### Untuk panel2/3:
```javascript
const targetElement = document.getElementById(panelId);
targetElement.style.backgroundImage = `url('${imageUrl}')`;
```

### setOpacity(panelId)
Mengatur opacity untuk panel.

#### Untuk panel1 (background):
```javascript
const targetElement = document.getElementById('panel1-root') || 
                      document.getElementById('panel1');
targetElement.style.opacity = opacitySlider.value / 100;
```

---

## Event Listeners

### Window Resize
Guide canvas akan otomatis redraw saat window resize:
```javascript
window.addEventListener('resize', () => {
    const guideCanvas = document.getElementById('guideCanvas');
    const layerContainer = document.getElementById('panel1-layercontainer');
    if (guideCanvas && layerContainer && guideCanvas.style.display !== 'none') {
        drawGuideOutline(guideCanvas, layerContainer);
    }
});
```

---

## Keyboard Shortcuts

### Ctrl+P: Zoom In
- Target: `panel1-layercontainer`
- Action: scale += 0.1
- Max scale: 3.0
- Call: `updateGuideCanvasVisibility()`

### Ctrl+M: Zoom Out
- Target: `panel1-layercontainer`
- Action: scale -= 0.1
- Min scale: 0.1
- Call: `updateGuideCanvasVisibility()`

---

## Files Modified

| File | Changes |
|------|---------|
| `js/frame/studiopose.js` | HTML structure, CSS styling |
| `studiopose.html` | HTML structure, CSS styling |
| `js/studiocharacter/sensivity.js` | handleZoom(), handleZoomInput(), updateGuideCanvasVisibility(), drawGuideOutline() |
| `js/studiocharacter/studiopose.js` | Layer attachment, renderLayer(), onLayerPointerDown() |
| `js/studiocharacter/background.js` | setBackground() target updated |
| `js/studiocharacter/opacity.js` | setOpacity() target updated |
| `js/studiocharacter/bgconfig.js` | applyBgConfig() target updated |
| `js/studiocharacter/function.js` | Keyboard shortcut zoom handlers |

---

## Testing Steps

1. **Zoom Slider Test**
   - Drag zoom slider ke kanan (zoom in)
   - Drag zoom slider ke kiri (zoom out)
   - Verifikasi: Layer zoom, background tetap fixed

2. **Zoom Input Test**
   - Ketik "50" di zoom input
   - Ketik "150" di zoom input
   - Verifikasi: Nilai terupdate, layer berubah ukuran

3. **Guide Outline Test**
   - Set zoom ke 75%
   - Verifikasi: Garis biru langit tampil dengan dash pattern
   - Set zoom ke 100%
   - Verifikasi: Garis biru langit hilang

4. **Background Test**
   - Upload background image untuk panel1
   - Zoom in/out
   - Verifikasi: Background tetap sama, tidak ikut zoom
   - Upload background lain
   - Verifikasi: Background berubah, layer tetap di posisi

5. **Layer Manipulation Test**
   - Drag layer saat zoom 50%
   - Drag layer saat zoom 150%
   - Verifikasi: Layer bergerak sesuai zoom scale, tapi dapat dikontrol

6. **Opacity Test**
   - Set opacity slider untuk panel1
   - Verifikasi: Hanya background yang berubah opacity
   - Verifikasi: Layer tetap 100% opaque

7. **Keyboard Shortcuts Test**
   - Press Ctrl+P (zoom in)
   - Press Ctrl+M (zoom out)
   - Verifikasi: Zoom berubah, slider terupdate, guide tampil/hilang

8. **Window Resize Test**
   - Resize window saat zoom 75%
   - Verifikasi: Guide outline adjust ke ukuran baru

---

## Troubleshooting

### Guide tidak tampil saat zoom < 100%
- Cek apakah `guideCanvas` element ada di HTML
- Cek apakah `updateGuideCanvasVisibility()` dipanggil
- Check browser console untuk error

### Background ikut zoom
- Verifikasi bahwa background ditaruh di `panel1-root`, bukan `panel1-layercontainer`
- Check CSS: `background-attachment: fixed` harus ada

### Layer tidak bisa diklik/drag
- Verifikasi bahwa layer.element ada di dalam `panel1-layercontainer`
- Check pointer event listeners attach ke layer element

### Zoom tidak update
- Verifikasi bahwa zoom slider memanggil `handleZoom()`
- Check console untuk error
- Verifikasi `panel1-layercontainer` element exist

---

## Performance Notes

- Guide canvas redraw hanya saat zoom < 100%
- Canvas size matches container size untuk sharp rendering
- Pointer events disabled pada guide canvas (pointer-events: none)
- Transform scale lebih efisien daripada resize individual elements

---

## Future Improvements

1. Opsi untuk customize guide spacing (bukan hard-coded 10%)
2. Opsi untuk customize guide color dan dash style
3. Grid guide mode (selain rectangle outline)
4. Ruler display di edges saat zoom < 100%
5. Snap-to-guide functionality
