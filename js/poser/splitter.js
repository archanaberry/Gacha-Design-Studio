// Pilih elemen container
const container = document.querySelector('.container');

// Tambahkan CSS ke elemen container
container.style.width = '100%';
container.style.backgroundColor = 'white';
container.style.overflow = 'auto';

function resizePanel(pointerY) {
    let newHeight = (pointerY - splitterHeight / 2) / window.innerHeight * 100;
    // Batasi tinggi agar tidak melewati batas atas (0%) atau batas bawah (100%)
    newHeight = Math.min(Math.max(newHeight, 0), 100 - splitterHeight / window.innerHeight * 100);
    // Atur posisi splitter dan tinggi panel 2
    splitter.style.top = newHeight + '%';
    panel2.style.height = (100 - newHeight - splitterHeight / window.innerHeight * 100) + '%';
}

/** 
 * @param {MouseEvent} e 
 */
function onMouseMove(e) {
    if (!isDragging) return;
    resizePanel(e.clientY);
}

/** 
 * @param {TouchEvent} e 
 */
function onTouchMove(e) {
    if (!isDragging) return;
    resizePanel(e.touches[0].clientY);
}

/** 
 * @param {MouseEvent} e 
 */
function onMouseUp(e) {
    isDragging = false;
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
}

/** 
 * @param {MouseEvent} e 
 */
function onMouseDown(e) {
    isDragging = true;
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
}

/**
 * @param {TouchEvent} e 
 */
function onTouchEnd(e) {
    isDragging = false;
    document.removeEventListener('touchmove', onTouchMove);
    document.removeEventListener('touchend', onTouchEnd);
}

// Event listener untuk mengatur perangkat sentuh
splitter.addEventListener('touchstart', function(e) {
    isDragging = true;
    document.addEventListener('touchmove', onTouchMove);
    document.addEventListener('touchend', onTouchEnd);
});

// Event listener untuk perangkat sentuh
splitter.addEventListener('mousedown', onMouseDown);

resizePanel(window.innerHeight / 2);
