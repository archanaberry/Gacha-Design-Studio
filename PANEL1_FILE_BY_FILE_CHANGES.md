# Panel1 Refactor - File-by-File Changes

## 1. js/frame/studiopose.js

### Location of Changes
- Lines 65-115: CSS styling untuk panel1-root dan panel1-layercontainer
- Lines 155-167: HTML structure dalam template string

### Changes Made

#### CSS Added (Before `.panel1-root` styling)
```css
/* Panel1 Root - Background/Wallpaper tidak ikut zoom */
.panel1-root {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: none;
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
    z-index: 0;
}

/* Panel1 Layer Container - objek layer bisa di-zoom dan transform */
.panel1-layercontainer {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
    transform-origin: center center;
    transform: scale(1);
}

/* Guide Canvas untuk outline garis biru saat zoom <100% */
.panel1-guide-canvas {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
    pointer-events: none;
    display: none; /* Tampil hanya saat zoom <100% */
}
```

#### HTML Structure Updated
**Before:**
```html
<div class="panel1 container" id="panel1">
</div>
```

**After:**
```html
<div class="panel1 container" id="panel1">
    <!-- Background/Wallpaper tetap full size tanpa zoom -->
    <div class="panel1-root" id="panel1-root">
    </div>
    
    <!-- Layer Container - objek dan layer yang bisa di-zoom dan diatur -->
    <div class="panel1-layercontainer" id="panel1-layercontainer">
        <!-- Guide outline untuk menunjukkan batas kerja saat zoom <100% -->
        <canvas id="guideCanvas" class="panel1-guide-canvas"></canvas>
    </div>
</div>
```

### Why Changed
- Memisahkan background dari layer objects
- Background bisa stay fixed sementara layers zoom
- Guide canvas untuk visual indicator saat zoom

---

## 2. studiopose.html

### Location of Changes
- Lines 8-47: CSS styling untuk 3 element baru
- Lines 63-76: HTML structure pemisahan panel1

### Changes Made

#### CSS Added (In `<style>` tag)
```css
/* Panel1 Root - Background/Wallpaper tidak ikut zoom */
.panel1-root {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: none;
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
    z-index: 0;
}

/* Panel1 Layer Container - objek layer bisa di-zoom dan transform */
.panel1-layercontainer {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
    transform-origin: center center;
    transform: scale(1);
}

/* Guide Canvas untuk outline garis biru saat zoom <100% */
.panel1-guide-canvas {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
    pointer-events: none;
    display: none;
}
```

#### HTML Structure Updated
Same as frame/studiopose.js - panel1 dibagi jadi 2 container

### Why Changed
- Same structure juga perlu di main HTML file
- Untuk standalone HTML version tanpa iframe

---

## 3. js/studiocharacter/sensivity.js

### Location of Changes
- Line 31: handleZoom() function signature
- Line 33-34: Target element changed
- Line 42: Call to updateGuideCanvasVisibility()
- Line 51: handleZoomInput() function signature
- Line 53-54: Target element changed
- Line 71: Call to updateGuideCanvasVisibility()
- Lines 81-191: 3 new functions added

### Changes Made

#### handleZoom() - Updated
**Before:**
```javascript
function handleZoom(value) {
    const zoomValue = parseFloat(value);
    const panel = document.getElementById('panel1');
    if (panel) {
        const scale = zoomValue / 100;
        panel.dataset.scale = scale;
        panel.style.transform = `scale(${scale})`;
        // ... rest of code
    }
}
```

**After:**
```javascript
function handleZoom(value) {
    const zoomValue = parseFloat(value);
    const layerContainer = document.getElementById('panel1-layercontainer');
    if (layerContainer) {
        const scale = zoomValue / 100;
        layerContainer.dataset.scale = scale;
        layerContainer.style.transform = `scale(${scale})`;
        // ... rest of code
        
        // NEW: Tampilkan guide canvas jika zoom <100%
        updateGuideCanvasVisibility(scale);
        // ... rest of code
    }
}
```

#### handleZoomInput() - Updated
**Before:**
```javascript
function handleZoomInput(value) {
    // ...
    const panel = document.getElementById('panel1');
    if (panel) {
        const scale = zoomValue / 100;
        panel.dataset.scale = scale;
        panel.style.transform = `scale(${scale})`;
        // ... rest of code
    }
}
```

**After:**
```javascript
function handleZoomInput(value) {
    // ...
    const layerContainer = document.getElementById('panel1-layercontainer');
    if (layerContainer) {
        const scale = zoomValue / 100;
        layerContainer.dataset.scale = scale;
        layerContainer.style.transform = `scale(${scale})`;
        // ... rest of code
        
        // NEW: Tampilkan guide canvas jika zoom <100%
        updateGuideCanvasVisibility(scale);
        // ... rest of code
    }
}
```

#### updateGuideCanvasVisibility() - New Function
```javascript
function updateGuideCanvasVisibility(zoomScale) {
    const guideCanvas = document.getElementById('guideCanvas');
    const layerContainer = document.getElementById('panel1-layercontainer');
    
    if (!guideCanvas || !layerContainer) return;
    
    // Tampilkan guide hanya jika zoom < 100% (zoomScale < 1)
    if (zoomScale < 1) {
        guideCanvas.style.display = 'block';
        drawGuideOutline(guideCanvas, layerContainer);
    } else {
        guideCanvas.style.display = 'none';
    }
}
```

#### drawGuideOutline() - New Function
```javascript
function drawGuideOutline(canvas, container) {
    // Get canvas context
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size sesuai container
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set line properties
    const skyBlueColor = '#87CEEB';
    const lineWidth = 2;
    const dashLength = 5;
    const gapLength = 5;
    
    // Calculate margin (10% dari edges)
    const marginX = canvas.width * 0.1;
    const marginY = canvas.height * 0.1;
    
    // Draw rectangle outline dengan dashed lines
    // (Implementation: drawDashedLine helper function)
}
```

#### Window Resize Listener - New Event Listener
```javascript
// Re-draw guide saat window resize
window.addEventListener('resize', () => {
    const guideCanvas = document.getElementById('guideCanvas');
    const layerContainer = document.getElementById('panel1-layercontainer');
    if (guideCanvas && layerContainer && guideCanvas.style.display !== 'none') {
        drawGuideOutline(guideCanvas, layerContainer);
    }
});
```

### Why Changed
- Target element changed dari panel1 ke panel1-layercontainer (only layers zoom)
- Added guide canvas visibility logic
- Added guide canvas drawing functionality
- Added window resize handler untuk responsive guide

---

## 4. js/studiocharacter/studiopose.js

### Location of Changes
- Line 42-43: onLayerPointerDown() guard check updated
- Line 980-981: DOMContentLoaded handler container selection updated
- Line 1811-1812: renderLayer() container selection updated

### Changes Made

#### onLayerPointerDown() - Guard Check Updated
**Before:**
```javascript
function onLayerPointerDown(e, layer) {
    // ...
    const panel1El = document.getElementById('panel1') || document.querySelector('.container');
    if (!panel1El || !panel1El.contains(layer.element)) return;
```

**After:**
```javascript
function onLayerPointerDown(e, layer) {
    // ...
    const panel1LayerContainer = document.getElementById('panel1-layercontainer') || 
                                  document.getElementById('panel1') || 
                                  document.querySelector('.container');
    if (!panel1LayerContainer || !panel1LayerContainer.contains(layer.element)) return;
```

#### DOMContentLoaded - Layer Attachment Updated
**Before:**
```javascript
const container = document.getElementById('panel1') || document.querySelector('.container');
for (const layer of layers) {
    layer.attach(container, null);
```

**After:**
```javascript
const container = document.getElementById('panel1-layercontainer') || 
                  document.getElementById('panel1') || 
                  document.querySelector('.container');
for (const layer of layers) {
    layer.attach(container, null);
```

#### renderLayer() - Container Selection Updated
**Before:**
```javascript
function renderLayer(layer) {
    const container = document.getElementById('panel1') || document.querySelector('.container');
    // ... rest of code
}
```

**After:**
```javascript
function renderLayer(layer) {
    const container = document.getElementById('panel1-layercontainer') || 
                      document.getElementById('panel1') || 
                      document.querySelector('.container');
    // ... rest of code
}
```

### Why Changed
- Layers harus attach ke panel1-layercontainer, bukan panel1
- Fallback logic untuk backward compatibility
- Guard check di pointer handler juga perlu updated

---

## 5. js/studiocharacter/background.js

### Location of Changes
- Lines 26-45: setBackground() function updated

### Changes Made

#### setBackground() - Target Element Updated
**Before:**
```javascript
function setBackground(panelId) {
    // ... file reading code ...
    reader.onload = function(e) {
        const panel = document.getElementById(panelId);
        const imageUrl = e.target.result;
        
        panel.style.backgroundImage = `url('${imageUrl}')`;
        // ... rest of code
    }
}
```

**After:**
```javascript
function setBackground(panelId) {
    // ... file reading code ...
    reader.onload = function(e) {
        let targetElement;
        
        // Jika panel1, set background ke panel1-root (tidak terpengaruh zoom)
        if (panelId === 'panel1') {
            targetElement = document.getElementById('panel1-root') || 
                            document.getElementById('panel1');
        } else {
            targetElement = document.getElementById(panelId);
        }
        
        const imageUrl = e.target.result;
        
        targetElement.style.backgroundImage = `url('${imageUrl}')`;
        // ... rest of code
    }
}
```

### Why Changed
- Background image harus go to panel1-root, bukan panel1-layercontainer
- Ini memastikan background tetap fixed dan tidak ikut zoom
- Panel2 dan 3 tetap sama (tidak ada perubahan)

---

## 6. js/studiocharacter/opacity.js

### Location of Changes
- Lines 56-71: setOpacity() function updated

### Changes Made

#### setOpacity() - Target Element Updated
**Before:**
```javascript
function setOpacity(panelId) {
    // ... slider dan input getting code ...
    const panel = document.getElementById(panelId);

    if (opacitySlider && opacityInput && panel) {
        panel.style.opacity = opacitySlider.value / 100;
        // ... rest of code
    }
}
```

**After:**
```javascript
function setOpacity(panelId) {
    // ... slider dan input getting code ...
    
    let targetElement;
    
    // Jika panel1, set opacity ke panel1-root (background)
    if (panelId === 'panel1') {
        targetElement = document.getElementById('panel1-root') || 
                        document.getElementById('panel1');
    } else {
        targetElement = document.getElementById(panelId);
    }

    if (opacitySlider && opacityInput && targetElement) {
        targetElement.style.opacity = opacitySlider.value / 100;
        // ... rest of code
    }
}
```

### Why Changed
- Opacity untuk panel1 harus di-apply ke panel1-root (background)
- Ini memastikan layer tetap opaque, hanya background yang berubah
- Sesuai dengan design paradigm pemisahan background dan layers

---

## 7. js/studiocharacter/bgconfig.js

### Location of Changes
- Lines 79-94: applyBgConfig() function updated

### Changes Made

#### applyBgConfig() - Target Element Updated
**Before:**
```javascript
function applyBgConfig(panelId) {
    const panel = document.getElementById(panelId);
    if (!panel) {
        console.warn(`Panel ${panelId} not found`);
        return;
    }
    
    const config = loadBgConfig(panelId);
    
    if (config.imageUrl) {
        panel.style.backgroundImage = `url('${config.imageUrl}')`;
    }
    // ... rest of code
}
```

**After:**
```javascript
function applyBgConfig(panelId) {
    let targetElement;
    
    // Jika panel1, apply ke panel1-root (background tidak zoom)
    if (panelId === 'panel1') {
        targetElement = document.getElementById('panel1-root') || 
                        document.getElementById('panel1');
    } else {
        targetElement = document.getElementById(panelId);
    }
    
    if (!targetElement) {
        console.warn(`Panel ${panelId} not found`);
        return;
    }
    
    const config = loadBgConfig(panelId);
    
    if (config.imageUrl) {
        targetElement.style.backgroundImage = `url('${config.imageUrl}')`;
    }
    // ... rest of code
}
```

### Why Changed
- Saved background config harus di-restore ke panel1-root
- Ini memastikan persistent background tidak hilang saat refresh
- Konsisten dengan setBackground() logic

---

## 8. js/studiocharacter/function.js

### Location of Changes
- Lines 228-254: Ctrl+P (Zoom In) handler updated
- Lines 255-281: Ctrl+M (Zoom Out) handler updated

### Changes Made

#### Ctrl+P Handler - Zoom In Updated
**Before:**
```javascript
if (isCtrl && e.key.toLowerCase() === 'p' && !isInput) {
    e.preventDefault();
    const panel = document.getElementById('panel1');
    if (panel) {
        const currentScale = parseFloat(panel.dataset.scale) || 1;
        const newScale = Math.min(currentScale + 0.1, 3);
        panel.dataset.scale = newScale;
        panel.style.transform = `scale(${newScale})`;
        console.log('Zoom in: ' + Math.round(newScale * 100) + '%');
        // Update zoom controls...
    }
}
```

**After:**
```javascript
if (isCtrl && e.key.toLowerCase() === 'p' && !isInput) {
    e.preventDefault();
    const layerContainer = document.getElementById('panel1-layercontainer') || 
                          document.getElementById('panel1');
    if (layerContainer) {
        const currentScale = parseFloat(layerContainer.dataset.scale) || 1;
        const newScale = Math.min(currentScale + 0.1, 3);
        layerContainer.dataset.scale = newScale;
        layerContainer.style.transform = `scale(${newScale})`;
        console.log('Zoom in: ' + Math.round(newScale * 100) + '%');
        // ... update zoom controls...
        
        // NEW: Update guide canvas visibility
        updateGuideCanvasVisibility(newScale);
        // ... rest of code
    }
}
```

#### Ctrl+M Handler - Zoom Out Updated
**Before:**
```javascript
if (isCtrl && e.key.toLowerCase() === 'm' && !isInput) {
    e.preventDefault();
    const panel = document.getElementById('panel1');
    if (panel) {
        const currentScale = parseFloat(panel.dataset.scale) || 1;
        const newScale = Math.max(currentScale - 0.1, 0.1);
        panel.dataset.scale = newScale;
        panel.style.transform = `scale(${newScale})`;
        console.log('Zoom out: ' + Math.round(newScale * 100) + '%');
        // Update zoom controls...
    }
}
```

**After:**
```javascript
if (isCtrl && e.key.toLowerCase() === 'm' && !isInput) {
    e.preventDefault();
    const layerContainer = document.getElementById('panel1-layercontainer') || 
                          document.getElementById('panel1');
    if (layerContainer) {
        const currentScale = parseFloat(layerContainer.dataset.scale) || 1;
        const newScale = Math.max(currentScale - 0.1, 0.1);
        layerContainer.dataset.scale = newScale;
        layerContainer.style.transform = `scale(${newScale})`;
        console.log('Zoom out: ' + Math.round(newScale * 100) + '%');
        // ... update zoom controls...
        
        // NEW: Update guide canvas visibility
        updateGuideCanvasVisibility(newScale);
        // ... rest of code
    }
}
```

### Why Changed
- Keyboard zoom shortcuts juga perlu target panel1-layercontainer
- Need to call updateGuideCanvasVisibility() untuk show/hide guide
- Konsisten dengan slider zoom behavior

---

## Summary of Change Patterns

### Pattern 1: Element Selection
```javascript
// Old
const target = document.getElementById('panel1');

// New (with fallback)
const target = document.getElementById('panel1-layercontainer') || 
               document.getElementById('panel1') || 
               document.querySelector('.container');
```

### Pattern 2: Background Operations
```javascript
// Old
const target = document.getElementById(panelId);

// New
if (panelId === 'panel1') {
    target = document.getElementById('panel1-root') || document.getElementById('panel1');
} else {
    target = document.getElementById(panelId);
}
```

### Pattern 3: Zoom Operations
```javascript
// Old
const panel = document.getElementById('panel1');
panel.style.transform = `scale(${scale})`;

// New
const layerContainer = document.getElementById('panel1-layercontainer');
layerContainer.style.transform = `scale(${scale})`;
updateGuideCanvasVisibility(scale);
```

---

## Testing Each Change

| File | Test Case | Expected Result |
|------|-----------|-----------------|
| frame/studiopose.js | View source, check HTML structure | 3 divs visible (root, container, canvas) |
| studiopose.html | Open in browser | Same structure, CSS loaded |
| sensivity.js | Zoom slider 50% | Guide appears, layers shrink |
| sensivity.js | Zoom slider 100% | Guide disappears, normal size |
| studiopose.js | Add layer, zoom | Layer attach ke container |
| background.js | Upload bg, zoom | Background stays fixed |
| opacity.js | Opacity slider | Only bg affected, not layers |
| bgconfig.js | Refresh page after bg set | Background restored |
| function.js | Ctrl+P | Zoom in, guide logic works |
| function.js | Ctrl+M | Zoom out, guide logic works |

---

## Migration Checklist

- [x] All target element selections updated
- [x] CSS styling added for new elements
- [x] HTML structure updated in 2 files
- [x] Guide canvas functions implemented
- [x] Event listeners updated
- [x] Keyboard shortcuts updated
- [x] Background management updated
- [x] Opacity management updated
- [x] Config saving/loading updated
- [x] Fallback logic for backward compatibility
- [x] Documentation created

**Status: ✅ COMPLETE**
