# 🎨 PANDUAN TEMPLATE KARAKTER LENGKAP
## Gacha Design Studio - Character Template Documentation

---

## 📋 STRUKTUR LAYER DENGAN PROPERTIES LENGKAP

### Format Umum Layer Object
```javascript
{
  "layerName": "Nama Layer",           // Nama tampilan di panel
  "src": [                             // Array path assets (outline, base, dst)
    "assets/character/base/arm1.svg",  // src0 - layer outline/trim
    "assets/character/base/arm2.svg"   // src1 - layer base/fill
  ],
  "options": {
    // ===== POSISI (Panel2: xCoord, yCoord) =====
    "posX": 0,                         // x0 - Posisi X awal (default: 0)
    "posY": 0,                         // y1 - Posisi Y awal (default: 0)
    
    // ===== ROTASI & SKALA (Panel2: rotationControl, scale) =====
    "rotation": 0,                     // Rotate 0-360 derajat (default: 0)
    "scale": 1,                        // Scale 0-2 (default: 1 = normal)
    
    // ===== SKEW (Panel2: skewXControl, skewYControl) =====
    "skewX": 0,                        // Skew X horizontal -45 hingga 45 (default: 0)
    "skewY": 0,                        // Skew Y vertikal -45 hingga 45 (default: 0)
    
    // ===== FLIP (Panel2: flipHorizontal, flipVertical) =====
    "flipX": false,                    // Flip horizontal (default: false)
    "flipY": false,                    // Flip vertikal (default: false)
    
    // ===== UKURAN OPSIONAL (Panel2: width, height) =====
    "width": null,                     // Lebar custom (opsional, null = auto)
    "height": null,                    // Tinggi custom (opsional, null = auto)
    
    // ===== OPASITAS OPSIONAL (Panel2: opacitySlider) =====
    "opacity": 1,                      // Opasitas 0-1 (default: 1 = fully opaque)
    
    // ===== WARNA OPSIONAL (untuk SVG assets) =====
    "color": null,                     // Warna default untuk semua src
    "color0": null,                    // Warna khusus src[0] - #RRGGBB format
    "color1": null,                    // Warna khusus src[1] - #RRGGBB format
    "color2": null                     // Warna khusus src[2] - #RRGGBB format
    // ... dst untuk src lainnya
  }
}
```

---

## 🔗 KONEKSI DENGAN PANEL2 CONTROLS

| Property | Panel2 Input ID | Tipe | Range | Default |
|----------|-----------------|------|-------|---------|
| **posX** | `xCoord` | text | any | 0 |
| **posY** | `yCoord` | text | any | 0 |
| **rotation** | `rotationControl` | range | 0-360 | 0 |
| **scale** | `scale` | text | 0-2+ | 1 |
| **skewX** | `skewXControl` / `skewXSlider` | text/range | -45 hingga 45 | 0 |
| **skewY** | `skewYControl` / `skewYSlider` | text/range | -45 hingga 45 | 0 |
| **flipX** | `flipHorizontal` | checkbox | boolean | false |
| **flipY** | `flipVertical` | checkbox | boolean | false |
| **width** | `width` | number | any | null |
| **height** | `height` | number | any | null |
| **opacity** | `opacitySlider1-3` | range | 0-100 | 100 |

---

## 📝 IMPLEMENTASI DI JavaScript

### Layer.js Constructor
```javascript
constructor(name, src, options = {}, childLayers = []) {
    // ... initialization code ...
    
    // Set initial options dari template
    if (options) {
        // Posisi
        if ('posX' in options) this.#x = options.posX;
        if ('x' in options) this.#x = options.x;         // backward compat
        if ('posY' in options) this.#y = options.posY;
        if ('y' in options) this.#y = options.y;         // backward compat
        
        // Transformasi
        if ('rotation' in options) this.#rotation = options.rotation;
        if ('rotate' in options) this.#rotation = options.rotate;
        if ('scale' in options) this.#scale = options.scale;
        if ('skewX' in options) this.#skewX = options.skewX;
        if ('skewY' in options) this.#skewY = options.skewY;
        
        // Flip
        if ('flipX' in options) this.#flipX = options.flipX;
        if ('flipY' in options) this.#flipY = options.flipY;
        
        // Ukuran
        if ('width' in options && !this.#width) this.#width = options.width;
        if ('height' in options && !this.#height) this.#height = options.height;
        
        // Warna
        this.#parseColorOptions(options);
    }
    this.#updateElement();
}
```

### Getters & Setters
```javascript
// Getters
get x() { return this.#x; }
get y() { return this.#y; }
get rotation() { return this.#rotation; }
get scale() { return this.#scale; }
get skewX() { return this.#skewX; }
get skewY() { return this.#skewY; }
get isFlipX() { return this.#flipX; }
get isFlipY() { return this.#flipY; }

// Setters (automatic #updateElement)
set x(value) { 
    this.#x = value; 
    this.#updateElement();
    this.#notifyParentUpdate();
}
set y(value) { 
    this.#y = value; 
    this.#updateElement();
    this.#notifyParentUpdate();
}
set rotation(value) { 
    this.#rotation = value; 
    this.#updateElement();
}
set scale(value) { 
    this.#scale = value; 
    this.#updateElement();
}
set skewX(value) { 
    this.#skewX = value; 
    this.#updateElement();
}
set skewY(value) { 
    this.#skewY = value; 
    this.#updateElement();
}
```

---

## 🎯 QUICK START - MEMBUAT TEMPLATE BARU

### Langkah 1: Tambah Layer Object
```javascript
{
  "layerName": "Nama Bagian Karakter",
  "src": [
    "assets/character/path/file1.svg",  // src0
    "assets/character/path/file2.svg"   // src1
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

### Langkah 2: Customize Properties
- Ubah **posX/posY** untuk positioning awal layer
- Set **flipX: true** jika layer di-mirror (kanan → kiri)
- Tambah **rotation** jika layer perlu rotasi default
- Atur **scale** jika layer lebih besar/kecil
- Gunakan **color0, color1** untuk SVG dengan warna custom

### Langkah 3: Test di Panel
- Layer akan load dengan properties dari template
- Panel2 akan membaca nilai default dari template
- Saat ubah di panel, nilai override template values

---

## 🎨 CONTOH TEMPLATE TERSTRUKTUR

### Untuk Karakter Lengkap
```javascript
// ========== TANGAN KANAN ==========
{
  "layerName": "Lengan atas kanan",
  "src": [
    "assets/character/base/arm1.svg",    // src0 outline
    "assets/character/base/arm2.svg"     // src1 base
  ],
  "options": {
    "posX": 100,      // x0 - positioned di x=100
    "posY": 150,      // y1 - positioned di y=150
    "rotation": 0,    // no rotation
    "scale": 1,       // normal size
    "skewX": 0,
    "skewY": 0,
    "flipX": true,    // mirror untuk tangan kanan
    "flipY": false,
    "width": null,
    "height": null,
    "opacity": 1,
    "color": null
  }
}
```

---

## 🔍 TROUBLESHOOTING

### Layer tidak tampil di panel?
- Pastikan `src` array tidak kosong
- Cek path assets benar (relative ke root)
- Pastikan `layerName` tidak kosong

### Posisi tidak benar?
- Periksa `posX`, `posY` values
- Gunakan panel2 untuk adjust real-time
- Catat nilai yang benar ke template

### Transformasi tidak berfungsi?
- Layer.js harus support property (cek getters/setters)
- Panel2 harus punya input element dengan ID sesuai
- `#updateElement()` harus dipanggil otomatis

### Warna SVG tidak berubah?
- SVG harus memiliki `fill` atau `stroke` attributes
- Gunakan `color`, `color0`, `color1` dst di options
- Format warna: `#RRGGBB` (hex 6 digit)

---

## 📚 REFERENCE FILES

- **Template Definition**: `/js/studiocharacter/studiopose.js` (lines 80-190)
- **Layer Class**: `/js/studiocharacter/layer.js` (full class definition)
- **Panel2 Handler**: `/js/frame/studiopose.js` (contains all input handlers)
- **Studiopose Handler**: `/js/studiocharacter/studiopose.js` (event handlers)

---

## 💡 TIPS & TRICKS

1. **Copy-paste template**: Duplikasi layer untuk styling similar bagian
2. **Naming convention**: Gunakan prefix region (Tangan, Kaki, Badan, Kepala)
3. **SRC organization**: src0=outline, src1=base, src2=detail (konsisten)
4. **Position format**: Gunakan angka round untuk positioning yang clean
5. **Batch update**: Ubah beberapa properties, tekan Enter untuk apply all
6. **Export template**: Setelah posisi sempurna, copy layer object untuk dokumentasi

---

**Last Updated**: 2026-01-23  
**Version**: 1.0  
**Author**: Archana Berry - Gacha Design Studio
