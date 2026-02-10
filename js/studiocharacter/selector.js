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
// 🔥 UNIFIED POINTER EVENT SYSTEM - Menggunakan PointerEvent untuk mouse, touch, dan pen input
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
    touch-action: none;
}
/* 🔥 Prevent scroll saat selector drag aktif */
.selector-active-drag {
    overflow: hidden !important;
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
        
        // 🔥 NEW: Track drag containers untuk multi-panel selector support
        this.dragContainers = [container];
        this.dragContainers.forEach(c => {
            if (c) c.style.touchAction = 'none';
        });
        const layerContainer = document.getElementById('panel1-layercontainer');
        const layerPanlock = document.getElementById('panel1-layerpanlock');
        if (layerContainer && !this.dragContainers.includes(layerContainer)) {
            this.dragContainers.push(layerContainer);
            layerContainer.style.touchAction = 'none';
        }
        if (layerPanlock && !this.dragContainers.includes(layerPanlock)) {
            this.dragContainers.push(layerPanlock);
            layerPanlock.style.touchAction = 'none';
        }
        
        // 🔥 NEW: Unified pointer state tracking (mouse, touch, pen)
        this.pointerDownState = new Map();
        
        // Bind handlers untuk document-level events
        this.onDocumentPointerMove = this.onPointerMove.bind(this);
        this.onDocumentPointerUp = this.onPointerUp.bind(this);

        // Ensure container punya positioning yang benar untuk absolute child positioning
        const containerStyle = window.getComputedStyle(this.container);
        if (containerStyle.position === 'static') {
            this.container.style.position = 'relative';
        }

        this.button.addEventListener('click', this.toggleSelector.bind(this));
        
        // 🔥 NEW: Use unified PointerEvent system instead of separate mouse/touch handlers
        this.dragContainers.forEach(c => {
            if (c) {
                c.addEventListener('pointerdown', this.onPointerDown.bind(this), { passive: false });
            }
        });
        
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
                    // 🔥 Add to DOM class too
                    el.classList.add('selected');
                    this.selectedLayers.push(inst);
                } else {
                    // fallback to DOM selection if no instance present
                    el.classList.add('selected');
                    this.selectedLayers.push(el);
                }
            }
        });
        
        // 🔥 CRITICAL: Sync selector.selectedLayers untuk bisa di-access dari studiopose.js
        if (window.selectorInstance && window.selectorInstance !== this) {
            // Copy ke global selector instance jika ada
            window.selectorInstance.selectedLayers = this.selectedLayers.slice();
        }
        
        // Sinkronisasi ke panel lain setelah selection di selector
        if (typeof updateMenuLayerSelectionForMultiSelect === 'function') {
            updateMenuLayerSelectionForMultiSelect();
        }
        
        // 🔥 CRITICAL: Update Panel2 display dengan color indicator (BLUE untuk grouped selection)
        if (typeof updateCoordInput === 'function') {
            setTimeout(() => updateCoordInput(), 10);  // Delay sedikit untuk ensure state updated
            console.log('📊 selectLayersInBox: Multi-select updated', {
                count: this.selectedLayers.length,
                names: this.selectedLayers.map(l => l.name || l.__layerInstance?.name || 'unknown')
            });
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

    // 🔥 NEW: Unified pointerdown handler (works for mouse, touch, and pen)
    onPointerDown(e) {
        if (!this.selectorActive) return;
        
        e.preventDefault();
        try { e.target.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
        
        const pid = e.pointerId;
        const containerRect = this.container.getBoundingClientRect();
        this.startX = e.clientX - containerRect.left;
        this.startY = e.clientY - containerRect.top;
        
        // 🔥 NEW: Store pointer state in Map
        this.pointerDownState.set(pid, {
            isDragging: true,
            startX: this.startX,
            startY: this.startY,
            container: this.container
        });
        
        this.isDragging = true;
        this.clearSelectionBox();
        this.deselectAllLayers();
        
        // 🔥 CRITICAL: Untuk layerContainer - pastikan selection box di-attach ke container yang tepat
        const container = e.currentTarget;
        if (container && container !== this.container) {
            // Jika pointer down di layerContainer, gunakan itu sebagai reference
            if (container === document.getElementById('panel1-layercontainer') ||
                container === document.getElementById('panel1-layerpanlock')) {
                this.currentDragContainer = container;
            }
        }
        
        // 🔥 NEW: Disable scroll pada container ketika selector drag aktif
        this.dragContainers.forEach(c => {
            if (c) {
                c.classList.add('selector-active-drag');
                c.style.pointerEvents = 'none';
            }
        });
        
        // Attach document-level listeners untuk capture movement di atas semua elemen
        document.addEventListener('pointermove', this.onDocumentPointerMove, { passive: false });
        document.addEventListener('pointerup', this.onDocumentPointerUp, { passive: false });
        document.addEventListener('pointercancel', this.onDocumentPointerUp, { passive: false });
    }

    // 🔥 NEW: Unified pointermove handler
    onPointerMove(e) {
        const pid = e.pointerId;
        if (!this.pointerDownState.has(pid) || !this.selectorActive || !this.isDragging) return;
        
        e.preventDefault();
        
        const state = this.pointerDownState.get(pid);
        const containerRect = this.container.getBoundingClientRect();
        const currentX = e.clientX - containerRect.left;
        const currentY = e.clientY - containerRect.top;
        const width = currentX - state.startX;
        const height = currentY - state.startY;
        
        this.setSelectionBox(state.startX, state.startY, width, height);
    }

    // 🔥 NEW: Unified pointerup handler
    onPointerUp(e) {
        const pid = e.pointerId;
        if (!this.pointerDownState.has(pid)) return;
        
        e.preventDefault();
        
        const state = this.pointerDownState.get(pid);
        const wasActive = this.isDragging;
        
        // 🔥 NEW: Re-enable scroll pada semua drag containers
        this.dragContainers.forEach(cont => {
            if (cont) {
                cont.classList.remove('selector-active-drag');
                cont.style.pointerEvents = 'auto';
            }
        });
        
        // Detach document-level listeners
        document.removeEventListener('pointermove', this.onDocumentPointerMove);
        document.removeEventListener('pointerup', this.onDocumentPointerUp);
        document.removeEventListener('pointercancel', this.onDocumentPointerUp);
        
        // Clean up pointer state
        this.pointerDownState.delete(pid);
        if (this.pointerDownState.size === 0) {
            this.isDragging = false;
        }
        
        try { e.target.releasePointerCapture(pid); } catch (err) { /* ignore */ }
        
        // Check apakah selection box ada sebelum di-access
        if (wasActive && this.selectionBox) {
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
    
    console.log('✅ Selector initialized with unified PointerEvent system');
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