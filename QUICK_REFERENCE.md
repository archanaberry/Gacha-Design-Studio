# ⚡ QUICK REFERENCE - CHARACTER TEMPLATE
## Gacha Design Studio - Fast Access Guide

---

## 🎯 DEFAULT LAYER TEMPLATE

```javascript
{
  "layerName": "Nama Bagian",
  "src": [
    "assets/character/path/file1.svg",  // src0 (outline/trim)
    "assets/character/path/file2.svg"   // src1 (base/fill)
  ],
  "options": {
    "posX": 0,           // x position (default: 0)
    "posY": 0,           // y position (default: 0)
    "rotation": 0,       // rotate 0-360 deg (default: 0)
    "scale": 1,          // scale 0-2+ (default: 1)
    "skewX": 0,          // skew X -45 to 45 (default: 0)
    "skewY": 0,          // skew Y -45 to 45 (default: 0)
    "flipX": false,      // horizontal flip (default: false)
    "flipY": false,      // vertical flip (default: false)
    "width": null,       // width px (default: null=auto)
    "height": null,      // height px (default: null=auto)
    "opacity": 1,        // opacity 0-1 (default: 1)
    "color": null        // SVG color #RRGGBB (default: null)
  }
}
```

---

## 🔗 PANEL2 INPUT ↔ LAYER PROPERTY

| Panel2 Label | Input ID | Property | Type | Handler |
|---|---|---|---|---|
| **Posisi X** | `xCoord` | `selected.x` | number | `handleXCoord()` |
| **Posisi Y** | `yCoord` | `selected.y` | number | `handleYCoord()` |
| **Rotate** | `rotationControl` | `selected.rotation` | number | `handleRotation()` |
| **Skala** | `scale` | `selected.scale` | number | `handleScale()` |
| **Skew X** | `skewXControl` | `selected.skewX` | number | `handleSkewX()` |
| **Skew Y** | `skewYControl` | `selected.skewY` | number | `handleSkewY()` |
| **Flip H** | `flipHorizontal` | `selected.flipX` | boolean | `handleFlipHorizontal()` |
| **Flip V** | `flipVertical` | `selected.flipY` | boolean | `handleFlipVertical()` |
| **Lebar** | `width` | `selected.width` | number | `updateLayerSize()` |
| **Tinggi** | `height` | `selected.height` | number | `updateLayerSize()` |

---

## 🎨 LAYER PROPERTIES REFERENCE

### Position & Transform
```javascript
selected.x = 100;              // Move X to 100px
selected.y = 150;              // Move Y to 150px
selected.rotation = 45;        // Rotate 45 degrees
selected.scale = 1.5;          // Scale to 150%
selected.skewX = 10;           // Skew X axis 10deg
selected.skewY = 5;            // Skew Y axis 5deg
selected.flipX = true;         // Mirror horizontal
selected.flipY = false;        // Don't mirror vertical
```

### Size & Opacity
```javascript
selected.width = 200;          // Set width 200px
selected.height = 300;         // Set height 300px
selected.opacity = 0.8;        // Set 80% opacity
```

### Colors (SVG only)
```javascript
selected.color = "#FF5733";    // All src same color
selected.color0 = "#FF0000";   // src[0] = red
selected.color1 = "#00FF00";   // src[1] = green
selected.color2 = "#0000FF";   // src[2] = blue
```

---

## 📊 PROPERTY VALUES GUIDE

| Property | Min | Max | Type | Notes |
|---|---|---|---|---|
| posX | -∞ | +∞ | number | Any value, pixel units |
| posY | -∞ | +∞ | number | Any value, pixel units |
| rotation | 0 | 360 | number | Degrees, wraps at 360 |
| scale | 0 | 2+ | number | 1 = normal, 2 = 200% size |
| skewX | -45 | 45 | number | Degrees, practical range |
| skewY | -45 | 45 | number | Degrees, practical range |
| flipX | — | — | boolean | true/false only |
| flipY | — | — | boolean | true/false only |
| width | 1 | ∞ | number | Pixels, null = auto |
| height | 1 | ∞ | number | Pixels, null = auto |
| opacity | 0 | 1 | number | 0 = invisible, 1 = opaque |
| color | — | — | string | Format: "#RRGGBB" (hex) |

---

## 🎯 COMMON USE CASES

### Mirror untuk bagian LEFT (dari template RIGHT)
```javascript
// Template punya flipX: true untuk tangan KANAN
// Untuk tangan KIRI, ubah:
"options": {
  "flipX": false,    // ← ubah dari true ke false
  // ... properties lainnya tetap sama
}
```

### Pose dengan rotasi
```javascript
// Ubah rotation di template untuk pose awal:
"options": {
  "posX": 0,
  "posY": 0,
  "rotation": 30,    // ← ubah dari 0 ke 30
  "scale": 1,
  // ... rest same
}
```

### Lengan yang lebih panjang
```javascript
// Scale up bagian yang ingin lebih besar:
"options": {
  "scale": 1.2,      // ← ubah dari 1 ke 1.2 (120%)
  // ... rest same
}
```

### Bagian lebih transparan
```javascript
// Untuk layer yang kurang opaque:
"options": {
  "opacity": 0.7,    // ← ubah dari 1 ke 0.7 (70%)
  // ... rest same
}
```

### SVG dengan warna custom
```javascript
// Jika aset SVG perlu warna berbeda:
"options": {
  "color0": "#FF6B6B",  // ← outline color
  "color1": "#FFD700",  // ← base color
  // ... rest same
}
```

---

## 🔧 HOW TO UPDATE TEMPLATE

### Metode 1: Edit File Langsung
```
File: /js/studiocharacter/studiopose.js
Lines: 80-365
Steps:
1. Buka file
2. Find layer yang ingin edit
3. Update property di "options"
4. Save file
5. Reload studio (F5 atau Ctrl+R)
```

### Metode 2: Using Panel2 Real-Time
```
Steps:
1. Buka studio
2. Click layer yang ingin edit
3. Ubah values di panel2
4. Copy final values
5. Paste ke template file
6. Save file
```

### Metode 3: Export & Import
```
// Setelah edit layer di panel:
1. Export as HTML/SVG
2. Inspect element values
3. Copy ke template
4. Save file
```

---

## 🐛 TROUBLESHOOTING

### Layer tidak tampil
```
✓ Check "src" paths are valid
✓ Check "layerName" not empty
✓ Reload page (Ctrl+Shift+R)
✓ Check console untuk error (F12)
```

### Properties tidak bekerja
```
✓ Pastikan property name exact (posX bukan posXPos)
✓ Pastikan type sesuai (number untuk angka, boolean untuk true/false)
✓ Check layer selected sebelum ubah di panel
✓ Use correct Panel2 input ID
```

### Warna SVG tidak berubah
```
✓ Pastikan SVG file punya fill/stroke attributes
✓ Use hex color format: #RRGGBB
✓ Try color0, color1, color2 individually
✓ Check console untuk fetch error
```

### Posisi salah
```
✓ Cek template posX, posY values
✓ Use panel2 untuk adjust real-time
✓ Copy correct values ke template
✓ Verify no CSS override di layer.js
```

---

## 📝 QUICK COPY-PASTE TEMPLATE

```javascript
{
  "layerName": "Bagian Karakter",
  "src": [
    "assets/character/path/outline.svg",
    "assets/character/path/base.svg"
  ],
  "options": {
    "posX": 0,
    "posY": 0,
    "rotation": 0,
    "scale": 1,
    "skewX": 0,
    "skewY": 0,
    "flipX": false,
    "flipY": false,
    "width": null,
    "height": null,
    "opacity": 1,
    "color": null
  }
}
```

---

## 🔗 HELPFUL LINKS

- **Full Guide**: [CHARACTER_TEMPLATE_GUIDE.md](CHARACTER_TEMPLATE_GUIDE.md)
- **Implementation Details**: [TEMPLATE_IMPLEMENTATION_REFERENCE.md](TEMPLATE_IMPLEMENTATION_REFERENCE.md)
- **Default Template**: [DEFAULT_LAYER_TEMPLATE.js](DEFAULT_LAYER_TEMPLATE.js)
- **Source File**: [js/studiocharacter/studiopose.js](js/studiocharacter/studiopose.js#L80-L365)

---

## ⌨️ KEYBOARD SHORTCUTS

| Shortcut | Action |
|---|---|
| **Ctrl+Z** | Undo |
| **Ctrl+Y** | Redo |
| **Click Layer** | Select |
| **Drag Layer** | Move |
| **Arrow Keys** | Micro-adjust position |

---

**Version**: 1.0  
**Last Updated**: 2026-01-23  
**Author**: Archana Berry
