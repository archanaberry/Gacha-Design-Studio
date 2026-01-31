# 🎯 Zoom Warning Dialog - Quick Reference

## What Changed?

✅ **Added Browser Zoom Warning Dialog**
- Tampil saat user zoom browser (Ctrl++, Ctrl+-, Ctrl+0)
- 2 Button: "Iya deh, reset saja" & "Abaikan saja"
- Smart flags prevent duplicate dialogs
- No warning on initial load

---

## Dialog Content

```
Title: "Gacha Design Studio - Mendeteksi Perubahan Zoom DPI"

Message:
┌─────────────────────────────────────────────┐
│ ⚠️ Perubahan Zoom DPI Terdeteksi!          │
│ Zoom browser berubah menjadi [ZOOM_LEVEL]% │
│                                              │
│ Jika anda ingin tetap melanjutkan maka     │
│ posisi origin nya BERANTAKAN dan ini       │
│ membutuhkan RESET STUDIO.                  │
│                                              │
│ ⚠️ Harap simpan pekerjaan mu jika tidak    │
│    ingin hilang selama lamanya!             │
└─────────────────────────────────────────────┘

Buttons:
[ Iya deh, reset saja ] [ Abaikan saja ]
```

---

## How It Works

### 1. Initial Load (No Warning)
```
Load Studio → initZoomDetection() → lastBrowserZoom = current zoom
→ ✅ No dialog shown (zoomDetectionInitialized = true skips initial)
```

### 2. Zoom Change (Show Warning)
```
User press Ctrl++ → zoom changes (150%) → showZoomWarningDialog() 
→ ✅ Dialog shown with 2 buttons
```

### 3. User Click "Iya deh, reset saja"
```
Button click → isResettingStudioNow = true → resetStudio() 
→ resetCenterOrigin() clears flags → Studio reset
```

### 4. User Click "Abaikan saja"
```
Button click → isShowingZoomDialog = false → Dialog close
→ ✅ User continue without reset (but origin may be broken)
```

---

## Global Flags

| Flag | Purpose | Value |
|------|---------|-------|
| `zoomDetectionInitialized` | Skip initial dialog on load | true/false |
| `isShowingZoomDialog` | Prevent duplicate dialogs | true/false |
| `isResettingStudioNow` | Prevent dialog during reset | true/false |

---

## Key Code Locations

**File:** `js/studiocharacter/centerorigin.js`

| Line | Function | Purpose |
|------|----------|---------|
| 30-32 | Global flags | Store state for dialog system |
| 255-337 | `showZoomWarningDialog()` | Create & manage dialog |
| 345-375 | `initZoomDetection()` | Detect zoom with dialog integration |
| 449 | `resetCenterOrigin()` | Clear dialog flag on reset |

---

## Testing

### Quick Test 1: Normal Load
```
1. Refresh page
2. Studio loads
3. ✅ No dialog shown
```

### Quick Test 2: Zoom Change
```
1. Press Ctrl++ (zoom to 150%)
2. ✅ Dialog appears with warning
3. ✅ Shows "150%" in message
```

### Quick Test 3: Reset
```
1. Dialog shown
2. Click "Iya deh, reset saja"
3. ✅ Dialog closes
4. ✅ Studio resets
5. ✅ No duplicate dialog
```

### Quick Test 4: Ignore
```
1. Dialog shown
2. Click "Abaikan saja"
3. ✅ Dialog closes
4. ✅ Studio continues (warning in console)
```

---

## Features Recap

| # | Feature | Status |
|---|---------|--------|
| 1 | Dialog shows on zoom change | ✅ |
| 2 | No dialog on initial load | ✅ |
| 3 | "Iya deh, reset saja" button | ✅ |
| 4 | "Abaikan saja" button | ✅ |
| 5 | No duplicate dialogs | ✅ |
| 6 | No duplicate on resetStudio() | ✅ |
| 7 | windowhandler.js integration | ✅ |
| 8 | Shows zoom percentage | ✅ |

---

**Implementation Date:** January 31, 2026  
**Status:** ✅ COMPLETE & TESTED  
**Files Modified:** 1 file (centerorigin.js)  
**Backward Compatible:** Yes  
