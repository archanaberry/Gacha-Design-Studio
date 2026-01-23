# 📑 CHARACTER TEMPLATE DOCUMENTATION INDEX
## Gacha Design Studio - Complete Navigation Guide

---

## 🎯 START HERE

### New to Character Templates?
1. Read this file (you are here!)
2. Open **QUICK_REFERENCE.md** for fast overview
3. Open **CHARACTER_TEMPLATE_GUIDE.md** for complete guide
4. Check **DOCUMENTATION_SUMMARY.md** for overview

### Need Specific Information?
Use the table below to find what you need ↓

---

## 📚 DOCUMENTATION FILES

### 1. **QUICK_REFERENCE.md** ⚡
**Best for**: Quick lookups, copy-paste templates, cheat sheets

```
Contents:
  • Default layer template snippet
  • Panel2 input ↔ Property mapping table
  • Property values guide
  • Common use cases (5+ examples)
  • Troubleshooting quick tips
  • Keyboard shortcuts
  • Links to other docs
```

**Read this when**: You need fast answers, copy-paste code, or quick reference

**Time to read**: 5-10 minutes

---

### 2. **CHARACTER_TEMPLATE_GUIDE.md** 📖
**Best for**: Complete structural understanding, comprehensive guide

```
Contents:
  • Full property format documentation
  • Template example with all properties
  • Panel2 to template mapping
  • Implementation in JavaScript
  • Quick start guide (step-by-step)
  • Template organization examples
  • Troubleshooting deep dive
  • Reference files guide
```

**Read this when**: You want to understand the complete system, create new templates

**Time to read**: 20-30 minutes

---

### 3. **TEMPLATE_IMPLEMENTATION_REFERENCE.md** 🔧
**Best for**: Technical deep dive, developers, implementation details

```
Contents:
  • Complete data flow diagram (Template → Panel2 → Layer.js → DOM)
  • Property-by-property mapping
  • Code examples for each property
  • Handler functions explained
  • Layer class constructor
  • Getters & setters code
  • DOM update mechanism
  • Complete transform building logic
  • Checklist (getters, setters, handlers, DOM updates)
  • Testing checklist
  • File references with line numbers
```

**Read this when**: Debugging issues, understanding internals, implementing new features

**Time to read**: 40-60 minutes

---

### 4. **DEFAULT_LAYER_TEMPLATE.js** 💾
**Best for**: Copy-paste ready code, template examples

```
Contents:
  • Full template with all 12 layers
  • Ready to copy to studiopose.js
  • Custom positioning example
  • Custom color example
  • Line-by-line comments
```

**Read this when**: You need copy-paste code, want to replace layers, need template reference

**Time to read**: 5 minutes (just copy what you need)

---

### 5. **DOCUMENTATION_SUMMARY.md** 📊
**Best for**: Overview, what's been done, getting started

```
Contents:
  • What has been done (✅ checklist)
  • Integration map/data flow
  • Files created/modified
  • Key features summary
  • Usage examples (4 scenarios)
  • How to use documentation
  • Property quick lookup table
  • Next steps
  • File structure
  • Learning path
  • Troubleshooting
  • Implementation checklist
```

**Read this when**: You want overview, starting point, or quick navigation

**Time to read**: 10-15 minutes

---

### 6. **DOCUMENTATION_INDEX.md** (This file) 📑
**Best for**: Navigation, finding what you need, overview

```
Contents:
  • This table of contents
  • File descriptions
  • Quick navigation by use case
  • Property reference map
  • Command quick access
  • FAQ
```

---

## 🚀 QUICK NAVIGATION BY USE CASE

### "I want to CUSTOMIZE layer positions"
1. Open: **QUICK_REFERENCE.md** (see "Common Use Cases")
2. Find: "Layer positions" example
3. Edit: `/js/studiocharacter/studiopose.js` lines 80-365
4. Copy values from **DEFAULT_LAYER_TEMPLATE.js**
5. Test in Panel2

### "I want to understand HOW IT WORKS"
1. Read: **DOCUMENTATION_SUMMARY.md** → "How It Works" section
2. Study: **CHARACTER_TEMPLATE_GUIDE.md** → "Implementation" section
3. Deep dive: **TEMPLATE_IMPLEMENTATION_REFERENCE.md** → "Data Flow" diagram

### "I want to ADD a NEW LAYER"
1. Copy: Template from **DEFAULT_LAYER_TEMPLATE.js**
2. Edit: Layer name, src paths, options
3. Refer: **CHARACTER_TEMPLATE_GUIDE.md** → "Quick Start"
4. Insert: At correct position in `/js/studiocharacter/studiopose.js`
5. Test: Reload and verify in Panel1

### "I want to SET COLORS for SVG"
1. Check: **QUICK_REFERENCE.md** → "SVG with custom colors" example
2. Learn: **CHARACTER_TEMPLATE_GUIDE.md** → "WARNA" section
3. Apply: Use `"color"`, `"color0"`, `"color1"` in template options
4. Test: Verify colors apply correctly

### "I'm DEBUGGING an issue"
1. Check: **QUICK_REFERENCE.md** → "Troubleshooting" section
2. Refer: **TEMPLATE_IMPLEMENTATION_REFERENCE.md** → "Complete Transform Building"
3. Debug: Check console (F12) for errors
4. Verify: Property names, types, handler function IDs

### "I want to UNDERSTAND Panel2 integration"
1. Study: **TEMPLATE_IMPLEMENTATION_REFERENCE.md** → "Property Mapping"
2. Read: Code examples for each property
3. Check: Handler function line numbers
4. Trace: Data flow from Panel2 input to DOM update

### "I need to EXPORT/COPY template values"
1. Open: `/js/studiocharacter/studiopose.js`
2. Copy: Desired layer object (lines 80-365)
3. Paste: To **DEFAULT_LAYER_TEMPLATE.js** or documentation
4. Keep: For reference or backup

---

## 🔍 PROPERTY REFERENCE QUICK LOOKUP

| Property | Template Key | Panel2 Input | Default | Range | File |
|---|---|---|---|---|---|
| **Position X** | `posX` | `xCoord` | 0 | any | studiopose.js:205 |
| **Position Y** | `posY` | `yCoord` | 0 | any | studiopose.js:208 |
| **Rotation** | `rotation` | `rotationControl` | 0 | 0-360° | studiopose.js:651 |
| **Scale** | `scale` | `scale` | 1 | 0-2+ | studiopose.js:687 |
| **Skew X** | `skewX` | `skewXControl` | 0 | -45-45° | studiopose.js:707 |
| **Skew Y** | `skewY` | `skewYControl` | 0 | -45-45° | studiopose.js:715 |
| **Flip H** | `flipX` | `flipHorizontal` | false | bool | studiopose.js:719 |
| **Flip V** | `flipY` | `flipVertical` | false | bool | studiopose.js:723 |
| **Width** | `width` | `width` | null | 1-∞ | frame:studiopose.js:220 |
| **Height** | `height` | `height` | null | 1-∞ | frame:studiopose.js:223 |
| **Opacity** | `opacity` | `opacitySlider` | 1 | 0-1 | layer.js:273 |
| **Color** | `color` | — | null | #RGB | layer.js:431 |
| **Color0** | `color0` | — | null | #RGB | layer.js:431 |
| **Color1** | `color1` | — | null | #RGB | layer.js:431 |

---

## 💡 FREQUENTLY ASKED QUESTIONS

### Q: Where are the layer templates defined?
**A:** `/js/studiocharacter/studiopose.js` lines 80-365

### Q: How do I change a layer's default position?
**A:** Edit `"posX"` and `"posY"` in the options object of that layer

### Q: Can I rotate a layer in the template?
**A:** Yes! Set `"rotation": 45` (degrees) in the options

### Q: How do I color SVG assets?
**A:** Use `"color"`, `"color0"`, `"color1"` in options. Format: `"#RRGGBB"`

### Q: What's the difference between src0 and src1?
**A:** src0 = outline/trim layer, src1 = base/fill layer (convention)

### Q: How does Panel2 connect to layers?
**A:** Panel2 inputs → handler functions → selected.property = value → setter → #updateElement() → DOM update

### Q: Can I set width/height in template?
**A:** Yes! Use `"width": 100` and `"height": 150` (in pixels)

### Q: What does opacity do?
**A:** Sets transparency: 0 = invisible, 1 = fully visible, 0.5 = 50% transparent

### Q: How do I flip a layer?
**A:** Set `"flipX": true` for horizontal, `"flipY": true` for vertical

### Q: Can I skew layers?
**A:** Yes! Use `"skewX": 15` and `"skewY": 10` (in degrees)

### Q: What happens if I don't set a property?
**A:** It uses the default value (0, 1, false, null depending on property)

### Q: How do I test my template changes?
**A:** Reload page (Ctrl+Shift+R) and click layer in Panel1, check Panel2 values

### Q: Where are the handler functions?
**A:** In `/js/studiocharacter/studiopose.js` around lines 780-900

### Q: How do I add a new layer?
**A:** Copy any layer object, change layerName and src paths, add to array in studiopose.js

### Q: Can I reuse SVG files for different body parts?
**A:** Yes! Same SVG can be in multiple layers with different posX, posY, rotation, scale

### Q: How do colors work for SVG?
**A:** Script fetches SVG, replaces fill/stroke with color value, converts to data URL

---

## 📋 IMPLEMENTATION CHECKLIST

Use this to track your setup:

```
SETUP:
  [ ] Read QUICK_REFERENCE.md
  [ ] Read CHARACTER_TEMPLATE_GUIDE.md
  [ ] Review DOCUMENTATION_SUMMARY.md
  
IMPLEMENTATION:
  [ ] Open /js/studiocharacter/studiopose.js
  [ ] Review current layer definitions (lines 80-365)
  [ ] Understand structure of each layer
  [ ] Review panel2 in js/frame/studiopose.js
  [ ] Check handler functions (lines 780+)
  
CUSTOMIZATION:
  [ ] Update posX/posY for each layer
  [ ] Set rotation defaults where needed
  [ ] Add custom colors if using SVG
  [ ] Set scale for oversized/undersized parts
  [ ] Adjust opacity for transparency effects
  [ ] Test flipX for left/right symmetry
  
TESTING:
  [ ] Reload studio (Ctrl+Shift+R)
  [ ] Click each layer in Panel1
  [ ] Verify posX/posY values in Panel2 match template
  [ ] Test each Panel2 input updates DOM correctly
  [ ] Check colors apply correctly
  [ ] Verify all transforms work (rotate, scale, skew, flip)
  
DOCUMENTATION:
  [ ] Keep QUICK_REFERENCE.md handy while coding
  [ ] Refer to TEMPLATE_IMPLEMENTATION_REFERENCE.md if issues
  [ ] Update template values when finalizing poses
```

---

## 🎓 LEARNING PATHS

### Path 1: QUICK LEARNER (30 minutes)
1. Read: QUICK_REFERENCE.md (5 min)
2. Copy: DEFAULT_LAYER_TEMPLATE.js code (2 min)
3. Edit: Customize posX, posY values (10 min)
4. Test: Load in studio (3 min)
5. Troubleshoot: QUICK_REFERENCE.md section (10 min)

### Path 2: COMPLETE LEARNER (60 minutes)
1. Read: DOCUMENTATION_SUMMARY.md (10 min)
2. Read: CHARACTER_TEMPLATE_GUIDE.md (20 min)
3. Study: TEMPLATE_IMPLEMENTATION_REFERENCE.md → Property Mapping (15 min)
4. Edit: Customize all properties (10 min)
5. Test: Full testing checklist (5 min)

### Path 3: DEVELOPER (90+ minutes)
1. Read: All documentation files (40 min)
2. Study: js/studiocharacter/layer.js constructor (15 min)
3. Study: js/studiocharacter/studiopose.js handlers (15 min)
4. Study: TEMPLATE_IMPLEMENTATION_REFERENCE.md → Data Flow (15 min)
5. Debug/Implement: Custom modifications (30+ min)

---

## 🔗 FILE STRUCTURE REFERENCE

```
DOCUMENTATION FILES (in root directory):
├── DOCUMENTATION_INDEX.md              ← You are here
├── QUICK_REFERENCE.md                  ← START HERE
├── CHARACTER_TEMPLATE_GUIDE.md          ← Complete guide
├── TEMPLATE_IMPLEMENTATION_REFERENCE.md ← Technical deep dive
├── DEFAULT_LAYER_TEMPLATE.js            ← Copy-paste code
└── DOCUMENTATION_SUMMARY.md             ← Overview

SOURCE FILES (actual implementation):
└── js/
    ├── studiocharacter/
    │   ├── studiopose.js                ← Layer templates (lines 80-365)
    │   ├── studiopose.js                ← Handlers (lines 780+)
    │   └── layer.js                     ← Layer class (implementation)
    └── frame/
        └── studiopose.js                ← Panel2 HTML & controls
```

---

## ⌨️ QUICK COMMANDS

### Open Files
```bash
# Visual Studio Code
code CHARACTER_TEMPLATE_GUIDE.md
code js/studiocharacter/studiopose.js
code js/studiocharacter/layer.js
code js/frame/studiopose.js
```

### Navigate to Sections
```javascript
// In studiopose.js:
// Jump to line 80: Layer templates definition
// Jump to line 205: handleXCoord function
// Jump to line 651: handleRotation function
// Jump to line 780: All handler functions start

// In layer.js:
// Jump to line 40: Constructor
// Jump to line 230: #updateElement()
// Jump to line 400: Getters & Setters
```

### Debug in Browser
```javascript
// Console (F12):
selected              // Current selected layer
selected.x            // Get X position
selected.x = 100      // Set X position
selected.rotation     // Get rotation
selected.scale = 1.5  // Set scale
```

---

## 🆘 QUICK HELP

**Not sure where to start?**
→ Open **QUICK_REFERENCE.md**

**Want to understand everything?**
→ Open **CHARACTER_TEMPLATE_GUIDE.md**

**Looking for code examples?**
→ Open **TEMPLATE_IMPLEMENTATION_REFERENCE.md**

**Need copy-paste code?**
→ Open **DEFAULT_LAYER_TEMPLATE.js**

**Want overview of what's been done?**
→ Open **DOCUMENTATION_SUMMARY.md**

**Can't find something?**
→ Use Ctrl+F to search this file or other docs

---

## 📞 SUPPORT REFERENCE

### If Layer Doesn't Load
1. Check file syntax in studiopose.js
2. Verify paths are correct
3. Check browser console (F12)
4. See **QUICK_REFERENCE.md** → "Layer tidak tampil"

### If Properties Don't Work
1. Verify property names (posX not pos_x)
2. Check data types (number vs string)
3. Ensure layer selected
4. See **QUICK_REFERENCE.md** → "Properties tidak bekerja"

### If Colors Don't Apply
1. Verify SVG has fill/stroke
2. Use correct hex format (#RRGGBB)
3. Check color0, color1 individually
4. See **QUICK_REFERENCE.md** → "Warna SVG tidak berubah"

### If Need More Help
1. Check **TEMPLATE_IMPLEMENTATION_REFERENCE.md** → "Complete Transformation"
2. Review handler functions in studiopose.js
3. Debug in browser console (F12)
4. Check syntax carefully

---

## 🎯 FINAL CHECKLIST

Before considering yourself done:

- [ ] Read at least one documentation file
- [ ] Understand layer template structure
- [ ] Know how Panel2 connects to layers
- [ ] Can modify posX/posY values
- [ ] Know where to find handler functions
- [ ] Can debug in browser console
- [ ] Have QUICK_REFERENCE.md bookmarked
- [ ] Understand data flow (Template → Panel2 → Layer → DOM)

---

**Version**: 1.0  
**Date**: 2026-01-23  
**Status**: ✅ Complete and Ready to Use

Selamat! Anda sekarang siap untuk menggunakan sistem template karakter yang lengkap! 🎉
