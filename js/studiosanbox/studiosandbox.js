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
    const selectedEls = getSelectedLayerElements();
    if (!selectedEls.length) return;
    // Move each selected layer up in the layers array
    selectedEls.forEach(el => {
        const inst = getLayerInstanceFromElement(el);
        if (!inst) return;
        const currentIndex = layers.indexOf(inst);
        if (currentIndex < layers.length - 1) {
            const temp = layers[currentIndex];
            layers[currentIndex] = layers[currentIndex + 1];
            layers[currentIndex + 1] = temp;
        }
    });
    renderLayer();
}

function moveLayerDown() {
    const selectedEls = getSelectedLayerElements();
    if (!selectedEls.length) return;
    // Move each selected layer down in the layers array
    selectedEls.forEach(el => {
        const inst = getLayerInstanceFromElement(el);
        if (!inst) return;
        const currentIndex = layers.indexOf(inst);
        if (currentIndex > 0) {
            const temp = layers[currentIndex];
            layers[currentIndex] = layers[currentIndex - 1];
            layers[currentIndex - 1] = temp;
        }
    });
    renderLayer();
}

function renderLayer(layer) {
    const container = document.querySelector('.container') || document.getElementById('panel1'); // Container tempat layer ditampilkan

    if (!container) {
        console.error('Container not found for rendering');
        return;
    }

    if (!layer) {
        // Render all layers
        layers.forEach(l => renderLayer(l));
        return;
    }

    // Hapus elemen layer sebelumnya untuk mencegah duplikasi
    const existingElements = document.querySelectorAll(`[data-layer-name="${layer.name}"]`);
    existingElements.forEach(el => el.remove());

    // Pastikan src ada dan merupakan array
    if (Array.isArray(layer.src)) {
        // Render ulang semua elemen dalam src
        layer.src.forEach((src, index) => {
            const imgElement = document.createElement('img');
            imgElement.src = src;
            imgElement.dataset.layerName = layer.name; // Tandai elemen ini sebagai bagian dari layer
            imgElement.id = `layer-${layer.name}-${index}`; // ID unik untuk setiap elemen

            // Terapkan properti layer ke elemen gambar
            imgElement.style.position = 'absolute';
            imgElement.style.left = `${layer.x}px`;
            imgElement.style.top = `${layer.y}px`;
            imgElement.style.width = `${layer.width}px`;
            imgElement.style.height = `${layer.height}px`;
            imgElement.style.transform = `
                rotate(${layer.rotation}deg)
                scale(${layer.scale}, ${layer.scale})
            `;
            imgElement.style.transformOrigin = 'center center';

            // Tambahkan elemen gambar ke layer.element
            layer.element.appendChild(imgElement);
        });

        // Set z-index on the layer element based on order
        layer.element.style.zIndex = layers.indexOf(layer) + 1;

        // Ensure layer.element is attached to container if not already
        if (!container.contains(layer.element)) {
            container.appendChild(layer.element);
        }
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
    const container = document.getElementById('panel1') || document.querySelector('.container');
    const selectedLayers = selectedEls.map(el => getLayerInstanceFromElement_sandbox(el)).filter(l => l);
    if (!selectedLayers.length) return;

    // Detach selected layers
    selectedLayers.forEach(l => l.detach());

    // Create group layer
    const groupLayer = new Layer('Group', [], {}, selectedLayers);
    layers.push(groupLayer);

    // Remove selected layers from layers array
    selectedLayers.forEach(l => {
        const idx = layers.indexOf(l);
        if (idx !== -1) layers.splice(idx, 1);
    });

    // Attach group
    groupLayer.attach(container, onlayerdragstart);

    // Adjust positions
    const minX = Math.min(...selectedLayers.map(l => l.x));
    const minY = Math.min(...selectedLayers.map(l => l.y));
    groupLayer.x = minX;
    groupLayer.y = minY;
    selectedLayers.forEach(layer => {
        layer.x -= minX;
        layer.y -= minY;
    });

    // Set selection
    selectedLayers.forEach(layer => layer.selected = false);
    groupLayer.selected = true;

    renderLayer(groupLayer);
}

function ungroupSelectedLayers() {
    const selectedEls = getSelectedLayerElements_sandbox();
    if (!selectedEls.length) return;
    const container = document.getElementById('panel1') || document.querySelector('.container');

    selectedEls.forEach(el => {
        const inst = getLayerInstanceFromElement_sandbox(el);
        if (inst && inst.childLayers && inst.childLayers.length > 0) {
            // Ungroup
            inst.detach();
            inst.childLayers.forEach(child => {
                child.x += inst.x;
                child.y += inst.y;
                layers.push(child);
                child.attach(container, onlayerdragstart);
                renderLayer(child);
            });
            const idx = layers.indexOf(inst);
            if (idx !== -1) layers.splice(idx, 1);
        }
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
    const container = document.getElementById('panel1') || document.querySelector('.container');
    selectedEls.forEach(el => {
        const inst = getLayerInstanceFromElement_sandbox(el);
        if (!inst) return;
        const imgs = Array.from(inst.element.querySelectorAll('img'));
        const srcClone = imgs.map(i => i.src);
        const newLayer = new Layer(inst.name + '_copy', srcClone, {
            x: inst.x,
            y: inst.y,
            rotation: inst.rotation,
            scale: inst.scale,
            flipX: inst.isFlipX,
            flipY: inst.isFlipY,
            width: inst.width,
            height: inst.height
        });
        layers.push(newLayer);
        newLayer.attach(container, onlayerdragstart);
        renderLayer(newLayer); // Render the new layer
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
        clipboardLayers_sandbox.push({
            name: inst.name,
            src: src,
            options: {
                x: inst.x,
                y: inst.y,
                rotation: inst.rotation,
                scale: inst.scale,
                flipX: inst.isFlipX,
                flipY: inst.isFlipY,
                width: inst.width,
                height: inst.height
            }
        });
    });
}

function pasteCopiedLayers() {
    if (!clipboardLayers_sandbox.length) return;
    const container = document.getElementById('panel1') || document.querySelector('.container');
    clipboardLayers_sandbox.forEach(data => {
        const newLayer = new Layer(data.name + '_paste', data.src.slice(), data.options || {});
        layers.push(newLayer);
        newLayer.attach(container, onlayerdragstart);
        renderLayer(newLayer); // Render the new layer
    });
}