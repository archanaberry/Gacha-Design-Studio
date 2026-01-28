//  -------------------Gacha Design Studio--------------------  //
//  Created by: Archana Berry                                   //
//  Assets credits: Lunime, OGL (Open Game License), MIT CC     //
//  Version resource: v0.001_alpha                              //
//  File: studiopose.js                                         //
//  Type: module[design]                                        //
//  Desc: Main handling studio module                           //
//                                                              //
//  ----------------------------------------------------------  //
//                                                              //
//  ---- Do not use this as a gacha design game as        ----  //
//  ---- template, or modifying it to make a other        ----  //
//  ---- version, than this without Archana Berry's       ----  //
//  ---- permission's, except to help with repairs or     ----  //
//  ---- updates art assets and etc with contributing     ----  //
//                                                              //
//**************************************************************//
// Please patient for release Gacha Design Studio in Playstore UwU

// studiopose.js


/** @type {Layer} Elemen yang sedang dipilih */
let selected = null;

/**
 * STRUKTUR LAYER DATA:
 * =====================
 * 
 * 1. SINGLE LAYER (tidak ada children):
 *    {
 *      "layerName": "Kepala",
 *      "src": ["assets/head.svg"],
 *      "options": { "flipX": true }
 *    }
 * 
 * 2. GROUP LAYER (dengan children):
 *    {
 *      "layerName": "Body Group",
 *      "src": ["assets/group.svg"],  // opsional
 *      "options": {},
 *      "childLayers": [
 *        { "layerName": "Sub 1", "src": [...], "options": {} },
 *        { "layerName": "Sub 2", "src": [...], "options": {} }
 *      ]
 *    }
 * 
 * 3. NESTED GROUP (group dalam group):
 *    {
 *      "layerName": "Main Group",
 *      "src": [],
 *      "childLayers": [
 *        {
 *          "layerName": "Sub Group",
 *          "src": [],
 *          "childLayers": [
 *            { "layerName": "Item", "src": [...] }
 *          ]
 *        }
 *      ]
 *    }
 */

// Fungsi untuk membuat instance Layer dari objek JSON
function createLayerFromObject(layerObj) {
    if (!layerObj || !layerObj.layerName || !layerObj.src) {
        console.error('Invalid layer data:', layerObj);
        return null;
    }

    const layer = new Layer(
        layerObj.layerName,
        layerObj.src,
        layerObj.options || {},
        layerObj.childLayers || []
    );

    return layer;
}

/**
 * ============================================================
 * DEFAULT CHARACTER LAYER TEMPLATE
 * ============================================================
 * 
 * STRUKTUR LAYER DENGAN PROPERTIES LENGKAP:
 * 
 * options: {
 *   // POSISI (Panel2: xCoord, yCoord)
 *   "posX": 0,        // x0 - Posisi horizontal awal
 *   "posY": 0,        // y1 - Posisi vertikal awal
 *   
 *   // ROTASI & SKALA (Panel2: rotationControl, scale)
 *   "rotation": 0,    // Rotate 0-360 derajat
 *   "scale": 1,       // Scale 0-2+ (1=normal)
 *   
 *   // SKEW (Panel2: skewXControl, skewYControl)
 *   "skewX": 0,       // Skew X -45 hingga 45
 *   "skewY": 0,       // Skew Y -45 hingga 45
 *   
 *   // FLIP (Panel2: flipHorizontal, flipVertical)
 *   "flipX": false,   // Flip horizontal
 *   "flipY": false,   // Flip vertikal
 *   
 *   // UKURAN (Panel2: width, height)
 *   "width": null,    // Auto jika null
 *   "height": null,   // Auto jika null
 *   
 *   // OPASITAS (Panel2: opacitySlider)
 *   "opacity": 1,     // 0-1 (1=fully opaque)
 *   
 *   // WARNA (untuk SVG)
 *   "color": null,    // Warna global
 *   "color0": null,   // Warna src[0] - format: #RRGGBB atau #RRGGBBAA (dengan alpha)
 *   "color1": null,   // Warna src[1] - format: #RRGGBB atau #RRGGBBAA
 *   
 *   // GRADASI (untuk SVG dengan gradient)
 *   "color0g0": null,    // Warna gradasi pertama di src[0], gradient index 0
 *   "color0g0pX": 0,     // Posisi X gradient pertama di src[0]
 *   "color0g0pY": 0,     // Posisi Y gradient pertama di src[0]
 *   "color0g1": null,    // Warna gradasi kedua di src[0], gradient index 1
 *   "color0g1pX": 0,     // Posisi X gradient kedua di src[0]
 *   "color0g1pY": 0      // Posisi Y gradient kedua di src[0]
 * }
 * 
 * FORMAT WARNA:
 * - #RRGGBB     - Solid color (red, green, blue)
 * - #RRGGBBAA   - Color dengan alpha/transparency (AA = 00 transparent hingga FF opaque)
 * 
 * CATATAN: Setiap layer siap di-customize di panel2 secara real-time
 * Refer: LAYER_OPTIONS_STRUCTURE.md untuk dokumentasi lengkap
 * Refer: LAYER_TEMPLATE_EXAMPLES.js untuk contoh implementasi
 * 
 * STRUKTUR OPTIONS BARU:
 * - Properties global (posX, posY, rotation, scale, dll) diterapkan ke semua src
 * - Properties per-src (posX0, posY1, color2, opacity3, dst) override global
 * - Semua properties bersifat OPSIONAL - hanya define yang dibutuhkan
 * - Gradient support: color0g0, color0g1, dll untuk setiap gradient stop
 * ============================================================
 */

const layers = [
    // ========== RAMBUT (Hair) - 5 src dengan styling lengkap per-src ==========
    {
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
        "opacity0": 1,
        "color0": "#1A1A1A",
        
        // ---- src1: Light/Highlight ----
        "posX1": 65,
        "posY1": 127,
        "opacity1": 0.85,
        "color1": "#FFFFFF",
        
        // ---- src2: Shade (gradasi tengah) ----
        "posX2": 65,
        "posY2": 127,
        "opacity2": 0.65,
        "color2": "#B39DDB",
        
        // ---- src3: Shadow (gradasi gelap) ----
        "posX3": 65,
        "posY3": 127,
        "opacity3": 0.55,
        "color3": "#6A4C93",
        
        // ---- src4: Base Color (warna utama) ----
        "posX4": 65,
        "posY4": 127,
        "opacity4": 1,
        "color4": "#9C6FB1",
        
        // Global transformations
        "rotation": 0,
        "scale": 1,
        "skewX": 0,
        "skewY": 0,
        "flipX": false,
        "flipY": false,
        "width": null,
        "height": null
      }
    },
    // ========== LENGAN ATAS KANAN ==========
    {
      "layerName": "Lengan atas kanan",
      "src": [
        "assets/character/base/arm1.svg",    // src0 - outline
        "assets/character/base/arm2.svg"     // src1 - base color
      ],
      "options": {
        // Global position
        "posX": 65,
        "posY": 127,
        
        // Per-src colors
        "color0": "#000000",                 // Outline hitam
        "color1": "#FFCC99",                 // Skin tone
        
        // Global transformations
        "rotation": 0,
        "scale": 1,
        "flipX": true,                       // Flip untuk kanan
        "flipY": false,
        "skewX": 0,
        "skewY": 0,
        "width": null,
        "height": null,
        "opacity": 1
      }
    },
    // ========== LENGAN BAWAH KANAN ==========
    {
      "layerName": "Lengan bawah kanan",
      "src": [
        "assets/character/base/hand1.svg",   // src0 - outline
        "assets/character/base/hand2.svg"    // src1 - base
      ],
      "options": {
        "posX": 73,
        "posY": 151,
        "color0": "#000000",
        "color1": "#FFCC99",
        "rotation": 0,
        "scale": 1,
        "flipX": true,
        "flipY": false,
        "skewX": 0,
        "skewY": 0,
        "width": null,
        "height": null,
        "opacity": 1
      }
    },
    // ========== TANGAN KANAN ==========
    {
      "layerName": "Tangan kanan",
      "src": [
        "assets/character/base/finger3.svg", // src0 - outline
        "assets/character/base/finger4.svg"  // src1 - base
      ],
      "options": {
        "posX": 80,
        "posY": 170,
        "color0": "#000000",
        "color1": "#FFCC99",
        "opacity0": 1,
        "opacity1": 0.95,
        "rotation": 0,
        "scale": 1,
        "flipX": true,
        "flipY": false,
        "skewX": 0,
        "skewY": 0,
        "width": null,
        "height": null
      }
    },
  
    // ========== KAKI KANAN ==========
    {
      "layerName": "Paha atas kanan",
      "src": [
        "assets/character/base/leg1.svg",    // src0 - outline
        "assets/character/base/leg2.svg"     // src1 - base
      ],
      "options": {
        "posX": 65.5,
        "posY": 178,
        "color0": "#000000",
        "color1": "#FFCC99",
        "rotation": 0,
        "scale": 1,
        "flipX": true,
        "flipY": false,
        "skewX": 0,
        "skewY": 0,
        "width": null,
        "height": null,
        "opacity": 1
      }
    },
    {
      "layerName": "Kaki kanan",
      "src": [
        "assets/character/base/foot1.svg",   // src0 - outline
        "assets/character/base/foot2.svg"    // src1 - base
      ],
      "options": {
        "posX": 66.5,
        "posY": 206,
        "color0": "#000000",
        "color1": "#FFCC99",
        "rotation": 352,
        "scale": 1,
        "flipX": false,
        "flipY": false,
        "skewX": 0,
        "skewY": 0,
        "width": null,
        "height": null,
        "opacity": 1
      }
    },
  
    // ========== BADAN ==========
    {
      "layerName": "Badan",
      "src": [
        "assets/character/base/body1.svg",   // src0 - outline
        "assets/character/base/body2.svg"    // src1 - base color
      ],
      "options": {
        "posX": 44,
        "posY": 112,
        "color0": "#000000",
        "color1": "#FF69B4",                 // Pink untuk baju
        "opacity0": 1,
        "opacity1": 1,
        "rotation": 0,
        "scale": 1,
        "flipX": false,
        "flipY": false,
        "skewX": 0,
        "skewY": 0,
        "width": null,
        "height": null
      }
    },
  
    // ========== KEPALA ==========
    {
      "layerName": "Kepala",
      "src": [
        "assets/character/base/head1.svg",   // src0 - outline
        "assets/character/base/head2.svg"    // src1 - base
      ],
      "options": {
        "posX": 0,
        "posY": 0,
        "color0": "#000000",
        "color1": "#FFCC99",
        "opacity": 1,
        "rotation": 0,
        "scale": 1,
        "flipX": false,
        "flipY": false,
        "skewX": 0,
        "skewY": 0,
        "width": null,
        "height": null
      }
    },
  
    // ========== LENGAN ATAS KIRI ==========
    {
      "layerName": "Lengan atas kiri",
      "src": [
        "assets/character/base/arm1.svg",    // src0 - outline
        "assets/character/base/arm2.svg"     // src1 - base
      ],
      "options": {
        "posX": 34.5,
        "posY": 127.5,
        "color0": "#000000",
        "color1": "#FFCC99",
        "rotation": 0,
        "scale": 1,
        "flipX": false,
        "flipY": false,
        "skewX": 0,
        "skewY": 0,
        "width": null,
        "height": null,
        "opacity": 1
      }
    },
    {
      "layerName": "Lengan bawah kiri",
      "src": [
        "assets/character/base/hand1.svg",   // src0 - outline
        "assets/character/base/hand2.svg"    // src1 - base
      ],
      "options": {
        "posX": 26.5,
        "posY": 152,
        "color0": "#000000",
        "color1": "#FFCC99",
        "rotation": 0,
        "scale": 1,
        "flipX": false,
        "flipY": false,
        "skewX": 0,
        "skewY": 0,
        "width": null,
        "height": null,
        "opacity": 1
      }
    },
    {
      "layerName": "Tangan kiri",
      "src": [
        "assets/character/base/finger1.svg", // src0 - outline
        "assets/character/base/finger2.svg"  // src1 - base
      ],
      "options": {
        "posX": 20,
        "posY": 172,
        "color0": "#000000",
        "color1": "#FFCC99",
        "opacity0": 1,
        "opacity1": 0.95,
        "rotation": 0,
        "scale": 1,
        "flipX": false,
        "flipY": false,
        "skewX": 0,
        "skewY": 0,
        "width": null,
        "height": null
      }
    },
  
    // ========== KAKI KIRI ==========
    {
      "layerName": "Paha atas kiri",
      "src": [
        "assets/character/base/leg1.svg",    // src0 - outline
        "assets/character/base/leg2.svg"     // src1 - base
      ],
      "options": {
        "posX": 42.5,
        "posY": 180.5,
        "color0": "#000000",
        "color1": "#FFCC99",
        "rotation": 0,
        "scale": 1,
        "flipX": false,
        "flipY": false,
        "skewX": 0,
        "skewY": 0,
        "width": null,
        "height": null,
        "opacity": 1
      }
    },
    {
      "layerName": "Kaki kiri",
      "src": [
        "assets/character/base/foot1.svg",   // src0 - outline
        "assets/character/base/foot2.svg"    // src1 - base
      ],
      "options": {
        "posX": 40.5,
        "posY": 208,
        "color0": "#000000",
        "color1": "#FFCC99",
        "rotation": 0,
        "scale": 1,
        "flipX": false,
        "flipY": false,
        "skewX": 0,
        "skewY": 0,
        "width": null,
        "height": null,
        "opacity": 1
      }
    },

    // ========== CONTOH TEXT LAYER (Opsional - Gunakan jika ada feature teks) ==========
     {
       "layerName": "Nama Karakter",
       "src": ["text://characterName"],
       "isTextLayer": true,
       "options": {
         "posX0": 50,
         "posY0": 300,
         "fontFamily0": "Arial",
         "fontSize0": 28,
         "fontWeight0": "bold",
         "color0": "#000000",
         "textAlign0": "center",
         "textStroke0": true,
         "textStrokeColor0": "#000000",
         "textStrokeWidth0": 2,
         "opacity0": 1,
         "width0": 200
       }
     }
  ].map(createLayerFromObject);

// Mendefinisikan koordinat awal ketika halaman dimuat
let initialX = 0;
let initialY = 0;

// Mendapatkan elemen input untuk menampilkan dan mengubah koordinat
const xCoordInput = document.getElementById('xCoord');
const yCoordInput = document.getElementById('yCoord');
const heightInput = document.getElementById('height');
const widthInput = document.getElementById('width');
const scaleInput = document.getElementById('scale');
const rotationControl = document.getElementById('rotationControl');
const flipHorizontal = document.getElementById('flipHorizontal');
const flipVertical = document.getElementById('flipVertical');
const rotationIndicator = document.getElementById('rotationIndicator');
const layerNameInput = document.getElementById('layerName');
const skewXControl = document.getElementById('skewXControl');
const skewXSlider = document.getElementById('skewXSlider');
const skewYControl = document.getElementById('skewYControl');
const skewYSlider = document.getElementById('skewYSlider');

// Store in window for cross-file access
window.splitterInstance = document.getElementById('splitter');
window.panel1Instance = document.getElementById('panel1');
window.panel2Instance = document.getElementById('panel2');

// Create local references
const splitter = window.splitterInstance;
const panel1 = window.panel1Instance;
const panel2 = window.panel2Instance;
const splitterHeight = splitter ? splitter.offsetHeight : 0;

// ============================================================
// MULTI-TOUCH HANDLER UNTUK DRAG LAYER
// ============================================================
// Support unlimited touches (10+ jari) untuk mobile multidrag
// Menggunakan centroid dari semua touch points untuk efisiensi maksimal

class LayerMultiTouchHandler {
    constructor() {
        this.activeTouches = new Map(); // Map<touchId, {x, y}>
        this.dragStartCentroid = null;
        this.isDragging = false;
        this.activeFingerCount = 0;
    }

    calculateCentroid() {
        if (this.activeTouches.size === 0) return null;
        
        let sumX = 0, sumY = 0;
        for (const pos of this.activeTouches.values()) {
            sumX += pos.x;
            sumY += pos.y;
        }
        
        const count = this.activeTouches.size;
        return {
            x: sumX / count,
            y: sumY / count,
            touchCount: count
        };
    }

    start(e, layer) {
        this.activeTouches.clear();
        this.isDragging = true;
        
        // Tangkap semua touches yang aktif
        if (e.touches) {
            for (let i = 0; i < e.touches.length; i++) {
                const touch = e.touches[i];
                const touchId = `touch_${touch.identifier}`;
                this.activeTouches.set(touchId, {
                    x: touch.clientX,
                    y: touch.clientY
                });
            }
        } else if (e.type === 'mousedown') {
            // Mouse fallback
            this.activeTouches.set('mouse_primary', {
                x: e.clientX,
                y: e.clientY
            });
        }
        
        this.dragStartCentroid = this.calculateCentroid();
        if (!this.dragStartCentroid) return false;
        
        this.activeFingerCount = this.activeTouches.size;
        selectLayer(layer);
        return true;
    }

    move(e) {
        if (!this.isDragging || !this.dragStartCentroid) return false;

        // Update positions dari touches yang aktif
        if (e.touches) {
            for (let i = 0; i < e.touches.length; i++) {
                const touch = e.touches[i];
                const touchId = `touch_${touch.identifier}`;
                if (this.activeTouches.has(touchId)) {
                    this.activeTouches.set(touchId, {
                        x: touch.clientX,
                        y: touch.clientY
                    });
                }
            }
        } else if (e.type === 'mousemove') {
            this.activeTouches.set('mouse_primary', {
                x: e.clientX,
                y: e.clientY
            });
        }

        const currentCentroid = this.calculateCentroid();
        if (!currentCentroid) return false;

        // Hitung delta dari start centroid
        const dx = currentCentroid.x - this.dragStartCentroid.x;
        const dy = currentCentroid.y - this.dragStartCentroid.y;

        if (selected) {
            selected.x += dx;
            selected.y += dy;
            updateCoordInput();
            
            // Update start centroid untuk next delta calculation
            this.dragStartCentroid = currentCentroid;
        }

        return true;
    }

    end(e) {
        if (!this.isDragging) return;
        
        // Remove touches yang berakhir
        if (e.changedTouches) {
            for (let i = 0; i < e.changedTouches.length; i++) {
                const touch = e.changedTouches[i];
                const touchId = `touch_${touch.identifier}`;
                this.activeTouches.delete(touchId);
            }
        } else {
            this.activeTouches.delete('mouse_primary');
        }

        // Jika semua touches selesai
        if (this.activeTouches.size === 0) {
            this.isDragging = false;
            this.dragStartCentroid = null;
            this.activeFingerCount = 0;
        }

        return !this.isDragging;
    }

    getTouchCount() {
        return this.activeTouches.size;
    }

    cancel() {
        this.activeTouches.clear();
        this.isDragging = false;
        this.dragStartCentroid = null;
        this.activeFingerCount = 0;
    }
}

// Create instance
const layerTouchHandler = new LayerMultiTouchHandler();

/**
 * @param {Event} e
 * @param {Layer} layer 
 */
function onlayerdragstart(e, layer) {
    // Mulai multi-touch tracking
    if (!layerTouchHandler.start(e, layer)) return;

    // Attach event listeners untuk tracking semua touches
    document.addEventListener('mousemove', onlayerdrag, { passive: false });
    document.addEventListener('mouseup', onlayerdragend, { passive: false });
    document.addEventListener('touchmove', onlayerdrag, { passive: false });
    document.addEventListener('touchend', onlayerdragend, { passive: false });
    document.addEventListener('touchcancel', onlayerdragend, { passive: false });
    
    e.preventDefault?.();
}

function onlayerdrag(e) {
    layerTouchHandler.move(e);
    e.preventDefault?.();
}

function onlayerdragend(e) {
    // Jika masih ada touches aktif, jangan cleanup
    if (!layerTouchHandler.end(e)) return;

    // Cleanup event listeners hanya ketika semua touches selesai
    document.removeEventListener('mousemove', onlayerdrag);
    document.removeEventListener('mouseup', onlayerdragend);
    document.removeEventListener('touchmove', onlayerdrag);
    document.removeEventListener('touchend', onlayerdragend);
    document.removeEventListener('touchcancel', onlayerdragend);
}


// Menambahkan event listener untuk mengatur perpindahan menggunakan keyboard
document.addEventListener('keydown', function(e) {
    if(!selected) return;

    // Mengatur sensitivitas perpindahan
    let sensitivity = 1;

    // Menangani perpindahan menggunakan keyboard
    switch(e.key) {
        case 'ArrowUp':
            selected.y -= sensitivity;
            updateCoordInput();
            break;
        case 'ArrowDown':
            selected.y += sensitivity;
            updateCoordInput();
            break;
        case 'ArrowLeft':
            selected.x -= sensitivity;
            updateCoordInput();
            break;
        case 'ArrowRight':
            selected.x += sensitivity;
            updateCoordInput();
            break;
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // Pasang layer ke container ketika halaman selesai dimuat
    const container = document.getElementById('panel1') || document.querySelector('.container');
    for (const layer of layers) {
        layer.attach(container, onlayerdragstart);
        // Tambah click handler untuk multi-select support
        addLayerClickHandler(layer);
    }

    // Initialize zoom input
    const zoomInput = document.getElementById('zoomInput');
    const zoomSlider = document.getElementById('zoomSlider');
    if (zoomInput) {
        zoomInput.value = '100%';
    }
    if (zoomSlider) {
        zoomSlider.value = 100;
    }

    // Initialize framework display di panel3
    if (window.frameworkDisplay) {
        window.frameworkDisplay.initialize(layers);
    }

    // Listen untuk selection perubahan di Panel2 (menulayer)
    document.addEventListener('layerChildSelected', (e) => {
        const layerData = e.detail.layerData;
        const layerName = layerData?.name;
        
        if (layerName) {
            // Cari layer dengan nama yang sama di array layers
            const selectedLayer = layers.find(l => l.name === layerName);
            if (selectedLayer) {
                selectLayer(selectedLayer);
            }
        }
    });

    // Hapus seleksi ketika user mengklik elemen yang bukan layer, splitter, atau panel tertentu
    document.addEventListener('click', function(e) {
        // Periksa apakah elemen yang diklik adalah splitter atau panel2
        if (e.target === splitter || e.target === panel2 || panel2.contains(e.target)) {
            return; // Jangan deselect layer jika klik di area splitter atau panel2
        }

        // Jika klik bukan pada layer, splitter, atau panel2, maka deselect
        if (!e.target.closest('.layer')) {
            deselectLayer();
        }
    });

    // Tambahkan event listener untuk mencegah pointer-events pada panel2 ketika diseret penuh
    panel2.addEventListener('mousemove', function(e) {
        // Pastikan pointer-events tetap aktif saat panel2 penuh
        if (panel2.style.height === '100%') {
            panel2.style.pointerEvents = 'auto';
        }
    });

    // Listen untuk message dari iframe
    window.addEventListener('message', function(e) {
        if (e.data && e.data.type === 'originChanged') {
            console.log('Received originChanged message:', e.data);
            const { centered } = e.data;
            // Hitung offset berdasarkan panel1
            const panel1 = document.getElementById('panel1');
            if (panel1) {
                const centerX = panel1.offsetWidth / 2;
                const centerY = panel1.offsetHeight / 2;
                window.originCentered = centered;
                window.originOffsetX = centered ? centerX : 0;
                window.originOffsetY = centered ? centerY : 0;
                console.log('Offset set:', window.originOffsetX, window.originOffsetY);
                
                // Update semua layers
                layers.forEach(layer => {
                    if (layer.element && typeof layer.updateElement === 'function') {
                        layer.updateElement();
                    }
                });
            }
        }
    });
});

/**
 * Tambahkan click handler untuk layer agar bisa multi-select ketika selector aktif
 */
function addLayerClickHandler(layer) {
    if (!layer.element) return;
    
    layer.element.addEventListener('click', function(e) {
        // Jika selector aktif, tambah ke multi-selection
        if (window.__selectorActive) {
            e.stopPropagation();
            // Toggle selection pada layer ini
            if (layer.element.classList.contains('selected')) {
                layer.element.classList.remove('selected');
            } else {
                layer.element.classList.add('selected');
            }
            // Update visual feedback di panel3 dan panel2
            if (window.frameworkDisplay) {
                window.frameworkDisplay.updateSelectionVisuals();
            }
            // Update menulayer juga untuk multi-select
            updateMenuLayerSelectionForMultiSelect();
            return;
        }
        
        // Jika selector tidak aktif, gunakan single selection biasa
        selectLayer(layer);
        e.stopPropagation();
    });
}

/**
 * Update menulayer selection untuk multi-select mode
 */
function updateMenuLayerSelectionForMultiSelect() {
    if (!window.studioMenuLayer) return;
    
    const selectedElements = document.querySelectorAll('.layer.selected, .layer-group.selected');
    const menuItems = document.querySelectorAll('.menulayer-item');
    
    // Clear semua selection di menulayer
    menuItems.forEach(item => {
        item.classList.remove('selected');
    });
    
    // Tandai items yang match dengan selected elements
    selectedElements.forEach(selectedEl => {
        const layer = layers.find(l => l.element === selectedEl);
        if (layer) {
            for (const item of menuItems) {
                const nameEl = item.querySelector('.menulayer-name');
                if (nameEl && nameEl.textContent === layer.name) {
                    item.classList.add('selected');
                    break;
                }
            }
        }
    });
    
    // Sinkronisasi framework display untuk multi-select juga
    syncMultiSelectToFramework();
}

/**
 * Sinkronisasi multi-select state dengan framework display
 */
function syncMultiSelectToFramework() {
    if (!window.frameworkDisplay) return;
    
    const selectedElements = document.querySelectorAll('.layer.selected, .layer-group.selected');
    const frameworkCards = document.querySelectorAll('.framework-card');
    
    frameworkCards.forEach(card => {
        const labelEl = card.querySelector('.framework-label');
        if (!labelEl) return;
        
        const layerName = labelEl.textContent;
        let isSelected = false;
        
        // Check apakah layer ini selected
        for (const selectedEl of selectedElements) {
            const layer = layers.find(l => l.element === selectedEl);
            if (layer && layer.name === layerName) {
                isSelected = true;
                break;
            }
        }
        
        if (isSelected) {
            card.classList.add('framework-card-selected');
        } else {
            card.classList.remove('framework-card-selected');
        }
    });
}

/**
 * Panggil fungsi ini saat objek dipilih
 * @param {Layer} layer 
 */
function selectLayer(layer) {
    if(selected) {
        selected.selected = false;
    }

    layer.selected = true;
    selected = layer;
    window.selected = selected; // Make it globally accessible
    updateCoordInput();
    widthInput.value = selected.element.clientWidth;
    heightInput.value = selected.element.clientHeight;
    layerNameInput.value = selected.name;
    scaleInput.value = selected.scale;
    rotationControl.value = selected.rotation;
    flipHorizontal.checked = selected.isFlipX;
    flipVertical.checked = selected.isFlipY;
    rotationIndicator.innerText = selected.rotation;
    
    // Sinkronisasi selection di semua panel
    syncLayerSelectionAcrossAllPanels(layer);

    // Sync textshape if available
    if (window.textShapeManager && typeof window.textShapeManager.syncTextInputFromLayer === 'function') {
        console.log('selectLayer: Checking if layer is text layer:', layer.name);
        if (layer && window.textShapeManager.isTextLayer(layer)) {
            console.log('selectLayer: Is text layer, syncing input');
            window.textShapeManager.syncTextInputFromLayer(layer);
        } else {
            console.log('selectLayer: Not a text layer, resetting to create mode');
            window.textShapeManager.resetToCreateMode();
        }
    } else {
        console.warn('selectLayer: TextShapeManager not available');
    }

    // Dispatch event for textshape sync
    setTimeout(() => {
        document.dispatchEvent(new CustomEvent('layerSelected', { detail: { layer: layer } }));
    }, 100);
}

/**
 * Sinkronisasi layer selection di Panel1, Panel2, dan Panel3
 * @param {Layer} layer - Layer yang dipilih
 */
function syncLayerSelectionAcrossAllPanels(layer) {
    if (!layer || !layer.element) return;
    
    // 1. Update Panel1 visual (layer element classes)
    document.querySelectorAll('.layer.selected, .layer-group.selected').forEach(el => {
        if (el !== layer.element) {
            el.classList.remove('selected');
        }
    });
    layer.element.classList.add('selected');
    
    // 2. Update Panel2 visual (menulayer)
    if (window.studioMenuLayer) {
        const menuItems = document.querySelectorAll('.menulayer-item');
        const layerName = layer.name;
        
        // Remove selected dari semua items
        menuItems.forEach(item => {
            item.classList.remove('selected');
        });
        
        // Find dan select item dengan nama yang sesuai
        for (const item of menuItems) {
            const nameEl = item.querySelector('.menulayer-name');
            if (nameEl && nameEl.textContent === layerName) {
                item.classList.add('selected');
                window.studioMenuLayer.selectedLayer = item;
                break;
            }
        }
    }
    
    // 3. Update Panel3 visual (framework)
    if (window.frameworkDisplay) {
        window.frameworkDisplay.updateSelectionVisuals();
    }
}

function handleLayerName(value) {
    if (selected) {
        selected.name = value; // Mengubah nama layer
    }
}

// Panggil fungsi ini saat objek tidak dipilih lagi
function deselectLayer() {
    if(!selected) return;
    selected.selected = false;
    selected = null;
    window.selected = null; // Clear global reference
    
    // Sinkronisasi deselect di semua panel
    syncDeselectionAcrossAllPanels();

    // Reset textshape if available
    if (window.textShapeManager && typeof window.textShapeManager.resetToCreateMode === 'function') {
        window.textShapeManager.resetToCreateMode();
    }

    // Dispatch event for textshape reset
    setTimeout(() => {
        document.dispatchEvent(new CustomEvent('layerDeselected'));
    }, 100);
}

/**
 * Sinkronisasi deselection di Panel1, Panel2, dan Panel3
 */
function syncDeselectionAcrossAllPanels() {
    // 1. Clear Panel1 selection
    document.querySelectorAll('.layer.selected, .layer-group.selected').forEach(el => {
        el.classList.remove('selected');
    });
    
    // 2. Clear Panel2 (menulayer) selection
    if (window.studioMenuLayer) {
        const menuItems = document.querySelectorAll('.menulayer-item.selected');
        menuItems.forEach(item => {
            item.classList.remove('selected');
        });
        window.studioMenuLayer.selectedLayer = null;
    }
    
    // 3. Clear Panel3 (framework) selection
    if (window.frameworkDisplay) {
        const frameworkCards = document.querySelectorAll('.framework-card-selected');
        frameworkCards.forEach(card => {
            card.classList.remove('framework-card-selected');
        });
    }
}

/**
 * Helper function untuk update framework display setelah modifikasi layers
 */
function updateFrameworkDisplay() {
    if (window.frameworkDisplay) {
        window.frameworkDisplay.update(layers);
    }
}

function updateCoordInput() {
    xCoordInput.value = selected.x;
    yCoordInput.value = selected.y;
    skewXControl.value = selected.skewX || 0;
    skewXSlider.value = selected.skewX || 0;
    skewYControl.value = selected.skewY || 0;
    skewYSlider.value = selected.skewY || 0;
}

function handleXCoord(value) {
    if(!selected) return;
    selected.x = parseFloat(value);
    // Record history
    if (typeof window.HistoryManager !== 'undefined') {
        window.HistoryManager.recordAction('move', {
            layerName: selected.layerName || selected.name,
            x: selected.x,
            action: 'X Position changed'
        });
    }
};

function handleYCoord(value) {
    if(!selected) return;
    selected.y = parseFloat(value);
    // Record history
    if (typeof window.HistoryManager !== 'undefined') {
        window.HistoryManager.recordAction('move', {
            layerName: selected.layerName || selected.name,
            y: selected.y,
            action: 'Y Position changed'
        });
    }
};

function handleRotation(value) {
    if(!selected) return;
    selected.rotation = parseFloat(value);
    rotationIndicator.innerText = value;
    // Record history
    if (typeof window.HistoryManager !== 'undefined') {
        window.HistoryManager.recordAction('rotate', {
            layerName: selected.layerName || selected.name,
            rotation: selected.rotation,
            action: 'Rotated'
        });
    }
}

function handleSkewX(value) {
    if(!selected) return;
    const skewValue = parseFloat(value);
    selected.skewX = skewValue;
    
    // Update slider jika ada
    const slider = document.getElementById('skewXSlider');
    if (slider) slider.value = skewValue;
}

function handleSkewXSlider(value) {
    if(!selected) return;
    const skewValue = parseFloat(value);
    selected.skewX = skewValue;
    
    // Update text input
    const input = document.getElementById('skewXControl');
    if (input) input.value = skewValue;
}

function handleSkewY(value) {
    if(!selected) return;
    const skewValue = parseFloat(value);
    selected.skewY = skewValue;
    
    // Update slider jika ada
    const slider = document.getElementById('skewYSlider');
    if (slider) slider.value = skewValue;
}

function handleSkewYSlider(value) {
    if(!selected) return;
    const skewValue = parseFloat(value);
    selected.skewY = skewValue;
    
    // Update text input
    const input = document.getElementById('skewYControl');
    if (input) input.value = skewValue;
}

function handleScale(value) {
    if(!selected) return;
    selected.scale = parseFloat(value);
    scaleInput.innerText = value;
}

function handleFlipHorizontal(value) {
    if(!selected) return;
    selected.flipX = value;
}

function handleFlipVertical(value) {
    if(!selected) return;
    selected.flipY = value;
}

// Fungsi untuk mengatur ukuran layer (width atau height)
// Fungsi untuk mengatur ukuran layer (width atau height)
function updateLayerSize(dimension, value) {
    if (!selected) {
        console.warn("Tidak ada layer yang dipilih.");
        return;
    }

    value = parseFloat(value);
    
    // Pastikan value yang diberikan adalah angka valid
    if (isNaN(value)) {
        console.error("Nilai yang dimasukkan bukan angka.");
        return;
    }

    // Mengatur lebar atau tinggi dari layer yang dipilih
    if (dimension === 'width') {
        selected.width = value;
    } else if (dimension === 'height') {
        selected.height = value;
    } else {
        console.error("Dimensi tidak valid. Harus 'width' atau 'height'.");
        return;
    }

    // Pastikan `selected` adalah objek layer yang valid dengan properti `src`
    if (selected && selected.src && Array.isArray(selected.src)) {
        // Memanggil fungsi renderLayer untuk memperbarui tampilan
        renderLayer(selected);
    } else {
        console.error("Layer yang dipilih tidak memiliki properti `src` yang valid.");
    }
}

function moveLayerUp() {
    if (!selected) return;
    const currentIndex = layers.indexOf(selected);
    if (currentIndex < layers.length - 1) {
        const temp = layers[currentIndex];
        layers[currentIndex] = layers[currentIndex + 1];
        layers[currentIndex + 1] = temp;
        renderLayer();
    }
}

function moveLayerDown() {
    if (!selected) return;
    const currentIndex = layers.indexOf(selected);
    if (currentIndex > 0) {
        const temp = layers[currentIndex];
        layers[currentIndex] = layers[currentIndex - 1];
        layers[currentIndex - 1] = temp;
        renderLayer();
    }
}

function renderLayer(layer) {
    const container = document.getElementById('panel1') || document.querySelector('.container'); // Container tempat layer ditampilkan

    if (!container) {
        console.error('Container not found for rendering');
        return;
    }

    if (!layer) {
        // Render all layers by reordering
        layers.forEach(l => {
            if (l.element.parentElement !== container) {
                container.appendChild(l.element);
            }
        });
    } else {
        if (layer.element.parentElement !== container) {
            container.appendChild(layer.element);
        }

        // Ensure layer.element is attached to container if not already
        if (!container.contains(layer.element)) {
            container.appendChild(layer.element);
        }
    }
    
    // Update framework display otomatis setiap kali layer di-render
    updateFrameworkDisplay();
}

// ------------------ Group / Duplicate / Copy / Delete helpers ------------------
const clipboardLayers = [];

/**
 * Gabung multiple layers dengan mengambil src mereka
 * Src akan diurutkan berdasarkan posisi Y (tinggi-rendah)
 * Layer name diambil dari layer yang paling atas (Y paling kecil)
 * 
 * Contoh:
 * Sebelum (multi-select):
 *   - Head (Y: 50, src: head.svg)
 *   - Torso (Y: 100, src: torso.svg)
 *   - Legs (Y: 150, src: legs.svg)
 * 
 * Sesudah (klik "Gabung Src"):
 *   - Head (src: [head.svg, torso.svg, legs.svg])
 */
function mergeSelectedLayersSrc() {
  // Ambil semua selected layers dari DOM
  const selectedElements = document.querySelectorAll('.layer.selected');
  const layersToMerge = [];
  
  selectedElements.forEach(el => {
    const layer = layers.find(l => l.element === el);
    if (layer) layersToMerge.push(layer);
  });

  if (layersToMerge.length < 2) {
    console.warn('Please select at least 2 layers to merge');
    return;
  }

  const container = document.getElementById('panel1') || document.querySelector('.container');

  // Sort layers berdasarkan Y position (tinggi-rendah)
  const sortedLayers = [...layersToMerge].sort((a, b) => a.y - b.y);

  // Layer pertama (paling atas) menjadi base
  const baseLayer = sortedLayers[0];
  const baseIndex = layers.indexOf(baseLayer);

  // Kumpulkan semua src dari semua layers
  const allSrcs = [];
  sortedLayers.forEach(layer => {
    const imgs = Array.from(layer.element.querySelectorAll('img'));
    imgs.forEach(img => {
      if (img.src && !allSrcs.includes(img.src)) {
        allSrcs.push(img.src);
      }
    });
  });

  if (allSrcs.length === 0) return;

  // Create merged layer dengan semua src
  const mergedLayer = new Layer(baseLayer.name, allSrcs, {
    x: baseLayer.x,
    y: baseLayer.y
  }, []);

  // Replace base layer dengan merged layer
  if (baseIndex !== -1) {
    layers[baseIndex] = mergedLayer;
  } else {
    layers.push(mergedLayer);
  }

  // Hapus layer lain yang di-merge
  sortedLayers.slice(1).forEach(layer => {
    const idx = layers.indexOf(layer);
    if (idx !== -1) layers.splice(idx, 1);
  });

  // Detach semua dan attach merged layer
  sortedLayers.forEach(layer => layer.detach());
  mergedLayer.attach(container, onlayerdragstart);
  addLayerClickHandler(mergedLayer);

  selectLayer(mergedLayer);
  renderLayer();
}

/**
 * Reset studio - refresh halaman untuk re-init dengan template layers
 * Menampilkan dialog konfirmasi terlebih dahulu
 */
function resetStudio() {
  // Buat HTML untuk dialog dengan Ya/Tidak buttons
  const dialogHTML = `
    <div style="padding: 20px; text-align: center;">
      <p style="font-size: 16px; margin: 15px 0;">
        <strong>Apakah anda yakin untuk merapihkan ulang studio? 😢</strong>
      </p>
      <p style="font-size: 14px; margin: 15px 0; color: #666;">
        Progress kerjamu akan hilang untuk karakter ini TwT
      </p>
      <p style="font-size: 12px; margin: 20px 0; color: #999;">
        Studio akan di-refresh dan template layers akan di-load ulang
      </p>
    </div>
  `;

  // Create footer buttons separately to avoid windowId reference before initialization
  const footerHTML = `
    <button class="footer-btn" style="background-color: #ff6b6b; color: white;" onclick="confirmResetStudio();">
      Ya, Hapus Semua
    </button>
    <button class="footer-btn" onclick="window.closeWindow(window.__resetWindowId);">
      Batal
    </button>
  `;

  const windowId = openWindow({
    title: 'Reset Studio',
    content: dialogHTML,
    footer: footerHTML,
    width: '400px',
    height: 'auto'
  });

  // Store windowId globally so buttons can access it
  window.__resetWindowId = windowId;
}

/**
 * Konfirmasi reset studio - refresh halaman
 */
function confirmResetStudio() {
  console.log('Resetting studio...');
  // Close the dialog window
  if (window.__resetWindowId) {
    window.closeWindow(window.__resetWindowId);
  }
  // Refresh halaman untuk re-init semua
  window.location.reload();
}

/**
 * Pisahkan single layer dengan multiple src menjadi multiple separate layers
 * Setiap src akan menjadi layer baru terpisah di root level
 * 
 * Contoh:
 * Sebelum: Kepala (src: [head1.svg, head2.svg, head3.svg])
 * Sesudah: 
 *   - Kepala_0 (src: head1.svg)
 *   - Kepala_1 (src: head2.svg)
 *   - Kepala_2 (src: head3.svg)
 */
function ungroupSrcLayers() {
  if (!selected) return;
  
  const imgs = Array.from(selected.element.querySelectorAll('img'));
  if (imgs.length <= 1) {
    console.warn('Layer has only one source, cannot ungroup');
    return;
  }

  const container = document.getElementById('panel1') || document.querySelector('.container');
  const originalLayer = selected;
  const baseX = originalLayer.x;
  const baseY = originalLayer.y;
  const originalIndex = layers.indexOf(originalLayer);
  const originalName = originalLayer.name;

  // Create separate layers untuk setiap src
  const newLayers = imgs.map((img, idx) => {
    const newLayerName = `${originalName}_${idx}`;
    const newLayer = new Layer(newLayerName, [img.src], {
      x: baseX,
      y: baseY
    }, []);
    return newLayer;
  });

  // Hapus original layer dari layers array
  if (originalIndex !== -1) {
    layers.splice(originalIndex, 1);
  }

  // Tambah semua layer baru di posisi original
  newLayers.forEach((layer, idx) => {
    layers.splice(originalIndex + idx, 0, layer);
  });

  // Detach original dan attach semua layer baru
  originalLayer.detach();
  newLayers.forEach(layer => {
    layer.attach(container, onlayerdragstart);
    addLayerClickHandler(layer);
  });

  // Select layer pertama
  selectLayer(newLayers[0]);
  renderLayer();
}

/**
 * Wrap selected layer(s) dalam group baru
 * Bisa handle single selection atau multi-selection dari selector
 */
function groupSelectedLayer() {
  const container = document.getElementById('panel1') || document.querySelector('.container');
  
  // Cek apakah ada multi-selection dari selector
  const selectedElements = document.querySelectorAll('.layer.selected');
  const layersToGroup = [];
  
  if (selectedElements.length > 1) {
    // Multi-select dari selector: kumpulkan semua selected layers
    selectedElements.forEach(el => {
      const layer = layers.find(l => l.element === el);
      if (layer) layersToGroup.push(layer);
    });
  } else if (selected) {
    // Single select: gunakan selected variable
    layersToGroup.push(selected);
  } else {
    return;
  }

  if (layersToGroup.length === 0) return;

  // Hitung min position
  const minX = Math.min(...layersToGroup.map(l => l.x));
  const minY = Math.min(...layersToGroup.map(l => l.y));

  // Reset posisi relative terhadap group
  const childrenForGroup = layersToGroup.map(layer => {
    layer.x -= minX;
    layer.y -= minY;
    return layer;
  });

  // Detach semua
  childrenForGroup.forEach(l => l.detach());

  // Create group
  const groupLayer = new Layer('Group', [], {
    x: minX,
    y: minY
  }, childrenForGroup);

  // Update layers array: hapus children, tambah group
  const firstIndex = layers.indexOf(layersToGroup[0]);
  layersToGroup.forEach(layer => {
    const idx = layers.indexOf(layer);
    if (idx !== -1) layers.splice(idx, 1);
  });
  
  if (firstIndex !== -1) {
    layers.splice(firstIndex, 0, groupLayer);
  } else {
    layers.push(groupLayer);
  }

  // Attach group
  groupLayer.attach(container, onlayerdragstart);
  selectLayer(groupLayer);
  renderLayer();
}

/**
 * Ungroup: keluar satu level dari hierarchy
 * Jika selected adalah group, ambil childLayers dan pindahkan ke parent level
 */
function ungroupSelectedLayer() {
  if (!selected || !selected.childLayers || selected.childLayers.length === 0) {
    console.warn('Selected layer is not a group, try ungroupSrcLayers() instead');
    return;
  }

  const container = document.getElementById('panel1') || document.querySelector('.container');
  const groupLayer = selected;
  const groupIndex = layers.indexOf(groupLayer);
  const groupX = groupLayer.x;
  const groupY = groupLayer.y;

  // Ambil semua child dan hitung posisi absolutnya
  const childrenToAdd = [];
  groupLayer.childLayers.forEach(child => {
    child.x += groupX;  // Posisi absolute
    child.y += groupY;
    childrenToAdd.push(child);
  });

  // Detach group
  groupLayer.detach();

  // Hapus group dari layers
  if (groupIndex !== -1) {
    layers.splice(groupIndex, 1);
  }

  // Add semua children ke layers di posisi group yang lama
  childrenToAdd.forEach((child, idx) => {
    layers.splice(groupIndex + idx, 0, child);  // Insert di posisi original
    child.attach(container, onlayerdragstart);
  });

  deselectLayer();
  renderLayer();
}

function deleteSelectedLayer() {
  if (!selected) return;
  const layerName = selected.layerName || selected.name;
  const idx = layers.indexOf(selected);
  if (idx !== -1) layers.splice(idx, 1);
  selected.detach();
  selected = null;
  
  // Record history
  if (typeof window.HistoryManager !== 'undefined') {
    window.HistoryManager.recordAction('delete', {
      layerName: layerName,
      action: 'Layer deleted'
    });
  }
}

function duplicateSelectedLayers() {
  if (!selected) return;
  const container = document.getElementById('panel1') || document.querySelector('.container');
  
  // Collect img srcs from DOM
  const imgs = Array.from(selected.element.querySelectorAll('img'));
  const srcClone = imgs.map(i => i.src);
  const newLayer = new Layer(selected.name + '_copy', srcClone, {
    x: selected.x,
    y: selected.y,
    rotation: selected.rotation,
    scale: selected.scale,
    flipX: selected.isFlipX,
    flipY: selected.isFlipY,
    width: selected.width,
    height: selected.height
  });
  layers.push(newLayer);
  newLayer.attach(container, onlayerdragstart);
  renderLayer(newLayer);
  
  // Record history
  if (typeof window.HistoryManager !== 'undefined') {
    window.HistoryManager.recordAction('duplicate', {
      layerName: newLayer.name,
      originalName: selected.name,
      action: 'Layer duplicated'
    });
  }
}

function copySelectedLayers() {
  if (!selected) return;
  clipboardLayers.length = 0;
  
  const imgs = Array.from(selected.element.querySelectorAll('img'));
  const src = imgs.map(i => i.src);
  clipboardLayers.push({
    name: selected.name,
    src: src,
    options: {
      x: selected.x,
      y: selected.y,
      rotation: selected.rotation,
      scale: selected.scale,
      flipX: selected.isFlipX,
      flipY: selected.isFlipY,
      width: selected.width,
      height: selected.height
    }
  });
}

function pasteCopiedLayers() {
  if (!clipboardLayers.length) return;
  const container = document.getElementById('panel1') || document.querySelector('.container');
  clipboardLayers.forEach(data => {
    const newLayer = new Layer(data.name + '_paste', data.src.slice(), data.options || {});
    layers.push(newLayer);
    newLayer.attach(container, onlayerdragstart);
    renderLayer(newLayer); // Render the new layer
    
    // Record history
    if (typeof window.HistoryManager !== 'undefined') {
      window.HistoryManager.recordAction('paste', {
        layerName: newLayer.name,
        originalName: data.name,
        action: 'Layer pasted'
      });
    }
  });
}

/**
 * Buka settings window menggunakan openWindow() dari windowhandler.js
 * Ini adalah alternative ke pause menu, bisa dipanggil dari ESC atau back button
 */
function openSettingsWindow() {
  // Check if windowhandler is available
  if (typeof window.openWindow !== 'function') {
    console.error('studiopose.js: windowhandler.js API not loaded');
    return;
  }

  // Create HTML content for settings (same as pausestudio.js)
  var settingsContent = `
    <div class="content">
      <div class="setting-section">
        <div class="setting-title">⚙️ Audio Settings</div>
        <div class="switch">
          <label class="slider-label">BGM Enabled</label>
          <label class="toggle-switch">
            <input type="checkbox" id="bgmSwitch">
            <span class="slider-switch"></span>
          </label>
        </div>
        <div class="slider-container">
          <label class="slider-label">Master Volume</label>
          <input type="range" id="masterVolumeSlider" class="custom-slider" min="0" max="100" value="50">
          <span id="masterVolumePercentage" class="percentage">50%</span>
        </div>
        <div class="slider-container">
          <label class="slider-label">BGM Volume</label>
          <input type="range" id="bgmVolumeSlider" class="custom-slider" min="0" max="100" value="50">
          <span id="bgmVolumePercentage" class="percentage">50%</span>
        </div>
        <div class="slider-container">
          <label class="slider-label">SFX Volume</label>
          <input type="range" id="sfxVolumeSlider" class="custom-slider" min="0" max="100" value="50">
          <span id="sfxVolumePercentage" class="percentage">50%</span>
        </div>
        <div class="slider-container">
          <label class="slider-label">UI Volume</label>
          <input type="range" id="uiVolumeSlider" class="custom-slider" min="0" max="100" value="50">
          <span id="uiVolumePercentage" class="percentage">50%</span>
        </div>
        <div id="studioAudioBGMControls" class="bgm-controls">
          <button id="prevStudioAudioBGM" style="padding: 8px 12px; cursor: pointer;">⏮️ Previous</button>
          <span id="studioAudioBGMTitle" style="margin: 0 20px; flex-grow: 1; text-align: center;">Loading...</span>
          <button id="nextStudioAudioBGM" style="padding: 8px 12px; cursor: pointer;">Next ⏭️</button>
        </div>
        
        <div style="width: 100%; text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ccc;">
          <button id="exitStudioBtn" style="background-color: #ff6b6b; color: white; padding: 12px 24px; border: none; border-radius: 5px; cursor: pointer; font-size: 14px; font-weight: bold;">
            🚪 Keluar dari Studio
          </button>
        </div>
      </div>
    </div>
  `;

  // Generate unique window ID
  var windowId = 'settingsWindow_' + Date.now();

  // Create settings window using windowhandler API
  openWindow({
    title: '🎵 Studio Settings',
    content: settingsContent,
    footer: `<button class="footer-btn" onclick="window.closeWindow('${windowId}')" style="width:100%;padding:10px;cursor:pointer;">Close</button>`,
    width: '55%',
    height: 'auto'
  });

  // Store window ID globally so buttons can close it
  window.__studioSettingsWindowId = windowId;

  // Set slider values from current settings
  setTimeout(() => {
    if (window.AudioSettings) {
      document.getElementById('masterVolumeSlider').value = Math.round(window.AudioSettings.masterVolume * 100);
      document.getElementById('bgmVolumeSlider').value = Math.round(window.AudioSettings.bgmVolume * 100);
      document.getElementById('sfxVolumeSlider').value = Math.round(window.AudioSettings.sfxVolume * 100);
      document.getElementById('uiVolumeSlider').value = Math.round(window.AudioSettings.uiVolume * 100);
      document.getElementById('bgmSwitch').checked = !!window.AudioSettings.bgmEnabled;
      
      // Update percentage displays
      document.getElementById('masterVolumePercentage').textContent = Math.round(window.AudioSettings.masterVolume * 100) + '%';
      document.getElementById('bgmVolumePercentage').textContent = Math.round(window.AudioSettings.bgmVolume * 100) + '%';
      document.getElementById('sfxVolumePercentage').textContent = Math.round(window.AudioSettings.sfxVolume * 100) + '%';
      document.getElementById('uiVolumePercentage').textContent = Math.round(window.AudioSettings.uiVolume * 100) + '%';
    }

    // Attach event listeners
    document.getElementById('masterVolumeSlider')?.addEventListener('input', function(e) {
      var val = e.target.value / 100;
      window.AudioSettings.masterVolume = val;
      document.getElementById('masterVolumePercentage').textContent = Math.round(val * 100) + '%';
      broadcastAudioSettings();
    });

    document.getElementById('bgmVolumeSlider')?.addEventListener('input', function(e) {
      var val = e.target.value / 100;
      window.AudioSettings.bgmVolume = val;
      document.getElementById('bgmVolumePercentage').textContent = Math.round(val * 100) + '%';
      broadcastAudioSettings();
    });

    document.getElementById('sfxVolumeSlider')?.addEventListener('input', function(e) {
      var val = e.target.value / 100;
      window.AudioSettings.sfxVolume = val;
      document.getElementById('sfxVolumePercentage').textContent = Math.round(val * 100) + '%';
      broadcastAudioSettings();
    });

    document.getElementById('uiVolumeSlider')?.addEventListener('input', function(e) {
      var val = e.target.value / 100;
      window.AudioSettings.uiVolume = val;
      document.getElementById('uiVolumePercentage').textContent = Math.round(val * 100) + '%';
      broadcastAudioSettings();
    });

    document.getElementById('bgmSwitch')?.addEventListener('change', function(e) {
      window.AudioSettings.bgmEnabled = !!e.target.checked;
      broadcastAudioSettings();
    });

    // BGM navigation
    document.getElementById('prevStudioAudioBGM')?.addEventListener('click', function() {
      document.dispatchEvent(new CustomEvent('changeStudioBGM', { detail: { direction: 'prev' } }));
      updateStudioBGMTitleInSettings();
    });

    document.getElementById('nextStudioAudioBGM')?.addEventListener('click', function() {
      document.dispatchEvent(new CustomEvent('changeStudioBGM', { detail: { direction: 'next' } }));
      updateStudioBGMTitleInSettings();
    });

    // Exit studio button
    document.getElementById('exitStudioBtn')?.addEventListener('click', function() {
      console.log('studiopose.js: Exit studio button clicked');
      if (typeof window.openExitStudioDialog === 'function') {
        window.openExitStudioDialog();
      }
    });

    // Update BGM title
    updateStudioBGMTitleInSettings();
  }, 50);
}

/**
 * Helper function untuk update studio BGM title di settings window
 */
function updateStudioBGMTitleInSettings() {
  try {
    if (typeof window.studioBGMList !== 'undefined' && window.currentStudioBGMIndex !== undefined) {
      var title = document.getElementById('studioAudioBGMTitle');
      if (title) {
        title.textContent = window.studioBGMList[window.currentStudioBGMIndex][1] || 'Loading...';
      }
    }
  } catch (e) {
    console.warn('studiopose.js: Could not update studio BGM title', e);
  }
}

/**
 * Helper function untuk broadcast audio settings
 */
function broadcastAudioSettings() {
  if (!window.AudioSettings) return;
  localStorage.setItem('masterVolume', window.AudioSettings.masterVolume);
  localStorage.setItem('bgmVolume', window.AudioSettings.bgmVolume);
  localStorage.setItem('sfxVolume', window.AudioSettings.sfxVolume);
  localStorage.setItem('uiVolume', window.AudioSettings.uiVolume);
  localStorage.setItem('bgmEnabled', window.AudioSettings.bgmEnabled);
  document.dispatchEvent(new CustomEvent('audioSettingsChanged', { 
    detail: Object.assign({}, window.AudioSettings) 
  }));
}

/**
 * Buka dialog konfirmasi keluar dari studio
 */
function openExitStudioDialog() {
  if (typeof window.openWindow !== 'function') {
    console.error('studiopose.js: windowhandler.js API not loaded');
    return;
  }

  var exitDialogContent = `
    <div style="padding: 20px; text-align: center;">
      <p style="font-size: 16px; margin: 15px 0; color: #333;">
        <strong>Kamu yakin ingin keluar dari studio, segala tindakan progress mu akan hilang selamanya gabisa dikembalikan?, jangan lupa simpan :3</strong>
      </p>
      <p style="font-size: 14px; margin: 20px 0; color: #666;">
        ⚠️ Semua perubahan yang belum disimpan akan hilang
      </p>
    </div>
  `;

  var exitWindowId = openWindow({
    title: 'Apakah Kamu Ingin Keluar dari Studio Karakter?',
    content: exitDialogContent,
    footer: `
      <button style="background-color: #ff6b6b; color: white; padding: 10px 20px; border: none; cursor: pointer; margin-right: 10px; border-radius: 5px; font-weight: bold;" 
              onclick="confirmExitStudio(); window.closeWindow(window.__exitStudioWindowId);">
        Iya deh, aku keluar
      </button>
      <button style="background-color: #5E6CC9; color: white; padding: 10px 20px; border: none; cursor: pointer; border-radius: 5px; font-weight: bold;" 
              onclick="window.closeWindow(window.__exitStudioWindowId);">
        Gak jadi keluar aku
      </button>
    `,
    width: '55%',
    height: 'auto'
  });

  window.__exitStudioWindowId = exitWindowId;
}

/**
 * Confirm exit studio - navigate back to mainmenu
 */
function confirmExitStudio() {
  console.log('studiopose.js: Confirming exit from studio');
  
  // Stop studio BGM
  if (typeof window.stopStudioBGMWithFade === 'function') {
    try {
      window.stopStudioBGMWithFade(500);
    } catch (e) {
      console.warn('studiopose.js: Could not stop BGM', e);
    }
  }

  // Dispatch exit event
  try {
    document.dispatchEvent(new Event('studioExit'));
  } catch (e) {}

  // Navigate back to mainmenu
  setTimeout(() => {
    // Method 1: Using history.back() if available
    if (window.history && window.history.back) {
      window.history.back();
    } 
    // Method 2: Navigate to mainmenu.html
    else if (window.location) {
      window.location.href = 'mainmenu.html';
    }
  }, 500);
}