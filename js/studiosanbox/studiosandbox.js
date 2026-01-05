//  -------------------Gacha Design Studio--------------------  //
//  Created by: Archana Berry                                   //
//  Assets credits: Lunime, OGL (Open Game License), MIT CC     //
//  Version resource: v0.001_alpha                              //
//  File: studiosandbox.js                                      //
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

// Fungsi untuk membuat instance Layer dari objek JSON
function createLayerFromObject(layerObj) {
    const layers = [];
    const { layerName, src = [], options = {}, childLayers = [] } = layerObj;

    // Buat instance Layer
    const layer = new Layer(layerName, src, options);

    // Jika ada childLayers, buat juga instance-nya
    if (childLayers.length > 0) {
        layer.childLayers = childLayers.map(createLayerFromObject);
    }

    return layer;
}

const layers = [].map(createLayerFromObject);

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
    const container = document.querySelector('.container');
    for (const layer of layers) {
        layer.attach(container, onlayerdragstart);
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
    const container = document.getElementById('container'); // Container tempat layer ditampilkan

    // Hapus elemen layer sebelumnya untuk mencegah duplikasi
    const existingElements = document.querySelectorAll(`[data-layer-name="${layer.layerName}"]`);
    existingElements.forEach(el => el.remove());

    // Pastikan src ada dan merupakan array
    if (Array.isArray(layer.src)) {
        // Render ulang semua elemen dalam src
        layer.src.forEach((src, index) => {
            const imgElement = document.createElement('img');
            imgElement.src = src;
            imgElement.dataset.layerName = layer.layerName; // Tandai elemen ini sebagai bagian dari layer
            imgElement.id = `layer-${layer.layerName}-${index}`; // ID unik untuk setiap elemen

            // Terapkan properti layer ke elemen gambar
            imgElement.style.position = 'absolute';
            imgElement.style.left = `${layer.x}px`;
            imgElement.style.top = `${layer.y}px`;
            imgElement.style.width = `${layer.width}px`;
            imgElement.style.height = `${layer.height}px`;
            imgElement.style.transform = `
                rotate(${layer.rotation}deg)
                scale(${layer.scaleX}, ${layer.scaleY})
            `;
            imgElement.style.transformOrigin = 'center center';

            // Tambahkan elemen gambar ke container
            container.appendChild(imgElement);
        });
    } else {
        console.error("Layer tidak memiliki array `src` yang valid.");
    }
}

// ------------------ Group / Duplicate / Copy / Delete helpers (sandbox) ------------------
const clipboardLayers_sandbox = [];

function getLayerInstanceFromElement_sandbox(el) {
    return layers.find(l => l.element === el);
}

function getSelectedLayerElements_sandbox() {
    return Array.from(document.querySelectorAll('.layer.selected'));
}

function groupSelectedLayers() {
    const selectedEls = getSelectedLayerElements_sandbox();
    if (!selectedEls.length) return;
    const container = document.querySelector('.container');
    const group = document.createElement('div');
    group.classList.add('layer-group');
    group.dataset.groupName = `Group${Date.now()}`;
    selectedEls.forEach(el => group.appendChild(el));
    container.appendChild(group);
}

function ungroupSelectedLayers() {
    const selectedGroups = Array.from(document.querySelectorAll('.layer-group.selected, .layer-group'));
    if (!selectedGroups.length) return;
    const container = document.querySelector('.container');
    selectedGroups.forEach(group => {
        while (group.firstChild) container.appendChild(group.firstChild);
        group.remove();
    });
}

function deleteSelectedLayer() {
    const selectedEls = getSelectedLayerElements_sandbox();
    if (!selectedEls.length) return;
    selectedEls.forEach(el => {
        const inst = getLayerInstanceFromElement_sandbox(el);
        if (inst) {
            const idx = layers.indexOf(inst);
            if (idx !== -1) layers.splice(idx, 1);
        }
        el.remove();
    });
    selected = null;
}

function duplicateSelectedLayers() {
    const selectedEls = getSelectedLayerElements_sandbox();
    if (!selectedEls.length) return;
    const container = document.querySelector('.container');
    selectedEls.forEach(el => {
        const inst = getLayerInstanceFromElement_sandbox(el);
        if (!inst) return;
        const imgs = Array.from(inst.element.querySelectorAll('img'));
        const srcClone = imgs.map(i => i.src);
        const newLayer = new Layer(inst.name + '_copy', srcClone, {}, []);
        layers.push(newLayer);
        newLayer.attach(container, onlayerdragstart);
    });
}

function copySelectedLayers() {
    const selectedEls = getSelectedLayerElements_sandbox();
    clipboardLayers_sandbox.length = 0;
    selectedEls.forEach(el => {
        const inst = getLayerInstanceFromElement_sandbox(el);
        if (!inst) return;
        const imgs = Array.from(inst.element.querySelectorAll('img'));
        const src = imgs.map(i => i.src);
        clipboardLayers_sandbox.push({ name: inst.name, src: src, options: {} });
    });
}

function pasteCopiedLayers() {
    if (!clipboardLayers_sandbox.length) return;
    const container = document.querySelector('.container');
    clipboardLayers_sandbox.forEach(data => {
        const newLayer = new Layer(data.name + '_paste', data.src.slice(), data.options || {});
        layers.push(newLayer);
        newLayer.attach(container, onlayerdragstart);
    });
}