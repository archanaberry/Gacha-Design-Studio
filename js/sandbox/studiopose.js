
/** @type {Layer} Elemen yang sedang dipilih */
let selected = null;

const layers = [];

/** 
 * Mendefinisikan koordinat awal ketika halaman dimuat 
 */
let initialX = 0;
let initialY = 0;

/** 
 * Mendapatkan elemen input untuk menampilkan dan mengubah koordinat 
 */
const xCoordInput = document.getElementById('xCoord');
const yCoordInput = document.getElementById('yCoord');
const heightInput = document.getElementById('height');
const widthInput = document.getElementById('width');
const zoomInput = document.getElementById('zoom');
const layerNameInput = document.getElementById('layerName');
const rotationControl = document.getElementById('rotationControl');
const flipHorizontal = document.getElementById('flipHorizontal');
const flipVertical = document.getElementById('flipVertical');
const rotationIndicator = document.getElementById('rotationIndicator');
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
//    let sensitivity = 1;

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
    for(const layer of layers) {
        layer.attach(container, onlayerdragstart);
    }

    // Hapus seleksi ketika user mengklik elemen yang bukan layer atau panel1
    document.addEventListener('click', function(e) {
        if(!selected || e.target.closest('.layer') || e.target.closest('#panel2') || e.target.id === 'splitter') return; // Memeriksa apakah yang diklik adalah objek layer, splitter atau panel
        console.log(`Lapisan batal dipilih: ${selected.name}`);
        deselectLayer();
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
    rotationControl.value = selected.rotation;
    flipHorizontal.checked = selected.isFlipX;
    flipVertical.checked = selected.isFlipY;
    rotationIndicator.innerText = selected.rotation;
}

// Panggil fungsi ini saat objek tidak dipilih lagi
function deselectLayer() {
    if(!selected) return;
    selected.selected = false;
    selected = null;
}

function handleLayerName(value) {
    if(!selected) return; // Tambahkan pengecekan disini
    selected.name = value;
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

function handleZoom(value) {
    if(!selected) return;
    selected.scale = value;
}

function handleFlipHorizontal(value) {
    if(!selected) return;
    selected.flipX = value;
}

function handleFlipVertical(value) {
    if(!selected) return;
    selected.flipY = value;
}

function moveLayerUp() {
    if (!selected) return;
    const currentIndex = layers.indexOf(selected);
    if (currentIndex < layers.length - 1) {
        const temp = layers[currentIndex];
        layers[currentIndex] = layers[currentIndex + 1];
        layers[currentIndex + 1] = temp;
        renderLayers();
    }
}

function moveLayerDown() {
    if (!selected) return;
    const currentIndex = layers.indexOf(selected);
    if (currentIndex > 0) {
        const temp = layers[currentIndex];
        layers[currentIndex] = layers[currentIndex - 1];
        layers[currentIndex - 1] = temp;
        renderLayers();
    }
}

function renderLayers() {
    const container = document.querySelector('.container');
    container.innerHTML = '';
    for (const layer of layers) {
        layer.attach(container, onlayerdragstart);
    }
}

function handleCharacterName() {
    var newTitle = document.getElementById('characterName').value;
    const gachaStudio = "Studio Sandbox - ";
    document.getElementById('title').innerText = gachaStudio + newTitle;
}

// test //
function addSVG(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const layer = new Layer(file.name, e.target.result, null, {x: 0, y: 0});
            layers.push(layer);
            layer.attach(document.querySelector('.container'), onlayerdragstart);
        };
        reader.readAsDataURL(file);
    }
}

function addImage(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const layer = new Layer(file.name, e.target.result, null, {x: 0, y: 0});
            layers.push(layer);
            layer.attach(document.querySelector('.container'), onlayerdragstart);
        };
        reader.readAsDataURL(file);
    }
}

// layer //
function copyLayer(layer) {
    const copy = layer.cloneNode(true);
    container.appendChild(copy);
    if (layer.classList.contains('selected')) {
        copy.classList.add('selected');
    }
}

function deleteSelectedLayers() {
    selectedLayers.forEach(layerObj => {
        const parent = layerObj.element.parentNode;
        layerObj.element.remove();
        if (parent.classList.contains('layer-group') && parent.children.length === 0) {
            parent.remove();
        }
    });
    selectedLayers = [];
}

function changeColorOfSelectedLayers(color) {
    selectedLayers.forEach(layerObj => {
        const svgs = layerObj.element.querySelectorAll('svg');
        svgs.forEach(svg => {
            svg.style.fill = color;
        });
    });
}
// layer //