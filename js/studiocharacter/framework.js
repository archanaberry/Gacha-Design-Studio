/****************************************************************/
//                                                              //
//  -------------------Gacha Design Studio--------------------  //
//  Created by: Archana Berry                                   //
//  Assets credits: Lunime, OGL (Open Game License), MIT CC     //
//  Version resource: v0.001_alpha                              //
//  File: framework.js                                          //
//  Type: module[panel3]                                        //
//  Desc: Framework character display in panel3                 //
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

// framework.js
// Panel3 Framework Display - Menampilkan semua layer kerangka karakter

class FrameworkDisplay {
    constructor() {
        this.panel3 = document.getElementById('panel3');
        this.maxFrameSize = 120; // pixels
        this.borderRadius = 20; // pixels
        this.borderWidth = 5; // pixels
        this.trackSpacing = 5; // pixels
        this.columnsCount = 3; // grid columns
        this.allLayers = [];
        
        // Whitelist urutan layer sesuai rendering
        this.layerOrder = [
            'Aksesoris',
            'Rambut belakang',
            'Rambut samping',
            'Rambut depan',
            'Kepala',
            'Lengan atas kiri',
            'Lengan bawah kiri',
            'Tangan kiri',
            'Badan',
            'Lengan atas kanan',
            'Lengan bawah kanan',
            'Tangan kanan',
            'Paha atas kiri',
            'Kaki kiri',
            'Paha atas kanan',
            'Kaki kanan'
        ];
    }

    /**
     * Initialize framework panel dengan semua layer
     * @param {Array} layers - Array of layer objects
     */
    initialize(layers) {
        if (!this.panel3 || !layers || layers.length === 0) {
            console.warn(`❌ Framework.initialize: panel3=${!!this.panel3}, layers=${layers?.length || 0}`);
            return;
        }

        // 🔥 DIAGNOSTIC: Verify layer instances are valid
        const validLayers = layers.filter(l => {
            const isValid = l && l.element && l.element.classList;
            if (!isValid) {
                console.warn(`⚠️ Framework.initialize: Invalid layer:`, {
                    name: l?.name,
                    hasElement: !!l?.element,
                    hasClassList: !!l?.element?.classList,
                    elementType: l?.element?.constructor.name
                });
            }
            return isValid;
        });

        if (validLayers.length < layers.length) {
            console.warn(`⚠️ Framework.initialize: Only ${validLayers.length}/${layers.length} layers are valid`);
        }

        // Sort layers berdasarkan whitelist order
        this.allLayers = this.sortLayersByWhitelist(layers);
        
        console.log(`✅ Framework.initialize: Rendering ${this.allLayers.length} layers`);
        this.renderFrameworkPanel();
    }

    /**
     * Sort layers berdasarkan whitelist order
     * @param {Array} layers - Original layers array
     * @returns {Array} Sorted layers
     */
    sortLayersByWhitelist(layers) {
        const sorted = [];
        
        // Loop through whitelist order
        for (const layerName of this.layerOrder) {
            const layer = layers.find(l => l.name === layerName);
            if (layer) {
                sorted.push(layer);
            }
        }
        
        // Add any layers not in whitelist (ke belakang)
        for (const layer of layers) {
            if (!sorted.includes(layer)) {
                sorted.push(layer);
            }
        }
        
        return sorted;
    }

    /**
     * Render panel3 dengan grid layout
     */
    renderFrameworkPanel() {
        if (!this.panel3) return;

        // Clear existing content
        this.panel3.innerHTML = '';

        // Create title
        const title = document.createElement('h2');
        title.textContent = 'Kerangka Karakter';
        title.style.fontSize = '20px';
        title.style.margin = '10px 5px';
        title.style.padding = '10px';
        this.panel3.appendChild(title);

        // Create grid container
        const gridContainer = document.createElement('div');
        gridContainer.id = 'frameworkGrid';
        gridContainer.style.display = 'grid';
        gridContainer.style.gridTemplateColumns = `repeat(${this.columnsCount}, 1fr)`;
        gridContainer.style.gap = `${this.trackSpacing}px`;
        gridContainer.style.padding = '10px';
        gridContainer.style.overflow = 'auto';
        gridContainer.style.minHeight = 'auto';

        // Render setiap layer (dengan semua src digabung dalam satu frame)
        this.allLayers.forEach((layer) => {
            if (layer.src && Array.isArray(layer.src) && layer.src.length > 0) {
                // Buat satu frame untuk layer ini dengan semua src digabung
                const frameCard = this.createCompositeFrameCard(layer);
                gridContainer.appendChild(frameCard);
            }
        });

        this.panel3.appendChild(gridContainer);
    }

    /**
     * Create composite frame card dengan semua src digabung
     * @param {Object} layer - Layer object dengan name property dan src array
     * @returns {HTMLElement} Frame card element
     */
    createCompositeFrameCard(layer) {
        const card = document.createElement('div');
        card.className = 'framework-card';
        card.style.display = 'flex';
        card.style.flexDirection = 'column';
        card.style.alignItems = 'center';
        card.style.gap = '5px';
        card.style.cursor = 'pointer';
        card.style.transition = 'transform 0.2s ease, border-color 0.2s ease';
        card.style.padding = '5px';
        card.style.borderRadius = '8px';
        card.style.border = '2px solid transparent';
        
        // Add hover effect
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'scale(1.05)';
            card.style.borderColor = '#888';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'scale(1)';
            // Keep border color jika selected, otherwise transparent
            if (!card.classList.contains('framework-card-selected')) {
                card.style.borderColor = 'transparent';
            }
        });

        // Add click handler untuk trigger selection di panel1
        card.addEventListener('click', (e) => {
            // 🔥 CRITICAL: Pass Ctrl key info to handler
            const isCtrl = e.ctrlKey || e.metaKey;
            console.log(`🎲 FrameworkPanel Click: "${layer.name}", Ctrl=${isCtrl}`);
            
            this.handleCardClick(layer, card, isCtrl);
        }, true); // 🔥 CAPTURE PHASE - must be before child handlers

        // Create frame container
        const frame = document.createElement('div');
        frame.className = 'framework-frame';
        frame.style.width = `${this.maxFrameSize}px`;
        frame.style.height = `${this.maxFrameSize}px`;
        frame.style.border = `${this.borderWidth}px solid #333`;
        frame.style.borderRadius = `${this.borderRadius}px`;
        frame.style.display = 'flex';
        frame.style.alignItems = 'center';
        frame.style.justifyContent = 'center';
        frame.style.backgroundColor = '#f5f5f5';
        frame.style.overflow = 'hidden';
        frame.style.position = 'relative';

        // Create canvas untuk composite rendering
        const canvas = document.createElement('canvas');
        canvas.width = this.maxFrameSize;
        canvas.height = this.maxFrameSize;
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.objectFit = 'contain';

        frame.appendChild(canvas);

        // Load dan render semua images ke canvas
        this.renderCompositeImages(canvas, layer.src);

        // Create label
        const label = document.createElement('div');
        label.className = 'framework-label';
        label.style.fontSize = '12px';
        label.style.textAlign = 'center';
        label.style.color = '#333';
        label.style.wordBreak = 'break-word';
        label.style.maxWidth = '120px';
        label.textContent = layer.name;

        card.appendChild(frame);
        card.appendChild(label);

        return card;
    }

    /**
     * Render multiple images ke canvas dengan composite
     * Gambar di-render secara berurutan (src0, src1, src2, dst)
     * @param {Canvas} canvas - Canvas element
     * @param {Array} srcArray - Array of image URLs
     */
    renderCompositeImages(canvas, srcArray) {
        const ctx = canvas.getContext('2d');

        // Clear canvas
        ctx.fillStyle = '#f5f5f5';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Gunakan Promise.all untuk load semua images terlebih dahulu
        const imagePromises = srcArray.map((srcUrl) => {
            return new Promise((resolve) => {
                const img = new Image();
                img.crossOrigin = 'anonymous';
                
                img.onload = () => {
                    resolve(img);
                };
                
                img.onerror = () => {
                    resolve(null); // Return null jika fail
                };
                
                img.src = srcUrl;
            });
        });

        // Tunggu semua images selesai ter-load, kemudian render dalam order yang benar
        Promise.all(imagePromises).then((images) => {
            // Clear canvas lagi (untuk memastikan)
            ctx.fillStyle = '#f5f5f5';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Render setiap image dalam order src0, src1, src2, dst
            images.forEach((img, index) => {
                if (!img) return; // Skip jika image gagal ter-load

                // Calculate size untuk fit dalam canvas
                const scale = Math.min(
                    canvas.width / img.naturalWidth,
                    canvas.height / img.naturalHeight
                );
                
                const scaledWidth = img.naturalWidth * scale;
                const scaledHeight = img.naturalHeight * scale;
                
                // Center image
                const x = (canvas.width - scaledWidth) / 2;
                const y = (canvas.height - scaledHeight) / 2;
                
                // Draw image - dalam urutan yang benar
                ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
            });
        });
    }

    /**
     * Update framework display saat ada layer changes
     * @param {Array} layers - Updated layers array
     */
    update(layers) {
        this.initialize(layers);
    }

    /**
     * Clear framework display
     */
    clear() {
        if (this.panel3) {
            this.panel3.innerHTML = '';
        }
    }

    /**
     * Handle click pada framework card - trigger selection di panel1
     * Support untuk single selection dan multi-selection via Ctrl+Click atau selector mode
     * Menggunakan SAME multiselect logic sebagai touchscreen/multiDrag system
     * @param {Object} layer - Layer object to select
     * @param {Element} cardElement - DOM element dari card yang di-klik
     * @param {Boolean} isCtrl - Whether Ctrl key was held
     */
    handleCardClick(layer, cardElement, isCtrl = false) {
        if (!layer || !layer.element) {
            console.warn(`❌ handleCardClick: invalid layer or layer.element`, {
                layer: layer?.name,
                hasElement: !!layer?.element,
                elementValid: layer?.element?.classList ? 'yes' : 'no'
            });
            return;
        }
        
        try {
            console.log(`�️ FrameworkPanel Click:`, {
                layer: layer.name,
                isCtrl,
                selectorActive: window.__selectorActive,
                selectorValid: !!window.selectorInstance,
                selectedCount: window.selectorInstance?.selectedLayers?.length || 0,
                elementInDOM: layer.element.parentElement ? 'yes' : 'no'
            });
            
            // 🔥 CRITICAL: Handle BOTH Ctrl+Click AND selector mode (SAMA seperti studiopose.js)
            if (isCtrl || window.__selectorActive) {
                console.log(`✋ FrameworkPanel: INTERCEPTED Ctrl+Click/Selector Mode on "${layer.name}"`);
                
                // Toggle selection pada layer element di panel1
                const wasSelected = layer.element.classList.contains('selected');
                
                if (wasSelected) {
                    // Remove from selection
                    layer.element.classList.remove('selected');
                    cardElement.classList.remove('framework-card-selected');
                    layer.selected = false;
                    console.log(`✖ Removed "${layer.name}" from framework selection`, {
                        elementHasClass: layer.element.classList.contains('selected'),
                        cardHasClass: cardElement.classList.contains('framework-card-selected'),
                        layerSelected: layer.selected
                    });
                } else {
                    // Add to selection
                    layer.element.classList.add('selected');
                    cardElement.classList.add('framework-card-selected');
                    layer.selected = true;
                    console.log(`✅ Added "${layer.name}" to framework selection`, {
                        elementHasClass: layer.element.classList.contains('selected'),
                        cardHasClass: cardElement.classList.contains('framework-card-selected'),
                        layerSelected: layer.selected
                    });
                }
                
                // 🔥 CRITICAL: Sync selector.selectedLayers - SAME LOGIC as studiopose.js onLayerPointerDown
                const selector = window.selectorInstance;
                if (selector) {
                    // Ensure selectedLayers array exists (like in studiopose.js line 132)
                    if (!Array.isArray(selector.selectedLayers)) {
                        selector.selectedLayers = [];
                    }
                    
                    // Toggle logic - remove if was selected, add otherwise
                    if (wasSelected) {
                        // Remove - filter by both layer instance and element (defensive)
                        selector.selectedLayers = selector.selectedLayers.filter(s => 
                            s !== layer && s !== layer.element && s.__layerInstance !== layer
                        );
                    } else {
                        // Add - check for duplicates (defensive against race conditions)
                        const alreadyExists = selector.selectedLayers.some(s => 
                            s === layer || s === layer.element || s.__layerInstance === layer
                        );
                        if (!alreadyExists) {
                            selector.selectedLayers.push(layer);
                        }
                    }
                    
                    console.log(`📊 FrameworkPanel: selector.selectedLayers updated, total: ${selector.selectedLayers.length}`);
                }
                
                // Update visual feedback - SAME ORDER as studiopose.js
                // Key: updateCoordInput() MUST be called last untuk reflect selection state
                if (typeof updateMenuLayerSelectionForMultiSelect === 'function') {
                    updateMenuLayerSelectionForMultiSelect();
                }
                if (window.frameworkDisplay && typeof window.frameworkDisplay.updateSelectionVisuals === 'function') {
                    window.frameworkDisplay.updateSelectionVisuals();
                }
                
                // 🔥 CRITICAL: Sync DOM .selected classes dengan selector.selectedLayers
                this.syncFrameworkSelectionWithPanel();
                
                if (typeof updateCoordInput === 'function') {
                    updateCoordInput();  // 🔥 MUST be last - updates Panel2 display with color indicator
                }
                
                console.log(`✅ Toggle complete on "${layer.name}", total selected: ${selector?.selectedLayers?.length || 0}`);
                return;
            }
            
            // Single select mode - clear previous selection (DEFAULT behavior tanpa Ctrl)
            console.log(`👆 FrameworkPanel: Single-select on "${layer.name}"`);
            
            // Clear framework card visuals
            document.querySelectorAll('.framework-card-selected').forEach(card => {
                card.classList.remove('framework-card-selected');
            });
            
            // Trigger selectLayer dari studiopose.js
            // selectLayer sẽ memanggil syncLayerSelectionAcrossAllPanels dan updateCoordInput()
            if (typeof selectLayer === 'function') {
                selectLayer(layer);
                cardElement.classList.add('framework-card-selected');
                console.log(`✅ selectLayer called for "${layer.name}"`);
            }
        } catch (err) {
            console.error(`💥 Error in handleCardClick for "${layer.name}":`, err);
        }
    }

    /**
     * Update menulayer selection ketika framework card di-klik
     * @param {Object} layer - Layer object
     */
    updateMenuLayerSelection(layer) {
        if (!window.studioMenuLayer || !layer) return;
        
        const menuItems = document.querySelectorAll('.menulayer-item');
        const layerName = layer.name;
        
        for (const item of menuItems) {
            const nameEl = item.querySelector('.menulayer-name');
            if (nameEl && nameEl.textContent === layerName) {
                // Dispatch event seperti yang dilakukan menulayer
                window.studioMenuLayer.selectLayer(item);
                break;
            }
        }
    }

    /**
     * Update visual feedback untuk selected frames di panel3
     * Di-call saat ada perubahan selection di panel1
     */
    updateSelectionVisuals() {
        if (!this.panel3) return;
        
        const selectedElements = document.querySelectorAll('.layer.selected, .layer-group.selected');
        const selectedCards = this.panel3.querySelectorAll('.framework-card');
        
        selectedCards.forEach(card => {
            const labelEl = card.querySelector('.framework-label');
            if (!labelEl) return;
            
            const layerName = labelEl.textContent;
            
            // Cek apakah ada layer yang selected dengan nama yang sama
            let isSelected = false;
            for (const selectedEl of selectedElements) {
                // Cari layer di array yang match dengan element ini
                const layer = this.allLayers.find(l => l.element === selectedEl);
                if (layer && layer.name === layerName) {
                    isSelected = true;
                    break;
                }
            }
            
            if (isSelected) {
                card.classList.add('framework-card-selected');
            } else {
                card.classList.remove('framework-card-selected');
            }
        });
    }

    /**
     * Sinkronisasi Framework selection dengan panel1 layer elements
     * Memastikan selector.selectedLayers di-reflect di DOM dengan .selected class dan visual outline
     * @param {Boolean} forceRefresh - Jika true, force re-render visual feedback
     */
    syncFrameworkSelectionWithPanel() {
        const selector = window.selectorInstance;
        if (!selector || !Array.isArray(selector.selectedLayers)) {
            console.warn(`❌ Framework sync: selector.selectedLayers not available`);
            return;
        }

        // Step 1: Ensure all selected layers punya .selected class di DOM
        selector.selectedLayers.forEach(layerOrEl => {
            let el = null;
            
            if (layerOrEl && layerOrEl.element) {
                // It's a Layer instance
                el = layerOrEl.element;
            } else if (layerOrEl && layerOrEl.classList) {
                // It's a DOM element
                el = layerOrEl;
            }
            
            if (el) {
                // Add visual class untuk outline
                if (!el.classList.contains('selected')) {
                    el.classList.add('selected');
                    console.log(`✅ Added .selected class to DOM element: ${el.className}`);
                }
            }
        });

        // Step 2: Remove .selected dari layer yang TIDAK di selector.selectedLayers
        document.querySelectorAll('.layer.selected, .layer-group.selected').forEach(el => {
            const isInSelector = selector.selectedLayers.some(s => 
                (s && s.element === el) || s === el || (s && s.__layerInstance && s.__layerInstance.element === el)
            );
            
            if (!isInSelector) {
                el.classList.remove('selected');
                console.log(`✖ Removed .selected class from DOM element: ${el.className}`);
            }
        });

        // Step 3: Update framework card indicators
        this.updateSelectionVisuals();
        
        console.log(`📊 Framework sync complete: ${selector.selectedLayers.length} layers selected`);
    }
}

// Create global instance
window.frameworkDisplay = new FrameworkDisplay();

/**
 * 🔥 HELPER: Force sync framework selection dengan panel1
 * Panggil ini setiap kali ada perubahan selection untuk ensure visual consistency
 */
window.syncFrameworkWithPanel1 = function() {
    if (window.frameworkDisplay) {
        window.frameworkDisplay.syncFrameworkSelectionWithPanel();
    }
};

// Export untuk digunakan di file lain
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FrameworkDisplay;
}
