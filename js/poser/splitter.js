// Pilih elemen container
const container = document.querySelector('.container');

// Tambahkan CSS ke elemen container
container.style.width = '100%';
container.style.height = 'calc(90% - 5px)';
container.style.backgroundColor = 'white';
container.style.overflow = 'auto';

/** 
 * @param {MouseEvent} e 
 */
function onMouseMove(e) {
    if (!isDragging) return;
    // Hitung tinggi baru panel 1
    let newHeight = (e.clientY - splitterHeight / 2) / window.innerHeight * 100;
    // Batasi tinggi agar tidak melewati batas atas (0%) atau batas bawah (100%)
    newHeight = Math.min(Math.max(newHeight, 0), 100 - splitterHeight / window.innerHeight * 100);
    // Atur tinggi panel 1 dan panel 2
    panel1.style.height = newHeight + '%';
    panel2.style.height = (100 - newHeight - splitterHeight / window.innerHeight * 100) + '%';
}

/** 
 * @param {TouchEvent} e 
 */
function onTouchMove(e) {
    if (!isDragging) return;
    const touch = e.touches[0];
    let newHeight = (touch.clientY - splitterHeight / 2) / window.innerHeight * 100;
    newHeight = Math.min(Math.max(newHeight, 0), 100 - splitterHeight / window.innerHeight * 100);
    panel1.style.height = newHeight + '%';
    panel2.style.height = (100 - newHeight - splitterHeight / window.innerHeight * 100) + '%';
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
