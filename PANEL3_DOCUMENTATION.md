# Dokumentasi Panel3 - Framework Panel

## Ringkasan Fitur yang Ditambahkan

Implementasi Panel3 (Framework Panel) dengan layout horizontal dan mekanisme hide/show yang fleksibel untuk Studio Pose.

### 1. **Layout dan Struktur**

#### File yang Dimodifikasi:
- `js/frame/studiopose.js` - HTML iframe dengan layout baru
- `studiopose.html` - HTML standalone dengan layout baru
- `js/mainmenu/studiopose.js` - CSS styling untuk layout baru

#### Struktur Layout:
```
┌─────────────────────────────────────────┐
│           Main Container                 │
├──────────┬─────────┬──────────────────┤
│          │         │                   │
│ Panel3   │Splitter │  Panel Group     │
│(Framework)  H     ├──────────────────┤
│          │        │   Panel1 (Canvas) │
│          │        ├──────────────────┤
│          │        │ Splitter V       │
│          │        ├──────────────────┤
│          │        │  Panel2 (Controls)│
│          │        │                  │
└──────────┴─────────┴──────────────────┘
```

### 2. **Panel3 Features**

#### Visibility Control:
- **Default**: Hidden (width: 0px)
- **Button**: "📂 Buka Kerangka" (Open Framework) - Menampilkan/menyembunyikan Panel3
- **Auto-hide**: Ketika diseret ke kiri sampai mentok (width < 10px), panel otomatis tersembunyi

#### Horizontal Splitter:
- Terletak antara Panel3 dan Panel Group
- Drag dari kiri ke kanan untuk resize Panel3
- ID: `splitterH` dengan class `splitter-horizontal`
- Cursor berubah ke `ew-resize` saat di atas splitter
- Max width: 40% dari container

#### Background dan Opacity:
- Input file: `imageUpload3` - Untuk upload background image
- Button: "Setel background kerangka" - Set background Panel3
- Opacity slider: `opacitySlider3` (0-100%)
- Input display: `opacityInput3` - Menampilkan nilai opacity

### 3. **Background Configuration System (bgconfig.js)**

File baru: `js/studiocharacter/bgconfig.js`

#### Fungsi Utama:

```javascript
// Load konfigurasi background dari localStorage
loadBgConfig(panelId)

// Simpan konfigurasi ke localStorage
saveBgConfig(panelId, config)

// Apply konfigurasi ke panel
applyBgConfig(panelId)

// Update konfigurasi dengan image URL dan opacity
updateBgConfig(panelId, imageUrl, opacity)

// Reset ke default
resetBgConfig(panelId)

// Apply semua konfigurasi (dipanggil saat page load)
applyAllBgConfigs()

// Clear semua konfigurasi
clearAllBgConfigs()
```

#### Storage Structure (localStorage):
```javascript
{
  "bgConfig_panel1": {
    "imageUrl": "data:image/png;base64,...",
    "opacity": 100
  },
  "bgConfig_panel2": {
    "imageUrl": "data:image/png;base64,...",
    "opacity": 100
  },
  "bgConfig_panel3": {
    "imageUrl": "data:image/png;base64,...",
    "opacity": 100
  }
}
```

### 4. **File Modifications**

#### A. `js/frame/studiopose.js`
- Added Panel3 HTML structure
- Added horizontal splitter (splitterH)
- Added Panel3 button ("📂 Buka Kerangka")
- Added Panel3 background upload (imageUpload3)
- Added Panel3 opacity control (opacitySlider3)
- Added toggleFrameworkPanel() function
- Added horizontal splitter drag handler
- Added reference to bgconfig.js

#### B. `studiopose.html`
- Same modifications as frame file
- Main container wrapper added
- Panel group wrapper for Panel1 + Panel2
- Horizontal splitter integration
- Panel3 framework container

#### C. `js/mainmenu/studiopose.js`
- Updated CSS for new layout
- Added #mainContainer styles
- Added .panel3 styles
- Added #splitterH (horizontal splitter) styles
- Added .panel-group styles
- Updated input styling for panel3

#### D. `js/studiocharacter/background.js`
- Updated setBackground() untuk support panel3
- Integrated dengan bgconfig.js
- Auto-save configuration saat upload background

#### E. `js/studiocharacter/opacity.js`
- Updated setOpacity() untuk support panel3
- Added panel3 slider/input support
- Integrated dengan bgconfig.js
- Auto-save opacity saat slider berubah

#### F. `js/studiocharacter/splitter.js`
- Updated untuk bekerja dengan panel-group
- Added null check untuk elements
- Maintained vertical splitter functionality

#### G. `js/studiocharacter/bgconfig.js` (NEW)
- Centralized configuration management
- localStorage untuk persist settings
- Auto-load saat page load
- Support untuk semua 3 panels

### 5. **JavaScript Functions**

#### Panel3 Toggle:
```javascript
function toggleFrameworkPanel() {
    // Menampilkan/menyembunyikan Panel3
    // Mengatur visibility dan display
}
```

#### Horizontal Splitter Handler:
```javascript
// Inside DOMContentLoaded event
// Handle mouse drag
handleHorizontalDrag(e)

// Handle touch drag
stopHorizontalDrag()

// Auto-hide jika width < 10px
```

### 6. **CSS Classes dan IDs**

**Containers:**
- `#mainContainer` - Main flex container horizontal
- `#panelGroup` - Container untuk Panel1 + Panel2
- `.panel3` - Framework panel
- `#splitterH` - Horizontal splitter

**Styles:**
- `#mainContainer { display: flex; flex-direction: row; }`
- `.panel3 { width: 0px; height: 100%; overflow: auto; }`
- `#splitterH { width: 5px; cursor: ew-resize; }`
- `.panel-group { flex: 1; display: flex; flex-direction: column; }`

### 7. **Event Handling**

#### Button Click:
```html
<button id="openFrameworkBtn" onclick="toggleFrameworkPanel()">
    📂 Buka Kerangka
</button>
```

#### Background Upload:
```html
<input type="file" id="imageUpload3" accept="image/*">
<button onclick="setBackground('panel3')">Setel background kerangka</button>
```

#### Opacity Control:
```html
<input type="range" id="opacitySlider3" 
       min="0" max="100" value="100" 
       oninput="setOpacity('panel3')">
```

### 8. **How It Works**

1. **Initialization**
   - Page loads, bgconfig.js applies saved configurations
   - Panel3 hidden by default (display: none, width: 0)
   - All panels set opacity/background from localStorage

2. **Opening Panel3**
   - User clicks "📂 Buka Kerangka" button
   - toggleFrameworkPanel() is called
   - Panel3 becomes visible, width: 200px
   - Horizontal splitter visible

3. **Resizing Panel3**
   - User drags splitterH left/right
   - handleHorizontalDrag() updates panel3.style.width
   - Max width: 40% of container
   - Min width: 0px (with auto-hide at < 10px)

4. **Auto-hide**
   - When panel3 width < 10px
   - Panel3 automatically hidden
   - Splitter hidden
   - User must click button again to show

5. **Setting Background**
   - User uploads image via imageUpload3
   - setBackground('panel3') is called
   - Background applied to panel3
   - Configuration saved via updateBgConfig()
   - localStorage persists across sessions

6. **Setting Opacity**
   - User adjusts opacitySlider3
   - setOpacity('panel3') is called
   - panel3.style.opacity updated
   - Configuration saved automatically

### 9. **Browser Compatibility**

- Supports all modern browsers with:
  - CSS Flexbox
  - localStorage API
  - ES6 (const, arrow functions)
  - FileReader API
  - Touch events

### 10. **Usage Example**

```javascript
// Auto-load saved config on startup
applyAllBgConfigs();

// Manually update panel3 config
updateBgConfig('panel3', 'data:image/png;base64,...', 75);

// Toggle panel3 visibility
toggleFrameworkPanel();

// Reset panel3 to default
resetBgConfig('panel3');

// Clear all configs
clearAllBgConfigs();
```

## Testing Checklist

- [ ] Panel3 hidden on initial load
- [ ] "📂 Buka Kerangka" button shows/hides Panel3
- [ ] Horizontal splitter drags smoothly
- [ ] Panel3 auto-hides when width < 10px
- [ ] Background upload works for panel3
- [ ] Opacity control works for panel3
- [ ] Configuration persists after page reload
- [ ] Splitter vertical (Panel1-Panel2) still works
- [ ] All panels can have independent background/opacity
- [ ] Touch events work on mobile
