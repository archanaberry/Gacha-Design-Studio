/**
 * DEFAULT CHARACTER LAYER TEMPLATE
 * ================================
 * File ini berisi template lengkap untuk layers karakter
 * Setiap layer memiliki properties posX, posY, rotation, scale, skewX, skewY, flipX, flipY, opacity
 * 
 * CARA PAKAI:
 * 1. Copy seluruh `const layers = [...]` dari file ini
 * 2. Paste ke js/studiocharacter/studiopose.js mengganti layer definition lama
 * 3. Customize posX, posY, rotation, scale sesuai kebutuhan karakter
 * 4. Test di panel, panel2 akan membaca semua properties
 */

// ============================================================
// TEMPLATE LENGKAP - SIAP PAKAI
// ============================================================

const layers = [
    // ========== TANGAN KANAN ==========
    {
      "layerName": "Lengan atas kanan",
      "src": [
        "assets/character/base/arm1.svg",    // src0 (outline)
        "assets/character/base/arm2.svg"     // src1 (base)
      ],
      "options": {
        "posX": 0,
        "posY": 0,
        "rotation": 0,
        "scale": 1,
        "skewX": 0,
        "skewY": 0,
        "flipX": true,
        "flipY": false,
        "width": null,
        "height": null,
        "opacity": 1,
        "color": null
      }
    },
    {
      "layerName": "Lengan bawah kanan",
      "src": [
        "assets/character/base/hand1.svg",   // src0 (outline)
        "assets/character/base/hand2.svg"    // src1 (base)
      ],
      "options": {
        "posX": 0,
        "posY": 0,
        "rotation": 0,
        "scale": 1,
        "skewX": 0,
        "skewY": 0,
        "flipX": true,
        "flipY": false,
        "width": null,
        "height": null,
        "opacity": 1,
        "color": null
      }
    },
    {
      "layerName": "Tangan kanan",
      "src": [
        "assets/character/base/finger3.svg", // src0 (outline)
        "assets/character/base/finger4.svg"  // src1 (base)
      ],
      "options": {
        "posX": 0,
        "posY": 0,
        "rotation": 0,
        "scale": 1,
        "skewX": 0,
        "skewY": 0,
        "flipX": true,
        "flipY": false,
        "width": null,
        "height": null,
        "opacity": 1,
        "color": null
      }
    },
  
    // ========== KAKI KANAN ==========
    {
      "layerName": "Paha atas kanan",
      "src": [
        "assets/character/base/leg1.svg",    // src0 (outline)
        "assets/character/base/leg2.svg"     // src1 (base)
      ],
      "options": {
        "posX": 0,
        "posY": 0,
        "rotation": 0,
        "scale": 1,
        "skewX": 0,
        "skewY": 0,
        "flipX": true,
        "flipY": false,
        "width": null,
        "height": null,
        "opacity": 1,
        "color": null
      }
    },
    {
      "layerName": "Kaki kanan",
      "src": [
        "assets/character/base/foot1.svg",   // src0 (outline)
        "assets/character/base/foot2.svg"    // src1 (base)
      ],
      "options": {
        "posX": 0,
        "posY": 0,
        "rotation": 0,
        "scale": 1,
        "skewX": 0,
        "skewY": 0,
        "flipX": true,
        "flipY": false,
        "width": null,
        "height": null,
        "opacity": 1,
        "color": null
      }
    },
  
    // ========== BADAN ==========
    {
      "layerName": "Badan",
      "src": [
        "assets/character/base/body1.svg",   // src0 (outline)
        "assets/character/base/body2.svg"    // src1 (base)
      ],
      "options": {
        "posX": 0,
        "posY": 0,
        "rotation": 0,
        "scale": 1,
        "skewX": 0,
        "skewY": 0,
        "flipX": false,
        "flipY": false,
        "width": null,
        "height": null,
        "opacity": 1,
        "color": null
      }
    },
  
    // ========== KEPALA ==========
    {
      "layerName": "Kepala",
      "src": [
        "assets/character/head1.svg",        // src0 (outline)
        "assets/character/head2.svg"         // src1 (base)
      ],
      "options": {
        "posX": 0,
        "posY": 0,
        "rotation": 0,
        "scale": 1,
        "skewX": 0,
        "skewY": 0,
        "flipX": false,
        "flipY": false,
        "width": null,
        "height": null,
        "opacity": 1,
        "color": null
      }
    },
  
    // ========== TANGAN KIRI ==========
    {
      "layerName": "Lengan atas kiri",
      "src": [
        "assets/character/base/arm1.svg",    // src0 (outline)
        "assets/character/base/arm2.svg"     // src1 (base)
      ],
      "options": {
        "posX": 0,
        "posY": 0,
        "rotation": 0,
        "scale": 1,
        "skewX": 0,
        "skewY": 0,
        "flipX": false,
        "flipY": false,
        "width": null,
        "height": null,
        "opacity": 1,
        "color": null
      }
    },
    {
      "layerName": "Lengan bawah kiri",
      "src": [
        "assets/character/base/hand1.svg",   // src0 (outline)
        "assets/character/base/hand2.svg"    // src1 (base)
      ],
      "options": {
        "posX": 0,
        "posY": 0,
        "rotation": 0,
        "scale": 1,
        "skewX": 0,
        "skewY": 0,
        "flipX": false,
        "flipY": false,
        "width": null,
        "height": null,
        "opacity": 1,
        "color": null
      }
    },
    {
      "layerName": "Tangan kiri",
      "src": [
        "assets/character/base/finger1.svg", // src0 (outline)
        "assets/character/base/finger2.svg"  // src1 (base)
      ],
      "options": {
        "posX": 0,
        "posY": 0,
        "rotation": 0,
        "scale": 1,
        "skewX": 0,
        "skewY": 0,
        "flipX": false,
        "flipY": false,
        "width": null,
        "height": null,
        "opacity": 1,
        "color": null
      }
    },
  
    // ========== KAKI KIRI ==========
    {
      "layerName": "Paha atas kiri",
      "src": [
        "assets/character/base/leg1.svg",    // src0 (outline)
        "assets/character/base/leg2.svg"     // src1 (base)
      ],
      "options": {
        "posX": 0,
        "posY": 0,
        "rotation": 0,
        "scale": 1,
        "skewX": 0,
        "skewY": 0,
        "flipX": false,
        "flipY": false,
        "width": null,
        "height": null,
        "opacity": 1,
        "color": null
      }
    },
    {
      "layerName": "Kaki kiri",
      "src": [
        "assets/character/base/foot1.svg",   // src0 (outline)
        "assets/character/base/foot2.svg"    // src1 (base)
      ],
      "options": {
        "posX": 0,
        "posY": 0,
        "rotation": 0,
        "scale": 1,
        "skewX": 0,
        "skewY": 0,
        "flipX": false,
        "flipY": false,
        "width": null,
        "height": null,
        "opacity": 1,
        "color": null
      }
    }
  ].map(createLayerFromObject);


// ============================================================
// TEMPLATE DENGAN CUSTOM POSITIONING - CONTOH
// ============================================================
/*
// JIKA INGIN CUSTOM POSITIONING, UBAH SEPERTI INI:

const layers = [
    {
      "layerName": "Lengan atas kanan",
      "src": [
        "assets/character/base/arm1.svg",
        "assets/character/base/arm2.svg"
      ],
      "options": {
        "posX": 100,      // ← UBAH nilai ini (x0)
        "posY": 150,      // ← UBAH nilai ini (y1)
        "rotation": 15,   // ← Rotasi 15 derajat
        "scale": 1.1,     // ← Scale 110% dari normal
        "skewX": 5,       // ← Skew 5 derajat
        "skewY": 0,
        "flipX": true,
        "flipY": false,
        "width": null,
        "height": null,
        "opacity": 1,
        "color": null
      }
    },
    // ... layer lainnya ...
  ].map(createLayerFromObject);
*/


// ============================================================
// TEMPLATE DENGAN CUSTOM COLORS - CONTOH
// ============================================================
/*
// JIKA SVG ASSETS PERLU WARNA CUSTOM:

{
  "layerName": "Badan",
  "src": [
    "assets/character/base/body1.svg",
    "assets/character/base/body2.svg"
  ],
  "options": {
    "posX": 0,
    "posY": 0,
    "rotation": 0,
    "scale": 1,
    "skewX": 0,
    "skewY": 0,
    "flipX": false,
    "flipY": false,
    "width": null,
    "height": null,
    "opacity": 1,
    "color": "#FF5733",      // Warna merah untuk semua src
    // ATAU gunakan color per src:
    // "color0": "#FF5733",  // Warna merah untuk src[0] (outline)
    // "color1": "#FFD700",  // Warna gold untuk src[1] (base)
  }
}
*/
