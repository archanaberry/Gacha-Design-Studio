// FIX: Per-Src Color Properties Tidak Bekerja
// ============================================

// MASALAH YANG DITEMUKAN:
// =====================

1. #parseSrcProperties() TIDAK meparse warna (color0, color1, color2, dst)
   - Hanya meparse: posX, posY, opacity, rotation, scale, skewX, skewY, flipX, flipY, width, height
   - HILANG: color property

2. #getColorForSrc() hanya cek di #srcColors (backward compat)
   - TIDAK cek di #srcProperties (hasil parser baru)
   - Jadi color0 dari #parseSrcProperties tidak pernah digunakan

3. SVG color fetch condition terlalu ketat
   - Hanya fetch jika: src.endsWith('.svg') && colorForThis
   - Jika tidak ada color, SVG tidak di-fetch sama sekali (masalah jika ada opacity/transform per-src)

// SOLUSI YANG DIIMPLEMENTASI:
// ===========================

✅ FIX 1: Tambah 'color' ke srcPropertyNames di #parseSrcProperties()
   Before: ['posX', 'posY', 'opacity', 'rotation', 'scale', 'skewX', 'skewY', 'flipX', 'flipY', 'width', 'height']
   After:  ['posX', 'posY', 'opacity', 'rotation', 'scale', 'skewX', 'skewY', 'flipX', 'flipY', 'width', 'height', 'color']
   
   Sekarang color0, color1, color2, dst akan di-parse ke #srcProperties[i]['color']

✅ FIX 2: Update #getColorForSrc() untuk check #srcProperties dulu
   Precedence: 
   1. #srcProperties[index]['color'] (dari #parseSrcProperties - NEW)
   2. #srcColors[index] (dari #parseColorOptions - backward compat)
   3. this.#color (global color)

✅ FIX 3: Ubah SVG fetch condition
   Before: if (src.endsWith('.svg') && colorForThis) { fetch SVG }
   After:  if (src.endsWith('.svg')) { fetch SVG }
   
   Sekarang SELALU fetch SVG, dan hanya apply warna jika ada colorForThis
   Ini memungkinkan SVG dimuat bahkan tanpa color (untuk opacity/transform per-src)

// TESTING:
// ========

Created: TEST_PER_SRC_COLOR.html
- Test 1: Hair Layer (5 SVG dengan color0-4)
- Test 2: Arm Layer (2 SVG dengan color0-1)
- Test 3: Color Precedence (Per-Src > Global)

// VERIFIKASI DI CONSOLE:
// ======================

Setiap layer sekarang akan log:
  [Layer: Rambut] Applying color #1A1A1A to SVG src0
  [Layer: Rambut] Applying color #FFFFFF to SVG src1
  [Layer: Rambut] Applying color #B39DDB to SVG src2
  [Layer: Rambut] Applying color #6A4C93 to SVG src3
  [Layer: Rambut] Applying color #9C6FB1 to SVG src4

Jika color per-src ada → SVG akan di-recolor
Jika color per-src TIDAK ada → akan log "No color for SVG src0, using original"

// BACKWARD COMPATIBILITY:
// ======================

✅ Semua yang bekerja sebelumnya tetap bekerja:
  - Global color masih support
  - color0, color1 dari #parseColorOptions masih support
  - #srcColors masih diparse dari options

Hanya DITAMBAH:
  - color0, color1, dst dari #parseSrcProperties sekarang support
  - Precedence lebih jelas dan konsisten
