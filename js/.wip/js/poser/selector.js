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
    display: none;
    border: 2px dashed blue;
    background: rgba(173, 216, 230, 0.5);
    pointer-events: none;
    z-index: 1000;
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

        this.button.addEventListener('click', this.toggleSelector.bind(this));
        this.container.addEventListener('mousedown', this.onMouseDown.bind(this));
        this.container.addEventListener('mousemove', this.onMouseMove.bind(this));
        this.container.addEventListener('mouseup', this.onMouseUp.bind(this));

        // Touch events
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

        // Adjust position and size
        this.selectionBox.style.left = `${Math.min(x, x + w)}px`;
        this.selectionBox.style.top = `${Math.min(y, y + h)}px`;
        this.selectionBox.style.width = `${Math.abs(w)}px`;
        this.selectionBox.style.height = `${Math.abs(h)}px`;
        this.selectionBox.style.display = 'block'; // Ensure the box is visible
    }

    clearSelectionBox() {
        this.removeSelectionBox();
    }

    toggleSelector() {
        this.selectorActive = !this.selectorActive;
        if (this.selectorActive) {
            this.button.textContent = "Matikan Seleksi";
        } else {
            this.button.textContent = "Nyalakan Seleksi";
            this.clearSelectionBox();
        }
    }

    selectLayersInBox(box) {
        this.selectedLayers = [];
        const layers = document.querySelectorAll('.layer');
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
        this.selectedLayers.forEach(layer => {
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
        this.startX = e.clientX;
        this.startY = e.clientY;
        this.isDragging = true;
        this.clearSelectionBox();
        this.deselectAllLayers();
    }

    onMouseMove(e) {
        if (!this.selectorActive || !this.isDragging) return;
        const currentX = e.clientX;
        const currentY = e.clientY;
        const width = currentX - this.startX;
        const height = currentY - this.startY;
        this.setSelectionBox(this.startX, this.startY, width, height);
    }

    onMouseUp(e) {
        if (!this.selectorActive || !this.isDragging) return;
        this.isDragging = false;
        const box = this.selectionBox.getBoundingClientRect();
        this.selectLayersInBox(box);
        this.clearSelectionBox();
    }

    onTouchStart(e) {
        if (!this.selectorActive) return;
        const touch = e.touches[0];
        this.startX = touch.clientX;
        this.startY = touch.clientY;
        this.isDragging = true;
        this.clearSelectionBox();
        this.deselectAllLayers();
    }

    onTouchMove(e) {
        if (!this.selectorActive || !this.isDragging) return;
        const touch = e.touches[0];
        const currentX = touch.clientX;
        const currentY = touch.clientY;
        const width = currentX - this.startX;
        const height = currentY - this.startY;
        this.setSelectionBox(this.startX, this.startY, width, height);
        e.preventDefault();
    }

    onTouchEnd(e) {
        if (!this.selectorActive || !this.isDragging) return;
        this.isDragging = false;
        const box = this.selectionBox.getBoundingClientRect();
        this.selectLayersInBox(box);
        this.clearSelectionBox();
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

document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('panel1');
    const toggleSelectorBtn = document.getElementById('toggleSelectorBtn');
    new Selector(container, toggleSelectorBtn);
});