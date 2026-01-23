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
            return;
        }

        // Sort layers berdasarkan whitelist order
        this.allLayers = this.sortLayersByWhitelist(layers);
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
            e.stopPropagation();
            this.handleCardClick(layer, card);
        });

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
     * Support untuk single selection dan multi-selection via selector
     * @param {Object} layer - Layer object to select
     * @param {Element} cardElement - DOM element dari card yang di-klik
     */
    handleCardClick(layer, cardElement) {
        if (!layer || !layer.element) {
            return;
        }
        
        // Jika selector aktif (multi-select mode)
        if (window.__selectorActive) {
            // Toggle selection pada layer element di panel1
            if (layer.element.classList.contains('selected')) {
                layer.element.classList.remove('selected');
                cardElement.classList.remove('framework-card-selected');
            } else {
                layer.element.classList.add('selected');
                cardElement.classList.add('framework-card-selected');
            }
            // Update menulayer dan sinkronisasi multi-select
            if (typeof updateMenuLayerSelectionForMultiSelect === 'function') {
                updateMenuLayerSelectionForMultiSelect();
            }
        } else {
            // Single select mode - clear previous selection
            document.querySelectorAll('.framework-card-selected').forEach(card => {
                card.classList.remove('framework-card-selected');
            });
            
            // Trigger selectLayer dari studiopose.js
            // selectLayer akan memanggil syncLayerSelectionAcrossAllPanels
            if (typeof selectLayer === 'function') {
                selectLayer(layer);
                cardElement.classList.add('framework-card-selected');
            }
            
            // Scroll panel1 ke layer yang ter-select
            setTimeout(() => {
                if (layer.element) {
                    layer.element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 100);
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
}

// Create global instance
window.frameworkDisplay = new FrameworkDisplay();

// Export untuk digunakan di file lain
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FrameworkDisplay;
}
