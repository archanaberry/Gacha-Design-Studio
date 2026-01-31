# 🎨 Visual Architecture: Dynamic Auto-Refresh System

## 📊 System Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    GACHA DESIGN STUDIO - STUDIOPOSE                      │
└─────────────────────────────────────────────────────────────────────────┘

User Input: Browser Zoom (Ctrl++, Ctrl+-, Ctrl+0)
              ↓
    ┌─────────────────────────┐
    │  Chrome/Browser Zoom    │  (25% - 500%)
    │  event triggered        │
    └────────────┬────────────┘
                 ↓
    ┌─────────────────────────────────────────┐
    │  initZoomDetection()                    │
    │  (Loop every 100ms)                     │
    │  ┌─────────────────────────────────┐   │
    │  │ getBrowserZoom()                │   │
    │  │ - Get window.outerWidth         │   │
    │  │ - Get window.innerWidth         │   │
    │  │ - Calculate: zoom = outer/inner │   │
    │  └────────────┬────────────────────┘   │
    │               ↓                         │
    │  Compare with lastBrowserZoom           │
    │               ↓                         │
    │       Zoom changed > 1% ?               │
    │       YES ↓          NO ↓               │
    │           ↓          (wait next loop)   │
    │       Update lastBrowserZoom            │
    │       Log: "Browser zoom changed..."    │
    └────────────┬────────────────────────────┘
                 ↓
    ┌──────────────────────────────────────────────┐
    │  IS CENTER ORIGIN ENABLED?                   │
    │  (checked in toggleCenterOrigin checkbox)    │
    │       YES ↓              NO ↓                │
    │           ↓              (do nothing)        │
    │  updateCenterOriginTransform()               │
    │  - calculateCenterOffset()                   │
    │  - Get panel1-layercontainer element         │
    │  - Get current scale from transform          │
    │  - Build new transform with calc()           │
    │  - Apply: transform = translate(...) scale()|
    └────────────┬─────────────────────────────────┘
                 ↓
    ┌──────────────────────────────────────────────┐
    │  VISUAL UPDATE                               │
    │  ┌──────────────────────────────────────┐   │
    │  │ .panel1-layercontainer               │   │
    │  │ ┌────────────────────────────────┐  │   │
    │  │ │   [  CANVAS/LAYER CONTENT  ]   │  │   │
    │  │ │   [  (ALWAYS AT CENTER)   ]   │  │   │
    │  │ └────────────────────────────────┘  │   │
    │  │        [ALWAYS CENTERED]             │   │
    │  └──────────────────────────────────────┘   │
    │                                              │
    │  drawGuideCanvas()                           │
    │  (Optional: redraw guide lines)              │
    └──────────────────────────────────────────────┘


💡 Key Points:
   ✅ Loop runs every 100ms (efficient)
   ✅ Only updates if zoom changed >1% (save CPU)
   ✅ Only applies if Center Origin checked
   ✅ Works with all browser zoom levels
   ✅ Real-time responsive
```

---

## 🏗️ Component Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                     studiopose.html/js                        │
│  (Parent - Main Studio Interface)                             │
└────────────────────┬─────────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        ↓                         ↓
┌──────────────────────────┐  ┌──────────────────┐
│   studiopose.js (iframe) │  │ Panel Controls   │
│ ┌──────────────────────┐ │  │ (HTML elements)  │
│ │ fullHTML = `...`     │ │  │ ┌──────────────┐ │
│ │ ├─ Canvas Panel      │ │  │ │ Checkbox:    │ │
│ │ ├─ Layer Controls    │ │  │ │ "Pusatkan    │ │
│ │ ├─ Scripts inline    │ │  │ │  Origin"     │ │
│ │ └─ Style CSS         │ │  │ │ ✅ ENABLED   │ │
│ └──────┬───────────────┘ │  │ └──────────────┘ │
│        │                 │  └──────────────────┘
│        │ initZoomDetection()
│        │ (call on line 582-584)
└────────┼──────────────────────────────────────────┘
         │
         ↓ window context (shared)
┌────────────────────────────────────────────────────────┐
│              centerorigin.js                            │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Exported Functions:                              │  │
│  │ • getBrowserZoom()                               │  │
│  │ • calculateCenterOffset()                        │  │
│  │ • toggleCenterOrigin(enabled)                    │  │
│  │ • updateCenterOriginTransform()                  │  │
│  │ • initZoomDetection()           ← MAIN LOOP     │  │
│  │ • stopZoomDetection()                            │  │
│  │ • refreshCenterOrigin()         ← MANUAL (Ctrl+Alt+R)
│  │ • resetCenterOrigin()                            │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  Global State:                                          │
│  • centerOriginActive = true/false                      │
│  • lastBrowserZoom = last detected zoom level           │
│  • zoomCheckInterval = setInterval ID                   │
└─────────────────────────────────────────────────────────┘

         ↓ keyboard event handler
┌──────────────────────────────────────┐
│          key.js                       │
│  ┌──────────────────────────────────┐│
│  │ keydown event listener            ││
│  │                                   ││
│  │ Ctrl+Alt+R → refreshCenterOrigin()││
│  │ (Manual trigger, fallback)        ││
│  └──────────────────────────────────┘│
└──────────────────────────────────────┘
```

---

## 🔄 State Machine: Center Origin

```
┌─────────────────────────────────────┐
│    CENTER ORIGIN STATE MACHINE       │
└─────────────────────────────────────┘

        ┌──────────────────────────┐
        │   DISABLED (initial)     │
        │ □ centerOriginToggle     │
        │                          │
        │ • NO centering offset    │
        │ • transform: translate() │
        │   scale()                │
        └────────┬─────────────────┘
                 │ User click checkbox
                 ↓
        ┌──────────────────────────┐
        │    ENABLED               │
        │ ☑ centerOriginToggle     │
        │                          │
        │ • Calculate center offset│
        │ • Store offset X/Y       │
        │ • Apply transform with   │
        │   calc() formula          │
        │ • initZoomDetection()    │
        │   starts monitoring      │
        └────────┬─────────────────┘
                 │ Loop every 100ms
                 │ (in background)
                 ↓
        ┌──────────────────────────┐
        │   MONITORING ZOOM        │
        │                          │
        │ ✓ Each 100ms:            │
        │   - getBrowserZoom()     │
        │   - Check if changed >1% │
        │   - If changed:          │
        │     updateTransform()    │
        │   - Visual refresh       │
        │                          │
        │ ✓ Keyboard shortcut:     │
        │   Ctrl+Alt+R             │
        │   refreshCenterOrigin()  │
        └────────┬─────────────────┘
                 │ User uncheck checkbox
                 ↓
        ┌──────────────────────────┐
        │    DISABLED              │
        │ □ centerOriginToggle     │
        │                          │
        │ • Clear offset data      │
        │ • Revert transform       │
        │ • stopZoomDetection()    │
        │   monitoring stops       │
        └──────────────────────────┘
```

---

## 📍 Transform Formula Visualization

### Before: Without Center Origin
```
Panel1-layercontainer position (ABSOLUTE, top-left anchor)

┌─────────────────────────────────────┐
│  Viewport / Screen                  │
│                                     │
│  ┌──────────────────────┐           │
│  │ [CANVAS CONTENT]     │           │
│  │ (top-left anchored)  │           │
│  └──────────────────────┘           │
│                                     │
└─────────────────────────────────────┘

transform: translate(-50%, -50%) scale(1);
└─ Centers element in viewport
```

### After: With Center Origin Enabled
```
Panel1-layercontainer position (FIXED, center anchor + offset)

┌─────────────────────────────────────┐
│  Viewport / Screen                  │
│                   ↑ y axis          │
│                   │                 │
│        ┌──────────●──────────┐      │
│        │  [CANVAS]  ← Origin │      │
│        │  CENTERED           │      │
│        └─────────────────────┘      │
│             ↑                       │
│        x axis →                     │
│                                     │
│  Center: (50%, 50%) of viewport     │
│  Offset: calc(-50% - Xpx)           │
│          calc(-50% - Ypx)           │
└─────────────────────────────────────┘

transform: 
  translate(calc(-50% - 640px), calc(-50% - 360px)) 
  scale(1);

Why calc()?
├─ -50%        → Centers element (responsive to resize)
├─ - Xpx       → Offsets to make (0,0) visual center
└─ Combines percentage + pixel → works with browser zoom
```

---

## 📱 Responsive Behavior

```
┌─────────────────────────────────────────────────────┐
│          RESPONSIVE AT ALL SIZES                    │
└─────────────────────────────────────────────────────┘

Viewport Size Change (Window resize, mobile orientation)
         ↓
calculateCenterOffset()
├─ Get panelGroup.getBoundingClientRect()
├─ Get width/height of visible viewport
├─ Calculate centerX = width/2
└─ Calculate centerY = height/2
         ↓
updateCenterOriginTransform()
├─ Apply new offset
└─ Panel re-centers
         ↓
Result: Always centered regardless of viewport size


Browser Zoom Change (Ctrl++, Ctrl+-, Ctrl+0)
         ↓
initZoomDetection() (every 100ms)
├─ getBrowserZoom() = outerWidth / innerWidth
├─ Compare with lastBrowserZoom
├─ If changed > 1%:
│  └─ updateCenterOriginTransform()
│     └─ Recalculate offset
│        └─ Apply new transform
└─ Result: Smooth follow to new zoom level
```

---

## ⚡ Performance Characteristics

```
┌────────────────────────────────────────┐
│     OPTIMIZATION POINTS                │
└────────────────────────────────────────┘

1. LOOP FREQUENCY: 100ms (10x per second)
   └─ Optimal balance: responsive + efficient

2. CHANGE THRESHOLD: > 1% zoom change
   └─ Filters out floating-point noise
   └─ Reduces unnecessary recalculations

3. CONDITIONAL EXECUTION:
   if (centerOriginActive) {
       updateCenterOriginTransform();
   }
   └─ Only runs when actually needed
   └─ No wasted cycles when disabled

4. CSS HANDLING:
   └─ transform: uses GPU acceleration
   └─ No layout thrashing
   └─ Smooth 60fps visuals

5. MEMORY:
   └─ No large data structures
   └─ Only track: zoom level, offset values
   └─ Lightweight global state

ESTIMATED CPU USAGE:
├─ Idle (checkbox disabled): ~0%
├─ Monitoring (enabled, no zoom): ~1-2%
└─ Active zoom: ~3-5% (temporary)

✅ Production Ready
```

---

## 🎯 User Journey

```
User opens Studio Pose
         ↓
System detects iframe load
         ↓
initZoomDetection() called automatically
         ↓
console.log: "✅ Zoom detection initialized..."
         ↓
User sees controls:
├─ Checkbox "Pusatkan Origin"
└─ [NO LONGER: Button "Refresh Origin"]
         ↓
User action: Check checkbox
         ↓
toggleCenterOrigin(true)
├─ Calculate center offset
├─ Apply transform
└─ Enable monitoring
         ↓
User action: Zoom browser (Ctrl++)
         ↓
initZoomDetection loop detects change
         ↓
AUTO REFRESH happens (user sees instant update)
├─ Panel stays centered
└─ No button click needed
         ↓
System shows in console:
"🔍 Browser zoom changed to: 150%"
"🔄 Center origin refreshed untuk follow zoom"
         ↓
User experience: SEAMLESS & RESPONSIVE ✅


Optional - User wants manual sync:
Press Ctrl+Alt+R
         ↓
refreshCenterOrigin() triggered
         ↓
console.log: "Center origin refreshed via keyboard shortcut"
         ↓
Visual update applied
```

---

## 🛠️ Debugging Checklist

```
If Center Origin not working:

1. Check if checkbox visible?
   □ YES → Check if enabled?
   □ NO  → Check HTML (studiopose.js line 251-254)

2. Check console for init message?
   □ YES → initZoomDetection() ran
   □ NO  → Check if centerorigin.js loaded

3. Check if getBrowserZoom() returns value?
   Open console & type: window.getBrowserZoom()
   □ YES (0.25, 1, 2, etc) → Working
   □ NO/Error → Check if function defined

4. Zoom browser & check console:
   Ctrl++ then watch console for:
   "🔍 Browser zoom changed to: ..."
   □ YES → Detection works
   □ NO  → initZoomDetection() loop issue

5. Check visual panel position:
   Should be centered regardless of zoom
   □ YES → All working ✅
   □ NO  → Check transform CSS

6. Try keyboard shortcut: Ctrl+Alt+R
   Should see: "Center origin refreshed..."
   □ YES → Manual refresh works
   □ NO  → Check key.js event listener

✅ If all checks pass → System fully operational
⚠️  If any check fails → Debug that component
```

---

**Architecture Version:** 1.0  
**Last Updated:** January 31, 2026  
**Status:** ✅ Fully Documented  
