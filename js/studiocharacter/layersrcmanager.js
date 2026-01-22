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

        // MenuSrc instance (UI handler)
        this.menuSrc = null;

        // Current layers reference
        this.currentLayers = [];

        this.#initCSS();
        this.#buildHTML();
        this.#attachEventListeners();
        this.#updateResponsive();
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
                    <div class="menusrc-icon-box">☰</div>
                    <div class="menusrc-title">LAYERS</div>
                    <div class="menusrc-color-picker" id="menusrc-colorPicker">
                        <input type="color" class="menusrc-color-input" id="menusrc-colorInput" value="#000000">
                        <span id="menusrc-colorDisplay">■</span>
                    </div>
                    <div class="menusrc-arrow"></div>
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
        this.colorPicker = document.getElementById('menusrc-colorPicker');
        this.colorInput = document.getElementById('menusrc-colorInput');
        this.colorDisplay = document.getElementById('menusrc-colorDisplay');
    }

    #attachEventListeners() {
        // Toggle header
        this.headerToggle.addEventListener('click', () => {
            this.widget.classList.toggle('open');
            this.#updateResponsive();
        });

        // Color picker
        this.colorPicker.addEventListener('click', () => {
            this.colorInput.click();
        });

        this.colorInput.addEventListener('change', (e) => {
            const color = e.target.value;
            this.colorDisplay.style.color = color;
            this.#applyColorToSelectedSrc(color);
        });

        // Folder toggle
        this.layerList.addEventListener('click', (e) => {
            const toggle = e.target.closest('.menusrc-folder-toggle');
            if (!toggle) return;
            const folder = toggle.closest('.menusrc-src-folder');
            folder.classList.toggle('collapsed');
            this.#updateResponsive();
        });

        // Layer selection
        this.layerList.addEventListener('click', (e) => {
            const row = e.target.closest('.menusrc-item-row');
            if (!row) return;
            this.selectLayer(row);
        });

        // Src selection
        this.layerList.addEventListener('click', (e) => {
            const srcItem = e.target.closest('.menusrc-src-item');
            if (!srcItem) return;
            this.selectSrc(srcItem);
        });

        // Drag & Drop
        this.layerList.addEventListener('pointerdown', (e) => {
            const handle = e.target.closest('.menusrc-handle');
            if (!handle) return;

            this.dragItem = handle.closest('.menusrc-item-row');
            this.dragItem.classList.add('menusrc-dragging');
            try {
                this.layerList.setPointerCapture(e.pointerId);
            } catch (_) {}

            e.preventDefault();
        });

        this.layerList.addEventListener('pointermove', (e) => {
            if (!this.dragItem) return;

            if (this.lastPointerMoveRaf) {
                cancelAnimationFrame(this.lastPointerMoveRaf);
            }

            this.lastPointerMoveRaf = requestAnimationFrame(() => {
                const y = e.clientY;
                const rows = [
                    ...this.layerList.querySelectorAll('.menusrc-item-row:not(.menusrc-dragging)')
                ];

                const targetRow = rows.find((row) => {
                    const rect = row.getBoundingClientRect();
                    return y > rect.top && y < rect.bottom;
                });

                if (!targetRow) return;

                const rect = targetRow.getBoundingClientRect();
                const midpoint = (rect.top + rect.bottom) / 2;
                const isFolder = targetRow.classList.contains('menusrc-src-folder');
                const isCollapsed = targetRow.classList.contains('collapsed');

                if (isFolder) {
                    const group = targetRow.nextElementSibling;
                    if (y > midpoint) {
                        if (isCollapsed) {
                            group.after(this.dragItem);
                            this.dragItem.classList.remove('menusrc-is-nested');
                        } else {
                            group.prepend(this.dragItem);
                            this.dragItem.classList.add('menusrc-is-nested');
                        }
                    } else {
                        targetRow.before(this.dragItem);
                        this.dragItem.classList.remove('menusrc-is-nested');
                    }
                } else {
                    if (y > midpoint) {
                        targetRow.after(this.dragItem);
                    } else {
                        targetRow.before(this.dragItem);
                    }

                    if (this.dragItem.parentElement.classList.contains('menusrc-nested-group')) {
                        this.dragItem.classList.add('menusrc-is-nested');
                    } else {
                        this.dragItem.classList.remove('menusrc-is-nested');
                    }
                }
            });
        });

        this.layerList.addEventListener('pointerup', (e) => {
            if (!this.dragItem) return;

            const parent = this.dragItem.parentElement;
            if (parent && parent.classList.contains('menusrc-nested-group')) {
                this.dragItem.classList.add('menusrc-is-nested');
            } else {
                this.dragItem.classList.remove('menusrc-is-nested');
            }

            this.dragItem.classList.remove('menusrc-dragging');
            try {
                this.layerList.releasePointerCapture(e.pointerId);
            } catch (_) {}
            this.dragItem = null;

            this.#updateResponsive();
        });

        // Mutation observer
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
    addLayer(layerData) {
        const layerId = layerData.id || `layer-${Date.now()}`;
        this.layerMap.set(layerId, layerData);
        this.layers.push(layerData);
        this.currentLayers.push(layerData);
        this.#renderLayers();
    }

    addLayerGroup(groupName, layers) {
        const folderId = `folder-${Date.now()}`;
        const folderRow = document.createElement('div');
        folderRow.className = 'menusrc-item-row menusrc-src-folder';
        folderRow.id = folderId;
        folderRow.dataset.type = 'folder';
        folderRow.innerHTML = `
            <span class="menusrc-folder-toggle">▼</span>
            <span class="menusrc-layer-icon">📁</span>
            <span class="menusrc-layer-name">${groupName}</span>
            <span class="menusrc-handle">☰</span>
        `;

        const nestedGroup = document.createElement('div');
        nestedGroup.className = 'menusrc-nested-group';
        nestedGroup.id = `group-${folderId}`;

        this.layerList.appendChild(folderRow);
        this.layerList.appendChild(nestedGroup);

        layers.forEach((layer) => {
            this.currentLayers.push(layer);
            this.#addLayerToGroup(nestedGroup, layer);
        });
    }

    selectLayer(rowElement) {
        document.querySelectorAll('.menusrc-item-row.selected').forEach((el) => {
            el.classList.remove('selected');
        });

        rowElement.classList.add('selected');
        this.selectedLayer = rowElement;
        this.selectedSrc = null;
        
        // Dispatch event
        this.#dispatchLayerSelectedEvent(rowElement.id);
    }

    selectSrc(srcElement) {
        document.querySelectorAll('.menusrc-src-item.selected').forEach((el) => {
            el.classList.remove('selected');
        });

        srcElement.classList.add('selected');
        this.selectedSrc = srcElement;
        
        // Dispatch event
        const srcIndex = Array.from(srcElement.parentElement.children).indexOf(srcElement);
        const srcPath = srcElement.querySelector('img')?.src || '';
        this.#dispatchSrcSelectedEvent(srcIndex, srcPath);
    }

    getSelectedLayerId() {
        if (!this.selectedLayer) return null;
        return this.selectedLayer.id;
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

    #addLayerToGroup(parentGroup, layerData) {
        const layer = document.createElement('div');
        layer.className = 'menusrc-item-row menusrc-is-nested';
        layer.id = layerData.id;
        layer.dataset.layerId = layerData.id;

        let srcHtml = '';
        if (layerData.srcs && Array.isArray(layerData.srcs)) {
            srcHtml = layerData.srcs
                .map(
                    (src, idx) => `
                <div class="menusrc-src-item" data-src-index="${idx}">
                    <div class="menusrc-layer-icon">
                        <img src="${src}" alt="src${idx}" style="width:100%; height:100%; object-fit:contain;">
                    </div>
                    <span class="menusrc-layer-name">src${idx}</span>
                </div>
            `
                )
                .join('');
        }

        layer.innerHTML = `
            <span class="menusrc-layer-icon">🖼️</span>
            <span class="menusrc-layer-name">${layerData.name || 'Layer'}</span>
            <span class="menusrc-handle">☰</span>
            <div style="margin-left: 10px; flex-grow: 1;">
                ${srcHtml}
            </div>
        `;

        parentGroup.appendChild(layer);
    }

    #renderLayers() {
        this.layerList.innerHTML = '';
        this.layers.forEach((layer) => {
            this.#addLayerToGroup(this.layerList, layer);
        });
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
        const gridIsVisible =
            !this.widget.classList.contains('open') &&
            this.gridContent.children.length > 0;
        if (gridIsVisible) {
            this.gridContent.classList.add('menusrc-compact');
        } else {
            this.gridContent.classList.remove('menusrc-compact');
        }

        const layersVisible = this.widget.classList.contains('open');
        if (layersVisible) {
            const visibleCount = this.#countVisibleLayers();
            if (visibleCount < 10) {
                this.layerWrapper.classList.add('menusrc-compact');
            } else {
                this.layerWrapper.classList.remove('menusrc-compact');
            }
        } else {
            this.layerWrapper.classList.remove('menusrc-compact');
        }
    }

    #dispatchLayerSelectedEvent(layerId) {
        const event = new CustomEvent('layerSelected', {
            detail: { layerId }
        });
        document.dispatchEvent(event);
    }

    #dispatchSrcSelectedEvent(srcIndex, srcPath) {
        const event = new CustomEvent('srcSelected', {
            detail: {
                srcIndex,
                srcPath
            }
        });
        document.dispatchEvent(event);
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
            font-family: 'Segoe UI', sans-serif;
            background: #f0f0f0;
            touch-action: manipulation;
            margin: 0;
            display: flex;
            justify-content: center;
            width: 100%;
        }

        .menusrc-main {
            width: calc(100% - 20px);
            max-width: 500px;
            margin: auto;
            border: 2px solid var(--border-color);
            background: var(--bg-color);
            overflow: hidden;
            display: flex;
            flex-direction: column;
            border-radius: 8px;
            transition: max-width 0.18s ease, transform 0.18s ease;
        }

        .menusrc-header {
            display: flex;
            align-items: center;
            padding: 12px;
            background: #fff;
            border-bottom: 2px solid var(--border-color);
            cursor: pointer;
            z-index: 20;
        }

        .menusrc-icon-box {
            border: 1px solid #000;
            padding: 2px 6px;
            margin-right: 10px;
            font-weight: bold;
            user-select: none;
        }

        .menusrc-title {
            flex-grow: 1;
            font-weight: bold;
        }

        .menusrc-color-picker {
            width: 30px;
            height: 30px;
            border: 1px solid #000;
            border-radius: 4px;
            cursor: pointer;
            margin-right: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #fff;
        }

        .menusrc-color-input {
            display: none;
            cursor: pointer;
        }

        .menusrc-arrow {
            width: 0;
            height: 0;
            border-left: 6px solid transparent;
            border-right: 6px solid transparent;
            border-top: 8px solid black;
            transition: transform 0.24s;
        }

        .menusrc-main.open .menusrc-arrow {
            transform: rotate(180deg);
        }

        .menusrc-grid-wrapper {
            max-height: 165px;
            transition: max-height 0.32s ease, opacity 0.28s ease;
            overflow-x: auto;
            background: #fff;
        }

        .menusrc-main.open .menusrc-grid-wrapper {
            max-height: 0;
            opacity: 0;
            pointer-events: none;
        }

        .menusrc-grid-content {
            display: grid;
            grid-template-rows: repeat(3, var(--item-size));
            grid-auto-flow: column;
            gap: 4px;
            padding: 10px;
            width: max-content;
            transition: gap 0.18s, padding 0.18s;
        }

        .menusrc-grid-content.menusrc-compact {
            gap: 2px;
            padding: 6px;
            --item-size: 36px;
        }

        .menusrc-grid-item {
            width: var(--item-size);
            height: var(--item-size);
            background: #f9f9f9;
            border: 1px solid #ccc;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 11px;
            user-select: none;
            border-radius: 4px;
            position: relative;
        }

        .menusrc-grid-item.selected {
            background: #1a73e8;
            color: white;
            border-color: #0d47a1;
        }

        .menusrc-layer-wrapper {
            max-height: 0;
            opacity: 0;
            transition: max-height 0.36s ease, opacity 0.28s ease, padding 0.18s;
            overflow-y: auto;
            background: #fafafa;
            pointer-events: none;
        }

        .menusrc-main.open .menusrc-layer-wrapper {
            max-height: 600px;
            opacity: 1;
            pointer-events: auto;
        }

        .menusrc-layer-wrapper.menusrc-compact {
            padding: 6px;
        }

        .menusrc-layer-list {
            padding: 8px;
            position: relative;
        }

        .menusrc-item-row {
            display: flex;
            align-items: center;
            padding: 10px;
            margin-bottom: 6px;
            background: #fff;
            border: 1px solid #ddd;
            border-radius: 4px;
            user-select: none;
            touch-action: pan-y;
            transition: padding 0.14s, margin-bottom 0.14s, transform 0.12s;
        }

        .menusrc-item-row.selected {
            background: #e8f0fe;
            border-color: #1a73e8;
        }

        .menusrc-item-row.menusrc-dragging {
            opacity: 0.75;
            background: #d1e7ff;
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.18);
            z-index: 1000;
            position: relative;
        }

        .menusrc-layer-wrapper.menusrc-compact .menusrc-item-row {
            padding: 6px;
            margin-bottom: 4px;
            font-size: 13px;
        }

        .menusrc-layer-wrapper.menusrc-compact .menusrc-item-row .menusrc-handle {
            padding: 6px 10px;
        }

        .menusrc-src-folder {
            background: var(--folder-bg);
            font-weight: bold;
            border-left: 4px solid #1a73e8;
        }

        .menusrc-folder-toggle {
            cursor: pointer;
            margin-right: 8px;
            font-size: 10px;
            transition: transform 0.18s;
            display: inline-block;
        }

        .menusrc-src-folder.collapsed + .menusrc-nested-group {
            display: none;
        }

        .menusrc-src-folder.collapsed .menusrc-folder-toggle {
            transform: rotate(-90deg);
        }

        .menusrc-nested-group {
            margin-left: 25px;
            border-left: 1px dashed #ccc;
            padding-left: 8px;
        }

        .menusrc-is-nested {
            margin-left: 5px;
            background: #fff;
        }

        .menusrc-layer-icon {
            margin-right: 10px;
            min-width: 30px;
            height: 30px;
            border: 1px solid #ccc;
            border-radius: 3px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f9f9f9;
            overflow: hidden;
            font-size: 14px;
        }

        .menusrc-layer-name {
            flex-grow: 1;
            pointer-events: none;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .menusrc-handle {
            cursor: grab;
            padding: 5px 12px;
            font-size: 18px;
            color: #666;
            background: #f0f0f0;
            border-radius: 3px;
            margin-left: 8px;
            user-select: none;
        }

        .menusrc-handle:active {
            cursor: grabbing;
        }

        .menusrc-src-item {
            display: flex;
            align-items: center;
            padding: 6px 10px;
            margin: 2px 0;
            background: #f5f5f5;
            border: 1px solid #ccc;
            border-radius: 3px;
            font-size: 12px;
        }

        .menusrc-src-item .menusrc-layer-icon {
            margin-right: 8px;
            min-width: 24px;
            height: 24px;
        }

        .menusrc-src-item.selected {
            background: #1a73e8;
            color: white;
            border-color: #0d47a1;
        }

        @media (max-width: 420px) {
            .menusrc-icon-box {
                display: none;
            }
            .menusrc-header {
                padding: 8px;
            }
            .menusrc-title {
                font-size: 14px;
            }
        }
    `;
}

// ===== AUTO-INITIALIZATION (Integration Handler) =====
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (typeof window.studioMenuIntegration === 'undefined') {
            const container = document.getElementById('menusrcContainer');
            if (container) {
                window.studioMenuIntegration = new LayerSrcManager(container);
            }
        }
    });
} else {
    if (typeof window.studioMenuIntegration === 'undefined') {
        const container = document.getElementById('menusrcContainer');
        if (container) {
            window.studioMenuIntegration = new LayerSrcManager(container);
        }
    }
}

// ===== AUTO-INITIALIZATION (Integration Handler) =====
// Initialize dengan delay untuk memastikan container siap
function initStudioMenuIntegration() {
    const container = document.getElementById('menusrcContainer');
    if (container && typeof window.studioMenuIntegration === 'undefined') {
        window.studioMenuIntegration = new LayerSrcManager(container);
        console.log('✓ LayerSrcManager (UI + Logic) initialized');
    }
}

// Cek DOM state
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Delay sedikit untuk pastikan semua elements ready
        setTimeout(initStudioMenuIntegration, 100);
    });
} else {
    // Document sudah loaded, init langsung dengan delay
    setTimeout(initStudioMenuIntegration, 100);
}

// Export untuk module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LayerSrcManager;
}
