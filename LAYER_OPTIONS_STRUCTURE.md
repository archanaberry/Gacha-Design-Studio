# Struktur Layer Options Baru - Per-Src Properties

## Penjelasan Perubahan

Struktur options layer telah diubah untuk memberikan fleksibilitas maksimal. Sebelumnya, semua properties (posX, posY, rotation, scale, dll) bersifat global untuk seluruh layer. Kini, properties dapat didefinisikan **per-src** agar setiap elemen dalam layer dapat di-customize secara independen.

---

## Format Struktur Baru

### 1. **Global Properties** (Opsional)
Properties yang diterapkan ke seluruh layer jika tidak ada override per-src:

```javascript
{
  "layerName": "Nama Layer",
  "src": ["src0.svg", "src1.svg", "src2.svg"],
  "options": {
    // Global properties - default untuk semua src
    "posX": 0,        // Posisi X global
    "posY": 0,        // Posisi Y global
    "rotation": 0,    // Rotasi global (derajat)
    "scale": 1,       // Skala global
    "skewX": 0,       // Skew X global
    "skewY": 0,       // Skew Y global
    "flipX": false,   // Flip horizontal global
    "flipY": false,   // Flip vertikal global
    "width": null,    // Lebar (null = auto)
    "height": null,   // Tinggi (null = auto)
    "opacity": 1,     // Opacity global (0-1)
    "color": null     // Warna tinting global
  }
}
```

### 2. **Per-Src Properties** (Lebih Fleksibel)
Override properties untuk src tertentu menggunakan nomor indeks:

```javascript
{
  "layerName": "Rambut Kompleks",
  "src": [
    "assets/hair/outline.svg",      // src0
    "assets/hair/light.svg",         // src1
    "assets/hair/shade.svg",         // src2
    "assets/hair/shadow.svg",        // src3
    "assets/hair/base.svg"           // src4
  ],
  "options": {
    // Definisikan untuk setiap src menggunakan sufiks nomor
    
    // src0 (outline)
    "posX0": 65,
    "posY0": 127,
    "opacity0": 1,
    "color0": "#000000",             // Warna outline hitam
    
    // src1 (light)
    "posX1": 65,
    "posY1": 127,
    "opacity1": 0.8,
    "color1": "#FFFFFF",             // Warna cahaya putih
    
    // src2 (shade)
    "posX2": 65,
    "posY2": 127,
    "opacity2": 0.6,
    "color2": "#8B8B8B",             // Warna shade abu-abu
    
    // src3 (shadow)
    "posX3": 65,
    "posY3": 127,
    "opacity3": 0.5,
    "color3": "#4A4A4A",             // Warna shadow gelap
    
    // src4 (base)
    "posX4": 65,
    "posY4": 127,
    "opacity4": 1,
    "color4": "#FF6B9D",             // Warna base utama
    
    // Properties transformasi (bisa global atau per-src)
    "rotation": 0,                   // Global untuk semua src
    "rotation0": 5,                  // Override untuk src0 saja
    "rotation4": -5,                 // Override untuk src4 saja
    
    "scale": 1,                      // Global default
    "scale1": 0.95,                  // src1 sedikit lebih kecil
    
    "skewX": 0,
    "skewY": 0,
    
    "flipX": false,
    "flipY": false,
    
    "width": null,                   // Auto width
    "height": null                   // Auto height
  }
}
```

---

## Aturan Precedence (Prioritas)

1. **Per-Src Value** (Tertinggi) - Jika ada `posX0`, `opacity1`, `color2`, dll
2. **Global Value** - Jika tidak ada per-src, gunakan global value
3. **Default Value** (Terendah) - Jika tidak ada keduanya, gunakan nilai default

```javascript
// Contoh precedence:
options: {
  "posX": 100,        // Global
  "posX0": 150,       // src0 akan pakai 150, bukan 100
  "posX1": undefined, // src1 akan pakai 100 (global)
  "posX2": 120        // src2 akan pakai 120
}
```

---

## Supported Properties Per-Src

Setiap property berikut dapat didefinisikan per-src menggunakan sufiks angka (0-9):

| Property | Tipe | Range/Type | Default | Per-Src |
|----------|------|-----------|---------|---------|
| `posX` | number | any | 0 | ✅ `posX0`, `posX1`, ... |
| `posY` | number | any | 0 | ✅ `posY0`, `posY1`, ... |
| `rotation` | number | 0-360 | 0 | ✅ `rotation0`, `rotation1`, ... |
| `scale` | number | >0 | 1 | ✅ `scale0`, `scale1`, ... |
| `skewX` | number | -45 to 45 | 0 | ✅ `skewX0`, `skewX1`, ... |
| `skewY` | number | -45 to 45 | 0 | ✅ `skewY0`, `skewY1`, ... |
| `flipX` | boolean | true/false | false | ✅ `flipX0`, `flipX1`, ... |
| `flipY` | boolean | true/false | false | ✅ `flipY0`, `flipY1`, ... |
| `opacity` | number | 0-1 | 1 | ✅ `opacity0`, `opacity1`, ... |
| `color` | string | #RRGGBB | null | ✅ `color0`, `color1`, ... |
| `width` | number | >0 or null | null | ✅ `width0`, `width1`, ... |
| `height` | number | >0 or null | null | ✅ `height0`, `height1`, ... |

---

## Contoh Implementasi Lengkap

### Hair Layer (5 src dengan styling kompleks)
```javascript
{
  "layerName": "Rambut",
  "src": [
    "assets/profilechibi/hair1.svg",     // src0 - outline
    "assets/profilechibi/hairl1.svg",    // src1 - light
    "assets/profilechibi/hairss1.svg",   // src2 - shade
    "assets/profilechibi/hairs1.svg",    // src3 - shadow
    "assets/profilechibi/hairo1.svg"     // src4 - base
  ],
  "options": {
    // src0 - outline (stroke hitam)
    "posX0": 65,
    "posY0": 127,
    "opacity0": 1,
    "color0": "#1A1A1A",
    
    // src1 - light (highlight putih)
    "posX1": 65,
    "posY1": 127,
    "opacity1": 0.8,
    "color1": "#FFFFFF",
    
    // src2 - shade (gradasi)
    "posX2": 65,
    "posY2": 127,
    "opacity2": 0.6,
    "color2": "#B39DDB",
    
    // src3 - shadow (gradasi gelap)
    "posX3": 65,
    "posY3": 127,
    "opacity3": 0.5,
    "color3": "#6A4C93",
    
    // src4 - base (warna utama)
    "posX4": 65,
    "posY4": 127,
    "opacity4": 1,
    "color4": "#9C6FB1",
    
    // Transformasi
    "rotation": 0,
    "scale": 1,
    "skewX": 0,
    "skewY": 0,
    "flipX": false,
    "flipY": false,
    "width": null,
    "height": null
  }
}
```

### Simple Arm (2 src, styling minimal)
```javascript
{
  "layerName": "Lengan Kanan",
  "src": [
    "assets/character/base/arm1.svg",    // src0 - outline
    "assets/character/base/arm2.svg"     // src1 - base
  ],
  "options": {
    // Global properties (diterapkan ke semua src)
    "posX": 65,
    "posY": 127,
    "rotation": 0,
    "scale": 1,
    "flipX": true,
    "opacity": 1
    // Jika tidak ada per-src override, semua src pakai nilai ini
  }
}
```

### Text Shape Layer
```javascript
{
  "layerName": "Nama Karakter",
  "src": ["text://nama"],  // Special src format untuk text
  "options": {
    "posX0": 50,
    "posY0": 300,
    "fontFamily0": "Arial",
    "fontSize0": 24,
    "fontWeight0": "bold",
    "color0": "#FFFFFF",
    "textAlign0": "center",
    "opacity0": 1
  },
  "isTextLayer": true
}
```

---

## Migration dari Format Lama

### Sebelum (Lama):
```javascript
{
  "layerName": "Rambut",
  "src": ["hair.svg", "light.svg"],
  "options": {
    "posX": 65,
    "posY": 127,
    "opacity": 1,
    "color": "#9C6FB1"  // Diterapkan ke semua src
  }
}
```

### Sesudah (Baru):
```javascript
{
  "layerName": "Rambut",
  "src": ["hair.svg", "light.svg"],
  "options": {
    // Global (tetap support format lama untuk backward compatibility)
    "posX": 65,
    "posY": 127,
    
    // Atau per-src (lebih fleksibel)
    "opacity0": 1,      // src0
    "opacity1": 0.8,    // src1
    "color0": "#1A1A1A",
    "color1": "#FFFFFF"
  }
}
```

---

## Tips & Best Practices

1. **Minimal Properties**: Hanya define properties yang berbeda dari default
2. **Konsistensi**: Jika menggunakan per-src, gunakan untuk semua properties sejenis
3. **Readability**: Group properties per-src bersama komentar
4. **Testing**: Test rendering setelah perubahan significant

---

## Backward Compatibility

Struktur lama tetap didukung (global properties), dan akan diterapkan ke semua src secara otomatis jika tidak ada per-src override.
