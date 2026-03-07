## Mode URL System - Implementation Guide

### ✅ Modes yang Sudah Diimplement:

```
?mode=loading     → Loading splash & spinner (dari DOMContentLoaded sampai tap screen muncul)
?mode=titlemenu   → Title screen (setelah tap screen muncul, ditunggu klik)
?mode=mainmenu    → Main menu (setelah tap screen diklik, layer2 visible)
?mode=studiopose  → Studio Pose (dari studioopen.js)
?mode=studiosandbox → Studio Sandbox (dari studioopen.js)
```

### 📍 Flow Loading:

```
1. index.html load
   ↓
2. DOMContentLoaded → loading.js triggered
   ↓
3. window.setPageMode('loading') → URL = ?mode=loading 
   ↓
4. Splash 1 (3 detik)
   ↓
5. Splash 2 (3 detik)
   ↓
6. Loading spinner (3 detik)
   ↓
7. Spinner fade-out (1 detik) → Tap screen visible
   ↓
8. window.setPageMode('titlemenu') → URL = ?mode=titlemenu
   ↓
9. [USER TAP] → Unlock BGM
   ↓
10. showLayer2() → window.setPageMode('mainmenu') → URL = ?mode=mainmenu
    ↓
11. Main menu visible (layer2)
```

### 🔍 Cara Verify dari Browser:

1. **Buka index.html di browser**
2. **Lihat di Developer Console (F12):**
   ```
   [MODE CHANGE] loading → file:///.../?mode=loading
   [Loading.js] DOMContentLoaded triggered!
   [Loading.js] Initial mode set to: loading
   [MODE CHANGE] titlemenu → file:///.../?mode=titlemenu
   [MODE CHANGE] mainmenu → file:///.../?mode=mainmenu
   ```

3. **Lihat di Address Bar (Search Bar):**
   - Awal: `file:///path/to/index.html?mode=loading`
   - Tap screen: `file:///path/to/index.html?mode=titlemenu`
   - Setelah tap: `file:///path/to/index.html?mode=mainmenu`

### 🛠️ Tools untuk Debugging:

**Via Console (F12):**
```javascript
// Lihat current mode
modeTracker.getCurrentMode()

// Lihat full tracking info
modeTracker.log()

// Lihat deskripsi mode
modeTracker.getCurrentModeDescription()

// Lihat full URL
modeTracker.getURL()
```

### 📄 Files yang Diupdate:

1. **js/frame/loading.js**
   - ✅ Add `window.setPageMode()` function
   - ✅ Add `window.getPageMode()` function  
   - ✅ Set `mode=loading` saat DOMContentLoaded
   - ✅ Set `mode=titlemenu` saat tap screen muncul
   - ✅ Set `mode=mainmenu` saat layer2 ditampilkan
   - ✅ Add popstate handler untuk browser back button
   - ✅ Add extensive console logging

2. **js/frame/modetracker.js** (NEW)
   - ✅ Debug utility untuk track mode changes

3. **index.html**
   - ✅ Load loading.js sebelum style & layout
   - ✅ Load modetracker.js terakhir untuk debug

4. **js/mainmenu/studioopen.js** (EXISTING)
   - ✅ Sudah punya `?mode=studiopose` dan `?mode=studiosandbox`
   - ✅ Kompatibel dengan sistem URL mode

### ⚙️ Implementasi Detail:

**Mode URL Tracking:**
```javascript
// Di loading.js
window.setPageMode = function(mode) {
  const newUrl = new URL(window.location);
  if (mode) {
    newUrl.searchParams.set('mode', mode);
  } else {
    newUrl.searchParams.delete('mode');
  }
  history.pushState({ mode: mode }, '', newUrl.toString());
  console.log('%c[MODE CHANGE]%c ' + mode + ' → ' + newUrl.toString(), 
    'color: cyan; font-weight: bold;', 'color: default;');
};
```

**Mode Transitions:**
- `DOMContentLoaded` → `window.setPageMode('loading')`
- Splash selesai → `showTapScreen()` → `window.setPageMode('titlemenu')`
- User tap → `showLayer2()` → `window.setPageMode('mainmenu')`
- Studio click → `StudioOverlay.show()` → `window.location.href = '?mode=studiopose'`

### 🧪 Testing Checklist:

- [ ] Buka index.html
- [ ] Lihat URL berubah ke `?mode=loading`
- [ ] Tunggu splash screens
- [ ] Lihat URL berubah ke `?mode=titlemenu` saat tap screen muncul
- [ ] Tap screen
- [ ] Lihat URL berubah ke `?mode=mainmenu`
- [ ] Test browser back button (popstate)
- [ ] Click studio → URL berubah ke `?mode=studiopose` atau `?mode=studiosandbox`
- [ ] Check console untuk logging messages

### 🚀 Live Tracking:

URL sekarang **visible di address bar** dan **berubah real-time** setiap ada state change:
- Loading screen visible? → `?mode=loading` di URL
- Tap screen visible? → `?mode=titlemenu` di URL  
- Main menu visible? → `?mode=mainmenu` di URL
- Studio visible? → `?mode=studiopose` atau `?mode=studiosandbox` di URL

Ini memungkinkan **deep linking** dan **state persistence** kalau user bookmark URL!

---

**Status**: ✅ Complete
**Last Updated**: March 5, 2026
