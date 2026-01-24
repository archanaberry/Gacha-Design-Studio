/**
 * ============================================================
 * LAYER TEMPLATE EXAMPLES - Per-Src Properties
 * ============================================================
 * 
 * File: LAYER_TEMPLATE_EXAMPLES.js
 * Desc: Contoh lengkap struktur layer dengan per-src options
 * 
 * Refer to: LAYER_OPTIONS_STRUCTURE.md untuk dokumentasi detail
 * ============================================================
 */

// ============================================================
// CONTOH 1: HAIR LAYER (5 src dengan styling kompleks)
// ============================================================
const hairLayerExample = {
  "layerName": "Rambut",
  "src": [
    "assets/profilechibi/hair1.svg",     // src0 - outline
    "assets/profilechibi/hairl1.svg",    // src1 - light/highlight
    "assets/profilechibi/hairss1.svg",   // src2 - shade
    "assets/profilechibi/hairs1.svg",    // src3 - shadow/gradation
    "assets/profilechibi/hairo1.svg"     // src4 - base color
  ],
  "options": {
    // ---- src0: Outline (stroke) ----
    "posX0": 65,
    "posY0": 127,
    "rotation0": 0,
    "scale0": 1,
    "opacity0": 1,
    "color0": "#1A1A1A",              // Hitam untuk outline
    "flipX0": false,
    "flipY0": false,
    
    // ---- src1: Light/Highlight ----
    "posX1": 65,
    "posY1": 127,
    "rotation1": 0,
    "scale1": 1,
    "opacity1": 0.85,                 // Sedikit transparan
    "color1": "#FFFFFF",              // Putih untuk cahaya
    "flipX1": false,
    "flipY1": false,
    
    // ---- src2: Shade (gradasi tengah) ----
    "posX2": 65,
    "posY2": 127,
    "rotation2": 0,
    "scale2": 1,
    "opacity2": 0.65,
    "color2": "#B39DDB",              // Ungu muda untuk shade
    "flipX2": false,
    "flipY2": false,
    
    // ---- src3: Shadow (gradasi gelap) ----
    "posX3": 65,
    "posY3": 127,
    "rotation3": 0,
    "scale3": 1,
    "opacity3": 0.55,
    "color3": "#6A4C93",              // Ungu gelap untuk shadow
    "flipX3": false,
    "flipY3": false,
    
    // ---- src4: Base Color (warna utama) ----
    "posX4": 65,
    "posY4": 127,
    "rotation4": 0,
    "scale4": 1,
    "opacity4": 1,
    "color4": "#9C6FB1",              // Ungu untuk base
    "flipX4": false,
    "flipY4": false,
    
    // Global width/height (auto jika null)
    "width": null,
    "height": null,
    "skewX": 0,
    "skewY": 0
  }
};

// ============================================================
// CONTOH 2: ARM LAYER (2 src, styling simple)
// ============================================================
const armLayerExample = {
  "layerName": "Lengan Atas Kanan",
  "src": [
    "assets/character/base/arm1.svg",    // src0 - outline
    "assets/character/base/arm2.svg"     // src1 - base color
  ],
  "options": {
    // Global properties (diterapkan ke semua src)
    "posX": 65,
    "posY": 127,
    "rotation": 0,
    "scale": 1,
    "skewX": 0,
    "skewY": 0,
    "flipX": true,                      // Flip untuk kanan
    "flipY": false,
    "width": null,
    "height": null,
    "opacity": 1,
    
    // Override color per-src jika diperlukan
    "color0": "#000000",                // Outline hitam
    "color1": "#FFCC99"                 // Skin tone untuk base
  }
};

// ============================================================
// CONTOH 3: HAND/FINGER LAYER (2 src, dengan rotation)
// ============================================================
const handLayerExample = {
  "layerName": "Tangan Kanan",
  "src": [
    "assets/character/base/finger3.svg", // src0 - outline
    "assets/character/base/finger4.svg"  // src1 - base
  ],
  "options": {
    "posX": 80,
    "posY": 170,
    
    // Different rotation per-src
    "rotation0": 0,                     // Outline no rotation
    "rotation1": 5,                     // Base sedikit rotated
    
    "scale": 1,
    "skewX": 0,
    "skewY": 0,
    "flipX": true,
    "flipY": false,
    
    // Per-src opacity untuk effect
    "opacity0": 1,
    "opacity1": 0.95,
    
    // Color per-src
    "color0": "#1A1A1A",
    "color1": "#FFCC99",
    
    "width": null,
    "height": null
  }
};

// ============================================================
// CONTOH 4: BODY LAYER (2 src, clothing dengan gradasi)
// ============================================================
const bodyLayerExample = {
  "layerName": "Badan",
  "src": [
    "assets/character/base/body1.svg",   // src0 - outline
    "assets/character/base/body2.svg"    // src1 - base color
  ],
  "options": {
    "posX": 44,
    "posY": 112,
    "rotation": 0,
    "scale": 1,
    "skewX": 0,
    "skewY": 0,
    "flipX": false,
    "flipY": false,
    "width": null,
    "height": null,
    
    // Per-src styling untuk depth effect
    "opacity0": 1,                      // Outline full opacity
    "opacity1": 1,                      // Base full opacity
    
    "color0": "#000000",                // Black outline
    "color1": "#FF69B4"                 // Pink for shirt
  }
};

// ============================================================
// CONTOH 5: TEXT SHAPE LAYER (1 src khusus teks)
// ============================================================
const textLayerExample = {
  "layerName": "Nama Karakter",
  "src": ["text://nama"],               // Special format untuk text
  "options": {
    // Position for text
    "posX0": 50,
    "posY0": 300,
    
    // Text-specific properties
    "fontFamily0": "Arial",
    "fontSize0": 28,
    "fontWeight0": "bold",
    "fontStyle0": "normal",
    "color0": "#FFFFFF",
    "textAlign0": "center",
    "textStroke0": true,
    "textStrokeColor0": "#000000",
    "textStrokeWidth0": 2,
    
    // General properties
    "opacity0": 1,
    "rotation0": 0,
    "scale0": 1,
    "skewX0": 0,
    "skewY0": 0,
    "flipX0": false,
    "flipY0": false,
    
    // Optional width constraint
    "width0": 200,
    "height0": null
  },
  "isTextLayer": true
};

// ============================================================
// CONTOH 6: COMPLEX LAYER (3 src dengan mix styling)
// ============================================================
const complexLayerExample = {
  "layerName": "Aksesoris Rambut",
  "src": [
    "assets/character/accessorie/ribbon1.svg",   // src0 - shadow/background
    "assets/character/accessorie/ribbon2.svg",   // src1 - main
    "assets/character/accessorie/ribbon3.svg"    // src2 - highlight/shine
  ],
  "options": {
    // ---- src0: Shadow ----
    "posX0": 70,
    "posY0": 110,
    "opacity0": 0.4,
    "color0": "#4A4A4A",
    
    // ---- src1: Main ----
    "posX1": 70,
    "posY1": 110,
    "opacity1": 1,
    "color1": "#FF1493",
    "rotation1": 2,                     // Slight tilt
    
    // ---- src2: Shine ----
    "posX2": 70,
    "posY2": 110,
    "opacity2": 0.7,
    "color2": "#FFFFFF",
    "rotation2": -2,                    // Counter tilt
    "scale2": 0.95,                     // Sedikit lebih kecil
    
    // Global transformations
    "flipX": false,
    "flipY": false,
    "skewX": 0,
    "skewY": 0,
    "width": null,
    "height": null
  }
};

// ============================================================
// CONTOH 7: MIXED GLOBAL & PER-SRC (Hybrid approach)
// ============================================================
const hybridLayerExample = {
  "layerName": "Mata",
  "src": [
    "assets/character/eye/sclera.svg",      // src0 - white of eye
    "assets/character/eye/iris.svg",        // src1 - iris color
    "assets/character/eye/pupil.svg",       // src2 - pupil/shine
    "assets/character/eye/outline.svg"      // src3 - outline
  ],
  "options": {
    // ---- Global base position ----
    "posX": 30,
    "posY": 40,
    
    // ---- Per-src overrides for specific positions ----
    "posX0": 30,    // Sclera exactly at global position
    "posX1": 32,    // Iris offset sedikit
    "posX2": 33,    // Pupil lebih ke dalam
    "posX3": 30,    // Outline back to global
    
    // ---- Per-src opacity untuk layering effect ----
    "opacity0": 1,
    "opacity1": 1,
    "opacity2": 0.9,
    "opacity3": 1,
    
    // ---- Per-src color ----
    "color0": "#FFFFFF",    // Putih
    "color1": "#2E8B57",    // Hijau
    "color2": "#000000",    // Hitam
    "color3": "#1A1A1A",    // Hitam outline
    
    // ---- Per-src scale untuk shimmer effect ----
    "scale0": 1,
    "scale1": 1,
    "scale2": 0.8,          // Pupil lebih kecil
    "scale3": 1.05,         // Outline sedikit lebih besar
    
    // Global transformations
    "rotation": 0,
    "skewX": 0,
    "skewY": 0,
    "flipX": false,
    "flipY": false,
    "width": null,
    "height": null
  }
};

// ============================================================
// CONTOH 8: ANIMATED LAYER (dengan multiple src untuk animation)
// ============================================================
const animationLayerExample = {
  "layerName": "Tombol Animasi",
  "src": [
    "assets/ui/button_frame1.svg",
    "assets/ui/button_frame2.svg",
    "assets/ui/button_frame3.svg",
    "assets/ui/button_frame4.svg"
  ],
  "options": {
    // Semua frame di posisi dan ukuran yang sama
    "posX": 100,
    "posY": 100,
    "width": 100,
    "height": 100,
    "rotation": 0,
    "scale": 1,
    
    // Semua dengan opacity full
    "opacity": 1,
    
    // Frame animation handled separately
    "animationEnabled": true,
    "animationSpeed": 100,  // ms per frame
    "animationLoop": true
  }
};

// ============================================================
// NOTES ON IMPLEMENTATION
// ============================================================
/*
 * 1. REQUIRED FIELDS:
 *    - layerName: Unique identifier untuk layer
 *    - src: Array of image paths atau special format (text://)
 *    - options: Object dengan properties
 *
 * 2. OPTIONAL PROPERTIES:
 *    - Semua properties dalam options adalah optional
 *    - Jika tidak defined, gunakan default value
 *    - Per-src properties override global properties
 *
 * 3. PROPERTY INHERITANCE:
 *    properties jika undefined:
 *    - Per-src value (posX0, opacity1, etc) > Global value (posX, opacity) > Default (0, 1, null)
 *
 * 4. SPECIAL SRC FORMATS:
 *    - "path/to/file.svg" : Normal image file
 *    - "path/to/file.png" : PNG image
 *    - "text://fieldname" : Text input (untuk text layers)
 *
 * 5. COLOR FORMATS:
 *    - "#RRGGBB" : Hex color (recommended)
 *    - "rgb(r, g, b)" : RGB color
 *    - "rgba(r, g, b, a)" : RGBA with alpha
 *    - null : No tinting applied
 *
 * 6. NUMERIC RANGES:
 *    - posX, posY: any number
 *    - rotation: 0-360 degrees
 *    - scale: > 0 (1 = normal, 0.5 = half, 2 = double)
 *    - skewX, skewY: -45 to 45 degrees
 *    - opacity: 0-1 (0 = transparent, 1 = opaque)
 *    - width, height: > 0 or null (null = auto)
 */

// ============================================================
// USAGE IN STUDIOPOSE.JS
// ============================================================
/*
 * const layers = [
 *   hairLayerExample,
 *   armLayerExample,
 *   handLayerExample,
 *   bodyLayerExample,
 *   textLayerExample,
 *   // ... more layers
 * ].map(createLayerFromObject);
 */
