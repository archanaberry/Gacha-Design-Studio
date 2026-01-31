# Panel1 Fix Summary - Zoom Guide Outline

## Perubahan yang Dilakukan

### 1. **Pemisahan Panel1 menjadi 2 bagian:**

#### a) **panel1-root** (Background Layer)
- Fungsi: Menampilkan wallpaper/background
- Karakteristik: 
  - Tidak terpengaruh oleh zoom/transform
  - Fixed position (background-attachment: fixed)
  - Z-index: 0 (di belakang layer container)

#### b) **panel1-layercontainer** (Layer Container)
- Fungsi: Menampilkan objek dan layer yang dapat diatur
- Karakteristik:
  - Terpengaruh oleh zoom (transform: scale)
  - Z-index: 1 (di atas background)
  - Transform-origin: center center
  - Tempat attachment untuk semua layer objects

---

## File yang Diubah

### 1. **js/frame/studiopose.js**
- ✅ Update HTML structure di template
- ✅ Tambah CSS untuk `.panel1-root` dan `.panel1-layercontainer`
- ✅ Tambah CSS untuk `.panel1-guide-canvas`

### 2. **studiopose.html**
- ✅ Update HTML structure untuk panel1-root dan panel1-layercontainer
- ✅ Tambah CSS styling untuk kedua container
- ✅ Tambah canvas element untuk guide outline

### 3. **js/studiocharacter/sensivity.js**
- ✅ Update `handleZoom()` - target panel1-layercontainer
- ✅ Update `handleZoomInput()` - target panel1-layercontainer
- ✅ Tambah `updateGuideCanvasVisibility()` - menampilkan guide saat zoom < 100%
- ✅ Tambah `drawGuideOutline()` - menggambar outline garis biru langit dash
- ✅ Tambah event listener resize untuk redraw guide

### 4. **js/studiocharacter/studiopose.js**
- ✅ Update DOMContentLoaded - attach layer ke panel1-layercontainer
- ✅ Update `renderLayer()` - target panel1-layercontainer
- ✅ Update `onLayerPointerDown()` - check panel1-layercontainer

### 5. **js/studiocharacter/background.js**
- ✅ Update `setBackground()` - set background ke panel1-root untuk panel1
- ✅ Background tidak akan ikut zoom lagi

### 6. **js/studiocharacter/opacity.js**
- ✅ Update `setOpacity()` - set opacity ke panel1-root untuk panel1
- ✅ Opacity hanya mempengaruhi background, bukan layer

### 7. **js/studiocharacter/bgconfig.js**
- ✅ Update `applyBgConfig()` - apply config ke panel1-root

### 8. **js/studiocharacter/function.js**
- ✅ Update Ctrl+P (zoom in) - target panel1-layercontainer
- ✅ Update Ctrl+M (zoom out) - target panel1-layercontainer
- ✅ Call `updateGuideCanvasVisibility()` untuk show/hide guide

---

## Feature: Guide Outline

### Aktivasi
- Tampil otomatis ketika zoom < 100% (zoomScale < 1)
- Sembunyikan ketika zoom >= 100%

### Karakteristik
- **Warna**: Sky Blue (#87CEEB)
- **Style**: Garis dash responsive
- **Spacing**: 10% dari tepi ukuran layar asli
- **Responsive**: Auto-redraw saat window resize

### Function Details
- `updateGuideCanvasVisibility(scale)` - Show/hide guide berdasarkan zoom scale
- `drawGuideOutline(canvas, container)` - Draw garis outline dengan dash pattern
- Automatic redraw pada window resize event

---

## Keuntungan Struktur Baru

1. **Background tidak zoom** - Wallpaper tetap full size dan fixed
2. **Layer container zoom** - Hanya layer yang zoom, background fixed
3. **Guide visual** - Ketahui batas kerja saat zoom kecil
4. **Responsive guide** - Guide menyesuaikan dengan ukuran layar
5. **Cleaner separation** - Background dan layer terpisah jelas
6. **Better UX** - User tahu area kerja yang sebenarnya

---

## Testing Checklist

- [ ] Zoom in/out dengan slider bekerja
- [ ] Zoom in/out dengan Ctrl+P/M bekerja
- [ ] Guide outline muncul saat zoom < 100%
- [ ] Guide outline hilang saat zoom >= 100%
- [ ] Background tidak ikut zoom
- [ ] Layer tetap dapat di-drag/manipulasi saat zoom
- [ ] Guide redraw saat window resize
- [ ] Background image persisten saat zoom
- [ ] Opacity background terpisah dari layer opacity

---

## Notes

- Layer hierarchy tetap sama, hanya attachment point yang berbeda
- Semua layer.attach() calls now target panel1-layercontainer
- Guide canvas adalah SVG canvas overlay, pointer-events: none
- Transform origin di center untuk zoom yang balanced
