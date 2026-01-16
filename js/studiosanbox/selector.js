/****************************************************************/
//                                                              //
//  -------------------Gacha Design Studio--------------------  //
//  Created by: Archana Berry                                   //
//  Assets credits: Lunime, OGL (Open Game License), MIT CC     //
//  Version resource: v0.001_alpha                              //
//  File: selector.js                                           //
//  Type: module[design]                                        //
//  Desc: Handling multi select in shapes                       //
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

// selector.js
// CSS diubah menjadi string JS
const css = `
.selection-box {
    position: absolute;
    border: 2px dashed blue;
    background: rgba(173, 216, 230, 0.5);
    pointer-events: none;
    z-index: 5;
}
.selector-container {
    position: relative;
}
`;

const style = document.createElement('style');
style.type = 'text/css';
style.appendChild(document.createTextNode(css));
document.head.appendChild(style);

// JavaScript untuk mendukung pemblokiran drag & drop dan menonaktifkan seleksi teks halaman
class Selector {
    constructor(container, button) {
        this.container = container;
        this.button = button;
        this.selectorActive = false;
        this.startX = 0;
        this.startY = 0;
        this.isDragging = false;
        this.selectedLayers = [];
        
        // Bind handlers untuk document-level events
        this.onDocumentMouseMove = this.onMouseMove.bind(this);
        this.onDocumentMouseUp = this.onMouseUp.bind(this);

        // Ensure container punya positioning yang benar untuk absolute child positioning
        const containerStyle = window.getComputedStyle(this.container);
        if (containerStyle.position === 'static') {
            this.container.style.position = 'relative';
        }

        this.button.addEventListener('click', this.toggleSelector.bind(this));
        this.container.addEventListener('mousedown', this.onMouseDown.bind(this));
        this.container.addEventListener('touchstart', this.onTouchStart.bind(this), { passive: true });
        this.container.addEventListener('touchmove', this.onTouchMove.bind(this), { passive: false });
        this.container.addEventListener('touchend', this.onTouchEnd.bind(this));

        // Keyboard events
        document.addEventListener('keydown', this.onKeyDown.bind(this));

        // Disable text selection and drag & drop
        document.addEventListener('dragstart', (e) => e.preventDefault());
        document.addEventListener('selectstart', (e) => e.preventDefault());
    }

    createSelectionBox() {
        if (!this.selectionBox) {
            this.selectionBox = document.createElement('div');
            this.selectionBox.className = 'selection-box';
            this.container.appendChild(this.selectionBox);
        }
    }

    removeSelectionBox() {
        if (this.selectionBox) {
            this.container.removeChild(this.selectionBox);
            this.selectionBox = null;
        }
    }

    setSelectionBox(x, y, w, h) {
        this.createSelectionBox();

        // x, y sudah container-relative, langsung set ke dalam container
        const left = Math.min(x, x + w);
        const top = Math.min(y, y + h);

        this.selectionBox.style.left = `${left}px`;
        this.selectionBox.style.top = `${top}px`;
        this.selectionBox.style.width = `${Math.abs(w)}px`;
        this.selectionBox.style.height = `${Math.abs(h)}px`;
    }

    clearSelectionBox() {
        this.removeSelectionBox();
    }

    toggleSelector() {
        this.selectorActive = !this.selectorActive;
        // Set global flag untuk memblokir layer drag saat selector aktif
        window.__selectorActive = this.selectorActive;
        
        // Toggle pointer-events pada semua layer dan groups
        const layers = document.querySelectorAll('.layer, .layer-group');
        layers.forEach(layer => {
            if (this.selectorActive) {
                // Saat selector aktif: layer tidak bisa di-interact (event pass through)
                layer.style.pointerEvents = 'none';
            } else {
                // Saat selector mati: layer bisa di-interact normal
                layer.style.pointerEvents = 'auto';
            }
        });
        
        if (this.selectorActive) {
            this.button.textContent = "Matikan Seleksi";
        } else {
            this.button.textContent = "Nyalakan Seleksi";
            this.clearSelectionBox();
            this.deselectAllLayers();
        }
    }

    selectLayersInBox(box) {
        this.selectedLayers = [];
        const layers = document.querySelectorAll('.layer, .layer-group');
        layers.forEach(layer => {
            const layerRect = layer.getBoundingClientRect();
            if (box.left <= layerRect.right && box.right >= layerRect.left && 
                box.top <= layerRect.bottom && box.bottom >= layerRect.top) {
                layer.classList.add('selected');
                this.selectedLayers.push(layer);
            }
        });
    }

    deselectAllLayers() {
        const allSelectable = document.querySelectorAll('.layer.selected, .layer-group.selected');
        allSelectable.forEach(layer => {
            layer.classList.remove('selected');
        });
        this.selectedLayers = [];
    }

    moveSelectedLayers(dx, dy) {
        this.selectedLayers.forEach(layer => {
            const rect = layer.getBoundingClientRect();
            layer.style.left = `${rect.left + dx - this.container.getBoundingClientRect().left}px`;
            layer.style.top = `${rect.top + dy - this.container.getBoundingClientRect().top}px`;
        });
    }

    onMouseDown(e) {
        if (!this.selectorActive) return;
        const containerRect = this.container.getBoundingClientRect();
        this.startX = e.clientX - containerRect.left;
        this.startY = e.clientY - containerRect.top;
        this.isDragging = true;
        this.clearSelectionBox();
        this.deselectAllLayers();
        
        // Disable pointer-events pada container agar document listener bisa tangkap event
        this.container.style.pointerEvents = 'none';
        
        // Attach document-level listeners untuk capture movement di atas semua elemen
        document.addEventListener('mousemove', this.onDocumentMouseMove);
        document.addEventListener('mouseup', this.onDocumentMouseUp);
    }

    onMouseMove(e) {
        if (!this.selectorActive || !this.isDragging) return;
        const containerRect = this.container.getBoundingClientRect();
        const currentX = e.clientX - containerRect.left;
        const currentY = e.clientY - containerRect.top;
        const width = currentX - this.startX;
        const height = currentY - this.startY;
        this.setSelectionBox(this.startX, this.startY, width, height);
    }

    onMouseUp(e) {
        if (!this.selectorActive || !this.isDragging) return;
        this.isDragging = false;
        
        // Re-enable pointer-events pada container
        this.container.style.pointerEvents = 'auto';
        
        // Detach document-level listeners
        document.removeEventListener('mousemove', this.onDocumentMouseMove);
        document.removeEventListener('mouseup', this.onDocumentMouseUp);
        
        // Check apakah selection box ada sebelum di-access
        if (this.selectionBox) {
            const box = this.selectionBox.getBoundingClientRect();
            this.selectLayersInBox(box);
            this.clearSelectionBox();
        }
    }

    onTouchStart(e) {
        if (!this.selectorActive) return;
        const touch = e.touches[0];
        const containerRect = this.container.getBoundingClientRect();
        this.startX = touch.clientX - containerRect.left;
        this.startY = touch.clientY - containerRect.top;
        this.isDragging = true;
        this.clearSelectionBox();
        this.deselectAllLayers();
    }

    onTouchMove(e) {
        if (!this.selectorActive || !this.isDragging) return;
        const touch = e.touches[0];
        const containerRect = this.container.getBoundingClientRect();
        const currentX = touch.clientX - containerRect.left;
        const currentY = touch.clientY - containerRect.top;
        const width = currentX - this.startX;
        const height = currentY - this.startY;
        this.setSelectionBox(this.startX, this.startY, width, height);
        e.preventDefault();
    }

    onTouchEnd(e) {
        if (!this.selectorActive || !this.isDragging) return;
        this.isDragging = false;
        
        // Check apakah selection box ada sebelum di-access
        if (this.selectionBox) {
            const box = this.selectionBox.getBoundingClientRect();
            this.selectLayersInBox(box);
            this.clearSelectionBox();
        }
    }

    onKeyDown(e) {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
            if (!this.selectedLayers.length) return;
            const dx = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
            const dy = e.key === 'ArrowDown' ? 1 : e.key === 'ArrowUp' ? -1 : 0;
            this.moveSelectedLayers(dx, dy);
        }
    }
}

// Inisialisasi Selector lebih robust
function initSelector() {
    const container = document.getElementById('panel1') || document.querySelector('.container');
    const toggleSelectorBtn = document.getElementById('toggleSelectorBtn');
    
    if (!container || !toggleSelectorBtn) {
        console.warn('Selector: Container or button not found, retrying...');
        setTimeout(initSelector, 100);
        return;
    }
    
    console.log('Selector initialized successfully');
    new Selector(container, toggleSelectorBtn);
}

// Coba init saat DOMContentLoaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSelector);
} else {
    // Jika document sudah loaded, langsung init
    initSelector();
}