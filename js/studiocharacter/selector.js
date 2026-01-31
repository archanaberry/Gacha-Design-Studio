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
        // track touchId untuk multi-touch support
        this.touchId = null;
        this.container.addEventListener('touchstart', this.onTouchStart.bind(this), { passive: true });
        this.container.addEventListener('touchmove', this.onTouchMove.bind(this), { passive: false });
        this.container.addEventListener('touchend', this.onTouchEnd.bind(this));
        this.container.addEventListener('touchcancel', this.onTouchEnd.bind(this));

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
        
        // Toggle pointer-events pada semua layer agar event bisa pass through saat selector aktif
        const layers = document.querySelectorAll('.layer, .layer-group');
        layers.forEach(layer => {
            if (this.selectorActive) {
                // Saat selector aktif: non-aktifkan interactions kecuali layer yang sudah dipilih
                if (layer.classList && layer.classList.contains('selected')) {
                    layer.style.pointerEvents = 'auto';
                } else {
                    layer.style.pointerEvents = 'none';
                }
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
        const elems = document.querySelectorAll('.layer, .layer-group');
        elems.forEach(el => {
            const layerRect = el.getBoundingClientRect();
            if (box.left <= layerRect.right && box.right >= layerRect.left && 
                box.top <= layerRect.bottom && box.bottom >= layerRect.top) {
                // prefer instance pointer if available
                const inst = el.__layerInstance || (window.layers && window.layers.find(l => l.element === el));
                if (inst) {
                    inst.selected = true;
                    this.selectedLayers.push(inst);
                } else {
                    // fallback to DOM selection if no instance present
                    el.classList.add('selected');
                    this.selectedLayers.push(el);
                }
            }
        });
        
        // Sinkronisasi ke panel lain setelah selection di selector
        if (typeof updateMenuLayerSelectionForMultiSelect === 'function') {
            updateMenuLayerSelectionForMultiSelect();
        }
    }

    deselectAllLayers() {
        // Deselect instances first
        if (this.selectedLayers && this.selectedLayers.length) {
            this.selectedLayers.forEach(s => {
                if (s && typeof s.selected !== 'undefined') {
                    s.selected = false;
                } else if (s && s.classList) {
                    s.classList.remove('selected');
                }
            });
        }

        // Also clear any DOM selected classes elsewhere
        const allSelectable = document.querySelectorAll('.layer.selected, .layer-group.selected');
        allSelectable.forEach(layer => {
            layer.classList.remove('selected');
        });

        this.selectedLayers = [];
        
        // Sinkronisasi deselect ke semua panel
        if (typeof syncDeselectionAcrossAllPanels === 'function') {
            syncDeselectionAcrossAllPanels();
        }
    }

    moveSelectedLayers(dx, dy) {
        // Prefer moving layer instances so their state updates properly
        this.selectedLayers.forEach(s => {
            if (s && typeof s.x !== 'undefined') {
                s.x += dx;
                s.y += dy;
            } else if (s && s.getBoundingClientRect) {
                // fallback: adjust DOM positioning directly
                const rect = s.getBoundingClientRect();
                s.style.left = `${rect.left + dx - this.container.getBoundingClientRect().left}px`;
                s.style.top = `${rect.top + dy - this.container.getBoundingClientRect().top}px`;
            }
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
        // If another touch-drag is active elsewhere, ignore starting a selection
        let startId = null;
        if (e.changedTouches && e.changedTouches.length > 0) startId = e.changedTouches[0].identifier;
        if (startId !== null && window.touchDragActive && window.touchDragId !== null && window.touchDragId !== startId) {
            return; // ignore selection start while dragging layers with another touch
        }

        // If any touch is on a layer, toggle selection for those touches (support multi-finger selection)
        if (e.changedTouches && e.changedTouches.length > 0) {
            for (let i = 0; i < e.changedTouches.length; i++) {
                const ct = e.changedTouches[i];
                // Because pointer-events may be disabled on non-selected layers, use bounding-box hit-test
                const layers = document.querySelectorAll('.layer, .layer-group');
                let layerEl = null;
                for (let li = 0; li < layers.length; li++) {
                    const cand = layers[li];
                    const r = cand.getBoundingClientRect();
                    if (ct.clientX >= r.left && ct.clientX <= r.right && ct.clientY >= r.top && ct.clientY <= r.bottom) {
                        layerEl = cand;
                        break;
                    }
                }
                if (layerEl) {
                    const inst = layerEl.__layerInstance || (window.layers && window.layers.find(l => l.element === layerEl));
                    if (inst) {
                        if (inst.selected) {
                            inst.selected = false;
                            if (Array.isArray(this.selectedLayers)) this.selectedLayers = this.selectedLayers.filter(s => s !== inst);
                        } else {
                            inst.selected = true;
                            if (!Array.isArray(this.selectedLayers)) this.selectedLayers = [];
                            if (!this.selectedLayers.includes(inst)) this.selectedLayers.push(inst);
                        }
                    } else {
                        if (layerEl.classList.contains('selected')) {
                            layerEl.classList.remove('selected');
                            if (Array.isArray(this.selectedLayers)) this.selectedLayers = this.selectedLayers.filter(s => s !== layerEl);
                        } else {
                            layerEl.classList.add('selected');
                            if (!Array.isArray(this.selectedLayers)) this.selectedLayers = [];
                            this.selectedLayers.push(layerEl);
                        }
                    }
                }
            }
            // Don't start selection box if touch was used to toggle layers
            window.frameworkDisplay?.updateSelectionVisuals?.();
            updateMenuLayerSelectionForMultiSelect?.();
            return;
        }

        // simpan touch identifier yang memulai selection (for selection box)
        if (e.changedTouches && e.changedTouches.length > 0) {
            this.touchId = e.changedTouches[0].identifier;
        } else {
            this.touchId = null;
        }
        const touch = e.touches ? e.touches[0] : (e.changedTouches ? e.changedTouches[0] : null);
        if (!touch) return;
        const containerRect = this.container.getBoundingClientRect();
        this.startX = touch.clientX - containerRect.left;
        this.startY = touch.clientY - containerRect.top;
        this.isDragging = true;
        this.clearSelectionBox();
        // Only deselect when starting a selection box on empty space
        this.deselectAllLayers();
    }

    onTouchMove(e) {
        if (!this.selectorActive || !this.isDragging) return;
        // cari touch yang sesuai identifier (support multi-touch)
        let touch = null;
        if (this.touchId !== null && e.touches) {
            for (let i = 0; i < e.touches.length; i++) {
                if (e.touches[i].identifier === this.touchId) {
                    touch = e.touches[i];
                    break;
                }
            }
        }
        if (!touch) touch = e.touches ? e.touches[0] : (e.changedTouches ? e.changedTouches[0] : null);
        if (!touch) return;
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
        // Jika ini touchend, pastikan menyangkut touch yang memulai selection
        if (e && e.changedTouches && e.changedTouches.length > 0 && this.touchId !== null) {
            let matched = false;
            for (let i = 0; i < e.changedTouches.length; i++) {
                if (e.changedTouches[i].identifier === this.touchId) {
                    matched = true;
                    break;
                }
            }
            if (!matched) return; // ignore touchend from other fingers
        }

        this.isDragging = false;
        this.touchId = null;
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
    // expose selector instance globally so drag code can detect multi-selected layers
    window.selectorInstance = new Selector(container, toggleSelectorBtn);
}

// Coba init saat DOMContentLoaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSelector);
} else {
    // Jika document sudah loaded, langsung init
    initSelector();
}