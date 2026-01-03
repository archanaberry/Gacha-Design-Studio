# Dokumentasi Struktur Studio Pose Frame

## Ringkasan Perbaikan

File `js/frame/studiopose.js` telah diperbaiki untuk memuat semua script studiocharacter secara proper tanpa perlu menempel seluruh kode ke dalam satu file besar.

## Cara Kerja Sistem

### 1. **Deklarasi Wrapper Fungsi (Baris 11-69)**
- Semua fungsi dari script yang diimport dideklarasikan sebagai wrapper di window object
- Setiap fungsi memiliki fallback yang aman (mencegah error jika script belum loaded)
- Struktur: `window.functionName = window.functionName || function() { ... }`

### 2. **Daftar Script untuk Dimuat (Baris 71-82)**
```javascript
const scriptsToLoad = [
  'js/studiocharacter/layer.js',
  'js/studiocharacter/studiopose.js',
  'js/studiocharacter/splitter.js',
  'js/studiocharacter/background.js',
  'js/studiocharacter/opacity.js',
  'js/studiocharacter/selector.js',
  'js/studiocharacter/key.js',
  'js/studiocharacter/sensivity.js',
  'js/studiocharacter/upload.js',
  'js/studiocharacter/export.js'
];
```

### 3. **HTML Panel Controls (Baris 84-166)**
- Struktur HTML yang clean untuk panel2 (kontrol)
- Menggunakan class-based styling dengan prefix `.studiopose-controls`
- Semua button dan input terhubung ke fungsi global yang sudah dideklarasikan

### 4. **CSS Styling (Baris 168-284)**
- Styling 100% terisolasi dengan prefix `.studiopose-frame`
- Tidak akan mengganggu style pada halaman lain
- Layout responsive dengan flexbox
- Styling untuk: buttons, inputs, panels, splitter, loading indicator

### 5. **Fungsi Init (Baris 286-399)**
```javascript
function init(container) {
  // 1. Setup class & HTML layout
  // 2. Buat loading indicator
  // 3. Load semua script sequential
  // 4. Attach layers ke panel1
  // 5. Init selector & splitter
  // 6. Hapus loading indicator
}
```

**Proses Detail:**

1. **Setup Container**
   - Tambah class `.studiopose-frame` untuk styling isolasi
   - Buat struktur HTML: `panel1` (atas), `splitter`, `panel2` (bawah)

2. **Loading Indicator**
   - Menampilkan pesan loading sambil script dimuat
   - Otomatis dihapus setelah semua selesai

3. **Sequential Script Loading**
   - Cek apakah script sudah loaded (skip jika sudah)
   - Load script satu per satu (async:false)
   - Error handling per script (lanjut ke script berikutnya meski ada error)

4. **Post-Loading Initialization**
   ```javascript
   // Attach layers dari window.layers ke panel1
   // Init Selector class
   // Init Splitter event listeners
   // Log status di console
   ```

### 6. **Register ke Overlay System (Baris 401-418)**
```javascript
if (typeof window.registerStudioFrame === 'function') {
  window.registerStudioFrame('studiopose', init);
} else {
  window.__pendingStudioPose = init;
}
```

- Kompatibel dengan `studioopen.js` overlay system
- Fallback jika overlay system belum siap

## Fungsi-Fungsi yang Tersedia

### Dari `layer.js`
- `Layer` (class)
- `createLayers(layersData, parent)`
- `createLayerFromObject(layerData)`

### Dari `studiopose.js`
- `layers` (array global)
- `selected` (current selected layer)
- `onlayerdragstart` (callback)

### Dari `key.js`
- `startMove(direction)` - Mulai gerakkan layer
- `stopMove()` - Stop gerakkan layer
- `moveLayer(direction)` - Gerak layer satu kali
- `handleXCoord(value)` - Set posisi X
- `handleYCoord(value)` - Set posisi Y
- `handleRotation(value)` - Set rotasi
- `handleScale(value)` - Set skala
- `handleFlipHorizontal(checked)` - Flip X
- `handleFlipVertical(checked)` - Flip Y
- `moveLayerUp()` - Naikkan layer index
- `moveLayerDown()` - Turunkan layer index
- `deleteSelectedLayer()` - Hapus layer
- `handleLayerName(value)` - Set nama layer

### Dari `background.js`
- `setBackground(panelId)` - Set background panel
- `saveConfig(panelId, imageUrl)` - Simpan config

### Dari `opacity.js`
- `setOpacity(panelId)` - Set opacity panel

### Dari `selector.js`
- `Selector` (class) - Multi-select layer system

### Dari `sensivity.js`
- `handleSensitivity(value)` - Set sensitivity slider

### Dari `upload.js`
- `addImage(event)` - Upload image/asset

### Dari `export.js`
- `exportAsSVG()` - Export ke SVG
- `exportAsHTML()` - Export ke HTML

## Keuntungan Sistem Ini

✅ **Modular** - Script tetap terpisah, mudah di-edit dan di-maintain
✅ **Safe** - Wrapper functions mencegah error jika script belum loaded
✅ **Isolated** - CSS dan DOM hanya berlaku di dalam container
✅ **Sequential** - Script dimuat berurutan, tidak ada race condition
✅ **Smart Loading** - Mencegah duplicate script loading
✅ **Error Handling** - Robust error handling per script
✅ **Debuggable** - Console logs membantu debugging
✅ **Backward Compatible** - Kompatibel dengan sistem overlay existing

## Cara Menggunakan

1. **Include di HTML:**
   ```html
   <script src="js/frame/studiopose.js"></script>
   ```

2. **Inisialisasi:**
   ```javascript
   // Via overlay system
   window.registerStudioFrame('studiopose', function(container) {
     window.__pendingStudioPose(container);
   });

   // Atau manual
   const container = document.getElementById('studio-container');
   if (window.__pendingStudioPose) {
     window.__pendingStudioPose(container);
   }
   ```

3. **Gunakan Fungsi:**
   ```javascript
   // Semua fungsi tersedia di window object
   window.handleSensitivity(50);
   window.startMove('up');
   window.exportAsSVG();
   // dll
   ```

## Console Output

Saat loading, akan terlihat di console:

```
✓ Skip (sudah loaded): js/studiocharacter/layer.js
✓ Loaded: js/studiocharacter/studiopose.js
✓ Loaded: js/studiocharacter/splitter.js
...
✓ Semua script loaded, melakukan inisialisasi...
Attaching 15 layers ke panel1...
✓ Layer 0: Lengan atas kanan attached
✓ Layer 1: Lengan bawah kanan attached
...
✓ Selector initialized
✓ Splitter initialized
✓✓✓ Gacha Design Studio siap! ✓✓✓
```

## Troubleshooting

### Fungsi masih mengatakan "not yet loaded"
- Pastikan `js/frame/studiopose.js` dimuat SEBELUM dipanggil
- Pastikan path script di `scriptsToLoad` correct
- Cek console untuk error messages

### Layer tidak muncul
- Cek apakah `js/studiocharacter/studiopose.js` loaded dengan baik
- Cek apakah `window.layers` ada dan berisi data
- Cek apakah `panel1` element ada di DOM

### CSS tidak muncul
- Cek apakah CSS style element berhasil ditambahkan ke `<head>`
- Cek apakah container memiliki class `.studiopose-frame`
- Periksa z-index dan overflow settings

---

**Version**: 1.0
**Last Updated**: 2026-01-03
**Status**: Ready for Production ✓
