# Keyboard Shortcuts & History System

## Daftar File Baru

### 1. **function.js**
- File: `js/studiocharacter/function.js`
- Mengelola semua keyboard shortcuts
- Mengelola clipboard untuk copy/paste layers

### 2. **history.js**
- File: `js/studiocharacter/history.js`
- Mengelola undo/redo system
- Menyimpan snapshot dari setiap perubahan
- Membuat thumbnail canvas untuk preview

### 3. **historywindow.js**
- File: `js/studiocharacter/historywindow.js`
- UI Window untuk menampilkan History Editor
- Menampilkan thumbnail dan detail setiap perubahan
- Opsi untuk restore state

---

## Keyboard Shortcuts

Semua shortcut dapat digunakan di studio editor:

| Shortcut | Fungsi | File |
|----------|--------|------|
| **Ctrl+Z** | Undo (batalkan action terakhir) | function.js |
| **Ctrl+Y** | Redo (ulangi action yang dibatalkan) | function.js |
| **Ctrl+C** | Copy layer terpilih | function.js |
| **Ctrl+V** | Paste layer dari clipboard | function.js |
| **Ctrl+D** | Duplicate layer terpilih | function.js |
| **Ctrl+P** | Zoom In (+) | function.js |
| **Ctrl+M** | Zoom Out (-) | function.js |
| **Ctrl+J** | Join Stroke/Fill (optional) | function.js |
| **Ctrl+Alt+C** | Buka Color Picker untuk layer terpilih | function.js |

---

## Tombol UI

### Buttons di Panel Bawah

- **↶ Undo**: Membatalkan action terakhir (Ctrl+Z)
- **↷ Redo**: Mengulangi action yang dibatalkan (Ctrl+Y)
- **📋 History**: Membuka History Editor Window

---

## History Manager API

### Methods:

```javascript
// Record action untuk simpan history
window.HistoryManager.recordAction(actionType, data);
// contoh:
window.HistoryManager.recordAction('move', { 
  layerName: 'Kepala',
  x: 100, 
  y: 200 
});

// Undo
window.HistoryManager.undo();

// Redo
window.HistoryManager.redo();

// Get history list
const history = window.HistoryManager.getHistory();

// Clear history
window.HistoryManager.clearHistory();

// Get count
console.log(window.HistoryManager.getUndoCount());
console.log(window.HistoryManager.getRedoCount());
```

### Action Types:

- `'move'` - Menggeser layer
- `'resize'` - Mengubah ukuran layer
- `'rotate'` - Memutar layer
- `'color'` - Mengubah warna layer
- `'duplicate'` - Menduplikasi layer
- `'delete'` - Menghapus layer
- `'paste'` - Paste layer
- `'opacity'` - Mengubah opasitas
- `'flip'` - Flip layer
- `'group'` - Grouping layers
- `'ungroup'` - Ungroup layers
- `'upload'` - Upload image
- `'background'` - Change background

---

## Studio Clipboard API

```javascript
// Copy data ke clipboard
window.StudioClipboard.copy(data);

// Paste dari clipboard
const data = window.StudioClipboard.paste();

// Clear clipboard
window.StudioClipboard.clear();
```

---

## History Window

### Menampilkan History Editor:

```javascript
window.openHistoryWindow();
```

### Fitur:

1. **Sidebar dengan Thumbnails**
   - Tampilkan thumbnail untuk setiap snapshot
   - Timestamp untuk setiap action
   - Click untuk select history item

2. **Content Area**
   - Detail action yang dilakukan
   - Preview snapshot
   - Tombol Restore This State untuk kembali ke state tersebut

3. **Buttons**
   - **Close**: Tutup window
   - **Clear History**: Hapus semua history (dengan konfirmasi)
   - **Restore This State**: Restore ke state yang dipilih

---

## Integrasi dengan Existing Code

### Update studiopose.js untuk Record Actions:

Tambahkan di function-function yang mengubah layer:

```javascript
// Contoh di function moveLayerUp()
function moveLayerUp() {
  // ... existing code ...
  
  // Record history
  if (typeof window.HistoryManager !== 'undefined') {
    window.HistoryManager.recordAction('move', {
      layerName: selected.layerName,
      action: 'Move layer up'
    });
  }
}
```

---

## Technical Details

### Snapshot Structure:

```javascript
{
  id: "abc123xyz",
  timestamp: Date object,
  actionType: "move",
  actionData: { layerName: "...", ... },
  canvasData: { html: "...", style: {...} },
  layerData: { 
    name: "...",
    x: 0, 
    y: 0, 
    scale: 1,
    rotation: 0,
    color: "#fff",
    opacity: 1
  },
  thumbnail: "data:image/png;...",
  description: "Move layer: Kepala"
}
```

### Memory Management:

- Maximum history: 50 states
- Automatic cleanup: Oldest entries removed when limit exceeded
- Thumbnail: Converted to data URL (base64)

---

## Contoh Penggunaan

### Copy/Paste Layer:

```javascript
// User tekan Ctrl+C
// Layer "Kepala" tersimpan di clipboard

// User tekan Ctrl+V
// Layer baru "Kepala (pasted)" dibuat dan ditambahkan ke canvas
```

### Undo/Redo:

```javascript
// User drag layer
// Action ter-record: { actionType: 'move', ... }
// Undo stack updated

// User tekan Ctrl+Z
// Layer kembali ke posisi sebelumnya
// Action pindah dari undo stack ke redo stack

// User tekan Ctrl+Y
// Layer kembali ke posisi setelah drag
// Action pindah dari redo stack ke undo stack
```

### Open History:

```javascript
// User klik tombol History
// Window opens dengan daftar semua actions
// User bisa klik action untuk lihat preview
// User bisa klik Restore untuk kembali ke state tersebut
```

---

## Files Modified:

1. `/workspaces/Gacha-Design-Studio/js/frame/studiopose.js` - Added history buttons & scripts
2. `/workspaces/Gacha-Design-Studio/studiopose.html` - Added history buttons & scripts

## Files Created:

1. `/workspaces/Gacha-Design-Studio/js/studiocharacter/function.js` - NEW
2. `/workspaces/Gacha-Design-Studio/js/studiocharacter/history.js` - NEW
3. `/workspaces/Gacha-Design-Studio/js/studiocharacter/historywindow.js` - NEW

---

## TODO untuk Development Selanjutnya:

1. ✅ Create keyboard shortcuts handler (function.js)
2. ✅ Create undo/redo system (history.js)
3. ✅ Create history window UI (historywindow.js)
4. ✅ Add buttons ke UI
5. ⏳ Integrate recordAction calls di semua functions yang mengubah layer
6. ⏳ Implement restore snapshot functionality
7. ⏳ Add localStorage untuk persist history (optional)
8. ⏳ Optimize thumbnail generation dengan canvas.toDataURL()
9. ⏳ Add keyboard shortcut hints di UI
10. ⏳ Implement Ctrl+J (join stroke/fill)

---

## Notes:

- Semua function berjalan di scope global untuk kompatibilitas dengan existing code
- History tidak otomatis menyimpan ke localStorage (bisa diimplementasikan nanti)
- Thumbnail saat ini adalah placeholder, bisa dioptimalkan dengan canvas rendering API
- Restore functionality masih placeholder, implementasi penuh perlu integrate dengan layer restoration logic
