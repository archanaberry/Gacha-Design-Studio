# 🧪 Multi-Select & Touch Screen - Testing Guide

## Quick Start Tests

### Test 1: Ctrl+A Select All ✅
**Expected**: All layers selected immediately without needing to drag
```
1. Open studio
2. Press Ctrl+A
3. Verify: All layers have green border/highlight
4. Verify: Can immediately drag all layers together
5. Verify: Panel2 shows first layer's properties
6. Verify: No delay or need for mouse movement
```

**Result**: ✅ PASS / ❌ FAIL

---

### Test 2: Ctrl+Click Multi-Select (Mouse)
**Expected**: Each Ctrl+Click adds/removes a layer from selection
```
1. Open studio
2. Click Layer1 (single select)
3. Ctrl+Click Layer2 (add to selection)
4. Verify: Both Layer1 and Layer2 have green border
5. Ctrl+Click Layer2 again (remove from selection)
6. Verify: Only Layer1 has green border now
7. Verify: Can drag both together when both selected
```

**Result**: ✅ PASS / ❌ FAIL

---

### Test 3: Touch Screen Rectangle Select
**Expected**: Dragging creates rectangle that selects layers inside it
```
1. Open studio on tablet/mobile or touch simulator
2. Click "Nyalakan Seleksi" button to enable selector
3. Touch and drag across multiple layers
4. Verify: Blue dashed rectangle appears as you drag
5. Upon release, verify: All layers inside rectangle selected
6. Verify: Button shows "Matikan Seleksi" when active
```

**Result**: ✅ PASS / ❌ FAIL

---

### Test 4: Touch Multi-Select Touch Multiple Fingers
**Expected**: Each finger can select a different layer
```
1. Make sure selector is enabled
2. Touch first layer with finger 1 (toggles selected)
3. While holding, touch second layer with finger 2 (toggles selected)
4. Verify: Both layers show selected state
5. Release both fingers
6. Verify: Both layers remain selected
7. Try dragging one of them (should move both together)
```

**Result**: ✅ PASS / ❌ FAIL

---

### Test 5: Group Drag After Multi-Select
**Expected**: Dragging one selected layer moves all selected layers together
```
1. Ctrl+Click to select 2-3 layers
2. Drag one of the selected layers
3. Verify: All selected layers move together
4. Verify: Relative positions maintained
5. Release and verify: All layers stay at new positions
```

**Result**: ✅ PASS / ❌ FAIL

---

### Test 6: Single Click Deselects Others
**Expected**: Single click (no Ctrl) deselects all and selects only that layer
```
1. Ctrl+A to select all
2. Single click on one random layer (no Ctrl)
3. Verify: Only that layer is selected
4. Verify: Previous selections cleared
```

**Result**: ✅ PASS / ❌ FAIL

---

### Test 7: Click Empty Area Deselects All
**Expected**: Clicking empty panel1 area clears all selections
```
1. Ctrl+A to select all
2. Click on empty area in panel1 (not on any layer)
3. Verify: All selections cleared
4. Verify: No layers have green border anymore
```

**Result**: ✅ PASS / ❌ FAIL

---

### Test 8: Panel Synchronization
**Expected**: Panel2 and Panel3 update when selection changes
```
1. Click Layer1
2. Verify: Panel2 (right panel) shows Layer1's properties
3. Verify: Panel3 (bottom) highlights Layer1
4. Ctrl+Click Layer2
5. Verify: Panel2 now shows properties for first layer of multi-select
6. Verify: Panel3 shows both Layer1 and Layer2 highlighted
```

**Result**: ✅ PASS / ❌ FAIL

---

## Advanced Tests

### Test 9: Selector Rectangle on Touch Screen
**Expected**: Rectangle select via touch works smoothly without lag
```
1. Enable selector mode
2. On touch device, touch-drag to create selection rectangle
3. Verify: Rectangle updates smoothly in real-time
4. Verify: No stutter or lag
5. Verify: Layers intersecting rectangle highlighted on release
```

**Result**: ✅ PASS / ❌ FAIL

---

### Test 10: Independent Finger Dragging
**Expected**: Two fingers on different layers drag them independently
```
1. Touch Layer1 and hold (first finger)
2. With second finger, touch Layer2 and drag
3. Verify: Layer2 moves while Layer1 stays in place
4. Verify: First finger drag doesn't interfere
5. Release and vice versa
```

**Result**: ✅ PASS / ❌ FAIL

---

### Test 11: Keyboard Arrow Keys on Multi-Select
**Expected**: Arrow keys move all selected layers
```
1. Ctrl+A to select all
2. Press ArrowUp key
3. Verify: All layers move up slightly
4. Press ArrowRight
5. Verify: All layers move right slightly
```

**Result**: ✅ PASS / ❌ FAIL

---

### Test 12: Layer Name Update in Multi-Select
**Expected**: Layer name input shows current active layer
```
1. Ctrl+A to select all
2. Look at "Layer Name" input field in Panel2
3. Verify: Shows name of first selected layer
4. Change name
5. Verify: Layer name updates correctly
```

**Result**: ✅ PASS / ❌ FAIL

---

## Browser/Device Specific Tests

### Desktop Tests
- [ ] Firefox - Ctrl+A works
- [ ] Chrome - Ctrl+A works
- [ ] Edge - Ctrl+A works
- [ ] Safari - Ctrl+A works
- [ ] Ctrl+Click multi-select works on all browsers

### Mobile Tests
- [ ] iOS Safari - Touch rectangle select works
- [ ] Android Chrome - Touch rectangle select works
- [ ] iPad - Multi-finger select works
- [ ] Tablet mode on desktop - Touch works

---

## Performance Tests

### Test 13: Performance with Many Layers
**Expected**: Selection and dragging smooth even with many layers
```
1. Create/load a scene with 20+ layers
2. Ctrl+A to select all
3. Drag from one corner to another
4. Measure: FPS should stay above 30fps
5. No noticeable stuttering or lag
```

**Result**: ✅ PASS / ❌ FAIL - FPS: ___

---

### Test 14: Selector Toggle Performance
**Expected**: Toggling selector on/off is instant
```
1. Click "Nyalakan Seleksi" button
2. Verify: Button changes text immediately
3. Verify: Selector ready without delay
4. Click again to turn off
5. Verify: Instant toggle off
```

**Result**: ✅ PASS / ❌ FAIL

---

## Edge Cases

### Test 15: Rapid Ctrl+Click
**Expected**: Multiple rapid Ctrl+Clicks work correctly
```
1. Ctrl+Click Layer1
2. Immediately Ctrl+Click Layer2
3. Immediately Ctrl+Click Layer3
4. Verify: All 3 selected
5. Verify: No UI glitches or missed selections
```

**Result**: ✅ PASS / ❌ FAIL

---

### Test 16: Ctrl+A Then Ctrl+Click to Deselect One
**Expected**: Can deselect individual layers after Ctrl+A
```
1. Ctrl+A to select all (e.g., 5 layers)
2. Ctrl+Click the second layer
3. Verify: 4 layers still selected (all except second)
4. Ctrl+Click third layer
5. Verify: 3 layers selected
```

**Result**: ✅ PASS / ❌ FAIL

---

### Test 17: Drag Partially Outside Bounds
**Expected**: Dragging still works even if pointer goes outside container
```
1. Select 2-3 layers
2. Start dragging one
3. Move pointer outside panel1 area
4. Verify: Layers continue moving
5. Bring pointer back in
6. Verify: Movement continues smoothly
```

**Result**: ✅ PASS / ❌ FAIL

---

## Summary Checklist

```
Core Features:
[ ] Ctrl+A selects all without dragging
[ ] Ctrl+Click adds/removes from selection
[ ] Touch rectangle select works
[ ] Group drag of multi-select works
[ ] Single click clears multi-select
[ ] Empty click deselects all

Visual Feedback:
[ ] Selected layers have visual indicator (border/highlight)
[ ] Panel2 updates on selection change
[ ] Panel3 shows selection state
[ ] Selector rectangle visible on drag

Cross-Platform:
[ ] Works on desktop mouse
[ ] Works on touch screen
[ ] Works on multi-touch devices
[ ] Selector toggle works reliably

Performance:
[ ] No lag with many layers
[ ] Smooth dragging
[ ] Rapid actions handled correctly
```

---

**Testing Date**: ___________  
**Tested By**: ___________  
**Notes**: 

```
[Your test notes here]
```

**Overall Result**: ✅ ALL TESTS PASS / ❌ SOME TESTS FAILED

---

## Debug Console

If any test fails, check browser console (F12) for:
- Error messages
- Console logs showing selection state
- Warning about deprecated APIs

**Expected console logs after fixes**:
```
✅ Selector initialized with unified PointerEvent system
✅ selector.selectedLayers synced: [Layer1, Layer2, ...]
🔥 Ctrl+Click multi-select: {layer: "LayerName", selected: true, totalSelected: 2}
✅ Ctrl+A: All layers selected (N) - Ready to drag immediately
```

---

**Happy Testing!** 🎉
