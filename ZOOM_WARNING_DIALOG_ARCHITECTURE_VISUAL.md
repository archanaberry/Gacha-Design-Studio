# 🎨 Zoom Warning Dialog - Visual Architecture

## 🔄 System Flow Diagram

```
┌────────────────────────────────────────────────────────────────────┐
│                    ZOOM WARNING DIALOG SYSTEM                      │
└────────────────────────────────────────────────────────────────────┘

USER ACTION: Browser Zoom (Ctrl++, Ctrl+-, Ctrl+0)
    ↓
    ├─ Initial Load (Zoom = 100%)
    │  │
    │  ├─ initZoomDetection() called
    │  ├─ lastBrowserZoom = 1.0
    │  ├─ zoomDetectionInitialized = true
    │  │
    │  └─ ✅ NO DIALOG (zoomDetectionInitialized skips initial check)
    │
    └─ User Zoom Change (Zoom = 150%)
       │
       ├─ Loop check (every 100ms)
       │  ├─ getCurrentZoom() = 1.5
       │  ├─ Compare with lastBrowserZoom = 1.0
       │  ├─ Change > 1%? YES ✓
       │  │
       │  └─ Check conditions:
       │     ├─ isShowingZoomDialog? NO ✓
       │     ├─ isResettingStudioNow? NO ✓
       │     └─ zoomDetectionInitialized? YES ✓
       │
       ├─ ✅ CALL showZoomWarningDialog(1.5)
       │
       ├─ Create Dialog via windowhandler.openWindow()
       │  │
       │  ├─ Title: "Gacha Design Studio - Mendeteksi Perubahan Zoom DPI"
       │  ├─ Content: Warning message + zoom level (150%)
       │  │
       │  └─ Footer Buttons:
       │     ├─ Button 1: "Iya deh, reset saja"
       │     └─ Button 2: "Abaikan saja"
       │
       └─ Wait for User Action
          │
          ├─ USER CLICK: "Iya deh, reset saja"
          │  │
          │  ├─ isShowingZoomDialog = false
          │  ├─ isResettingStudioNow = true ← PREVENT DUPLICATE
          │  ├─ window.closeWindow(dialogId)
          │  ├─ resetStudio() → resetCenterOrigin()
          │  │  ├─ centerOriginActive = false
          │  │  ├─ isShowingZoomDialog = false ← CLEANUP
          │  │  ├─ Reset transforms
          │  │  └─ Refresh visuals
          │  │
          │  ├─ setTimeout(() => {
          │  │   isResettingStudioNow = false
          │  │ }, 500) ← ALLOW NEXT DIALOG
          │  │
          │  └─ ✅ STUDIO RESET, Ready for next zoom
          │
          └─ USER CLICK: "Abaikan saja"
             │
             ├─ isShowingZoomDialog = false
             ├─ window.closeWindow(dialogId)
             ├─ console.log('User mengabaikan zoom warning...')
             │
             └─ ⚠️ CONTINUE WITHOUT RESET (origin may be broken)
```

---

## 🏗️ Component Interaction

```
┌─────────────────────────────────────────────────────────────────┐
│                    studiopose.js (iframe)                        │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  Contains:                                                  ││
│  │  • fullHTML = `<!DOCTYPE html>...`                         ││
│  │  • Script includes:                                        ││
│  │    └─ centerorigin.js ← WE MODIFIED HERE                  ││
│  │    └─ windowhandler.js ← Dialog system                    ││
│  │  • initZoomDetection() called on line 582-584             ││
│  └─────────────────────────────────────────────────────────────┘│
│         ↓ (window context shared)                              │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │             centerorigin.js (MODIFIED)                      ││
│  │  ┌───────────────────────────────────────────────────────┐ ││
│  │  │ Global Flags:                                         │ ││
│  │  │ • zoomDetectionInitialized = false/true              │ ││
│  │  │ • isShowingZoomDialog = false/true                   │ ││
│  │  │ • isResettingStudioNow = false/true                  │ ││
│  │  └───────────────────────────────────────────────────────┘ ││
│  │  ┌───────────────────────────────────────────────────────┐ ││
│  │  │ Functions:                                            │ ││
│  │  │ • getBrowserZoom()                                    │ ││
│  │  │ • initZoomDetection() ← MODIFIED (added dialog call)  │ ││
│  │  │ • showZoomWarningDialog() ← NEW FUNCTION             │ ││
│  │  │ • resetCenterOrigin() ← MODIFIED (add flag clear)    │ ││
│  │  └───────────────────────────────────────────────────────┘ ││
│  └─────────────────────────────────────────────────────────────┘│
│         ↓ (calls)                                               │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │          windowhandler.js (EXISTING API)                    ││
│  │  ┌───────────────────────────────────────────────────────┐ ││
│  │  │ Functions used:                                       │ ││
│  │  │ • window.openWindow(config)                           │ ││
│  │  │ • window.closeWindow(dialogId)                        │ ││
│  │  └───────────────────────────────────────────────────────┘ ││
│  │  ┌───────────────────────────────────────────────────────┐ ││
│  │  │ Dialog Rendering:                                     │ ││
│  │  │ ┌─────────────────────────────────────────────────┐  │ ││
│  │  │ │ Title                                           │  │ ││
│  │  │ ├─────────────────────────────────────────────────┤  │ ││
│  │  │ │ Content (with zoom warning + percentage)       │  │ ││
│  │  │ ├─────────────────────────────────────────────────┤  │ ││
│  │  │ │ [Button 1: Reset] [Button 2: Ignore]          │  │ ││
│  │  │ └─────────────────────────────────────────────────┘  │ ││
│  │  └───────────────────────────────────────────────────────┘ ││
│  └─────────────────────────────────────────────────────────────┘│
│         ↓ (on button click)                                     │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │          function.js / studiopose.js (EXISTING)             ││
│  │  ┌───────────────────────────────────────────────────────┐ ││
│  │  │ • resetStudio()                                       │ ││
│  │  │   └─ calls resetCenterOrigin()                        │ ││
│  │  │      └─ clears dialog flags                           │ ││
│  │  └───────────────────────────────────────────────────────┘ ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎯 State Machine

```
┌──────────────────────────────────────────────────────────────┐
│         ZOOM WARNING DIALOG STATE MACHINE                     │
└──────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ STATE 1: NOT_INITIALIZED                                    │
│ • zoomDetectionInitialized = false                          │
│ • isShowingZoomDialog = false                               │
│ • isResettingStudioNow = false                              │
│                                                              │
│ Action: initZoomDetection() called                           │
└──────────────┬──────────────────────────────────────────────┘
               │
               ↓
┌──────────────────────────────────────────────────────────────┐
│ STATE 2: INITIALIZED_READY                                   │
│ • zoomDetectionInitialized = true                           │
│ • isShowingZoomDialog = false                               │
│ • isResettingStudioNow = false                              │
│                                                              │
│ → lastBrowserZoom set (NO DIALOG YET)                        │
│ → Monitoring zoom changes every 100ms                        │
└──────────────┬──────────────────────────────────────────────┘
               │
               ├─ (No zoom change)
               │  └─ Stay in STATE 2
               │
               └─ (User zoom change > 1%)
                  │
                  ├─ Check: isShowingZoomDialog?
                  │  NO → Continue
                  │
                  ├─ Check: isResettingStudioNow?
                  │  NO → Continue
                  │
                  └─ Call showZoomWarningDialog()
                     │
                     ↓
┌──────────────────────────────────────────────────────────────┐
│ STATE 3: DIALOG_SHOWING                                      │
│ • zoomDetectionInitialized = true                           │
│ • isShowingZoomDialog = true ← PREVENT DUPLICATE            │
│ • isResettingStudioNow = false                              │
│                                                              │
│ Dialog visible with 2 buttons                                │
│ Waiting for user action                                      │
└──────────────┬──────────────────────────────────────────────┘
               │
               ├─ User click "Iya deh, reset saja"
               │  │
               │  ├─ isShowingZoomDialog = false
               │  ├─ isResettingStudioNow = true ← LOCK
               │  ├─ Close dialog
               │  ├─ Call resetStudio()
               │  │
               │  ↓
               │  ┌──────────────────────────────────────┐
               │  │ STATE 4a: RESETTING                  │
               │  │ • isResettingStudioNow = true        │
               │  │ • Dialog closed                      │
               │  │ • Reset in progress                  │
               │  └──────────────────────────────────────┘
               │  │
               │  ├─ resetStudio() running
               │  ├─ resetCenterOrigin() → clear flags
               │  ├─ Transforms reset
               │  │
               │  └─ setTimeout 500ms
               │     ├─ isResettingStudioNow = false
               │     │
               │     ↓
               │  ┌──────────────────────────────────────┐
               │  │ STATE 2: READY AGAIN                 │
               │  │ All flags reset                      │
               │  │ Ready for next zoom change           │
               │  └──────────────────────────────────────┘
               │
               └─ User click "Abaikan saja"
                  │
                  ├─ isShowingZoomDialog = false
                  ├─ Close dialog
                  ├─ No reset
                  │
                  ↓
┌──────────────────────────────────────────────────────────────┐
│ STATE 2b: CONTINUE_WITHOUT_RESET                             │
│ • isShowingZoomDialog = false                               │
│ • Dialog closed                                              │
│ • Studio continues (origin may be broken)                    │
│                                                              │
│ → If user zoom again: Dialog shows again (new, not dup)      │
└──────────────────────────────────────────────────────────────┘
```

---

## 📊 Flag Truth Table

```
┌──────────────────┬─────────────────────────────────────┬──────────┐
│ Scenario         │ Flags                               │ Result   │
├──────────────────┼─────────────────────────────────────┼──────────┤
│ Init + No zoom   │ initialized=T, showing=F, reset=F   │ No dialog│
├──────────────────┼─────────────────────────────────────┼──────────┤
│ Zoom change      │ initialized=T, showing=F, reset=F   │ Show dlg │
├──────────────────┼─────────────────────────────────────┼──────────┤
│ Dialog showing   │ initialized=T, showing=T, reset=F   │ No dup   │
├──────────────────┼─────────────────────────────────────┼──────────┤
│ Resetting        │ initialized=T, showing=?, reset=T   │ No dlg   │
├──────────────────┼─────────────────────────────────────┼──────────┤
│ After reset      │ initialized=T, showing=F, reset=F   │ Ready    │
└──────────────────┴─────────────────────────────────────┴──────────┘

Legend:
T = true, F = false, ? = any value
```

---

## 🔄 Timeline: Complete User Journey

```
TIME     ACTION                  FLAGS                   VISUAL
────────────────────────────────────────────────────────────────────
0ms      Load Studio Pose        init=F, show=F, reset=F  Studio loads
↓
100ms    initZoomDetection()     init=T, show=F, reset=F  No dialog
         lastBrowserZoom=1.0                              (initial skip)
↓
1000ms   User press Ctrl++       [monitoring...]           -
         Zoom changes to 150%
↓
1100ms   Check interval detects  init=T, show=F, reset=F  Condition OK
         zoom change (1.0→1.5)   ↓
         showZoomWarningDialog() show=T (flag set)        Dialog appears
↓
2000ms   [User sees dialog]      init=T, show=T, reset=F  Waiting for
                                                           button click
↓
2500ms   User clicks             show=F, reset=T          Dialog starts
         "Iya deh, reset saja"   ↓                        closing
                                 resetStudio()
                                 resetCenterOrigin()
↓
3000ms   resetStudio() running   [All running...]         Resetting
                                 
↓
3500ms   Reset complete          reset=F (timeout fired)   ✅ Studio reset
                                                            Ready again
↓
3600ms   [Monitoring resumes]    init=T, show=F, reset=F  Normal ops
         zoom=1.0 (after reset)
↓
4000ms   User zoom again to 200% show=F (not locked)       ✅ New dialog
         showZoomWarningDialog() show=T                    (not duplicate)
         called again
```

---

## 🎨 Dialog Layout

```
┌──────────────────────────────────────────────────────────┐
│  [X] Gacha Design Studio - Mendeteksi Perubahan Zoom DPI │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  ⚠️ Perubahan Zoom DPI Terdeteksi!                      │
│  Zoom browser berubah menjadi 150%                       │
│                                                           │
│  Jika anda ingin tetap melanjutkan maka posisi           │
│  origin nya BERANTAKAN dan ini membutuhkan               │
│  RESET STUDIO.                                           │
│                                                           │
│  ⚠️ Harap simpan pekerjaan mu jika tidak ingin hilang   │
│     selama lamanya!                                      │
│                                                           │
├──────────────────────────────────────────────────────────┤
│ [ Iya deh, reset saja ]  [ Abaikan saja ]                │
└──────────────────────────────────────────────────────────┘
```

---

## 🔍 Debug Visualization

```
Console Output Timeline:

[00:00] "✅ Zoom detection initialized..."
        └─ initZoomDetection() called

[00:10] (monitoring...)

[01:00] "🔍 Browser zoom changed to: 150.0%"
        └─ Zoom change detected

[01:01] "⚠️ showZoomWarningDialog called"
        └─ Dialog about to display

[01:02] [DIALOG VISIBLE]

[01:05] User clicks button

[01:06] "🔄 resetStudio() called"
        OR
        "⚠️ User mengabaikan zoom warning..."
        └─ User action logged

[01:10] "✅ Center origin reset"
        └─ Reset complete (if reset clicked)

[01:11] (back to monitoring)
```

---

**Visualization Version:** 1.0  
**Last Updated:** January 31, 2026  
**Status:** Complete & Accurate
