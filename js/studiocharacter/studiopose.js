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

const layers = [
    // lapisan //
    // Tangan kanan
    {
      "layerName": "Lengan atas kanan",
      "src": [
        "assets/character/base/arm1.svg",
        "assets/character/base/arm2.svg"
      ],
      "options": {
        "flipX": true,
        //"color": "#ff0000"
      }
    },
    {
      "layerName": "Lengan bawah kanan",
      "src": [
        "assets/character/base/hand1.svg",
        "assets/character/base/hand2.svg"
      ],
      "options": {
        "flipX": true
      }
    },
    {
      "layerName": "Tangan kanan",
      "src": [
        "assets/character/base/finger3.svg",
        "assets/character/base/finger4.svg"
      ],
      "options": {
        "flipX": true
      }
    },
  
    // Kaki kanan
    {
      "layerName": "Paha atas kanan",
      "src": [
        "assets/character/base/leg1.svg",
        "assets/character/base/leg2.svg"
      ],
      "options": {
        "flipX": true
      }
    },
    {
      "layerName": "Kaki kanan",
      "src": [
        "assets/character/base/foot1.svg",
        "assets/character/base/foot2.svg"
      ],
      "options": {
        "flipX": true
      }
    },
  
    // Kepala
    {
      "layerName": "Badan",
      "src": [
        "assets/character/base/body1.svg",
        "assets/character/base/body2.svg"
      ],
      "options": {}
    },
  
    // Badan
    {
      "layerName": "Kepala",
      "src": [
        "assets/character/base/head1.svg",
        "assets/character/base/head2.svg"
      ],
      "options": {}
    },
  
    // Tangan kiri
    {
      "layerName": "Lengan atas kiri",
      "src": [
        "assets/character/base/arm1.svg",
        "assets/character/base/arm2.svg"
      ],
      "options": {}
    },
    {
      "layerName": "Lengan bawah kiri",
      "src": [
        "assets/character/base/hand1.svg",
        "assets/character/base/hand2.svg"
      ],
      "options": {}
    },
    {
      "layerName": "Tangan kiri",
      "src": [
        "assets/character/base/finger1.svg",
        "assets/character/base/finger2.svg"
      ],
      "options": {}
    },
  
    // Kaki kiri
    {
      "layerName": "Paha atas kiri",
      "src": [
        "assets/character/base/leg1.svg",
        "assets/character/base/leg2.svg"
      ],
      "options": {}
    },
    {
      "layerName": "Kaki kiri",
      "src": [
        "assets/character/base/foot1.svg",
        "assets/character/base/foot2.svg"
      ],
      "options": {}
    }
    // lapisan //
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
const splitter = document.getElementById('splitter');
const panel1 = document.getElementById('panel1');
const panel2 = document.getElementById('panel2');
const splitterHeight = splitter.offsetHeight;

/**
 * @param {Event} e
 * @param {Layer} layer 
 */
function onlayerdragstart(e, layer) {
    // Mendapatkan koordinat awal mouse/jari
    if(e.targetTouches) {
        initialX = e.targetTouches[0].clientX;
        initialY = e.targetTouches[0].clientY;
    } else {
        initialX = e.clientX;
        initialY = e.clientY;
    }

    // Menandai layer yang dipilih
    selectLayer(layer);

    // Menambahkan event listener untuk mengikuti pergerakan mouse/jari
    document.addEventListener('mousemove', onlayerdrag);
    document.addEventListener('mouseup', onlayerdragend);
    document.addEventListener('touchmove', onlayerdrag);
    document.addEventListener('touchend', onlayerdragend);
}

function onlayerdrag(e) {
    // Koordinat mouse/jari
    let px, py;
    if(e.targetTouches) {
        px = e.targetTouches[0].clientX;
        py = e.targetTouches[0].clientY;
    } else {
        px = e.clientX;
        py = e.clientY;
    }

    let dx = px - initialX;
    let dy = py - initialY;

    // Memperbarui koordinat elemen gambar
    selected.x += dx;
    selected.y += dy;

    updateCoordInput();

    // Memperbarui koordinat awal mouse
    initialX = px;
    initialY = py;
}

function onlayerdragend(e) {
    // Menghapus event listener setelah selesai drag
    document.removeEventListener('mousemove', onlayerdrag);
    document.removeEventListener('mouseup', onlayerdragend);
    document.removeEventListener('touchmove', onlayerdrag);
    document.removeEventListener('touchend', onlayerdragend);
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
            return;
        }
        
        // Jika selector tidak aktif, gunakan single selection biasa
        selectLayer(layer);
        e.stopPropagation();
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
    updateCoordInput();
    widthInput.value = selected.element.clientWidth;
    heightInput.value = selected.element.clientHeight;
    layerNameInput.value = selected.name;
    scaleInput.value = selected.scale;
    rotationControl.value = selected.rotation;
    flipHorizontal.checked = selected.isFlipX;
    flipVertical.checked = selected.isFlipY;
    rotationIndicator.innerText = selected.rotation;
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
};

function handleYCoord(value) {
    if(!selected) return;
    selected.y = parseFloat(value);
};

function handleRotation(value) {
    if(!selected) return;
    selected.rotation = parseFloat(value);
    rotationIndicator.innerText = value;
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
        return;
    }

    if (layer.element.parentElement !== container) {
        container.appendChild(layer.element);
    }

    // Ensure layer.element is attached to container if not already
    if (!container.contains(layer.element)) {
        container.appendChild(layer.element);
    }
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
  const idx = layers.indexOf(selected);
  if (idx !== -1) layers.splice(idx, 1);
  selected.detach();
  selected = null;
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