
/** @type {Layer} Elemen yang sedang dipilih */
let selected = null;

const layers = [
    // lapisan //
    // Tangan kanan
    new Layer('Lengan atas kanan', 'assets/arm1.svg', 'assets/arm2.svg', {flipX: true}),
    new Layer('Lengan bawah kanan', 'assets/hand1.svg', 'assets/hand2.svg', {flipX: true}),
    new Layer('Tangan kanan', 'assets/finger3.svg', 'assets/finger4.svg', {flipX: true}),
    // Kaki kanan
    new Layer('Paha atas kanan', 'assets/leg1.svg', 'assets/leg2.svg', {flipX: true}),
    new Layer('Kaki kanan', 'assets/foot1.svg', 'assets/foot2.svg', {flipX: true}),
    // Kepala dan badan
    new Layer('Badan', 'assets/body1.svg', 'assets/body2.svg'),
    new Layer('Kepala', 'assets/head1.svg', 'assets/head2.svg'),
    // Tangan kiri
    new Layer('Lengan atas kiri', 'assets/arm1.svg', 'assets/arm2.svg'),
    new Layer('Lengan bawah kiri', 'assets/hand1.svg', 'assets/hand2.svg'),
    new Layer('Tangan kiri', 'assets/finger1.svg', 'assets/finger2.svg'),
    // Kaki kiri
    new Layer('Paha atas kiri', 'assets/leg1.svg', 'assets/leg2.svg'),
    new Layer('Kaki kiri', 'assets/foot1.svg', 'assets/foot2.svg'),
    // lapisan //
];

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
    for(const layer of layers) {
        layer.attach(container, onlayerdragstart);
    }

    // Hapus seleksi ketika user mengklik elemen yang bukan layer
    document.addEventListener('click', function(e) {
        if(e.target.tagName !== 'HTML') {
            return;
        }
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
