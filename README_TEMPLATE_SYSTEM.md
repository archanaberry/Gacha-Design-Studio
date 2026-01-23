# 🎨 GACHA DESIGN STUDIO - CHARACTER TEMPLATE DOCUMENTATION
## Complete Implementation & Usage Guide

---

## 📖 BACA INI DULU!

Jika baru pertama kali:
1. **Baca file ini sampai habis** (5 menit)
2. Buka **QUICK_REFERENCE.md** (fast lookup)
3. Buka **CHARACTER_TEMPLATE_GUIDE.md** (complete guide)
4. Mulai customize di **studiopose.js**

---

## 🎯 RINGKASAN SINGKAT

### Apa itu Template Character?
Template adalah **default values untuk setiap body part** (tangan, kaki, kepala, dll) yang di-load otomatis saat membuka studio.

### Dimana Template Disimpan?
File: `/js/studiocharacter/studiopose.js`  
Lines: 80-365 (semua 12 layers)

### Properties yang Available?
```
✅ posX, posY          (position x, y)
✅ rotation            (0-360 derajat)
✅ scale              (0-2+ factor)
✅ skewX, skewY       (-45 sampai 45 derajat)
✅ flipX, flipY       (horizontal/vertical mirror)
✅ width, height      (custom sizing)
✅ opacity            (transparency 0-1)
✅ color              (SVG color override)
```

### Gimana Cara Pakai?
1. Edit template value di studiopose.js
2. Reload studio
3. Layer load dengan default dari template
4. Customize lebih lanjut di Panel2 (real-time)
5. Copy final values kembali ke template

---

## 📚 DOKUMENTASI FILES

### 1. 🚀 **START HERE: QUICK_REFERENCE.md**
**Untuk**: Fast lookups, copy-paste, cheat sheet  
**Waktu**: 5-10 menit  
**Berisi**:
- Default template snippet
- Property quick lookup table  
- Common use cases (5 examples)
- Troubleshooting quick tips
- Copy-paste templates

👉 **Buka dulu file ini!**

---

### 2. 📖 **CHARACTER_TEMPLATE_GUIDE.md**
**Untuk**: Complete understanding, structural guide  
**Waktu**: 20-30 menit  
**Berisi**:
- Full format documentation
- Template structure explanation
- Panel2 to template mapping
- Implementation in JavaScript
- Quick start examples
- Troubleshooting deep dive

👉 **Baca setelah QUICK_REFERENCE.md**

---

### 3. 🔧 **TEMPLATE_IMPLEMENTATION_REFERENCE.md**
**Untuk**: Technical deep dive, developers  
**Waktu**: 40-60 menit  
**Berisi**:
- Complete data flow diagram
- Property-by-property mapping dengan code
- Handler functions explanation
- Layer.js implementation
- #updateElement() logic
- Testing checklist
- File references with line numbers

👉 **Untuk yang mau understand internals**

---

### 4. 💾 **DEFAULT_LAYER_TEMPLATE.js**
**Untuk**: Copy-paste ready code  
**Waktu**: 2-5 menit (just copy what you need)  
**Berisi**:
- Full template dengan semua 12 layers
- Ready to copy to studiopose.js
- Custom positioning example
- Custom color example

👉 **Gunakan ketika butuh code**

---

### 5. 📊 **DOCUMENTATION_SUMMARY.md**
**Untuk**: Overview, what's been done  
**Waktu**: 10-15 menit  
**Berisi**:
- What has been done (checklist)
- Integration map & data flow
- Files created/modified
- Key features summary
- Usage examples
- Learning paths
- Troubleshooting

👉 **Untuk overview & navigation**

---

### 6. 📑 **DOCUMENTATION_INDEX.md**
**Untuk**: Navigation, finding things  
**Waktu**: Sebagai reference  
**Berisi**:
- Complete file descriptions
- Quick navigation by use case
- Property reference map
- FAQ section
- Learning paths
- File structure reference

👉 **Gunakan sebagai navigator**

---

## 🚀 QUICK START (5 MINUTES)

### Step 1: Understand Structure (1 min)
Setiap layer punya format:
```javascript
{
  "layerName": "Nama Bagian",
  "src": ["assets/path/file1.svg", "assets/path/file2.svg"],
  "options": {
    "posX": 0,
    "posY": 0,
    "rotation": 0,
    // ... more properties
  }
}
```

### Step 2: Edit Template (2 min)
File: `/js/studiocharacter/studiopose.js`  
Lines: 80-365

Ubah values seperti:
```javascript
"posX": 100,      // dari 0 ke 100
"rotation": 45,   // dari 0 ke 45 derajat
"scale": 1.2,     // dari 1 ke 1.2 (120%)
```

### Step 3: Test (1 min)
Reload studio: `Ctrl+Shift+R`  
Klik layer di Panel1 → cek values di Panel2

### Step 4: Customize (1+ min)
Gunakan Panel2 untuk fine-tune  
Copy final values kembali ke template

✅ Done!

---

## 📊 PROPERTY REFERENCE

| Property | Default | Range | Usage | Panel2 |  
|---|---|---|---|---|  
| **posX** | 0 | any | X position | xCoord |  
| **posY** | 0 | any | Y position | yCoord |  
| **rotation** | 0 | 0-360° | Rotate layer | rotationControl |  
| **scale** | 1 | 0-2+ | Resize layer | scale |  
| **skewX** | 0 | -45-45° | Skew horizontal | skewXControl |  
| **skewY** | 0 | -45-45° | Skew vertical | skewYControl |  
| **flipX** | false | bool | Mirror horizontal | flipHorizontal |  
| **flipY** | false | bool | Mirror vertical | flipVertical |  
| **width** | null | 1-∞ | Custom width | width |  
| **height** | null | 1-∞ | Custom height | height |  
| **opacity** | 1 | 0-1 | Transparency | opacitySlider |  
| **color** | null | #RGB | SVG color | — |  

---

## 🔗 HOW IT WORKS

### Simple Flow:
```
1. Template (studiopose.js)
   └─ Layer definitions dengan default values

2. Layer.js Constructor  
   └─ Read options from template
   └─ Set initial #x, #y, #rotation, etc
   └─ Apply to DOM

3. Panel1
   └─ Layer visible dengan default position/transform

4. User Click Layer
   └─ selected = that layer
   └─ Panel2 values populated from selected properties

5. User Change Panel2 Input
   └─ handleXCoord() dipanggil
   └─ selected.x = newValue
   └─ Setter trigger #updateElement()
   └─ DOM updated
   └─ Visual change instant di Panel1!
```

### Real-Time Sync:
```
Template Values ← → Panel2 Inputs ← → Layer Properties ← → DOM Styles
```

---

## ✨ SUDAH IMPLEMENTED

### Template ✅
- [x] All 12 layers defined
- [x] All properties present
- [x] Proper structure & comments
- [x] Ready to customize

### Layer.js ✅
- [x] Constructor parse all options
- [x] All getters present
- [x] All setters present  
- [x] #updateElement() fully working
- [x] SVG color support

### Panel2 ✅
- [x] All input elements present
- [x] All handler functions working
- [x] Real-time synchronization
- [x] Visual feedback instant

### Documentation ✅
- [x] 8 documentation files
- [x] 77+ KB content
- [x] Complete examples
- [x] Quick reference
- [x] Technical deep dive
- [x] Troubleshooting guides

---

## 🎯 COMMON TASKS

### Change Layer Position
1. Edit `posX` dan `posY` di studiopose.js
2. Reload studio
3. Layer appear di posisi baru

### Rotate Layer in Template  
1. Edit `rotation` value (0-360)
2. Reload studio
3. Layer appear rotated

### Mirror Layer (for left side)
1. Edit `flipX` dari true → false
2. Reload studio
3. Layer appear mirrored

### Set SVG Colors
1. Edit `color` atau `color0`, `color1`
2. Use hex format: `"#FF5733"`
3. Reload studio  
4. Colors applied automatically

### Scale Layer Up/Down
1. Edit `scale` (1 = normal, 1.5 = 150%)
2. Reload studio
3. Layer appear resized

---

## 🐛 QUICK TROUBLESHOOTING

### Layer tidak tampil?
→ Check file paths di src array  
→ Check syntax (quotes, commas)
→ Reload dengan Ctrl+Shift+R

### Properties tidak work?
→ Verify property names (posX tidak pos_x)
→ Check values are correct type
→ Ensure layer selected sebelum ubah Panel2

### Warna SVG tidak change?
→ Verify SVG has fill/stroke attributes
→ Use hex format #RRGGBB
→ Check console untuk errors (F12)

→ Lebih detail? Buka **QUICK_REFERENCE.md** troubleshooting section

---

## 📞 NEED HELP?

**Tidak tahu harus kemana?**
1. Cek file yang sesuai dari section documentation files di atas
2. Atau buka **DOCUMENTATION_INDEX.md** untuk navigation lengkap

**Mau copy-paste?**
→ Buka **DEFAULT_LAYER_TEMPLATE.js**

**Mau quick answer?**
→ Buka **QUICK_REFERENCE.md** → Ctrl+F cari keyword

**Mau understand internals?**
→ Buka **TEMPLATE_IMPLEMENTATION_REFERENCE.md**

**Mau overview apa aja yang udah done?**
→ Buka **DOCUMENTATION_SUMMARY.md**

**Bingung navigasi dokumentasi?**
→ Buka **DOCUMENTATION_INDEX.md**

---

## 🎓 RECOMMENDED READING ORDER

### Untuk Quick Start (15 min):
1. ⏱️ 5 min: File ini (README_TEMPLATE_SYSTEM.md)
2. ⏱️ 5 min: QUICK_REFERENCE.md
3. ⏱️ 5 min: DEFAULT_LAYER_TEMPLATE.js (copy-paste)

### Untuk Complete Understanding (60 min):
1. ⏱️ 5 min: File ini
2. ⏱️ 10 min: DOCUMENTATION_SUMMARY.md
3. ⏱️ 20 min: CHARACTER_TEMPLATE_GUIDE.md
4. ⏱️ 15 min: TEMPLATE_IMPLEMENTATION_REFERENCE.md
5. ⏱️ 10 min: QUICK_REFERENCE.md (untuk reference)

### Untuk Developer Deep Dive (90+ min):
1. Read semua files di atas (60 min)
2. Study js/studiocharacter/layer.js constructor (15 min)
3. Study handler functions di studiopose.js (15 min)

---

## 📁 FILE LOCATIONS

### Dokumentasi Files (di root):
```
✅ README_TEMPLATE_SYSTEM.md             (START HERE - this file)
✅ QUICK_REFERENCE.md                   
✅ CHARACTER_TEMPLATE_GUIDE.md
✅ TEMPLATE_IMPLEMENTATION_REFERENCE.md
✅ DEFAULT_LAYER_TEMPLATE.js
✅ DOCUMENTATION_SUMMARY.md
✅ DOCUMENTATION_INDEX.md
✅ IMPLEMENTASI_COMPLETE.md
```

### Source Files:
```
/js/studiocharacter/studiopose.js       (layer templates)
/js/studiocharacter/layer.js            (layer class)
/js/frame/studiopose.js                 (panel2 controls)
```

---

## ✅ FINAL CHECKLIST

Before you start customizing:

- [ ] Read **QUICK_REFERENCE.md** (5 min)
- [ ] Understand template structure (from this file)
- [ ] Know where to edit (studiopose.js lines 80-365)
- [ ] Know how to test (reload Ctrl+Shift+R)
- [ ] Have documentation bookmarked

You are ready! 🚀

---

## 🎉 SUMMARY

You have:
✅ Complete character template system  
✅ All properties documented  
✅ Real-time Panel2 integration  
✅ 8 comprehensive documentation files  
✅ Ready-to-use code examples  
✅ Quick reference guides  
✅ Technical deep dives  
✅ Troubleshooting guides  

**Everything is ready to use!**

---

**Version**: 1.0  
**Date**: 2026-01-23  
**Status**: ✅ COMPLETE & READY

**Next Step**: Open **QUICK_REFERENCE.md** → Start customizing! 🎨✨
