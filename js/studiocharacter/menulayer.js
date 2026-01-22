/****************************************************************/
//                                                              //
//  -------------------Gacha Design Studio--------------------  //
//  Created by: Archana Berry                                   //
//  Assets credits: Lunime, OGL (Open Game License), MIT CC     //
//  Version resource: v0.001_alpha                              //
//  File: menulayer.js                                          //
//  Type: module[design]                                        //
//  Desc: Child Layer Manager (Group/InnerChild) UI + Logic     //
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
 * MENU LAYER - Child Layers Manager (Group/InnerChild)
 * 
 * Handles hierarchical layer structure:
 * - Parent Layer
 *   - Child Layer 1
 *   - Child Layer 2
 *     - GrandChild Layer 1
 *     - GrandChild Layer 2
 */

class MenuLayer {
    #css = `
        :root {
            --border-color: #333;
            --bg-color: #fff;
            --item-size: 45px;
            --group-bg: #fff3cd;
        }

        .menulayer-container {
            font-family: 'Segoe UI', sans-serif;
            background: #f0f0f0;
            touch-action: manipulation;
            margin: 0;
            display: flex;
            justify-content: center;
            width: 100%;
        }

        .menulayer-main {
            width: calc(100% - 20px);
            max-width: 500px;
            margin: auto;
            border: 2px solid var(--border-color);
            background: var(--bg-color);
            overflow: hidden;
            display: flex;
            flex-direction: column;
            border-radius: 8px;
            transition: max-width 0.18s ease;
        }

        .menulayer-header {
            display: flex;
            align-items: center;
            padding: 12px;
            background: #fff;
            border-bottom: 2px solid var(--border-color);
            cursor: pointer;
            z-index: 20;
        }

        .menulayer-icon-box {
            border: 1px solid #000;
            padding: 2px 6px;
            margin-right: 10px;
            font-weight: bold;
            user-select: none;
        }

        .menulayer-title {
            flex-grow: 1;
            font-weight: bold;
        }

        .menulayer-arrow {
            width: 0;
            height: 0;
            border-left: 6px solid transparent;
            border-right: 6px solid transparent;
            border-top: 8px solid black;
            transition: transform 0.24s;
        }

        .menulayer-main.open .menulayer-arrow {
            transform: rotate(180deg);
        }

        .menulayer-wrapper {
            max-height: 0;
            opacity: 0;
            transition: max-height 0.36s ease, opacity 0.28s ease;
            overflow-y: auto;
            background: #fafafa;
            pointer-events: none;
        }

        .menulayer-main.open .menulayer-wrapper {
            max-height: 600px;
            opacity: 1;
            pointer-events: auto;
        }

        .menulayer-list {
            padding: 8px;
            position: relative;
        }

        .menulayer-item {
            display: flex;
            align-items: center;
            padding: 10px;
            margin-bottom: 6px;
            background: #fff;
            border: 1px solid #ddd;
            border-radius: 4px;
            user-select: none;
            touch-action: pan-y;
            transition: padding 0.14s, margin-bottom 0.14s;
        }

        .menulayer-item.selected {
            background: #fff3cd;
            border-color: #ffc107;
        }

        .menulayer-item.dragging {
            opacity: 0.75;
            background: #ffe599;
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.18);
            z-index: 1000;
            position: relative;
        }

        /* Parent Layer Style */
        .menulayer-item.parent {
            background: #e7f3ff;
            border-left: 4px solid #2196f3;
            font-weight: bold;
        }

        .menulayer-item.parent.selected {
            background: #bbdefb;
            border-left-color: #1976d2;
        }

        /* Child Layer Style */
        .menulayer-item.child {
            margin-left: 25px;
            padding-left: 8px;
            background: #f5f5f5;
            border-left: 1px dashed #ccc;
        }

        .menulayer-item.child.selected {
            background: #ffe599;
            border-left-color: #ffc107;
        }

        /* GrandChild Layer Style */
        .menulayer-item.grandchild {
            margin-left: 50px;
            padding-left: 8px;
            background: #f9f9f9;
            border-left: 1px dotted #999;
            font-size: 12px;
        }

        .menulayer-item.grandchild.selected {
            background: #ffccbc;
            border-left-color: #ff6f00;
        }

        .menulayer-toggle {
            cursor: pointer;
            margin-right: 8px;
            font-size: 10px;
            transition: transform 0.18s;
            display: inline-block;
            min-width: 12px;
        }

        .menulayer-item.collapsed .menulayer-toggle {
            transform: rotate(-90deg);
        }

        .menulayer-children {
            margin-left: 0;
            border-left: 1px dashed #999;
            padding-left: 8px;
        }

        .menulayer-item.collapsed + .menulayer-children {
            display: none;
        }

        .menulayer-icon {
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

        .menulayer-name {
            flex-grow: 1;
            pointer-events: none;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .menulayer-handle {
            cursor: grab;
            padding: 5px 12px;
            font-size: 18px;
            color: #666;
            background: #f0f0f0;
            border-radius: 3px;
            margin-left: 8px;
            user-select: none;
        }

        .menulayer-handle:active {
            cursor: grabbing;
        }

        .menulayer-actions {
            display: flex;
            gap: 4px;
            margin-left: 8px;
        }

        .menulayer-btn {
            padding: 4px 8px;
            font-size: 11px;
            background: #e0e0e0;
            border: 1px solid #999;
            border-radius: 3px;
            cursor: pointer;
            user-select: none;
        }

        .menulayer-btn:hover {
            background: #d0d0d0;
        }

        @media (max-width: 420px) {
            .menulayer-icon-box {
                display: none;
            }
            .menulayer-header {
                padding: 8px;
            }
            .menulayer-title {
                font-size: 14px;
            }
            .menulayer-item {
                padding: 6px;
            }
        }
    `;

    constructor(container, options = {}) {
        this.container = container;
        this.options = options;

        this.selectedLayer = null;
        this.selectedParent = null;
        this.dragItem = null;
        this.lastPointerMoveRaf = null;

        this.layers = []; // Parent layers
        this.layerMap = new Map();

        this.#initCSS();
        this.#buildHTML();
        this.#attachEventListeners();
    }

    #initCSS() {
        const style = document.createElement('style');
        style.type = 'text/css';
        style.appendChild(document.createTextNode(this.#css));
        document.head.appendChild(style);
    }

    #buildHTML() {
        const wrapper = document.createElement('div');
        wrapper.className = 'menulayer-container';

        wrapper.innerHTML = `
            <div class="menulayer-main" id="menulayer-widget">
                <div class="menulayer-header" id="menulayer-headerToggle">
                    <div class="menulayer-icon-box">📁</div>
                    <div class="menulayer-title">CHILD LAYERS</div>
                    <div class="menulayer-arrow"></div>
                </div>

                <div class="menulayer-wrapper" id="menulayer-wrapper">
                    <div class="menulayer-list" id="menulayer-list"></div>
                </div>
            </div>
        `;

        this.container.appendChild(wrapper);

        this.widget = document.getElementById('menulayer-widget');
        this.headerToggle = document.getElementById('menulayer-headerToggle');
        this.wrapper = document.getElementById('menulayer-wrapper');
        this.list = document.getElementById('menulayer-list');
    }

    #attachEventListeners() {
        // Toggle header
        this.headerToggle.addEventListener('click', () => {
            this.widget.classList.toggle('open');
        });

        // Layer selection
        this.list.addEventListener('click', (e) => {
            const item = e.target.closest('.menulayer-item');
            if (!item) return;
            this.selectLayer(item);
        });

        // Layer toggle (collapse/expand children)
        this.list.addEventListener('click', (e) => {
            const toggle = e.target.closest('.menulayer-toggle');
            if (!toggle) return;
            const item = toggle.closest('.menulayer-item');
            item.classList.toggle('collapsed');
        });

        // Drag & Drop
        this.list.addEventListener('pointerdown', (e) => {
            const handle = e.target.closest('.menulayer-handle');
            if (!handle) return;

            this.dragItem = handle.closest('.menulayer-item');
            this.dragItem.classList.add('menulayer-dragging');
            try {
                this.list.setPointerCapture(e.pointerId);
            } catch (_) {}

            e.preventDefault();
        });

        this.list.addEventListener('pointermove', (e) => {
            if (!this.dragItem) return;

            if (this.lastPointerMoveRaf) {
                cancelAnimationFrame(this.lastPointerMoveRaf);
            }

            this.lastPointerMoveRaf = requestAnimationFrame(() => {
                const y = e.clientY;
                const items = [...this.list.querySelectorAll('.menulayer-item:not(.menulayer-dragging)')];

                const targetItem = items.find((item) => {
                    const rect = item.getBoundingClientRect();
                    return y > rect.top && y < rect.bottom;
                });

                if (!targetItem) return;

                const rect = targetItem.getBoundingClientRect();
                const midpoint = (rect.top + rect.bottom) / 2;

                if (y > midpoint) {
                    targetItem.after(this.dragItem);
                } else {
                    targetItem.before(this.dragItem);
                }
            });
        });

        this.list.addEventListener('pointerup', (e) => {
            if (!this.dragItem) return;

            this.dragItem.classList.remove('menulayer-dragging');
            try {
                this.list.releasePointerCapture(e.pointerId);
            } catch (_) {}
            this.dragItem = null;
        });
    }

    // ===== PUBLIC API =====
    
    addParentLayer(layerData) {
        const layerId = layerData.id || `layer-${Date.now()}`;
        this.layerMap.set(layerId, layerData);
        this.layers.push(layerData);
        this.#renderLayers();
    }

    addMultipleParents(layersData) {
        layersData.forEach(layer => this.addParentLayer(layer));
    }

    selectLayer(itemElement) {
        document.querySelectorAll('.menulayer-item.selected').forEach((el) => {
            el.classList.remove('selected');
        });

        itemElement.classList.add('selected');
        this.selectedLayer = itemElement;
        
        const layerId = itemElement.id;
        const layerData = this.layerMap.get(layerId);
        
        this.#dispatchLayerSelectedEvent(layerId, layerData);
    }

    getSelectedLayerId() {
        return this.selectedLayer?.id || null;
    }

    getSelectedLayer() {
        const layerId = this.getSelectedLayerId();
        return layerId ? this.layerMap.get(layerId) : null;
    }

    #renderLayers() {
        this.list.innerHTML = '';

        this.layers.forEach((layer) => {
            this.#addParentLayerToDOM(this.list, layer);
        });
    }

    #addParentLayerToDOM(parentElement, layerData, level = 0) {
        const layerId = layerData.id || `layer-${Date.now()}`;
        
        // Parent item
        const parentItem = document.createElement('div');
        parentItem.className = 'menulayer-item parent';
        parentItem.id = layerId;
        parentItem.dataset.layerId = layerId;

        const hasChildren = layerData.childLayers && layerData.childLayers.length > 0;
        const toggleHtml = hasChildren ? `<span class="menulayer-toggle">▼</span>` : '<span class="menulayer-toggle" style="visibility:hidden;">▼</span>';

        parentItem.innerHTML = `
            ${toggleHtml}
            <span class="menulayer-icon">📦</span>
            <span class="menulayer-name">${layerData.name || 'Layer'}</span>
            <span class="menulayer-handle">☰</span>
        `;

        parentElement.appendChild(parentItem);

        // Children container
        if (hasChildren) {
            const childrenContainer = document.createElement('div');
            childrenContainer.className = 'menulayer-children';

            layerData.childLayers.forEach((child) => {
                this.#addChildLayerToDOM(childrenContainer, child, 1, parentItem);
            });

            parentElement.appendChild(childrenContainer);
        }
    }

    #addChildLayerToDOM(parentElement, layerData, depth, parentItem) {
        const layerId = layerData.id || `layer-${Date.now()}`;
        
        const childItem = document.createElement('div');
        const depthClass = depth === 1 ? 'child' : 'grandchild';
        childItem.className = `menulayer-item ${depthClass}`;
        childItem.id = layerId;
        childItem.dataset.layerId = layerId;
        childItem.dataset.depth = depth;

        const hasChildren = layerData.childLayers && layerData.childLayers.length > 0;
        const toggleHtml = hasChildren ? `<span class="menulayer-toggle">▼</span>` : '<span class="menulayer-toggle" style="visibility:hidden;">▼</span>';

        childItem.innerHTML = `
            ${toggleHtml}
            <span class="menulayer-icon">🔗</span>
            <span class="menulayer-name">${layerData.name || 'Child Layer'}</span>
            <span class="menulayer-handle">☰</span>
        `;

        parentElement.appendChild(childItem);

        // Grandchildren
        if (hasChildren) {
            const grandChildrenContainer = document.createElement('div');
            grandChildrenContainer.className = 'menulayer-children';

            layerData.childLayers.forEach((grandchild) => {
                this.#addChildLayerToDOM(grandChildrenContainer, grandchild, depth + 1, childItem);
            });

            parentElement.appendChild(grandChildrenContainer);
        }
    }

    #dispatchLayerSelectedEvent(layerId, layerData) {
        const event = new CustomEvent('layerChildSelected', {
            detail: {
                layerId,
                layerData,
                layer: this.getSelectedLayer()
            }
        });
        document.dispatchEvent(event);
    }

    update() {
        // Placeholder untuk update jika diperlukan
    }

    getSelectedLayerData() {
        return this.getSelectedLayer();
    }
}

// ===== AUTO-INITIALIZATION =====
function initMenuLayer() {
    const container = document.getElementById('menulayerContainer');
    if (container && typeof window.studioMenuLayer === 'undefined') {
        window.studioMenuLayer = new MenuLayer(container);
        console.log('✓ MenuLayer (Child Layers Manager) initialized');
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initMenuLayer, 150);
    });
} else {
    setTimeout(initMenuLayer, 150);
}

// Export untuk module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MenuLayer;
}
