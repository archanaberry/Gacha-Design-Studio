# 🔗 IMPLEMENTASI TEMPLATE KARAKTER - TECHNICAL REFERENCE
## Gacha Design Studio - Complete Integration Guide

---

## 📊 ALUR DATA: TEMPLATE → PANEL2 → LAYER.JS

```
┌─────────────────────────────────────────────────────────────┐
│                   studiopose.js                              │
│  Layer Template Definition (lines 80-365)                   │
│  const layers = [                                            │
│    { layerName, src, options: {...} }                       │
│  ].map(createLayerFromObject)                               │
└────────────────┬────────────────────────────────────────────┘
                 │ options dibaca oleh createLayerFromObject()
                 ▼
┌─────────────────────────────────────────────────────────────┐
│                   layer.js Constructor                       │
│  constructor(name, src, options = {}, childLayers = [])     │
│                                                              │
│  Set initial properties dari options:                        │
│  • this.#x = options.posX (atau options.x)                 │
│  • this.#y = options.posY (atau options.y)                 │
│  • this.#rotation = options.rotation                        │
│  • this.#scale = options.scale                              │
│  • this.#skewX = options.skewX                              │
│  • this.#skewY = options.skewY                              │
│  • this.#flipX = options.flipX                              │
│  • this.#flipY = options.flipY                              │
│  • this.#width = options.width                              │
│  • this.#height = options.height                            │
│  • opacity = options.opacity                                │
│  • color parsing untuk color0, color1, dst                  │
│                                                              │
│  this.#updateElement()  → apply ke DOM                      │
└────────────────┬────────────────────────────────────────────┘
                 │ element HTML dibuat dan styled
                 ▼
┌─────────────────────────────────────────────────────────────┐
│                   DOM Layer Element                          │
│  <div class="layer selected" style="                         │
│    left: Xpx; top: Ypx;                                     │
│    transform: rotate(Rdeg) scale(S) skewX(SXdeg)...;        │
│    opacity: O; ...                                          │
│  ">                                                          │
│    <img src="assets/character/..." />                       │
│    <img src="assets/character/..." />                       │
│  </div>                                                      │
└────────────────┬────────────────────────────────────────────┘
                 │ Layer siap untuk interact dengan panel2
                 ▼
┌─────────────────────────────────────────────────────────────┐
│                   Panel2 Controls                            │
│  Input IDs yang terhubung:                                  │
│  • xCoord → handleXCoord() → selected.x = newValue          │
│  • yCoord → handleYCoord() → selected.y = newValue          │
│  • rotationControl → handleRotation() → selected.rotation   │
│  • scale → handleScale() → selected.scale                   │
│  • skewXControl/Slider → handleSkewX() → selected.skewX    │
│  • skewYControl/Slider → handleSkewY() → selected.skewY    │
│  • flipHorizontal → handleFlipHorizontal() → selected.flipX│
│  • flipVertical → handleFlipVertical() → selected.flipY    │
│  • width/height → updateLayerSize() → selected.width/height│
│  • opacitySlider → setOpacity() → layer opacity            │
└────────────────┬────────────────────────────────────────────┘
                 │ Setter calls #updateElement()
                 ▼
┌─────────────────────────────────────────────────────────────┐
│                   Layer #updateElement()                     │
│  Setiap setter (x, y, rotation, scale, skewX, skewY, flip) │
│  akan otomatis:                                             │
│  1. Update internal property (#x, #y, dst)                  │
│  2. Call this.#updateElement()                              │
│  3. Update DOM style real-time                              │
│  4. Notify parent jika ada child layers                     │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 PROPERTY MAPPING - TEMPLATE OPTIONS → PANEL2 → LAYER.JS

### POSISI (Position)

| Template Key | Type | Default | Panel2 Input | Layer Property | DOM Attribute |
|--------------|------|---------|--------------|----------------|---------------|
| **posX** | number | 0 | `#xCoord` | `#x` | `left` |
| **posY** | number | 0 | `#yCoord` | `#y` | `top` |

**Handler Code** (studiopose.js):
```javascript
function handleXCoord(value) {
    if (!selected) return;
    selected.x = parseFloat(value);
}

function handleYCoord(value) {
    if (!selected) return;
    selected.y = parseFloat(value);
}
```

**Layer Setter** (layer.js):
```javascript
set x(value) {
    this.#x = value;
    this.#updateElement();     // Trigger DOM update
    this.#notifyParentUpdate();
}

set y(value) {
    this.#y = value;
    this.#updateElement();
    this.#notifyParentUpdate();
}
```

**DOM Update** (#updateElement):
```javascript
this.element.style.left = this.#x + 'px';
this.element.style.top = this.#y + 'px';
```

---

### ROTASI (Rotation)

| Template Key | Type | Range | Default | Panel2 Input | Layer Property | DOM Transform |
|--------------|------|-------|---------|--------------|----------------|---------------|
| **rotation** | number | 0-360 | 0 | `#rotationControl` | `#rotation` | `rotate(Ndeg)` |

**Handler Code** (studiopose.js):
```javascript
function handleRotation(value) {
    if (!selected) return;
    const rotation = parseFloat(value);
    selected.rotation = rotation;
    const indicator = document.getElementById('rotationIndicator');
    if (indicator) indicator.innerText = rotation;
}
```

**Layer Setter** (layer.js):
```javascript
set rotation(value) {
    this.#rotation = value;
    this.#updateElement();
}
```

**DOM Update** (#updateElement):
```javascript
const transforms = [
    `translate(${this.#x}px, ${this.#y}px)`,
    `rotate(${this.#rotation}deg)`,
    // ... transforms lainnya
];
this.element.style.transform = transforms.join(' ');
```

---

### SKALA (Scale)

| Template Key | Type | Range | Default | Panel2 Input | Layer Property | DOM Transform |
|--------------|------|-------|---------|--------------|----------------|---------------|
| **scale** | number | 0-2+ | 1 | `#scale` | `#scale` | `scale(N)` |

**Handler Code** (studiopose.js):
```javascript
function handleScale(value) {
    if (!selected) return;
    selected.scale = parseFloat(value);
    const scaleInput = document.getElementById('scale');
    if (scaleInput) scaleInput.value = value;
}
```

**Layer Setter** (layer.js):
```javascript
set scale(value) {
    this.#scale = value;
    this.#updateElement();
}
```

**DOM Update** (#updateElement):
```javascript
const transforms = [
    ...,
    `scale(${this.#scale})`,
    ...
];
this.element.style.transform = transforms.join(' ');
```

---

### SKEW (Skew Transform)

| Template Key | Type | Range | Default | Panel2 Input | Layer Property | DOM Transform |
|--------------|------|-------|---------|--------------|----------------|---------------|
| **skewX** | number | -45 to 45 | 0 | `#skewXControl` / `#skewXSlider` | `#skewX` | `skewX(Ndeg)` |
| **skewY** | number | -45 to 45 | 0 | `#skewYControl` / `#skewYSlider` | `#skewY` | `skewY(Ndeg)` |

**Handler Code** (studiopose.js):
```javascript
function handleSkewX(value) {
    if (!selected) return;
    selected.skewX = parseFloat(value);
    const slider = document.getElementById('skewXSlider');
    if (slider) slider.value = value;
}

function handleSkewXSlider(value) {
    if (!selected) return;
    selected.skewX = parseFloat(value);
    const control = document.getElementById('skewXControl');
    if (control) control.value = value;
}

function handleSkewY(value) {
    if (!selected) return;
    selected.skewY = parseFloat(value);
    const slider = document.getElementById('skewYSlider');
    if (slider) slider.value = value;
}

function handleSkewYSlider(value) {
    if (!selected) return;
    selected.skewY = parseFloat(value);
    const control = document.getElementById('skewYControl');
    if (control) control.value = value;
}
```

**Layer Setters** (layer.js):
```javascript
set skewX(value) {
    this.#skewX = value;
    this.#updateElement();
}

set skewY(value) {
    this.#skewY = value;
    this.#updateElement();
}
```

**DOM Update** (#updateElement):
```javascript
const transforms = [
    ...,
    `skewX(${this.#skewX}deg)`,
    `skewY(${this.#skewY}deg)`,
    ...
];
this.element.style.transform = transforms.join(' ');
```

---

### FLIP (Horizontal & Vertical)

| Template Key | Type | Default | Panel2 Input | Layer Property | DOM Transform |
|--------------|------|---------|--------------|----------------|---------------|
| **flipX** | boolean | false | `#flipHorizontal` | `#flipX` | `scaleX(-1)` |
| **flipY** | boolean | false | `#flipVertical` | `#flipY` | `scaleY(-1)` |

**Handler Code** (studiopose.js):
```javascript
function handleFlipHorizontal(checked) {
    if (!selected) return;
    selected.flipX = checked;
}

function handleFlipVertical(checked) {
    if (!selected) return;
    selected.flipY = checked;
}
```

**Layer Setters** (layer.js):
```javascript
set flipX(value) {
    this.#flipX = value;
    this.#updateElement();
}

set flipY(value) {
    this.#flipY = value;
    this.#updateElement();
}
```

**DOM Update** (#updateElement):
```javascript
let scaleX = this.#flipX ? -1 : 1;
let scaleY = this.#flipY ? -1 : 1;

const transforms = [
    ...,
    `scaleX(${scaleX})`,
    `scaleY(${scaleY})`,
];
this.element.style.transform = transforms.join(' ');
```

---

### UKURAN (Width & Height)

| Template Key | Type | Default | Panel2 Input | Layer Property | DOM Attribute |
|--------------|------|---------|--------------|----------------|---------------|
| **width** | number | null | `#width` | `#width` | `width` |
| **height** | number | null | `#height` | `#height` | `height` |

**Handler Code** (studiopose.js):
```javascript
function updateLayerSize(dimension, value) {
    if (!selected) return;
    value = parseFloat(value);
    if (isNaN(value)) return;
    
    if (dimension === 'width') {
        selected.width = value;
    } else if (dimension === 'height') {
        selected.height = value;
    }
}
```

**Layer Setters** (layer.js):
```javascript
set width(value) {
    this.#width = value;
    this.#updateElement();
}

set height(value) {
    this.#height = value;
    this.#updateElement();
}
```

**DOM Update** (#updateElement):
```javascript
if (this.#width !== null) {
    this.element.style.width = this.#width + 'px';
}
if (this.#height !== null) {
    this.element.style.height = this.#height + 'px';
}
```

---

### OPASITAS (Opacity)

| Template Key | Type | Range | Default | Panel2 Input | DOM Attribute |
|--------------|------|-------|---------|--------------|---------------|
| **opacity** | number | 0-1 | 1 | `#opacitySlider1-3` | `opacity` |

**Handler Code** (frame/studiopose.js):
```javascript
function setOpacity(panelId) {
    const slider = document.getElementById('opacitySlider' + num);
    const input = document.getElementById('opacityInput' + num);
    const panel = document.getElementById(panelId);
    
    if (slider && panel) {
        const opacityPercent = parseInt(slider.value);
        const opacityDecimal = opacityPercent / 100;
        panel.style.opacity = opacityDecimal;
        if (input) input.value = opacityPercent + '%';
    }
}
```

**DOM Update**:
```javascript
panel.style.opacity = opacityDecimal;
```

---

### WARNA (Color)

| Template Key | Type | Format | Default | Usage |
|--------------|------|--------|---------|-------|
| **color** | string | #RRGGBB | null | Warna global untuk semua src |
| **color0** | string | #RRGGBB | null | Warna khusus src[0] (outline) |
| **color1** | string | #RRGGBB | null | Warna khusus src[1] (base) |
| **color2** | string | #RRGGBB | null | Warna khusus src[2] (detail) |
| ... | ... | ... | ... | ... |

**Parsing di Constructor** (layer.js):
```javascript
#parseColorOptions(options) {
    if ('color' in options && options.color !== null) {
        this.#color = options.color;
    }
    
    // Parse color0, color1, color2, dst
    for (let i = 0; i < this.#src.length; i++) {
        const colorKey = `color${i}`;
        if (colorKey in options && options[colorKey] !== null) {
            // Apply color ke src[i]
            if (this.element) {
                const img = this.element.querySelectorAll('.src-item')[i];
                if (img && img.src.endsWith('.svg')) {
                    // Fetch & tint SVG
                }
            }
        }
    }
}
```

**SVG Color Tinting** (#initElement):
```javascript
if (src.endsWith('.svg') && colorForThis) {
    fetch(src).then(r => r.text()).then(svgText => {
        // Replace fill dan stroke dengan warna custom
        svgText = svgText.replace(/fill="[^"]*"/g, `fill="${colorForThis}"`);
        svgText = svgText.replace(/stroke="[^"]*"/g, `stroke="${colorForThis}"`);
        svgText = svgText.replace(/fill:\s*[^;]+/g, `fill:${colorForThis}`);
        svgText = svgText.replace(/stroke:\s*[^;]+/g, `stroke:${colorForThis}`);
        
        // Convert ke data URL
        const dataUrl = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgText)));
        imgElement.src = dataUrl;
    });
}
```

---

## 🔍 COMPLETE TRANSFORM BUILDING

Ketika layer di-update, #updateElement() membangun transform complete:

```javascript
#updateElement() {
    if (!this.element) return;
    
    // Position
    this.element.style.left = this.#x + 'px';
    this.element.style.top = this.#y + 'px';
    
    // Build transform array
    const transforms = [];
    
    // 1. Origin transform
    transforms.push(`translate(${this.#x}px, ${this.#y}px)`);
    
    // 2. Rotation
    if (this.#rotation !== 0) {
        transforms.push(`rotate(${this.#rotation}deg)`);
    }
    
    // 3. Scale (including flip)
    let scaleX = this.#flipX ? -1 : 1;
    let scaleY = this.#flipY ? -1 : 1;
    if (scaleX !== 1 || scaleY !== 1) {
        transforms.push(`scale(${scaleX}, ${scaleY})`);
    } else if (this.#scale !== 1) {
        transforms.push(`scale(${this.#scale})`);
    }
    
    // 4. Skew
    if (this.#skewX !== 0 || this.#skewY !== 0) {
        transforms.push(`skew(${this.#skewX}deg, ${this.#skewY}deg)`);
    }
    
    // Apply transform
    if (transforms.length > 0) {
        this.element.style.transform = transforms.join(' ');
    }
    
    // Size
    if (this.#width !== null) {
        this.element.style.width = this.#width + 'px';
    }
    if (this.#height !== null) {
        this.element.style.height = this.#height + 'px';
    }
    
    // Opacity
    if (this.opacity !== null && this.opacity !== 1) {
        this.element.style.opacity = this.opacity;
    }
    
    // Notify parent untuk bounds update
    if (this.#parentLayer) {
        this.#parentLayer.#notifyParentUpdate();
    }
}
```

---

## 🔄 UPDATE FLOW - REAL-TIME SYNCHRONIZATION

### Scenario: User mengubah nilai di Panel2

```
User Input Panel2 (e.g., xCoord = 100)
    │
    ▼
oninput event → handleXCoord("100")
    │
    ▼
selected.x = 100
    │
    ▼
Layer.js: set x(100)
    │
    ├─→ this.#x = 100
    │
    ├─→ this.#updateElement()
    │   │
    │   ├─→ element.style.left = "100px"
    │   ├─→ element.style.transform = ... (rebuild)
    │   └─→ #notifyParentUpdate() (jika ada parent)
    │
    └─→ DOM instantly updated
        │
        ▼
    Visual change terlihat immediately di Panel1
```

---

## 📋 CHECKLIST IMPLEMENTASI

### ✅ Template Setup (layer.js)
- [x] Constructor menerima options object
- [x] Parse posX, posY dari options
- [x] Parse rotation, scale, skewX, skewY
- [x] Parse flipX, flipY
- [x] Parse width, height
- [x] Parse opacity
- [x] Parse color, color0, color1, dst
- [x] Call #updateElement() setelah init

### ✅ Getters (layer.js)
- [x] get x → return #x
- [x] get y → return #y
- [x] get rotation → return #rotation
- [x] get scale → return #scale
- [x] get skewX → return #skewX
- [x] get skewY → return #skewY
- [x] get isFlipX → return #flipX
- [x] get isFlipY → return #flipY
- [x] get width → return #width
- [x] get height → return #height

### ✅ Setters (layer.js)
- [x] set x(value) → update #x, call #updateElement()
- [x] set y(value) → update #y, call #updateElement()
- [x] set rotation(value) → update #rotation, call #updateElement()
- [x] set scale(value) → update #scale, call #updateElement()
- [x] set skewX(value) → update #skewX, call #updateElement()
- [x] set skewY(value) → update #skewY, call #updateElement()
- [x] set flipX(value) → update #flipX, call #updateElement()
- [x] set flipY(value) → update #flipY, call #updateElement()
- [x] set width(value) → update #width, call #updateElement()
- [x] set height(value) → update #height, call #updateElement()

### ✅ Panel2 Handlers (studiopose.js)
- [x] handleXCoord(value) → selected.x = parseFloat(value)
- [x] handleYCoord(value) → selected.y = parseFloat(value)
- [x] handleRotation(value) → selected.rotation = parseFloat(value)
- [x] handleScale(value) → selected.scale = parseFloat(value)
- [x] handleSkewX(value) → selected.skewX = parseFloat(value)
- [x] handleSkewY(value) → selected.skewY = parseFloat(value)
- [x] handleFlipHorizontal(checked) → selected.flipX = checked
- [x] handleFlipVertical(checked) → selected.flipY = checked
- [x] updateLayerSize('width', value) → selected.width
- [x] updateLayerSize('height', value) → selected.height
- [x] setOpacity(panelId) → update panel/layer opacity

### ✅ DOM Update (#updateElement)
- [x] Apply position (left, top)
- [x] Build transform string (translate, rotate, scale, skew)
- [x] Apply width, height jika defined
- [x] Apply opacity jika defined
- [x] Notify parent jika ada child layers

---

## 🧪 TESTING CHECKLIST

### Posisi
- [ ] Set posX di template → layer tampil di posX yang benar
- [ ] Ubah xCoord di panel → layer bergerak horizontal
- [ ] Set posY di template → layer tampil di posY yang benar
- [ ] Ubah yCoord di panel → layer bergerak vertikal

### Rotasi
- [ ] Set rotation: 45 di template → layer rotate 45°
- [ ] Ubah rotationControl → layer rotate real-time

### Skala
- [ ] Set scale: 1.5 di template → layer 150% size
- [ ] Ubah scale input → layer scale real-time

### Skew
- [ ] Set skewX: 15 di template → layer skew horizontal
- [ ] Ubah skewXSlider → layer skew real-time
- [ ] Set skewY: 10 di template → layer skew vertikal
- [ ] Ubah skewYSlider → layer skew real-time

### Flip
- [ ] Set flipX: true → layer mirror horizontal
- [ ] Toggle flipHorizontal checkbox → layer flip
- [ ] Set flipY: true → layer mirror vertikal
- [ ] Toggle flipVertical checkbox → layer flip

### Ukuran
- [ ] Set width: 100 di template → layer width 100px
- [ ] Set height: 150 di template → layer height 150px
- [ ] Ubah width/height input → layer resize real-time

### Warna
- [ ] Set color: "#FF5733" → SVG assets berubah warna
- [ ] Set color0: "#FF0000" → src[0] merah, src[1] normal
- [ ] Set color1: "#00FF00" → src[0] normal, src[1] hijau

---

## 📚 FILE REFERENCES

| File | Lines | Purpose |
|------|-------|---------|
| [studiopose.js](js/studiocharacter/studiopose.js#L80-L365) | 80-365 | Layer template definitions |
| [studiopose.js](js/studiocharacter/studiopose.js#L200-L400) | 200-400 | Handler functions (handleXCoord, handleYCoord, dst) |
| [layer.js](js/studiocharacter/layer.js#L40-L100) | 40-100 | Constructor & options parsing |
| [layer.js](js/studiocharacter/layer.js#L230-L280) | 230-280 | #updateElement() implementation |
| [layer.js](js/studiocharacter/layer.js#L400-L500) | 400-500 | Getters & Setters |
| [studiopose.js (frame)](js/frame/studiopose.js#L150-L220) | 150-220 | Panel2 input elements |

---

**Document Version**: 1.0  
**Last Updated**: 2026-01-23  
**Status**: Complete Implementation ✅
