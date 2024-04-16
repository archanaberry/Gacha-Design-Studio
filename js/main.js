
/** @type {Layer} Elemen yang sedang dipilih */
let selected = null;

const layers = [
    new Layer('Badan', 'assets/body1.svg', 'assets/body2.svg'),
    new Layer('Kepala', 'assets/head1.svg', 'assets/head2.svg'),
];

// Mendefinisikan koordinat awal ketika halaman dimuat
var initialX = 0;
var initialY = 0;

/**
 * @param {Event} e
 * @param {Layer} layer 
 */
function onlayerdragstart(e, layer) {
    // Mendapatkan koordinat awal mouse
    initialX = e.clientX;
    initialY = e.clientY;

    // Menandai elemen yang dipilih dengan border biru
    selected = layer;
    layer.selected = true;

    // Menambahkan event listener untuk mengikuti pergerakan mouse
    document.addEventListener('mousemove', onlayerdrag);
    document.addEventListener('mouseup', onlayerdragend);
}

function onlayerdrag(e) {
    var dx = e.clientX - initialX;
    var dy = e.clientY - initialY;

    // Memperbarui koordinat elemen gambar
    selected.x += dx;
    selected.y += dy;

    // Memperbarui koordinat awal mouse
    initialX = e.clientX;
    initialY = e.clientY;
}

function onlayerdragend(e) {
    // Menghapus border biru dari elemen yang dipilih
    selected.selected = false;

    // Menghapus event listener setelah selesai drag
    document.removeEventListener('mousemove', onlayerdrag);
    document.removeEventListener('mouseup', onlayerdragend);
}

document.addEventListener('DOMContentLoaded', function() {
    // Pasang layer ke container ketika halaman selesai dimuat
    const container = document.querySelector('.container');
    for(const layer of layers) {
        layer.attach(container, onlayerdragstart, onlayerdrag, onlayerdragend);
    }
})