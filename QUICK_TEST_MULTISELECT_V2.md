# 🎯 MULTI-SELECT V2 - QUICK TEST GUIDE

## 🚀 What's New

### 1. Drag-to-Select Rectangle 📦
- Drag with mouse to select multiple layers at once
- Works on both `panel1-layercontainer` and `panel1-layerpanlock`
- Scroll blocks during drag (focusnya ke selection)

### 2. Ctrl+Click Multi-Select 🖱️
- Hold Ctrl, click layer to add/remove from selection
- Build selection one layer at a time
- Instant feedback in Panel2

### 3. Color Indicator 🔵🔴
- **BLUE** when dragging: "🔵 2: kepala, kaki"
- **RED** when idle: "🔴 2: kepala, kaki" (tetap selectable)
- Single layer: "kepala" (BLACK - normal)

---

## ⚡ 5-Minute Test

### Setup
```
1. Reload: Ctrl+R
2. Open file with 3+ layers
3. Check Panel2 visible (right side)
```

### Test A: Selector Drag 📦
```
1. Click "Nyalakan Seleksi" button
2. Click + DRAG from top-left ke bottom-right on layer area
   Look for: Blue dashed rectangle following your mouse
3. Release mouse
   Expected: Layers in box get selected
   Expected: Panel2 shows "🔵 N: layer1, layer2..."
   Expected: No scroll happened during drag
```
✅ = Works! / ❌ = Issue!

### Test B: Ctrl+Click 🖱️
```
1. Click "Matikan Seleksi" button (turn off selector)
2. Click layer "kepala"
   Panel2 shows: "kepala" (BLACK)
3. Ctrl+Click layer "kaki" (hold Ctrl, then click)
   Expected: Both selected
   Expected: Panel2 shows "🔵 2: kepala, kaki" (BLUE)
4. Ctrl+Click "kepala" again
   Expected: Only "kaki" selected now
```
✅ = Works! / ❌ = Issue!

### Test C: Color Change 🔵→🔴
```
1. Get 2+ layers selected (use Test B)
2. Panel2 currently shows: "🔵 2: ..." (BLUE)
3. Release Ctrl key (stop doing anything)
4. Wait 1 second
   Expected: Changes to "🔴 2: ..."(RED!)
5. Touch/click any layer
   Expected: Back to "🔵..." (BLUE during action)
```
✅ = Works! / ❌ = Issue!

---

## 🔍 Console Verification

Open DevTools (F12):

```javascript
// Check selector exists
console.log('Selector:', window.selectorInstance?.selectedLayers?.length);

// Check selected at multiDragState
console.log('Dragging:', window.multiDragState?.size);

// During multi-select (should be > 1)
console.log('Selected layers:', window.selectorInstance?.selectedLayers);
```

---

## 🗂️ Files Changed

| File | What | Where |
|------|------|-------|
| **selector.js** | Drag-select, multi-panel, scroll block | Line 27-243 |
| **function.js** | Ctrl+Click handler | Line 59-110 |
| **key.js** | (no change, already has color) | Already done |
| **studiopose.js** | (no change, already ready) | Already done |

---

## ✅ Success = All 3 Tests Pass

| Test | Expected | Your Result |
|------|----------|---|
| A: Selector Drag | 2-3 layers selected | ✅ / ❌ |
| B: Ctrl+Click | Add/remove working | ✅ / ❌ |
| C: Color BLUE→RED | Color changes | ✅ / ❌ |

**All ✅ = PERFECT!** Ready to use! 🎉

---

## 🐛 Quick Fixes

**Drag not working?**
- Click "Nyalakan Seleksi" button first!
- Check panel1-layercontainer exists in DOM

**Ctrl+Click not working?**
- Selector must be OFF ("Matikan Seleksi")
- Make sure holding Ctrl while clicking

**Color not changing?**
- Wait 1 second after last action
- Check console for updateCoordInput errors

---

## 📱 Before You Test

**IMPORTANT**:
```
Press F5 atau Ctrl+R to reload page
This loads all new JavaScript changes
```

Then follow test A, B, C above!

---

**That's it!** Simple 3-test verification. Report results! 🚀

