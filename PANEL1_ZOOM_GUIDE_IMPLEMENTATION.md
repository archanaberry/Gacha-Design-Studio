# Panel1 Zoom Guide Implementation

## 📋 Summary
Implementasi fitur guide canvas (garis biru dash) yang muncul saat zoom <100%, membantu pengguna melihat batas kerja ketika workspace kecil. Background panel1 tidak akan ikut zoom.

## ✅ Perubahan yang Dilakukan

### 1. **js/studiocharacter/sensivity.js** (UTAMA)
#### Fungsi Baru: `drawGuideCanvas()`
- Menggambar garis-garis grid biru (sky blue: #5dade2) dengan pola dash
- Interval 10% responsive terhadap ukuran layar asli
- Hanya muncul saat zoom < 100%
- Menampilkan outline tebal border (#2196f3) untuk menunjukkan batas kerja

#### Update: `handleZoom(value)`
- **Sebelum**: Zoom seluruh panel1 (termasuk background)
- **Sesudah**: Zoom hanya panel1-layercontainer (objek & layer saja)
- Panggil `drawGuideCanvas()` otomatis setelah zoom

#### Update: `handleZoomInput(value)`
- **Sebelum**: Input langsung ke panel1
- **Sesudah**: Input langsung ke panel1-layercontainer
- Panggil `drawGuideCanvas()` otomatis

### 2. **js/studiocharacter/function.js**
#### Update: Ctrl+P (Zoom In)
- Ganti `updateGuideCanvasVisibility(newScale)` dengan `drawGuideCanvas()`
- Target tetap panel1-layercontainer

#### Update: Ctrl+M (Zoom Out)
- Ganti `updateGuideCanvasVisibility(newScale)` dengan `drawGuideCanvas()`
- Target tetap panel1-layercontainer

### 3. **js/frame/studiopose.js** (HTML/CSS)
#### CSS Updates
- **panel1-layercontainer**: Tambah `overflow: hidden`
- **panel1-guide-canvas**: 
  - Tambah `width: 100%` dan `height: 100%`
  - Pastikan canvas full-size untuk rendering yang sempurna

#### HTML Structure (Sudah Benar)
```html
<div class="panel1 container" id="panel1">
    <!-- Background/Wallpaper tetap full size tanpa zoom -->
    <div class="panel1-root" id="panel1-root">
    </div>
    
    <!-- Layer Container - objek dan layer yang bisa di-zoom -->
    <div class="panel1-layercontainer" id="panel1-layercontainer">
        <canvas id="guideCanvas" class="panel1-guide-canvas"></canvas>
    </div>
</div>
```

### 4. **js/studiocharacter/upload.js**
#### Fungsi Baru: `getPanel1LayerContainer()`
```javascript
function getPanel1LayerContainer() {
    return document.getElementById('panel1-layercontainer') || 
           document.getElementById('panel1') || 
           document.querySelector('.container');
}
```
- Helper function untuk mendapatkan container dengan fallback

## 🎯 Fitur Utama

### Guide Canvas Properties
- **Warna Garis**: Sky blue (#5dade2)
- **Warna Border**: Darker blue (#2196f3)
- **Pola**: Dash (5px line, 5px gap)
- **Lebar Border**: 3px untuk visibility
- **Interval Grid**: 10% dari ukuran container

### Behavior
1. **Zoom 100%**: Canvas disembunyikan, hanya layer yang terlihat
2. **Zoom 50%**: Canvas menampilkan grid dengan spacing responsif
3. **Zoom 25%**: Grid lebih rapat, visual boundaries jelas
4. **Responsif**: Ukuran grid menyesuaikan dengan ukuran viewport

## 🔄 Data Flow

```
User zoom slider / keyboard (Ctrl+P/M)
    ↓
handleZoom() atau handleZoomInput()
    ↓
Set transform: scale() pada panel1-layercontainer
    ↓
Panggil drawGuideCanvas()
    ↓
[Jika zoom < 100%]
    ↓
Hitung interval grid (10%)
    ↓
Gambar garis vertikal & horizontal
    ↓
Gambar border outline
    ↓
Canvas.style.display = 'block'
```

## 📁 File Structure
```
panel1 (position: absolute)
├── panel1-root (position: absolute, z-index: 0)
│   └── Background image (background-attachment: fixed)
│
└── panel1-layercontainer (position: absolute, z-index: 1)
    ├── canvas#guideCanvas (z-index: 0, pointer-events: none)
    └── [Layer elements] (z-index: 1, 2, 3, ...)
```

## ✨ Benefits

1. **Visual Reference**: Pengguna tahu persis batas kerja saat zoom kecil
2. **Non-Intrusive**: Guide hanya muncul saat diperlukan (<100%)
3. **Responsive**: Grid menyesuaikan ukuran layer container
4. **Performance**: Canvas hanya di-render ulang saat zoom change
5. **Background Fixed**: Wallpaper tidak scale, terlihat natural

## 🧪 Testing Checklist

- [x] Zoom slider 100% → guide hidden
- [x] Zoom slider 50% → guide muncul dengan grid
- [x] Zoom slider 25% → grid lebih rapat
- [x] Keyboard Ctrl+P (zoom in) → guide update
- [x] Keyboard Ctrl+M (zoom out) → guide update
- [x] Manual input zoom → guide update
- [x] Background tidak ikut zoom
- [x] Layer objects dapat di-drag dengan guide visible
- [x] Guide canvas tidak interfere dengan mouse events

## 📝 Notes

- `drawGuideCanvas()` dipanggil di sensivity.js (sudah loaded di frame)
- Canvas element ID: `#guideCanvas` (sudah ada di HTML)
- Transform origin: `center center` (sudah di-set di CSS)
- Fallback container lookup: panel1-layercontainer → panel1 → .container

## 🔧 Future Improvements

- Opsi untuk customize grid interval
- Opsi untuk customize guide colors
- Snap-to-grid feature saat drag layers
- Virtual grid pattern untuk large zoom values
