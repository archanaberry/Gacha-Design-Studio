# Test Ctrl+A dan Ctrl+Click Multi-Select

## Perubahan yang sudah dilakukan:

1. ✅ **Dihapus duplicate click handler di studiopose.js (line 1274)**
   - Sebelumnya ada dua click handler yang conflict
   - Sekarang hanya satu di function.js dengan capture phase (true)
   - function.js handler punya priority karena pakai capture phase

2. ✅ **Fixed Ctrl+A syntax error di function.js (lines 205-220)**
   - Tambah missing `}` closing brace
   - Fixed indentation untuk proper code structure
   - Sekarang handler structure correct

3. ✅ **Fixed script load order di studiopose.html**
   - studiopose.js SEBELUM function.js (was AFTER before)
   - Sekarang selectAllLayersUnified() available ketika function.js load
   - Dependencies terurut correct

4. ✅ **Enhanced click handler di function.js**
   - Pakai capture phase true untuk priority handling
   - Tambah console logging untuk debug
   - Proper Ctrl key check untuk multi-select

## Test Cases:

### Test 1: Ctrl+A Select All
1. Buka studio pose
2. Buat beberapa layer
3. Tekan Ctrl+A
4. **EXPECTED**: Semua layers di highlight/selected di panel layer
5. **Verify**: Console log "🎯 selectAllLayersUnified triggered!" muncul

### Test 2: Ctrl+Click Multi-Select
1. Buka studio pose  
2. Buat 3+ layers
3. Klik layer 1 (normal click)
4. Tekan Ctrl + klik layer 2
5. **EXPECTED**: Layer 1 dan 2 sama-sama selected (highlighted)
6. Tekan Ctrl + klik layer 1 lagi
7. **EXPECTED**: Layer 1 di-deselect, hanya layer 2 yang selected
8. **Verify**: Console show "Multi-select click detected" untuk setiap Ctrl+click

### Test 3: Single Click (normal)
1. Dengan beberapa layers selected dari Test 2
2. Klik satu layer tanpa Ctrl
3. **EXPECTED**: Hanya layer itu yang selected, yang lain deselect
4. **Verify**: Selector.selectedLayers hanya punya 1 item

### Test 4: Click empty area
1. Klik di area kosong (not di layer)
2. **EXPECTED**: Semua selection clear
3. **Verify**: selector.selectedLayers kosong

## Debug Console Commands:

Ketika di browser, buka DevTools (F12), pas di console jalanin:

```javascript
// Check selector.selectedLayers state
console.log('Selected layers:', window.selector.selectedLayers);

// Check apakah selectAllLayersUnified ada
console.log('selectAllLayersUnified exists:', typeof selectAllLayersUnified === 'function');

// Manual trigger select all
selectAllLayersUnified();

// Check click handler ada
console.log('Click handler attached untuk element:', document.body);
```

## Expected Console Logs:

Untuk Ctrl+A:
```
🎯 selectAllLayersUnified triggered!
✅ All layers selected successfully! Count: X
```

Untuk Ctrl+Click:
```
Multi-select click detected - layer: [layer name]
Toggle selection - layer: [layer name]
selector.selectedLayers updated: [array of selected layers]
```

## Jika masih error:

1. Cek browser console untuk error message
2. Verify di studiopose.html bahwa:
   - studiopose.js di line 204 (sebelum function.js)
   - function.js di line 205 (setelah studiopose.js)
3. Refresh page (Ctrl+F5 untuk hard refresh)
4. Check Network tab apakah semua js files load sukses
