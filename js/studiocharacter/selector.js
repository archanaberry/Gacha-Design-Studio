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
    z-index: 10000;
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
                // 🔥 CRITICAL: Semua layer dibikin none agar drag bisa mulai dari mana saja (bahkan di atas objek)
                // untuk memicu selection box.
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
        }
    }

    selectLayersInBox(box) {
        const newSelectedLayers = [];
        const elems = document.querySelectorAll('.layer, .layer-group');

        elems.forEach(el => {
            const layerRect = el.getBoundingClientRect();
            const inst = el.__layerInstance || (window.layers && window.layers.find(l => l.element === el));

            // Check intersection (overlap)
            const isIntersecting = box.left <= layerRect.right &&
                box.right >= layerRect.left &&
                box.top <= layerRect.bottom &&
                box.bottom >= layerRect.top;

            if (isIntersecting) {
                if (inst) {
                    inst.selected = true;
                    el.classList.add('selected');
                    // Ensure pointer events allowed for dragging while selected
                    el.style.pointerEvents = 'auto';
                    newSelectedLayers.push(inst);
                } else {
                    el.classList.add('selected');
                    el.style.pointerEvents = 'auto';
                    newSelectedLayers.push(el);
                }
            } else {
                // 🔥 Un-select if no longer in box
                if (inst) inst.selected = false;
                el.classList.remove('selected');
                // Back to none if selector active to allow box selection to pass through
                if (this.selectorActive) el.style.pointerEvents = 'none';
            }
        });

        this.selectedLayers = newSelectedLayers;

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
        // 🔥 Use unified deselect if available to ensure all states are cleared
        if (typeof deselectAllLayersUnified === 'function') {
            deselectAllLayersUnified();
            this.selectedLayers = [];
            return;
        }

        // Fallback: Deselect instances first
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
        window.selected = null;

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

                // 🔥 CRITICAL: Propagate move to Rigging System (Master -> Slave pull)
                if (s.spine) {
                    s.spine.onLayerMove(dx, dy, this.selectedLayers);
                }
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
        // Shift+Drag activates selector, but ONLY if Ctrl is not held (Ctrl+Shift is for Deep Select)
        const isShift = e.shiftKey && !e.ctrlKey;

        // Allow drag if selector is active OR Shift key is held (Temporary Selector)
        if (!this.selectorActive && !isShift) return;

        // Visual feedback for Shift Mode
        if (isShift && !this.selectorActive) {
            console.log('⇧ Shift+Drag: Temporary Selector Active');
        }

        // e.preventDefault(); // 🔥 Remove to allow synthesized click events for deselection logic
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
            container: this.container,
            hasClearedSelection: false, // Track jika sudah reset seleksi untuk drag baru
            forceActive: isShift // 🔥 Store Shift state for this drag session
        });

        this.isDragging = true;
        this.clearSelectionBox();
        // REMOVED: this.deselectAllLayers(); // 🔥 JANGAN deselect di sini, biar bisa tap-to-select atau drag-select murni

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
        const state = this.pointerDownState.get(pid);

        // Allow if selector active OR forced active (Shift+Drag)
        // Check state first to avoid undefined errors
        if (!state || (!this.selectorActive && !state.forceActive) || !this.isDragging) return;

        e.preventDefault();

        // const state = this.pointerDownState.get(pid); // Already got above
        const containerRect = this.container.getBoundingClientRect();
        const currentX = e.clientX - containerRect.left;
        const currentY = e.clientY - containerRect.top;
        const width = currentX - state.startX;
        const height = currentY - state.startY;

        // Hitung jarak gerakan
        const dist = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));

        // 🔥 JANGAN mulai seleksi kotak jika gerakan terlalu kecil
        if (dist > 5) {
            // Jika ini gerakan pertama yang valid, hapus seleksi lama (start fresh selection box)
            if (!state.hasClearedSelection) {
                this.deselectAllLayers();
                state.hasClearedSelection = true;
            }

            this.setSelectionBox(state.startX, state.startY, width, height);

            // 🔥 Real-time multi-select: Hitung seleksi saat drag berlangsung
            const x1 = state.startX + containerRect.left;
            const y1 = state.startY + containerRect.top;
            const x2 = e.clientX;
            const y2 = e.clientY;

            const currentBox = {
                left: Math.min(x1, x2),
                right: Math.max(x1, x2),
                top: Math.min(y1, y2),
                bottom: Math.max(y1, y2)
            };

            this.selectLayersInBox(currentBox);
        }
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
            }
        });

        // Detach document-level listeners
        document.removeEventListener('pointermove', this.onDocumentPointerMove);
        document.removeEventListener('pointerup', this.onDocumentPointerUp);
        document.removeEventListener('pointercancel', this.onDocumentPointerUp);

        // Calculate selection before cleaning up state
        if (wasActive) {
            const containerRect = this.container.getBoundingClientRect();
            const currentX = e.clientX - containerRect.left;
            const currentY = e.clientY - containerRect.top;

            // 🔥 NEW: Jarak gerakan total
            const dist = Math.sqrt(Math.pow(currentX - state.startX, 2) + Math.pow(currentY - state.startY, 2));

            if (dist > 5) {
                // Selesai Drag Select
                const x1 = state.startX + containerRect.left;
                const y1 = state.startY + containerRect.top;
                const x2 = currentX + containerRect.left;
                const y2 = currentY + containerRect.top;

                const box = {
                    left: Math.min(x1, x2),
                    right: Math.max(x1, x2),
                    top: Math.min(y1, y2),
                    bottom: Math.max(y1, y2)
                };

                this.selectLayersInBox(box);
                this.clearSelectionBox();

                // 🔥 NEW: Set flag agar klik yang menyusul diabaikan oleh handler lain
                window.justFinishedDrag = true;
                setTimeout(() => { window.justFinishedDrag = false; }, 100);
            } else {
                // 🔥 TAP LOGIC (Jarak kecil = Klik/Tap)
                // Karena layers punya pointer-events: none, kita gunakan elementsFromPoint
                const elements = document.elementsFromPoint(e.clientX, e.clientY);
                const tappedLayerEl = elements.find(el => el.classList.contains('layer') || el.classList.contains('layer-group'));

                if (tappedLayerEl) {
                    // Tap pada layer -> Select layer tersebut (Deselect yang lain)
                    this.deselectAllLayers();
                    const inst = tappedLayerEl.__layerInstance || (window.layers && window.layers.find(l => l.element === tappedLayerEl));
                    if (inst) {
                        inst.selected = true;
                        tappedLayerEl.classList.add('selected');
                        this.selectedLayers = [inst];
                    } else {
                        tappedLayerEl.classList.add('selected');
                        this.selectedLayers = [tappedLayerEl];
                    }
                    if (typeof selectLayer === 'function' && inst) selectLayer(inst);
                } else {
                    // Tap pada background panel1 -> Deselect All
                    // Pastikan yang di-tap adalah panel1 atau container-nya
                    const isPanel1Content = elements.some(el =>
                        el.id === 'panel1' ||
                        el.id === 'panel1-layercontainer' ||
                        el.classList.contains('container')
                    );
                    if (isPanel1Content) {
                        this.deselectAllLayers();
                    }
                }
            }
        }

        // Clean up pointer state
        this.pointerDownState.delete(pid);
        if (this.pointerDownState.size === 0) {
            this.isDragging = false;
        }

        try { e.target.releasePointerCapture(pid); } catch (err) { /* ignore */ }
    }

    onKeyDown(e) {
        // Removed: handled by key.js to prevent double movement and respect sensitivity
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