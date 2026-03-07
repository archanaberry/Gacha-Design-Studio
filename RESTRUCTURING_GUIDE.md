# Gacha Design Studio - Restructuring Summary

## Changes Made

### 1. File Movement & Creation

#### Created new files in `js/frame/`:
- **loading.js** - Loading screens flow (splash → loading → tap screen)
- **titlescreen.js** - Title screen styling and management
- **mainmenu.js** - Main menu layout CSS (moved from `js/mainmenu/main.js`)

#### Created new entry point:
- **index.html** - Black background overlay with loading flow (replaces mainmenu.html as main entry)

### 2. Loading Flow Architecture

The new loading sequence in `index.html`:

```
1. Black background (index.html body)
   ↓
2. Splash Screen 1 (from loading.js)
   ↓
3. Splash Screen 2 (from loading.js)
   ↓
4. Loading Screen with spinner (from loading.js)
   ↓
5. "Tap Screen" prompt (from loading.js)
   ↓
6. Title Screen (from titlescreen.js) - on tap
   ↓
7. Main Menu (Layer2) (from mainmenu.js styles + HTML)
```

### 3. Script Loading Order in index.html

```html
<script src="js/windowhandler.js"></script>
<script src="js/mainmenu/mainmenu.js"></script>         <!-- Utilities -->
<script src="js/frame/loading.js"></script>             <!-- Loading & Splash -->
<script src="js/mainmenu/bgm.js"></script>              <!-- Audio -->
<script src="js/mainmenu/studioopen.js"></script>       <!-- Studio functions -->
<script src="js/frame/studiopose.js"></script>          <!-- Studio Pose -->
<script src="js/frame/studiosandbox.js"></script>       <!-- Studio Sandbox -->
<script src="js/mainmenu/settings.js"></script>         <!-- Settings -->
<script src="js/mainmenu/clickbutton.js"></script>      <!-- Button handlers -->
<script src="js/mainmenu/volume.js"></script>           <!-- Volume control -->
<script src="js/frame/titlescreen.js"></script>         <!-- Title screen (NEW) -->
<script src="js/frame/mainmenu.js"></script>            <!-- Layout CSS (MOVED) -->
```

### 4. Key Features

✅ **Black background** - Body background is pure black (#000000)
✅ **Overlay pattern** - Similar to studiopose.js structure
✅ **Loading mode** - Shows splash screens and loading indicator
✅ **Title screen mode** - Separate title screen with fade transitions
✅ **Main menu mode** - Layer2 shows mainmenu content after tap

### 5. Reference Updates

- `loading.js` in `js/frame/` updated resource list to reference `js/frame/mainmenu.js` instead of `js/mainmenu/main.js`
- Font paths in `mainmenu.js` use root-relative paths: `assets/font/` 
- All asset paths remain unchanged and work from index.html root

### 6. Files Structure

```
root
├── index.html                    (NEW - Main entry point, black background)
├── mainmenu.html                 (OLD - Can be deprecated)
├── js/
│   ├── frame/
│   │   ├── loading.js            (MOVED)
│   │   ├── titlescreen.js        (NEW)
│   │   ├── mainmenu.js           (MOVED from js/mainmenu/main.js)
│   │   ├── studiopose.js         (existing)
│   │   └── studiosandbox.js      (existing)
│   ├── mainmenu/
│   │   ├── main.js               (deprecated - moved to js/frame/mainmenu.js)
│   │   ├── loading.js            (deprecated - moved to js/frame/loading.js)
│   │   ├── mainmenu.js           (keeping - utilities & functions)
│   │   ├── bgm.js                (existing)
│   │   ├── settings.js           (existing)
│   │   └── ... (other files stay)
│   └── windowhandler.js          (existing)
└── assets/
    └── ui/mainmenu/              (all assets unchanged)
```

## Next Steps (Optional)

1. Delete or deprecate `mainmenu.html` 
2. Delete `js/mainmenu/main.js` and `js/mainmenu/loading.js` after verifying everything works
3. Test loading flow on various devices and browsers
4. Update documentation to reference `index.html` as main entry point

## Testing the Changes

1. Open `index.html` in browser
2. Should see black background
3. Splash screens should appear and fade
4. Loading spinner should show
5. "Tap screen" prompt should appear
6. On tap, main menu should load and display

---

**Status**: ✅ Structure reorganization complete
**Entry Point**: index.html
**Background**: Black (#000000)
**Mode System**: Loading → Title Screen → Main Menu (Layer2)
