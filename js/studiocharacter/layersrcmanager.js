/****************************************************************/
//                                                              //
//  -------------------Gacha Design Studio--------------------  //
//  Created by: Archana Berry                                   //
//  Assets credits: Lunime, OGL (Open Game License), MIT CC     //
//  Version resource: v0.001_alpha                              //
//  File: layersrcmanager.js                                    //
//  Type: module[design]                                        //
//  Desc: Layer src management with UI & Logic handlers         //
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

/**
 * LAYER SRC MANAGER - Combined UI & Logic Handler
 * 
 * Two handler classes in one file:
 * 1. LayerSrcManager - Logic handler untuk manage layer src
 * 2. Auto-initialization untuk studio integration
 */

class LayerSrcManager {
    #isSyncing = false;
    dragGroup = null;
    get isSyncing() {
        return this.#isSyncing;
    }

    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            maxGridItems: 60,
            maxGridRows: 3,
            ...options
        };

        this.selectedLayer = null;
        this.selectedSrc = null;
        this.dragItem = null;
        this.lastPointerMoveRaf = null;

        this.layers = [];
        this.layerMap = new Map();
        this.#isSyncing = false;
        this.dragGroup = null;

        // MenuSrc instance (UI handler)
        this.menuSrc = null;

        // Current layers reference
        this.currentLayers = [];

        this.#initCSS();
        this.#buildHTML();
        this.#attachEventListeners();

        // Ensure initial VISIBLE state
        if (this.widget) {
            this.widget.classList.remove('menusrc-hidden');
            this.widget.classList.add('visible');
        }
        this.#updateResponsive();
        this.#initObservers();
    }

    #initCSS() {
        const style = document.createElement('style');
        style.type = 'text/css';
        style.appendChild(document.createTextNode(this.#css));
        document.head.appendChild(style);
    }

    #buildHTML() {
        const wrapper = document.createElement('div');
        wrapper.className = 'menusrc-container';

        wrapper.innerHTML = `
            <div class="menusrc-main" id="menusrc-widget">
                <div class="menusrc-header" id="menusrc-headerToggle">
                    <div class="menusrc-icon-box" id="menusrc-selected-thumbnail" title="Selected Thumbnail">🖼️</div>
                    <div class="menusrc-title">LAYERS</div>
                    <div class="menusrc-color-box-container" id="menusrc-headerColorBoxContainer">
                        <div class="menusrc-color-box" id="menusrc-headerColorBox" title="Bulk Color Overwrite">
                            <div class="menusrc-color-inner"></div>
                        </div>
                        <input type="color" class="menusrc-color-input" id="menusrc-headerColorInput">
                    </div>
                    <div class="menusrc-arrow" id="menusrc-arrowGlobal">▼</div>
                </div>

                <div class="menusrc-grid-wrapper" id="menusrc-gridWrapper">
                    <div class="menusrc-grid-content" id="menusrc-gridContent"></div>
                </div>

                <div class="menusrc-layer-wrapper" id="menusrc-layerWrapper">
                    <div class="menusrc-layer-list" id="menusrc-layerList"></div>
                </div>
            </div>
        `;

        this.container.appendChild(wrapper);

        this.widget = document.getElementById('menusrc-widget');
        this.headerToggle = document.getElementById('menusrc-headerToggle');
        this.gridContent = document.getElementById('menusrc-gridContent');
        this.gridWrapper = document.getElementById('menusrc-gridWrapper');
        this.layerWrapper = document.getElementById('menusrc-layerWrapper');
        this.layerList = document.getElementById('menusrc-layerList');

        this.headerThumbnail = document.getElementById('menusrc-selected-thumbnail');
        this.headerColorBox = document.getElementById('menusrc-headerColorBox');
        this.headerColorInput = document.getElementById('menusrc-headerColorInput');
    }

    #attachEventListeners() {
        // HEADER: Toggle logic (Clicking Arrow / Header)
        this.headerToggle.addEventListener('click', (e) => {
            if (e.target.closest('.menusrc-color-box-container')) return; // Ignore color box click

            console.log('%c[LayerSrcManager] 🔄 Header toggle clicked', 'color: #00ffff; font-weight: bold');

            const isListOpen = this.widget.classList.contains('show-list');
            const arrow = document.getElementById('menusrc-arrowGlobal');

            if (isListOpen) {
                console.log('   → Mode: LIST -> GRID');
                this.widget.classList.remove('show-list');
                this.widget.classList.add('show-grid');
                if (arrow) arrow.textContent = '▼'; // Closed (Grid view)
            } else {
                console.log('   → Mode: GRID -> LIST');
                this.widget.classList.remove('show-grid');
                this.widget.classList.add('show-list');
                if (arrow) arrow.textContent = '▲'; // Open (List view)
            }
            this.#updateResponsive();
        });

        // HEADER: Bulk Color Overwrite
        this.headerColorBox.addEventListener('click', (e) => {
            e.stopPropagation();
            this.headerColorInput.click();
        });

        // Bulk color overwrite in Header (Apply to all selected)
        this.headerColorInput.addEventListener('change', (e) => {
            const color = e.target.value;
            console.log('%c[LayerSrcManager] 🎨 Bulk color overwrite:', 'color: #00ffff', color);

            const selectedRows = this.layerList.querySelectorAll('.menusrc-item-row.selected');
            if (selectedRows.length > 0) {
                selectedRows.forEach(row => {
                    this.#applyColorToLayer(row.dataset.layerId, color);
                });
            } else {
                // If nothing selected in menu, maybe apply to window.selected or all?
                // User said: "pas ganti warna kok ga mau berubah" - usually they select first.
            }

            // Update the bulk box visual
            const inner = this.headerColorBox.querySelector('.menusrc-color-inner');
            if (inner) inner.style.backgroundColor = color;
        });

        // GRID: Click delegation for grid items
        this.gridContent.addEventListener('click', (e) => {
            const gridItem = e.target.closest('.menusrc-grid-item');
            if (gridItem) {
                this.selectSrc(gridItem); // Grid items are essentially SRCs
            }
        });

        // LIST: Click delegation
        this.layerList.addEventListener('click', (e) => {
            // Row selection
            const row = e.target.closest('.menusrc-item-row');
            if (row) {
                // Toggle expand/collapse logic
                const toggle = e.target.closest('.menusrc-row-toggle');
                if (toggle) {
                    e.stopPropagation();
                    const nextSibling = row.nextElementSibling;
                    if (nextSibling && nextSibling.classList.contains('menusrc-nested-group')) {
                        const isHidden = nextSibling.style.display === 'none';
                        nextSibling.style.display = isHidden ? 'block' : 'none';
                        toggle.textContent = isHidden ? '▲' : '▼'; // Update arrow
                        row.classList.toggle('collapsed', !isHidden); // Add/remove collapsed class
                    }
                    return;
                }

                // Color box click
                const colorBox = e.target.closest('.menusrc-color-box');
                if (colorBox) {
                    e.stopPropagation();
                    const input = colorBox.parentElement.querySelector('input[type="color"]');
                    if (input) input.click();
                    return;
                }

                // Select the row
                this.selectLayer(row, e.ctrlKey);
            }
        });

        // LIST: Color Change Delegation
        this.layerList.addEventListener('change', (e) => {
            if (e.target.classList.contains('menusrc-row-color-input')) {
                const color = e.target.value;
                const row = e.target.closest('.menusrc-item-row');
                const layerId = row.dataset.layerId;
                const srcIndex = e.target.dataset.srcIndex;

                if (srcIndex !== undefined) {
                    // Single SRC color change
                    this.#applyColorToSrc(layerId, parseInt(srcIndex), color);
                } else {
                    // Group/Layer color overwrite
                    this.#applyColorToLayer(layerId, color);
                }

                // Update visual box
                const boxInner = e.target.parentElement.querySelector('.menusrc-color-inner');
                if (boxInner) boxInner.style.backgroundColor = color;
            }
        });

        // Drag & Drop - ONLY top-level reordering (childLayers is read-only on Layer)
        this.layerList.addEventListener('pointerdown', (e) => {
            const handle = e.target.closest('.menusrc-row-handle');
            if (!handle) return;

            const row = handle.closest('.menusrc-item-row');
            if (!row) return;

            // Only allow dragging top-level rows (direct children of layerList)
            if (row.parentElement !== this.layerList) return;
            // Don't allow dragging src-rows
            if (row.classList.contains('menusrc-src-row')) return;

            this.dragItem = row;

            // Find associated nested-group container (if it's a folder)
            const sibling = row.nextElementSibling;
            this.dragGroup = (sibling && sibling.classList.contains('menusrc-nested-group')) ? sibling : null;

            this.dragItem.classList.add('menusrc-dragging');
            if (this.dragGroup) this.dragGroup.classList.add('menusrc-dragging-group');

            try {
                this.layerList.setPointerCapture(e.pointerId);
            } catch (_) { }

            e.preventDefault();
        });

        this.layerList.addEventListener('pointermove', (e) => {
            if (!this.dragItem) return;

            if (this.lastPointerMoveRaf) {
                cancelAnimationFrame(this.lastPointerMoveRaf);
            }

            this.lastPointerMoveRaf = requestAnimationFrame(() => {
                const y = e.clientY;

                // Only consider other top-level rows as drop targets
                const rows = Array.from(this.layerList.children).filter(el =>
                    el.classList.contains('menusrc-item-row') &&
                    !el.classList.contains('menusrc-src-row') &&
                    el !== this.dragItem
                );

                let targetRow = null;
                for (const row of rows) {
                    const rect = row.getBoundingClientRect();
                    if (y >= rect.top && y <= rect.bottom) {
                        targetRow = row;
                        break;
                    }
                }

                if (!targetRow) return;

                const rect = targetRow.getBoundingClientRect();
                const midpoint = (rect.top + rect.bottom) / 2;

                // Find the targetRow's associated group container (if folder)
                const targetSibling = targetRow.nextElementSibling;
                const targetGroup = (targetSibling && targetSibling.classList.contains('menusrc-nested-group')) ? targetSibling : null;

                if (y > midpoint) {
                    // Insert AFTER targetRow (and its group)
                    const insertAfter = targetGroup || targetRow;
                    insertAfter.after(this.dragItem);
                    if (this.dragGroup) this.dragItem.after(this.dragGroup);
                } else {
                    // Insert BEFORE targetRow
                    targetRow.before(this.dragItem);
                    if (this.dragGroup) this.dragItem.after(this.dragGroup);
                }
            });
        });

        this.layerList.addEventListener('pointerup', (e) => {
            if (!this.dragItem) return;

            this.dragItem.classList.remove('menusrc-dragging');
            if (this.dragGroup) this.dragGroup.classList.remove('menusrc-dragging-group');
            try {
                this.layerList.releasePointerCapture(e.pointerId);
            } catch (_) { }

            // Re-order window.layers based on the new DOM order in menu
            this.#syncSystemOrderFromMenu();

            this.dragItem = null;
            this.dragGroup = null;
            this.#updateResponsive();
        });
    }

    #syncSystemOrderFromMenu() {
        if (!window.layers || !this.layerList || this.#isSyncing) return;
        this.#isSyncing = true;
        console.log('%c[LayerSrcManager] 🔄 Syncing system order from menu...', 'color: #00ddff');

        try {
            // Only reorder top-level layers. Do NOT modify childLayers (it's read-only on Layer class).
            const topLevelRows = Array.from(this.layerList.children).filter(
                el => el.classList.contains('menusrc-item-row') && !el.classList.contains('menusrc-src-row')
            );

            const newOrderIds = topLevelRows.map(row => row.dataset.layerId);

            // Build a lookup for O(1) access
            const layerById = new Map();
            window.layers.forEach(l => { if (l && l.id) layerById.set(l.id, l); });

            const reordered = [];
            newOrderIds.forEach(id => {
                const layer = layerById.get(id);
                if (layer) reordered.push(layer);
            });

            // Add any layers that weren't in the menu (safety net)
            window.layers.forEach(l => {
                if (!reordered.includes(l)) reordered.push(l);
            });

            // Update global layers array
            window.layers.length = 0;
            reordered.forEach(l => window.layers.push(l));

            // Trigger canvas re-render to reflect new order
            if (typeof window.renderLayer === 'function') {
                window.renderLayer();
            }
        } catch (err) {
            console.error('[LayerSrcManager] Error in sync:', err);
        } finally {
            // Delay resetting flag to prevent MutationObserver from triggering loop
            setTimeout(() => {
                this.#isSyncing = false;
            }, 500);
        }
    }

    #initObservers() {
        const mo = new MutationObserver(() => {
            this.#updateResponsive();
        });
        mo.observe(this.layerList, { childList: true, subtree: true });

        let rz;
        window.addEventListener('resize', () => {
            clearTimeout(rz);
            rz = setTimeout(() => this.#updateResponsive(), 120);
        });
    }

    // ===== PUBLIC API =====
    addLayers(layersArray) {
        if (!Array.isArray(layersArray)) return;
        console.log(`%c[LayerSrcManager] addLayers called with ${layersArray.length} layers`, 'color: #ff00ff; font-weight: bold');

        layersArray.forEach(layerData => {
            const layerId = layerData.id || `layer-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
            layerData.id = layerId;
            this.layerMap.set(layerId, layerData);
            this.layers.push(layerData);
            this.currentLayers.push(layerData);
        });

        this.#renderLayers();
    }

    addLayer(layerData) {
        const layerId = layerData.id || `layer-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
        layerData.id = layerId;
        this.layerMap.set(layerId, layerData);
        this.layers.push(layerData);
        this.currentLayers.push(layerData);
    }

    addLayerGroup(groupName, layers, id = null) {
        // Create a pseudo-layer object to represent the group
        const groupData = {
            id: id || `folder-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            name: groupName,
            childLayers: layers
        };
        this.layerMap.set(groupData.id, groupData);
        this.layers.push(groupData); // Add to the main layers array
        this.currentLayers.push(groupData);
        // We don't call #renderLayers here anymore to allow bulk updates
    }

    render() {
        this.#renderLayers();
    }

    clear() {
        this.layers = [];
        this.currentLayers = [];
        this.layerMap.clear();
        if (this.layerList) this.layerList.innerHTML = '';
        if (this.gridContent) this.gridContent.innerHTML = '';
    }

    selectLayer(rowElement, isCtrl = false) {
        if (!rowElement) return;

        const layerId = rowElement.dataset.layerId;
        console.log(`%c[LayerSrcManager] 🖱️ selectLayer: ${layerId} (Ctrl: ${isCtrl})`, 'color: #00ff00; font-weight: bold');

        if (!isCtrl) {
            // Remove selection from all rows
            this.layerList.querySelectorAll('.menusrc-item-row.selected').forEach((el) => {
                el.classList.remove('selected');
                el.style.backgroundColor = '';
            });
        }

        rowElement.classList.add('selected');
        rowElement.style.backgroundColor = '#e3f2fd';
        this.selectedLayer = rowElement;

        // === SELECT IN PANEL1 (canvas) ===
        if (window.layers) {
            // Find the actual Layer object by ID
            const findLayerById = (arr, id) => {
                for (const l of arr) {
                    if (l.id === id) return l;
                    if (l.childLayers && l.childLayers.length > 0) {
                        const found = findLayerById(l.childLayers, id);
                        if (found) return found;
                    }
                }
                return null;
            };

            const targetLayer = findLayerById(window.layers, layerId);
            if (targetLayer && targetLayer.element) {
                if (!isCtrl) {
                    // Single select: deselect all others first
                    document.querySelectorAll('.layer.selected, .layer-group.selected').forEach(el => {
                        el.classList.remove('selected');
                    });
                    if (window.selectorInstance && Array.isArray(window.selectorInstance.selectedLayers)) {
                        window.selectorInstance.selectedLayers = [];
                    }
                }

                // Select this layer
                targetLayer.selected = true;
                targetLayer.element.classList.add('selected');
                window.selected = targetLayer;

                // Add to selector
                if (window.selectorInstance && Array.isArray(window.selectorInstance.selectedLayers)) {
                    if (!window.selectorInstance.selectedLayers.includes(targetLayer)) {
                        window.selectorInstance.selectedLayers.push(targetLayer);
                    }
                }

                // Update coord inputs
                if (typeof window.updateCoordInput === 'function') window.updateCoordInput();
                if (typeof window.syncMultiSelectToFramework === 'function') window.syncMultiSelectToFramework();
            }
        }

        // syncHeaderSelection will handle thumbnail updates and visibility
        this.syncHeaderSelection();
    }

    selectSrc(srcElement) {
        // In the new layout, srcs are rows themselves, so delegating to selectLayer
        this.selectLayer(srcElement);
    }

    #updateHeaderThumbnail(layerId, srcIndex) {
        if (!this.headerThumbnail) return;

        const layerData = this.layerMap.get(layerId);
        if (!layerData) return;

        let srcPath = '';
        if (srcIndex !== undefined) {
            const srcs = layerData.srcs || layerData.src || [];
            srcPath = srcs[parseInt(srcIndex)];
        } else {
            // Default to first src if it's a layer/group
            const srcs = layerData.srcs || layerData.src || [];
            srcPath = Array.isArray(srcs) ? srcs[0] : srcs;
        }

        if (srcPath) {
            this.headerThumbnail.innerHTML = `<img src="${srcPath}" style="width:100%; height:100%; object-fit:contain;">`;
        } else {
            this.headerThumbnail.innerHTML = '🖼️';
        }
    }

    getSelectedLayerId() {
        if (!this.selectedLayer) return null;
        return this.selectedLayer.id;
    }

    syncHeaderSelection() {
        // Check CANVAS selection state (the real source of truth)
        const canvasSelected = document.querySelectorAll('.layer.selected, .layer-group.selected');
        const hasCanvasSelection = canvasSelected.length > 0;

        // Show/hide widget content based on canvas selection (using class, not inline display)
        if (this.widget) {
            if (hasCanvasSelection) {
                this.widget.classList.remove('menusrc-hidden');
                this.widget.classList.add('visible');
                if (this.layerWrapper) this.layerWrapper.classList.remove('menusrc-content-hidden');
                if (this.gridWrapper) this.gridWrapper.classList.remove('menusrc-content-hidden');
            } else {
                // Hide layer list and grid when nothing selected
                if (this.layerWrapper) this.layerWrapper.classList.add('menusrc-content-hidden');
                if (this.gridWrapper) this.gridWrapper.classList.add('menusrc-content-hidden');
            }
        }

        // Update menu row highlights to match canvas selection
        const selectedRows = this.layerList?.querySelectorAll('.menusrc-item-row.selected') || [];

        if (selectedRows.length > 0) {
            // Handle Multiple Thumbnails in Header
            if (this.headerThumbnail) {
                this.headerThumbnail.innerHTML = '';
                this.headerThumbnail.style.display = 'flex';
                this.headerThumbnail.style.overflowX = 'auto';
                this.headerThumbnail.style.width = 'auto';
                this.headerThumbnail.style.maxWidth = '120px';

                const maxThumbs = 4;
                Array.from(selectedRows).slice(0, maxThumbs).forEach(row => {
                    const layerId = row.dataset.layerId;
                    const layerData = this.layerMap.get(layerId);

                    if (layerData) {
                        const srcs = layerData.srcs || layerData.src || [];
                        const thumbSrc = Array.isArray(srcs) ? srcs[0] : srcs;

                        if (thumbSrc) {
                            const img = document.createElement('img');
                            img.src = thumbSrc;
                            img.style.cssText = 'width:24px;height:24px;object-fit:contain;margin-right:2px;border:1px solid #ddd;';
                            this.headerThumbnail.appendChild(img);
                        }
                    }
                });

                if (selectedRows.length > maxThumbs) {
                    const more = document.createElement('span');
                    more.textContent = `+${selectedRows.length - maxThumbs}`;
                    more.style.cssText = 'font-size:10px;align-self:center;';
                    this.headerThumbnail.appendChild(more);
                }
            }

            // Update header color box
            const lastRow = selectedRows[selectedRows.length - 1];
            const colorInner = lastRow.querySelector('.menusrc-color-inner');
            if (colorInner && this.headerColorBox) {
                this.headerColorBox.querySelector('.menusrc-color-inner').style.backgroundColor = colorInner.style.backgroundColor;
            }
        } else {
            // Clear header info
            if (this.headerThumbnail) {
                this.headerThumbnail.innerHTML = '🖼️';
                this.headerThumbnail.style.width = '32px';
            }
            if (this.headerColorBox) {
                this.headerColorBox.querySelector('.menusrc-color-inner').style.backgroundColor = 'transparent';
            }
        }
    }

    getSelectedSrcIndex() {
        if (!this.selectedSrc) return null;
        const srcIndex = Array.from(this.selectedSrc.parentElement.children).indexOf(this.selectedSrc);
        return srcIndex;
    }

    getSelectedLayer() {
        const layerId = this.getSelectedLayerId();
        if (!layerId) return null;
        return this.layerMap.get(layerId);
    }

    getSelectedSrcs() {
        const layer = this.getSelectedLayer();
        if (!layer) return [];
        return layer.srcs || [];
    }

    getSelectedSrcPath() {
        const srcs = this.getSelectedSrcs();
        const srcIndex = this.getSelectedSrcIndex();
        if (srcIndex === null) return null;
        return srcs[srcIndex] || null;
    }

    applyColorToSelectedSrc(color) {
        if (!this.selectedSrc) return;

        const srcElement = this.selectedSrc.querySelector('img');
        if (!srcElement) return;

        srcElement.style.filter = `drop-shadow(0 0 0 ${color})`;

        this.#dispatchColorChangedEvent(color);
    }

    /**
     * Recursive rendering helper
     * @param {HTMLElement} parentGroup 
     * @param {Object} layerData 
     * @param {number} depth Indentation depth
     */
    #addLayerToGroup(parentGroup, layerData, depth = 0, path = []) {
        const layerId = layerData.id;
        const name = layerData.name || 'Layer';
        const currentPath = [...path, name];
        const fullIdentity = currentPath.join(':');

        // Register in Map to allow lookup for color application/selection
        this.layerMap.set(layerId, layerData);

        const srcs = layerData.srcs || layerData.src || [];
        const srcArr = Array.isArray(srcs) ? srcs : [srcs];
        const hasChildren = layerData.childLayers && layerData.childLayers.length > 0;
        const hasMultipleSrcs = srcArr.length > 1;

        // Determine Type Tag based on requested format
        let typeTag = '';
        if (hasChildren) typeTag = ':IG';
        else if (hasMultipleSrcs) typeTag = ':SG';

        // Indentation string
        const indentStr = depth > 0 ? Array(depth).fill('-').join('') + ' ' : '';

        const layerRow = document.createElement('div');
        layerRow.className = `menusrc-item-row depth-${depth}`;
        layerRow.id = layerId;
        layerRow.dataset.layerId = layerId;

        // Color for Group Box - Priority: layer.color (getter) > layer.options.color0 > layer.options.color
        let groupColor = '#000000';
        if (layerData.color) {
            groupColor = layerData.color;
        } else if (layerData.options) {
            groupColor = layerData.options.color0 || layerData.options.color || '#000000';
        }

        layerRow.innerHTML = `
            <div class="menusrc-row-content">
                <span class="menusrc-indent">${indentStr}</span>
                <span class="menusrc-row-symbol">|</span>
                <span class="menusrc-layer-name" title="${fullIdentity}">${fullIdentity}${typeTag}</span>
                <div class="menusrc-color-box-container">
                    <div class="menusrc-color-box" title="Layer/Group Color">
                        <div class="menusrc-color-inner" style="background-color: ${groupColor}"></div>
                    </div>
                    <input type="color" class="menusrc-row-color-input" value="${groupColor}">
                </div>
                ${(hasChildren || hasMultipleSrcs) ? '<span class="menusrc-row-toggle">▼</span>' : ''}
                <span class="menusrc-row-handle">=</span>
                <span class="menusrc-row-symbol">|</span>
            </div>
        `;

        // Event Listeners for Layer Row
        layerRow.addEventListener('click', (e) => {
            if (e.target.closest('.menusrc-color-box-container') ||
                e.target.closest('.menusrc-row-toggle') ||
                e.target.closest('.menusrc-row-handle')) return;
            this.selectLayer(layerRow, e.ctrlKey);
        });

        const colorInput = layerRow.querySelector('.menusrc-row-color-input');
        const colorBox = layerRow.querySelector('.menusrc-color-box');
        if (colorBox) {
            colorBox.addEventListener('click', (e) => {
                e.stopPropagation();
                colorInput.click();
            });
        }
        if (colorInput) {
            colorInput.addEventListener('input', (e) => {
                const color = e.target.value;
                layerRow.querySelector('.menusrc-color-inner').style.backgroundColor = color;
                this.#applyColorToLayer(layerId, color);
            });
            colorInput.addEventListener('click', (e) => e.stopPropagation());
        }

        parentGroup.appendChild(layerRow);

        // Nested Container
        const nestedContainer = document.createElement('div');
        nestedContainer.className = 'menusrc-nested-group';
        nestedContainer.style.display = 'none';
        parentGroup.appendChild(nestedContainer);

        const toggleBtn = layerRow.querySelector('.menusrc-row-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const isHidden = nestedContainer.style.display === 'none';
                nestedContainer.style.display = isHidden ? 'block' : 'none';
                toggleBtn.textContent = isHidden ? '▲' : '▼';
                if (isHidden) layerRow.classList.remove('collapsed');
                else layerRow.classList.add('collapsed');
            });
        }

        // Render Sources if SG
        if (hasMultipleSrcs) {
            srcs.forEach((srcPath, idx) => {
                const srcRow = document.createElement('div');
                srcRow.className = `menusrc-item-row menusrc-src-row depth-${depth + 1}`;
                srcRow.dataset.layerId = layerId;
                const srcIndent = Array(depth + 1).fill('-').join('') + ' ';
                let srcColor = '#000000';
                if (layerData.srcColors && layerData.srcColors[idx]) {
                    srcColor = layerData.srcColors[idx];
                } else if (layerData.options && layerData.options[`color${idx}`]) {
                    srcColor = layerData.options[`color${idx}`];
                } else if (groupColor && groupColor !== '#000000') {
                    // Fallback to group color if per-src is missing
                    srcColor = groupColor;
                }

                const sLabel = `${fullIdentity}:S${idx}`;

                srcRow.innerHTML = `
                    <div class="menusrc-row-content">
                        <span class="menusrc-indent">${srcIndent}</span>
                        <span class="menusrc-row-symbol">|</span>
                        <span class="menusrc-layer-name">${sLabel}</span>
                        <div class="menusrc-color-box-container">
                            <div class="menusrc-color-box" title="Source Color">
                                <div class="menusrc-color-inner" style="background-color: ${srcColor}"></div>
                            </div>
                            <input type="color" class="menusrc-row-color-input" data-src-index="${idx}" value="${srcColor}">
                        </div>
                        <span class="menusrc-row-handle">=</span>
                        <span class="menusrc-row-symbol">|</span>
                    </div>
                `;

                srcRow.addEventListener('click', (e) => {
                    if (e.target.closest('.menusrc-color-box-container') || e.target.closest('.menusrc-row-handle')) return;
                    this.selectLayer(layerRow, e.ctrlKey);
                });

                const sInput = srcRow.querySelector('.menusrc-row-color-input');
                const sBox = srcRow.querySelector('.menusrc-color-box');
                if (sBox) sBox.addEventListener('click', (e) => { e.stopPropagation(); sInput.click(); });
                if (sInput) {
                    sInput.addEventListener('input', (e) => {
                        const color = e.target.value;
                        srcRow.querySelector('.menusrc-color-inner').style.backgroundColor = color;
                        this.#applyColorToSrc(layerId, idx, color);
                    });
                    sInput.addEventListener('click', (e) => e.stopPropagation());
                }
                nestedContainer.appendChild(srcRow);
            });
        }

        if (hasChildren) {
            layerData.childLayers.forEach((child) => {
                if (!child.id) child.id = `layer-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
                this.#addLayerToGroup(nestedContainer, child, depth + 1, currentPath);
            });
        }
    }

    #applyColorToLayer(layerId, color) {
        const layerData = this.layerMap.get(layerId);
        if (!layerData) return;

        // Apply to this layer's sources (SG)
        const srcs = layerData.srcs || layerData.src || [];
        srcs.forEach((_, idx) => {
            this.#applyColorToSrc(layerId, idx, color);
        });

        // Recursively apply to child layers (IG)
        if (layerData.childLayers && layerData.childLayers.length > 0) {
            layerData.childLayers.forEach(child => {
                this.#applyColorToLayer(child.id, color);
            });
        }
    }

    #applyColorBulkToLayer(layerId) {
        const colorInput = document.createElement('input');
        colorInput.type = 'color';
        colorInput.oninput = (e) => {
            const color = e.target.value;
            this.#applyColorToLayer(layerId, color);
        };
        colorInput.click();
    }

    #applyColorToSrc(layerId, srcIndex, color = null) {
        if (color === null) {
            this.#showColorPicker(layerId, srcIndex);
            return;
        }

        console.log('🎨 Applying color:', color, 'to layer:', layerId, 'src:', srcIndex);

        const layer = this.layerMap.get(layerId) || (window.layers && window.layers.find(l => l.id === layerId));
        if (!layer) {
            console.error('Layer not found for color application:', layerId);
            return;
        }

        if (!layer.options) layer.options = {};
        layer.options[`color${srcIndex}`] = color;

        if (typeof layer.updateOptions === 'function') {
            layer.updateOptions({ [`color${srcIndex}`]: color });
        } else {
            if (layer.element && layer.element.parentElement) {
                const parent = layer.element.parentElement;
                layer.detach();
                layer.attach(parent, window.onLayerPointerDown);
            }
        }

        this.#dispatchColorChangedEvent(color);
        this.#updateGridThumbnail(layerId);
        this.syncHeaderSelection();

        const row = document.getElementById(layerId);
        if (row) {
            const input = row.querySelector(`.menusrc-row-color-input[data-src-index="${srcIndex}"]`) || row.querySelector('.menusrc-row-color-input');
            if (input) {
                input.value = color;
                const inner = input.parentElement.querySelector('.menusrc-color-inner');
                if (inner) inner.style.backgroundColor = color;
            }
        }

        if (typeof window.HistoryManager !== 'undefined') {
            window.HistoryManager.recordAction('color', {
                layerName: layer.name,
                srcIndex: srcIndex,
                color: color,
                action: `Changed color for src${srcIndex}`
            });
        }
    }

    #applyColorBulk(color) {
        this.layers.forEach(layer => {
            this.#applyColorToLayer(layer.id, color);
        });
    }

    #renderLayers() {
        console.log('%c[LayerSrcManager] 🎨 #renderLayers (Filtered)', 'color: purple; font-weight: bold');
        this.layerList.innerHTML = '';
        this.gridContent.innerHTML = '';

        // Find actual layer objects that are selected
        const selectedLayers = [];
        const findSelected = (layers) => {
            layers.forEach(l => {
                const isSelected = l.selected || (l.element && l.element.classList.contains('selected'));
                if (isSelected) {
                    selectedLayers.push(l);
                } else if (l.childLayers && l.childLayers.length > 0) {
                    findSelected(l.childLayers);
                }
            });
        };
        if (window.layers) findSelected(window.layers);

        // If nothing selected, don't render list/grid
        if (selectedLayers.length === 0) {
            this.syncHeaderSelection();
            return;
        }

        // Helper: collect all {layer, srcIndex, srcPath, label, type}
        const collectAllSrcs = (layerData, path = []) => {
            const result = [];
            const srcArr = Array.isArray(layerData.srcs || layerData.src) ? (layerData.srcs || layerData.src) : [layerData.srcs || layerData.src];
            const name = layerData.name || 'Layer';
            const hasChildren = layerData.childLayers && layerData.childLayers.length > 0;
            const hasMultipleSrcs = srcArr.length > 1;

            // Build path string for identity
            const currentPath = [...path, name];
            const fullIdentity = currentPath.join(':');

            if (hasChildren) {
                result.push({ layer: layerData, type: 'IG', label: `${fullIdentity}:IG` });
            } else if (hasMultipleSrcs) {
                result.push({ layer: layerData, type: 'SG', label: `${fullIdentity}:SG` });
            }

            srcArr.forEach((srcPath, idx) => {
                if (srcPath) {
                    const label = hasMultipleSrcs ? `${fullIdentity}:S${idx}` : `${fullIdentity}:S0`;
                    result.push({ layer: layerData, srcIndex: idx, srcPath, type: 'SRC', label: label });
                }
            });

            if (hasChildren) {
                layerData.childLayers.forEach((child, gIdx) => {
                    // Use G prefix for children if desired? 
                    // User example: GrupBadan:IG:G0
                    // This implies the child itself is labeled within its parent
                    result.push(...collectAllSrcs(child, currentPath));
                });
            }
            return result;
        };

        selectedLayers.forEach((layer) => {
            // 1. Add to Layer List
            this.#addLayerToGroup(this.layerList, layer);

            // 2. Add to Grid
            const allSrcs = collectAllSrcs(layer);
            allSrcs.forEach(({ layer: srcLayer, srcIndex, srcPath, type, label }) => {
                const gridItem = document.createElement('div');
                gridItem.className = 'menusrc-grid-item';
                gridItem.dataset.layerId = srcLayer.id;
                gridItem.dataset.srcIndex = srcIndex !== undefined ? srcIndex : '';

                let tintColor = 'transparent';
                if (type === 'SRC' && srcLayer.options && srcLayer.options[`color${srcIndex}`]) {
                    tintColor = srcLayer.options[`color${srcIndex}`];
                } else if (srcLayer.options) {
                    tintColor = srcLayer.options.color0 || srcLayer.options.color || 'transparent';
                }

                let imgHtml = '';
                if (type === 'SRC') {
                    imgHtml = `<img src="${srcPath}" style="width:100%; height:100%; object-fit:contain; ${tintColor !== 'transparent' ? `filter: drop-shadow(0 0 0 ${tintColor})` : ''}">`;
                } else {
                    const s = srcLayer.srcs || srcLayer.src || [];
                    const ts = Array.isArray(s) ? s[0] : s;
                    imgHtml = ts ? `<img src="${ts}" style="width:100%; height:100%; object-fit:contain; opacity:0.6; ${tintColor !== 'transparent' ? `filter: drop-shadow(0 0 0 ${tintColor})` : ''}">` : '<span>📁</span>';
                }

                gridItem.innerHTML = `<div class="grid-thumb-container" style="position:relative; width:100%; height:100%;">${imgHtml}<span style="position:absolute; bottom:0; left:0; font-size:7px; background:rgba(0,0,0,0.6); color:#fff; padding:0 2px; border-radius:0 2px 0 0; white-space:nowrap;">${label}</span></div>`;

                gridItem.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const row = document.getElementById(srcLayer.id);
                    if (row) this.selectLayer(row, e.ctrlKey);
                    if (!e.ctrlKey) this.gridContent.querySelectorAll('.grid-selected').forEach(g => g.classList.remove('grid-selected'));
                    gridItem.classList.add('grid-selected');
                });

                gridItem.addEventListener('dblclick', (e) => {
                    e.stopPropagation();
                    if (type === 'SRC') this.#applyColorToSrc(srcLayer.id, srcIndex);
                    else this.#applyColorBulkToLayer(srcLayer.id);
                });

                this.gridContent.appendChild(gridItem);
            });
        });

        if (!this.widget.classList.contains('show-list')) {
            this.widget.classList.add('show-list');
            const arrow = document.getElementById('menusrc-arrowGlobal');
            if (arrow) arrow.textContent = '▲';
        }
        this.syncHeaderSelection();
    }

    #applyColorToSelectedSrc(color) {
        if (!this.selectedSrc) return;

        const srcElement = this.selectedSrc.querySelector('img');
        if (!srcElement) return;

        srcElement.style.filter = `drop-shadow(0 0 0 ${color})`;

        this.#dispatchColorChangedEvent(color);
    }

    #countVisibleLayers() {
        const allRows = [...this.layerList.querySelectorAll('.menusrc-item-row')];
        let count = 0;

        allRows.forEach((row) => {
            if (row.classList.contains('menusrc-src-folder')) return;

            let visible = true;
            let p = row.parentElement;
            while (p && p !== this.layerList) {
                if (p.classList && p.classList.contains('menusrc-nested-group')) {
                    const prev = p.previousElementSibling;
                    if (
                        prev &&
                        prev.classList.contains('menusrc-src-folder') &&
                        prev.classList.contains('collapsed')
                    ) {
                        visible = false;
                        break;
                    }
                }
                p = p.parentElement;
            }
            if (visible) count++;
        });
        return count;
    }

    #updateResponsive() {
        const isListMode = this.widget.classList.contains('show-list');

        if (!isListMode) {
            // Grid mode
            this.gridContent.classList.add('menusrc-compact');
            this.layerWrapper.classList.remove('menusrc-compact');
        } else {
            // List mode
            this.gridContent.classList.remove('menusrc-compact');
            const visibleCount = this.#countVisibleLayers();
            if (visibleCount < 10) {
                this.layerWrapper.classList.add('menusrc-compact');
            } else {
                this.layerWrapper.classList.remove('menusrc-compact');
            }
        }
    }

    #dispatchLayerSelectedEvent(layerId) {
        const event = new CustomEvent('layerSelected', {
            detail: { layerId },
            bubbles: true,
            composed: true
        });
        window.dispatchEvent(event);
    }

    #dispatchSrcSelectedEvent(srcIndex, srcPath) {
        const event = new CustomEvent('srcSelected', {
            detail: { srcIndex, srcPath },
            bubbles: true,
            composed: true
        });
        window.dispatchEvent(event);
    }

    #dispatchColorChangedEvent(color) {
        const event = new CustomEvent('layerSrcColorChanged', {
            detail: {
                color,
                srcIndex: this.getSelectedSrcIndex(),
                srcPath: this.getSelectedSrcPath()
            }
        });
        document.dispatchEvent(event);
    }

    #showColorPicker(layerId, srcIndex) {
        console.log('🎨 Opening color picker for layer:', layerId, 'src:', srcIndex);

        // Find the layer object (try map first, then global layers)
        const layer = this.layerMap.get(layerId) || (window.layers && window.layers.find(l => l.id === layerId));
        if (!layer) {
            console.error('Layer not found for picker:', layerId);
            return;
        }

        // Create color input
        const input = document.createElement('input');
        input.type = 'color';

        // Get current color if available
        const currentColor = layer.options?.[`color${srcIndex}`] || '#000000';
        input.value = currentColor;

        input.addEventListener('change', (e) => {
            const newColor = e.target.value;
            console.log('🎨 Color changed to:', newColor, 'for layer:', layer.name, 'src:', srcIndex);

            // Update layer options
            if (!layer.options) layer.options = {};
            layer.options[`color${srcIndex}`] = newColor;

            // Re-render the layer to apply color
            if (typeof layer.updateOptions === 'function') {
                layer.updateOptions({ [`color${srcIndex}`]: newColor });
            } else {
                // Fallback: force re-render
                if (layer.element && layer.element.parentElement) {
                    const parent = layer.element.parentElement;
                    layer.detach();
                    layer.attach(parent, window.onLayerPointerDown);
                }
            }

            // Dispatch event
            this.#dispatchColorChangedEvent(newColor);

            // Update Live Grid Thumbnail and Header Thumbnail
            this.#updateGridThumbnail(layerId);
            this.syncHeaderSelection();

            // Record to history if available
            if (typeof window.HistoryManager !== 'undefined') {
                window.HistoryManager.recordAction('color', {
                    layerName: layer.name,
                    srcIndex: srcIndex,
                    color: newColor,
                    action: `Changed color for src${srcIndex}`
                });
            }
        });

        // Trigger the color picker
        input.click();
    }

    #updateGridThumbnail(layerId) {
        const gridItem = this.gridContent.querySelector(`.menusrc-grid-item[data-layer-id="${layerId}"]`);
        if (!gridItem) return;

        const layerData = this.layerMap.get(layerId);
        if (!layerData) return;

        // Update tint color in grid
        const img = gridItem.querySelector('img');
        if (img) {
            let tintColor = 'transparent';
            if (layerData.options) {
                tintColor = layerData.options.color0 || layerData.options.color || 'transparent';
            }
            img.style.filter = tintColor !== 'transparent' ? `drop-shadow(0 0 0 ${tintColor})` : '';
        }

        // Update nested count
        const countSpan = gridItem.querySelector('span');
        if (countSpan && layerData.childLayers) {
            countSpan.textContent = `G:${layerData.childLayers.length}`;
        }
    }

    update() {
        this.#updateResponsive();
    }

    getSelectedSrcPath() {
        const srcs = this.getSelectedSrcs();
        const srcIndex = this.getSelectedSrcIndex();
        if (srcIndex === null) return null;
        return srcs[srcIndex] || null;
    }

    renderSelectedSrc(canvas) {
        const srcPath = this.getSelectedSrcPath();
        if (!srcPath) {
            canvas.innerHTML = '<p>No src selected</p>';
            return;
        }

        this.#renderSvgOrImage(canvas, srcPath);
    }

    renderAllSrcsFromLayer(canvas) {
        const srcs = this.getSelectedSrcs();
        if (srcs.length === 0) {
            canvas.innerHTML = '<p>No srcs found</p>';
            return;
        }

        canvas.innerHTML = '';
        srcs.forEach((src, idx) => {
            const wrapper = document.createElement('div');
            wrapper.style.display = 'inline-block';
            wrapper.style.margin = '5px';
            wrapper.style.textAlign = 'center';

            const label = document.createElement('p');
            label.textContent = `src${idx}`;
            label.style.fontSize = '12px';
            label.style.margin = '5px 0';

            const container = document.createElement('div');
            container.style.width = '60px';
            container.style.height = '60px';
            container.style.border = '1px solid #ccc';
            container.style.borderRadius = '4px';
            container.style.overflow = 'hidden';

            this.#renderSvgOrImage(container, src);

            wrapper.appendChild(label);
            wrapper.appendChild(container);
            canvas.appendChild(wrapper);
        });
    }

    #renderSvgOrImage(container, srcPath) {
        if (srcPath.startsWith('data:image/svg')) {
            const parser = new DOMParser();
            const svg = parser.parseFromString(srcPath, 'image/svg+xml');
            container.innerHTML = '';
            container.appendChild(svg.documentElement);
        } else if (srcPath.startsWith('data:') || srcPath.includes('http')) {
            const img = document.createElement('img');
            img.src = srcPath;
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'contain';
            container.innerHTML = '';
            container.appendChild(img);
        } else {
            const img = document.createElement('img');
            img.src = srcPath;
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'contain';
            img.onerror = () => {
                container.innerHTML = '<p style="font-size:10px;">Failed to load</p>';
            };
            container.innerHTML = '';
            container.appendChild(img);
        }
    }

    #css = `
        :root {
            --border-color: #333;
            --bg-color: #fff;
            --item-size: 45px;
            --folder-bg: #e8f0fe;
        }

        .menusrc-container {
            font-family: 'Segoe UI', 'Roboto', sans-serif;
            margin: 0;
            display: flex;
            justify-content: center;
            width: 100%;
        }

        .menusrc-main {
            display: none; /* Hidden by default */
            width: calc(100% - 20px);
            max-width: 500px;
            margin: auto;
            border: 2px solid var(--border-color);
            background: var(--bg-color);
            overflow: hidden;
            flex-direction: column;
            border-radius: 8px;
            transition: max-width 0.18s ease, transform 0.18s ease;
        }

        .menusrc-main.visible, .menusrc-main.open {
            display: flex;
        }
        
        .menusrc-hidden {
            display: none !important;
        }

        /* HEADER */
        .menusrc-header {
            display: flex;
            align-items: center;
            padding: 12px;
            background: #fff;
            border-bottom: 2px solid var(--border-color);
            cursor: pointer;
            z-index: 20;
        }

        /* Thumbnail in Header */
        .menusrc-icon-box {
            width: 32px;
            height: 32px;
            border: 1px solid #000;
            margin-right: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            background: #eee;
        }
        
        .menusrc-icon-box img {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }

        .menusrc-title {
            flex-grow: 1;
            font-weight: bold;
        }

        /* Color Box in Row/Header */
        .menusrc-color-box-container {
            position: relative;
            display: flex;
            align-items: center;
            margin-right: 10px;
        }

        .menusrc-color-box {
            width: 20px;
            height: 20px;
            border: 2px solid #000;
            padding: 1px;
            cursor: pointer;
            display: flex;
            background: #fff;
        }

        .menusrc-color-inner {
            flex: 1;
            background: #000;
        }
        
        .menusrc-color-input {
            width: 0; height: 0; opacity: 0; position: absolute;
        }

        .menusrc-arrow {
            font-weight: bold;
            font-size: 20px;
            user-select: none;
            padding: 4px 12px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            min-width: 40px;
            min-height: 40px;
            color: #333;
        }
        
        .menusrc-arrow:hover {
            background: #eee;
            border-radius: 4px;
        }

        /* GRID SECTION - Visible by default or when toggled */
        .menusrc-grid-wrapper {
            max-height: 200px;
            opacity: 1;
            transition: max-height 0.35s ease, opacity 0.3s ease;
            overflow-x: auto;
            background: #fff;
            border-bottom: 1px solid #ddd;
        }

        .menusrc-grid-content {
            display: grid;
            grid-template-rows: repeat(2, var(--item-size)); /* 2 rows like typical grid */
            grid-auto-flow: column;
            gap: 4px;
            padding: 10px;
            width: max-content;
        }
        
        .menusrc-grid-item {
            width: var(--item-size);
            height: var(--item-size);
            background: #f9f9f9;
            border: 1px solid #ccc;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
            cursor: pointer;
            overflow: hidden;
        }
        
        .menusrc-grid-item:hover { filter: brightness(0.95); }
        .menusrc-grid-item.selected { border: 2px solid #000; }
        .menusrc-grid-item.grid-selected { border: 2px solid #2196F3; box-shadow: 0 0 4px rgba(33,150,243,0.5); }

        /* LIST SECTION - Hidden by default (grid visible), Expanded when 'v' clicked */
        .menusrc-layer-wrapper {
            max-height: 0;
            opacity: 0;
            transition: max-height 0.4s ease, opacity 0.3s ease;
            overflow-y: auto;
            background: #fafafa;
            pointer-events: none;
        }
        
        /* STATES for switching views */
        /* State 1: Show Grid (Default or toggled) --> Hide List? No, user says "grid ke tutup... terekspansi layer menu" */
        
        .menusrc-main.show-grid .menusrc-grid-wrapper {
             max-height: 200px;
             opacity: 1;
             pointer-events: auto;
        }
        .menusrc-main.show-grid .menusrc-layer-wrapper {
             max-height: 100px; /* Small peek? or 0? let's keep it small or 0 based on preference */
             /* User said: "v di klik grid ke tutup ... terekspansi layer menu" -> so originally grid open, list closed/small. */
             max-height: 0;
             opacity: 0;
             pointer-events: none;
        }
        .menusrc-main.show-grid .menusrc-arrow { transform: rotate(0deg); }

        .menusrc-main.show-list .menusrc-grid-wrapper {
             max-height: 0;
             opacity: 0;
             pointer-events: none;
             border-bottom: none;
        }
        .menusrc-main.show-list .menusrc-layer-wrapper {
             max-height: 500px; /* Expanded */
             opacity: 1;
             pointer-events: auto;
        }
        .menusrc-main.show-list .menusrc-arrow { transform: rotate(180deg); }


        .menusrc-layer-list { padding: 4px; }

        /* ROW STYLING matches pol.html + Request */
        .menusrc-item-row {
            display: flex;
            align-items: center;
            padding: 6px 8px;
            border-bottom: 1px solid #eee;
            background: #fff;
            user-select: none;
        }
        
        .menusrc-item-row.selected { background-color: #e3f2fd; }
        
        .menusrc-dragging { 
            opacity: 0.5; 
            background: #e3f2fd !important;
        }

        .menusrc-dragging-group {
            display: none !important;
        }

        .menusrc-row-content {
            display: flex;
            align-items: center;
            font-family: monospace;
            font-size: 12px;
            white-space: nowrap;
            width: 100%;
        }

        .menusrc-indent { color: #999; margin-right: 4px; }
        .menusrc-row-symbol { color: #999; margin: 0 4px; font-weight: bold; }
        
        .menusrc-layer-name {
            flex-grow: 1;
            margin: 0 6px;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .menusrc-row-toggle {
            cursor: pointer;
            width: 20px;
            text-align: center;
            font-weight: bold;
        }
        
        .menusrc-row-handle {
            cursor: grab;
            margin-left: 6px;
            font-weight: bold;
            color: #666;
        }

        /* Nested Groups */
        .menusrc-nested-group {
             display: none; /* Hidden by default until toggled */
        }

        /* Content hidden when no layer is selected in canvas */
        .menusrc-content-hidden {
            display: none !important;
        }
    `;
}

// Export untuk module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LayerSrcManager;
}
