#!/usr/bin/env bash
# QUICK REFERENCE - Struktur Layer Options Per-Src
# File: LAYER_OPTIONS_QUICK_REF.md

## 📋 Quick Reference - Layer Options Baru

### Struktur Dasar
```javascript
{
  "layerName": "Nama Layer",
  "src": ["file1.svg", "file2.svg", "file3.svg"],
  "options": {
    // Global properties (opsional)
    "posX": 0,
    "posY": 0,
    "rotation": 0,
    "scale": 1,
    "opacity": 1,
    
    // Per-src properties (opsional) - override global
    "posX0": 65,       // src0 position X
    "posY1": 127,      // src1 position Y
    "color2": "#FFF",  // src2 color
    "opacity3": 0.8,   // src3 opacity
    // ...
  }
}
```

---

## 🎨 Contoh Praktis

### Contoh 1: Hair (5 src, per-src styling)
```javascript
{
  "layerName": "Rambut",
  "src": [
    "assets/hair/outline.svg",    // src0
    "assets/hair/light.svg",      // src1
    "assets/hair/shade.svg",      // src2
    "assets/hair/shadow.svg",     // src3
    "assets/hair/base.svg"        // src4
  ],
  "options": {
    // src0 - outline
    "posX0": 65,
    "posY0": 127,
    "opacity0": 1,
    "color0": "#1A1A1A",
    
    // src1 - light
    "posX1": 65,
    "posY1": 127,
    "opacity1": 0.85,
    "color1": "#FFFFFF",
    
    // src2 - shade
    "posX2": 65,
    "posY2": 127,
    "opacity2": 0.65,
    "color2": "#B39DDB",
    
    // src3 - shadow
    "posX3": 65,
    "posY3": 127,
    "opacity3": 0.55,
    "color3": "#6A4C93",
    
    // src4 - base
    "posX4": 65,
    "posY4": 127,
    "opacity4": 1,
    "color4": "#9C6FB1",
    
    // Global untuk semua
    "rotation": 0,
    "scale": 1,
    "flipX": false,
    "flipY": false
  }
}
```

### Contoh 2: Arm (2 src, minimal)
```javascript
{
  "layerName": "Lengan Kanan",
  "src": [
    "assets/character/arm_outline.svg",  // src0
    "assets/character/arm_base.svg"      // src1
  ],
  "options": {
    // Global (applies to all src)
    "posX": 65,
    "posY": 127,
    "color0": "#000000",    // outline
    "color1": "#FFCC99",    // skin
    "rotation": 0,
    "scale": 1,
    "flipX": true
  }
}
```

### Contoh 3: Text Layer
```javascript
{
  "layerName": "Nama Karakter",
  "src": ["text://characterName"],
  "isTextLayer": true,
  "options": {
    "posX0": 50,
    "posY0": 300,
    "fontFamily0": "Arial",
    "fontSize0": 28,
    "fontWeight0": "bold",
    "color0": "#FFFFFF",
    "textAlign0": "center",
    "opacity0": 1
  }
}
```

---

## 📊 Tabel Property Support

| Property | Global | Per-Src | Tipe | Default |
|----------|--------|---------|------|---------|
| posX | ✅ | ✅ | number | 0 |
| posY | ✅ | ✅ | number | 0 |
| rotation | ✅ | ✅ | number (0-360) | 0 |
| scale | ✅ | ✅ | number (>0) | 1 |
| skewX | ✅ | ✅ | number (-45-45) | 0 |
| skewY | ✅ | ✅ | number (-45-45) | 0 |
| flipX | ✅ | ✅ | boolean | false |
| flipY | ✅ | ✅ | boolean | false |
| opacity | ✅ | ✅ | number (0-1) | 1 |
| color | ✅ | ✅ | string (#RGB) | null |
| width | ✅ | ✅ | number or null | null |
| height | ✅ | ✅ | number or null | null |

---

## 🔄 Precedence Rules

```
Per-Src Value (posX0, opacity1, color2) > Global Value (posX, opacity, color) > Default Value
```

Contoh:
```javascript
"options": {
  "posX": 100,     // Global
  "posX0": 150,    // src0 pakai 150
  "posX1": 120,    // src1 pakai 120
  "posX2": 100     // src2 pakai 100 (global)
}
```

---

## 💡 Tips

1. **Minimal Definition** - Hanya define yang berubah
   ```javascript
   // ❌ Tidak perlu
   "rotation": 0,
   "scale": 1,
   "flipX": false,
   
   // ✅ Lebih baik (hanya yang berbeda)
   "rotation": 45,
   "flipX": true
   ```

2. **Konsisten** - Jika pakai per-src, gunakan untuk semua properti sejenis
   ```javascript
   // ❌ Campuran bingung
   "color0": "#000",
   "color": "#FFF",
   
   // ✅ Jelas
   "color0": "#000",
   "color1": "#FFF"
   ```

3. **Grouping** - Group per-src dengan komentar
   ```javascript
   // src0 - outline
   "posX0": 65,
   "posY0": 127,
   "color0": "#000",
   
   // src1 - base
   "posX1": 65,
   "posY1": 127,
   "color1": "#FFF"
   ```

---

## 🚀 Implementasi di studiopose.js

File: `/js/studiocharacter/studiopose.js` (baris 122-450)

Sudah diupdate dengan:
- ✅ Rambut (5 src, per-src styling lengkap)
- ✅ Arm, Hand, Finger (2 src, per-src color)
- ✅ Body, Head, Legs, Foot (2 src, per-src color)
- ✅ Contoh Text Layer (commented)

---

## 📚 Referensi Lengkap

- **Dokumentasi Detail**: `LAYER_OPTIONS_STRUCTURE.md`
- **Contoh Lengkap**: `LAYER_TEMPLATE_EXAMPLES.js`
- **Implementasi**: `js/studiocharacter/studiopose.js`
- **Layer Class**: `js/studiocharacter/layer.js`

---

## ⚙️ Backward Compatibility

Format lama tetap supported:
```javascript
// Old format (masih bisa)
"options": {
  "posX": 65,
  "posY": 127,
  "color": "#FFF"  // Diterapkan ke semua src
}

// New format (lebih fleksibel)
"options": {
  "posX0": 65,     // src0 khusus
  "posY1": 127,    // src1 khusus
  "color0": "#000",
  "color1": "#FFF"
}
```

---

## 🔍 Debugging

Untuk check apakah layer loaded dengan benar:
```javascript
// Di browser console
layers[0]  // Lihat layer object
layers[0].options  // Lihat options
layers[0].element  // Lihat rendered element
```

---

## 📝 Checklist Implementasi

- [x] Struktur per-src support
- [x] Backward compatibility
- [x] Update studiopose.js template
- [x] Contoh lengkap + text layer
- [x] Dokumentasi
- [ ] Update UI untuk per-src editing (future)
- [ ] Animation support (future)

---

**Dibuat**: 24 Jan 2026
**Version**: 1.0
**Status**: ✅ Ready for use
