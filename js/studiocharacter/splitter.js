/****************************************************************/
//                                                              //  
//  -------------------Gacha Design Studio--------------------  //
//  Created by: Archana Berry                                   //
//  Assets credits: Lunime, OGL (Open Game License), MIT CC     //
//  Version resource: v0.001_alpha                              //
//  File: splitter.js                                           //
//  Type: module[design]                                        //
//  Desc: Panel splitter for container studio                   //
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

// splitter.js
// Pilih elemen container (panel group untuk layout baru dengan panel3)
const panelGroup = document.getElementById('panelGroup');
const container = panelGroup || document.querySelector('.container');

if (container) {
    // Tambahkan CSS ke elemen container
    container.style.width = '100%';
    container.style.backgroundColor = 'white';
    container.style.overflow = 'auto';
}

// Get references dari window atau create new ones
const splitterEl = window.splitterInstance || document.getElementById('splitter');
const panel1El = window.panel1Instance || document.getElementById('panel1');
const panel2El = window.panel2Instance || document.getElementById('panel2');

// Store in window untuk akses file lain
if (!window.splitterInstance) {
    window.splitterInstance = splitterEl;
    window.panel1Instance = panel1El;
    window.panel2Instance = panel2El;
}

// Hanya jalankan jika splitter ada
if (splitterEl && panel1El && panel2El) {
    const splitterHeight = splitterEl.offsetHeight;
    let isDragging = false;

    function resizePanel(pointerY) {
        let newHeight = (pointerY - splitterHeight / 2) / window.innerHeight * 100;
        // Batasi tinggi agar tidak melewati batas atas (0%) atau batas bawah (100%)
        newHeight = Math.min(Math.max(newHeight, 0), 100 - splitterHeight / window.innerHeight * 100);
        // Atur posisi splitter dan tinggi panel 2
        splitterEl.style.top = newHeight + '%';
        panel2El.style.height = (100 - newHeight - splitterHeight / window.innerHeight * 100) + '%';
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
        if (e.touches && e.touches.length > 0) {
            resizePanel(e.touches[0].clientY);
        }
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
    splitterEl.addEventListener('touchstart', function(e) {
        isDragging = true;
        document.addEventListener('touchmove', onTouchMove, { passive: false });
        document.addEventListener('touchend', onTouchEnd);
    });

    // Event listener untuk mouse
    splitterEl.addEventListener('mousedown', onMouseDown);

    // Set initial height: 70% untuk panel1, 30% untuk panel2 (lebih luas untuk canvas)
    resizePanel(window.innerHeight * 0.7);
}