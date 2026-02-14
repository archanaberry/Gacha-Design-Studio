/****************************************************************/
//                                                              //
//  -------------------Gacha Design Studio--------------------  //
//  Created by: Archana Berry                                   //
//  Assets credits: Lunime, OGL (Open Game License), MIT CC     //
//  Version resource: v0.001_alpha                              //
//  File: layer.js                                              //
//  Type: module[design]                                        //
//  Desc: Handling control layer in studio                      //
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

// layer.js
class Layer {
    #name = null;
    #x = 0;
    #y = 0;
    #rotation = 0;
    #scale = 1;
    #flipX = false;
    #flipY = false;
    #skewX = 0;
    #skewY = 0;
    #width = null; // Tambahkan properti width
    #height = null; // Tambahkan properti height
    #src = [];
    #childLayers = [];
    #ondragstart = null;
    #color = null;
    #srcColors = {}; // Warna spesifik untuk setiap src (color0, color1, color2, dst)
    #srcProperties = {}; // Per-src properties (posX0, posY1, rotation2, opacity3, dst)
    #parentLayer = null; // Reference ke parent layer jika ini adalah child
    #opacity = 1; // 0-1
    #selectedImageIndex = null; // Index src yang sedang dipilih
    #relativeX = 0; // Posisi relatif terhadap parent (hanya berlaku jika punya parent)
    #relativeY = 0; // Posisi relatif terhadap parent (hanya berlaku jika punya parent)
    #contentWrapper = null; // Wrapper untuk child agar terlindungi dari parent transform
    #minX = 0; // Bounding box min X relative to layer origin
    #minY = 0; // Bounding box min Y
    #maxX = 0; // Bounding box max X
    #maxY = 0; // Bounding box max Y
    #hasFinalBounds = false; // Flag if bounds are calculated from loaded images
    options = {};

    constructor(name, src, options = {}, childLayers = []) {
        this.options = options || {};
        this.#name = name;
        this.#src = Array.isArray(src) ? src : [src];
        this.#x = 0; // Posisi awal x
        this.#y = 0; // Posisi awal y
        this.#rotation = 0; // Rotasi awal
        this.#scale = 1; // Skala awal
        this.selected = false; // Status seleksi
        this.#flipX = false; // Apakah horizontal flipped
        this.#flipY = false; // Apakah vertical flipped   
        this.#width = options.width || null; // Lebar awal
        this.#height = options.height || null; // Tinggi awal
        this.#color = options.color || null; // Warna opsional
        this.element = null; // Referensi ke elemen DOM
        this.#childLayers = childLayers.map(child => {
            if (child instanceof Layer) {
                return child;
            } else {
                return new Layer(child.layerName, child.src, child.options, child.childLayers || []);
            }
        });

        // Initialize bounds based on property offsets immediately (naturalWidth unknown yet)
        this.#initBoundsFromProperties();

        // Set initial options SEBELUM initElement agar color dan per-src properties siap
        if (options) {
            // Simpan options untuk referensi eksternal (selected.options dll.)
            this.options = options;
            // Posisi default
            if ('posX' in options) this.#x = options.posX;
            if ('x' in options) this.#x = options.x; // Backward compatibility
            if ('posY' in options) this.#y = options.posY;
            if ('y' in options) this.#y = options.y; // Backward compatibility

            // Transformasi
            if ('rotation' in options) this.#rotation = options.rotation;
            if ('rotate' in options) this.#rotation = options.rotate;
            if ('scale' in options) this.#scale = options.scale;
            if ('skewX' in options) this.#skewX = options.skewX;
            if ('skewY' in options) this.#skewY = options.skewY;

            // Flip
            if ('flipX' in options) this.#flipX = options.flipX;
            if ('flipY' in options) this.#flipY = options.flipY;

            // Ukuran
            if ('width' in options && !this.#width) this.#width = options.width;
            if ('height' in options && !this.#height) this.#height = options.height;

            // Warna - parse color0, color1, color2, dst
            this.#parseColorOptions(options);

            // Per-src properties - parse posX0, posY1, opacity2, dst
            this.#parseSrcProperties(options);

            // Opacity
            if ('opacity' in options) {
                // Expect value 0-1; if user provided 0-100, normalize
                let val = options.opacity;
                if (val > 1) val = Math.min(100, val) / 100;
                this.#opacity = Number(val) || 0;
            }
        }

        // Initialize element SETELAH semua options sudah di-parse
        this.#initElement();
        this.#updateElement();
    }

    #parseColorOptions(options) {
        // Parse color untuk seluruh layer
        if ('color' in options && options.color !== null) {
            this.#color = options.color;
        }

        // Parse color per src (color0, color1, color2, dst)
        for (let i = 0; i < this.#src.length; i++) {
            const colorKey = `color${i}`;
            if (colorKey in options && options[colorKey] !== null) {
                this.#srcColors[i] = options[colorKey];
            }
        }
    }

    #parseSrcProperties(options) {
        /**
         * Parse per-src properties dari options
         * Mendukung: posX0, posY0, opacity0, rotation0, scale0, skewX0, skewY0, flipX0, flipY0, width0, height0, color0
         * dst untuk src1, src2, src3, ... src9
         * Default: posX{i}=0, posY{i}=0, opacity{i}=1, dll.
         */
        const srcPropertyNames = ['posX', 'posY', 'opacity', 'rotation', 'scale', 'skewX', 'skewY', 'flipX', 'flipY', 'width', 'height', 'color'];
        const defaults = {
            posX: 0,
            posY: 0,
            opacity: 1,
            rotation: 0,
            scale: 1,
            skewX: 0,
            skewY: 0,
            flipX: false,
            flipY: false,
            width: null,
            height: null,
            color: null
        };

        for (let i = 0; i < this.#src.length; i++) {
            if (!this.#srcProperties[i]) {
                this.#srcProperties[i] = {};
            }

            // Parse setiap property dengan suffix nomor src, atau set default
            srcPropertyNames.forEach(prop => {
                const keyWithSuffix = `${prop}${i}`;
                if (keyWithSuffix in options) {
                    this.#srcProperties[i][prop] = options[keyWithSuffix];
                } else if (!(prop in this.#srcProperties[i])) {
                    this.#srcProperties[i][prop] = defaults[prop];
                }
            });
        }
    }

    #getPropertyForSrc(propertyName, srcIndex, globalValue, defaultValue) {
        /**
         * Get value untuk src tertentu dengan precedence:
         * Per-Src Value > Global Value > Default Value
         */
        // Check per-src value dulu
        if (srcIndex in this.#srcProperties && propertyName in this.#srcProperties[srcIndex]) {
            return this.#srcProperties[srcIndex][propertyName];
        }

        // Jika tidak ada per-src, gunakan global
        if (globalValue !== undefined && globalValue !== null) {
            return globalValue;
        }

        // Terakhir gunakan default
        return defaultValue;
    }

    #getColorForSrc(index) {
        // Return warna spesifik untuk src, dengan precedence:
        // Per-Src Color (#srcProperties) > Per-Src Color (#srcColors) > Global Color

        // Check di #srcProperties dulu (hasil dari #parseSrcProperties)
        if (index in this.#srcProperties && 'color' in this.#srcProperties[index]) {
            return this.#srcProperties[index]['color'];
        }

        // Lalu check #srcColors (hasil dari #parseColorOptions - backward compat)
        if (index in this.#srcColors) {
            return this.#srcColors[index];
        }

        // Terakhir gunakan global color
        return this.#color;
    }

    #resetInputs() {
        const elements = {
            layerName: document.getElementById('layerName'),
            xCoord: document.getElementById('xCoord'),
            yCoord: document.getElementById('yCoord'),
            height: document.getElementById('height'),
            width: document.getElementById('width'),
            scale: document.getElementById('scale'),
            rotationControl: document.getElementById('rotationControl'),
            rotationIndicator: document.getElementById('rotationIndicator'),
            flipHorizontal: document.getElementById('flipHorizontal'),
            flipVertical: document.getElementById('flipVertical'),
        };

        if (elements.layerName) elements.layerName.value = '';
        if (elements.xCoord) elements.xCoord.value = '';
        if (elements.yCoord) elements.yCoord.value = '';
        if (elements.height) elements.height.value = '';
        if (elements.width) elements.width.value = '';
        if (elements.scale) elements.scale.value = '';
        if (elements.rotationControl) elements.rotationControl.value = '';
        if (elements.rotationIndicator) elements.rotationIndicator.innerText = '0';
        if (elements.flipHorizontal) elements.flipHorizontal.checked = false;
        if (elements.flipVertical) elements.flipVertical.checked = false;
    }

    //
    #initElement() {
        console.log(`Initializing element for layer "${this.#name}"`);
        this.element = document.createElement('div');
        this.element.classList.add('layer');
        // Ensure absolute positioning so child offsets are relative and bounds calc works
        this.element.style.position = 'absolute';

        // 🔥 Root Guard: Transparent div agar drag area akurat dan tidak "bolong"
        const rootGuard = document.createElement('div');
        rootGuard.classList.add('layer-guard');
        rootGuard.style.position = 'absolute';
        rootGuard.style.top = '0';
        rootGuard.style.left = '0';
        rootGuard.style.width = '100%';
        rootGuard.style.height = '100%';
        rootGuard.style.zIndex = '-1'; // Behind content
        rootGuard.style.pointerEvents = 'auto';
        this.element.appendChild(rootGuard);

        if (this.#childLayers.length > 0) {
            this.element.classList.add('layer-group');
            // Create content wrapper for protection from parent transforms
            this.#contentWrapper = document.createElement('div');
            this.#contentWrapper.className = 'layer-group-content';
            this.#contentWrapper.style.position = 'absolute';
            this.#contentWrapper.style.left = '0px';
            this.#contentWrapper.style.top = '0px';
            this.#contentWrapper.style.width = '100%';
            this.#contentWrapper.style.height = '100%';
            this.#contentWrapper.style.pointerEvents = 'none';
            this.element.appendChild(this.#contentWrapper);

            // Children will be attached to #contentWrapper in the attach() method
            // which is called recursively. We don't append them here anymore
            // to avoid double appending or using unreliable offsetLeft values.
        }

        let maxWidth = 0, maxHeight = 0;
        let imageDimensions = [];

        this.#src.forEach((src, index) => {
            const imgElement = document.createElement('img');
            imgElement.draggable = false;
            imgElement.classList.add('src-item');
            imgElement.dataset.index = index; // Tambahkan indeks untuk identifikasi

            // Set z-index berdasarkan urutan src untuk memastikan rendering order yang benar
            // src0 (index 0) = z-index 0, src1 (index 1) = z-index 1, dst
            imgElement.style.zIndex = index;

            // Load image to get dimensions
            const img = new Image();
            img.onload = () => {
                imageDimensions[index] = { width: img.naturalWidth, height: img.naturalHeight };

                // Get offsets for this src (EXTENT logic)
                const offX = this.#getPropertyForSrc('posX', index, 0, 0);
                const offY = this.#getPropertyForSrc('posY', index, 0, 0);

                // Right/Bottom edges determine the required width/height relative to (0,0)
                const rightEdge = offX + img.naturalWidth;
                const bottomEdge = offY + img.naturalHeight;

                // Update min/max tracker
                if (!this.#hasFinalBounds) {
                    this.#minX = offX;
                    this.#minY = offY;
                    this.#maxX = rightEdge;
                    this.#maxY = bottomEdge;
                    this.#hasFinalBounds = true;
                } else {
                    this.#minX = Math.min(this.#minX, offX);
                    this.#minY = Math.min(this.#minY, offY);
                    this.#maxX = Math.max(this.#maxX, rightEdge);
                    this.#maxY = Math.max(this.#maxY, bottomEdge);
                }

                // Update container width/height only if not set manually
                if (this.#width === null || this.#width === 0) {
                    this.element.style.width = (this.#maxX - this.#minX) + 'px';
                }
                if (this.#height === null || this.#height === 0) {
                    this.element.style.height = (this.#maxY - this.#minY) + 'px';
                }

                // Re-position images to compensate for shifted container origin
                const allImgs = this.element.querySelectorAll('img.src-item');
                allImgs.forEach((el, idx) => {
                    this.#applySrcProperties(el, idx);
                });

                // Update container position
                this.#updateElement();
            };
            img.onerror = () => {
                console.warn(`Failed to load image: ${src}`);
            };

            const colorForThis = this.#getColorForSrc(index);
            if (src.endsWith('.svg')) {
                // Always fetch SVG to potentially recolor
                fetch(src).then(r => r.text()).then(svgText => {
                    // Jika ada warna untuk src ini, aplikasikan ke SVG menggunakan DOM parsing
                    if (colorForThis) {
                        console.log(`[Layer: ${this.#name}] src${index} - Applying color ${colorForThis}`);

                        // Debug: tampilkan SVG sebelum di-ubah
                        const beforeFills = (svgText.match(/fill\s*[:=]/gi) || []).length;
                        const beforeStrokes = (svgText.match(/stroke\s*[:=]/gi) || []).length;
                        const beforeStopColors = (svgText.match(/stop-color\s*[:=]/gi) || []).length;
                        console.log(`[Layer: ${this.#name}] src${index} BEFORE - Fill: ${beforeFills}, Stroke: ${beforeStrokes}, StopColor: ${beforeStopColors}`);

                        const recoloredSVG = this.#recolorSVG(svgText, colorForThis);

                        // Debug: count setelah perubahan
                        const afterFills = (recoloredSVG.match(/fill\s*[:=]/gi) || []).length;
                        const afterStrokes = (recoloredSVG.match(/stroke\s*[:=]/gi) || []).length;
                        const afterStopColors = (recoloredSVG.match(/stop-color\s*[:=]/gi) || []).length;
                        console.log(`[Layer: ${this.#name}] src${index} AFTER - Fill: ${afterFills}, Stroke: ${afterStrokes}, StopColor: ${afterStopColors}`);

                        svgText = recoloredSVG;
                    } else {
                        console.warn(`[Layer: ${this.#name}] src${index} - No color defined, using original`);
                    }
                    const dataUrl = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgText)));
                    imgElement.src = dataUrl;
                    img.src = dataUrl; // Also load for dimensions
                }).catch(e => {
                    console.error(`Failed to load SVG for layer "${this.#name}" src${index}:`, e);
                    imgElement.src = src;
                    img.src = src;
                });
            } else {
                imgElement.src = src;
                img.src = src; // Load untuk get dimensions
            }

            // Append ke content wrapper jika group, atau ke element jika standalone
            const attachTarget = this.#contentWrapper || this.element;
            attachTarget.appendChild(imgElement);
            console.log(`[DEBUG] Image src${index} appended to ${this.#contentWrapper ? 'contentWrapper' : 'element'} for layer "${this.#name}"`);

            // Terapkan per-src properties pada img element
            this.#applySrcProperties(imgElement, index);

            // Tambahkan event listener untuk seleksi
            imgElement.addEventListener('click', (e) => {
                // 🔥 CRITICAL modification for selection logic:
                // If Ctrl key pressed, let it bubble to layer handler for multi-select (already handled).
                // If layer is NOT selected, let it bubble to layer handler to select the layer first.
                // If layer IS selected, stop propagation to handle sub-selection (specific image).

                const isCtrl = e.ctrlKey || e.metaKey;
                if (!isCtrl) {
                    // Always select the specific image part internally
                    this.#selectImage(index);

                    // Only stop bubbling if we are already selected (sub-selection mode)
                    if (this.selected) {
                        e.stopPropagation();
                    }
                    // Otherwise, let bubble to layer.element to trigger SelectLayer()
                }
                // Ctrl case bubbles automatically
            });
            // Terapkan opacity per src pada saat inisialisasi
            const opacityForSrc = this.#getPropertyForSrc('opacity', index, this.#opacity, 1);
            imgElement.style.opacity = opacityForSrc;
        });

        // Inisialisasi child layers
        this.#childLayers.forEach(child => {
            // Attach child ke content wrapper (jika ada) agar terlindungi dari parent transform
            const attachTarget = this.#contentWrapper || this.element;
            child.attach(attachTarget);
            console.log(`[DEBUG] Child layer "${child.name}" attached to ${this.#contentWrapper ? 'contentWrapper' : 'element'}`);
        });
    }
    //

    //
    #applySrcProperties(imgElement, srcIndex) {
        /**
         * Terapkan per-src styling ke img element
         * Ini memungkinkan setiap src punya positioning, scale, opacity berbeda
         */
        if (!imgElement || srcIndex === undefined) return;

        // Create transform untuk src ini jika ada per-src properties
        const transforms = [];

        // Check per-src transform properties
        const scaleForSrc = this.#getPropertyForSrc('scale', srcIndex, null, 1);
        const rotationForSrc = this.#getPropertyForSrc('rotation', srcIndex, null, 0);
        const skewXForSrc = this.#getPropertyForSrc('skewX', srcIndex, null, 0);
        const skewYForSrc = this.#getPropertyForSrc('skewY', srcIndex, null, 0);
        const flipXForSrc = this.#getPropertyForSrc('flipX', srcIndex, null, false);
        const flipYForSrc = this.#getPropertyForSrc('flipY', srcIndex, null, false);

        if (rotationForSrc !== 0) transforms.push(`rotate(${rotationForSrc}deg)`);
        if (scaleForSrc !== 1) transforms.push(`scale(${scaleForSrc})`);
        if (flipXForSrc) transforms.push('scaleX(-1)');
        if (flipYForSrc) transforms.push('scaleY(-1)');
        if (skewXForSrc !== 0) transforms.push(`skewX(${skewXForSrc}deg)`);
        if (skewYForSrc !== 0) transforms.push(`skewY(${skewYForSrc}deg)`);

        if (transforms.length > 0) {
            imgElement.style.transform = transforms.join(' ');
        }

        // Per-src positioning dengan offset
        const posXForSrc = this.#getPropertyForSrc('posX', srcIndex, null, null);
        const posYForSrc = this.#getPropertyForSrc('posY', srcIndex, null, null);

        // Set position absolute untuk positioning relatif di dalam layer
        imgElement.style.position = 'absolute';

        // Adjust left/top by subtracting the container's relative origin (minX/minY)
        // This ensures the container correctly encompasses images and the VISUAL position remains stable.
        const adjLeft = (posXForSrc ?? 0) - this.#minX;
        const adjTop = (posYForSrc ?? 0) - this.#minY;

        imgElement.style.left = adjLeft + 'px';
        imgElement.style.top = adjTop + 'px';

        // Ukuran per-src (opsional)
        const widthForSrc = this.#getPropertyForSrc('width', srcIndex, null, null);
        const heightForSrc = this.#getPropertyForSrc('height', srcIndex, null, null);
        if (widthForSrc !== null) imgElement.style.width = widthForSrc + 'px';
        if (heightForSrc !== null) imgElement.style.height = heightForSrc + 'px';

        // Store per-src offset untuk digunakan di #updateElement
        imgElement.dataset.posXOffset = posXForSrc ?? 0;
        imgElement.dataset.posYOffset = posYForSrc ?? 0;
    }

    #initBoundsFromProperties() {
        // Estimate bounds from property offsets if we haven't loaded images yet
        let minX = 0, minY = 0, maxX = 0, maxY = 0;
        let set = false;

        for (let i = 0; i < this.#src.length; i++) {
            const x = this.#getPropertyForSrc('posX', i, 0, 0);
            const y = this.#getPropertyForSrc('posY', i, 0, 0);
            if (!set) {
                minX = maxX = x;
                minY = maxY = y;
                set = true;
            } else {
                minX = Math.min(minX, x);
                minY = Math.min(minY, y);
                maxX = Math.max(maxX, x); // widths unknown yet
                maxY = Math.max(maxY, y);
            }
        }

        this.#minX = minX;
        this.#minY = minY;
        this.#maxX = maxX;
        this.#maxY = maxY;
    }

    //
    #selectSrc(imgElement, index) {
        // Hapus seleksi pada semua elemen src (gunakan class baru `item-selected`)
        this.element.querySelectorAll('.src-item').forEach(img => {
            img.classList.remove('item-selected');
            img.dataset.selected = 'false';
        });

        // Tandai elemen yang dipilih
        imgElement.classList.add('item-selected');
        imgElement.dataset.selected = 'true';
        console.log(`Selected src at index ${index} for layer "${this.#name}"`);
    }
    //

    #updateElement() {
        if (!this.element) {
            console.warn('Element is not defined for layer:', this.#name);
            return; // Keluar jika elemen tidak ada
        }

        // Jika ini child layer, gunakan relative position; jika root, gunakan absolute + render offset
        let posX = this.#x;
        let posY = this.#y;

        if (this.#parentLayer) {
            // Child layer: gunakan relative offset terhadap parent
            posX = this.#relativeX;
            posY = this.#relativeY;
        } else {
            // Root layer: hitung render offset (visual only - tidak mempengaruhi layer.x/layer.y)
            // Default render offset: center canvas (50% X, 50% Y)
            let offsetX = 0, offsetY = 0;
            if (typeof getTotalLayerRenderOffset === 'function') {
                const renderOffset = getTotalLayerRenderOffset();
                offsetX = renderOffset.offsetX;
                offsetY = renderOffset.offsetY;
            }
            posX += offsetX;
            posY += offsetY;
        }

        // 🔥 Correct visual position to account for the internal minX/minY offset
        // We want the layer's origin (baseX, baseY) to correspond to (0,0) in the property coordinate system.
        // Since the container physically starts at minX/minY relative to (0,0), we must add those offsets here.
        // This applies to BOTH root and child layers.
        posX += this.#minX;
        posY += this.#minY;

        // Atur posisi elemen utama
        this.element.style.left = posX + 'px'; // Posisi horizontal
        this.element.style.top = posY + 'px'; // Posisi vertikal

        // Jika ini adalah grouped layer, hitung bounding box dari children
        if (this.#childLayers.length > 0) {
            const bounds = this.#calculateGroupBounds();
            this.element.style.width = bounds.width + 'px';
            this.element.style.height = bounds.height + 'px';
            // Border hanya tampil jika selected
            this.element.style.boxSizing = 'border-box';
            this.element.style.background = 'transparent';
            // SELALU allow pointer events pada group outline agar bisa di-drag tanpa multi-select
            // Content wrapper akan block events ke child jika group tidak selected
            this.element.style.pointerEvents = 'auto';
            // Set transform-origin ke top-left (0, 0) agar child positioning tidak terganggu
            this.element.style.transformOrigin = '0px 0px';

            // Update content wrapper sizing dan control pointer-events
            if (this.#contentWrapper) {
                this.#contentWrapper.style.width = bounds.width + 'px';
                this.#contentWrapper.style.height = bounds.height + 'px';
                // Block child pointer events ketika group tidak selected, biar outline bisa didrag
                this.#contentWrapper.style.pointerEvents = (this.selectedState ? 'auto' : 'none');
                // Also set data attribute untuk CSS selector
                this.#contentWrapper.dataset.selected = this.selectedState ? 'true' : 'false';
            }
        } else {
            this.element.style.width = this.#width + 'px'; // Lebar
            this.element.style.height = this.#height + 'px'; // Tinggi
            this.element.style.border = 'none';
            this.element.style.pointerEvents = 'auto';
            this.element.style.transformOrigin = '0px 0px';
        }

        // Cari elemen gambar di dalam elemen utama (hanya untuk non-grouped layers)
        if (this.#childLayers.length === 0) {
            const imgElements = this.element.querySelectorAll('img.src-item');

            // Periksa keberadaan imgElements sebelum mengakses style-nya
            if (imgElements && imgElements.length > 0) {
                imgElements.forEach((imgElement, index) => {
                    // 🔥 JANGAN paksa width/height layer ke semua image!
                    // Image harus punya ukurannya sendiri kecuali user specify per-src width.
                    // Baris ini dihapus karena merusak proporsi gambar individual di multi-src layer.

                    // Update per-src properties jika ada perubahan
                    this.#applySrcProperties(imgElement, index);
                });
            } else {
                console.warn('Image element not found in layer:', this.#name);
            }
        }

        // Terapkan transformasi (rotasi, skala, flip, skew)
        // Terapkan opacity
        this.element.style.opacity = this.#opacity;

        const transforms = [
            `rotate(${this.#rotation}deg)`,
            `scale(${this.#scale})`,
        ];
        if (this.#flipX) transforms.push('scaleX(-1)');
        if (this.#flipY) transforms.push('scaleY(-1)');
        if (this.#skewX !== 0) transforms.push(`skewX(${this.#skewX}deg)`);
        if (this.#skewY !== 0) transforms.push(`skewY(${this.#skewY}deg)`);
        this.element.style.transform = transforms.join(' ');

        // Perbarui label nama layer
        const nameLabel = this.element.querySelector('.layer-name');
        if (nameLabel) {
            nameLabel.textContent = this.#name;
        }
    }

    #calculateGroupBounds() {
        // Hitung bounding box dari semua child layers untuk menentukan ukuran & posisi grup
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

        // Gunakan relative position dari child (bukan DOM offsetLeft/Top yang bisa terganggu transform)
        this.#childLayers.forEach(child => {
            if (!child.element) return;
            // Gunakan relativeX/Y jika child punya parent, atau x/y jika tidak
            const x = child.#parentLayer ? child.#relativeX : child.#x;
            const y = child.#parentLayer ? child.#relativeY : child.#y;

            // Adjust bounds based on child's internal tracked min/max
            const childMinX = x + (child.minX || 0);
            const childMinY = y + (child.minY || 0);
            const childMaxX = x + (child.maxX || 0);
            const childMaxY = y + (child.maxY || 0);

            minX = Math.min(minX, childMinX);
            minY = Math.min(minY, childMinY);
            maxX = Math.max(maxX, childMaxX);
            maxY = Math.max(maxY, childMaxY);
        });

        // Pastikan bounds valid
        if (minX === Infinity) minX = 0;
        if (minY === Infinity) minY = 0;
        if (maxX === -Infinity) maxX = 0;
        if (maxY === -Infinity) maxY = 0;

        return {
            x: minX,
            y: minY,
            width: Math.max(maxX - minX, 20), // Minimum width 20px
            height: Math.max(maxY - minY, 20) // Minimum height 20px
        };
    }

    #notifyParentUpdate() {
        // Jika ini adalah child layer, beritahu parent untuk update bounds
        if (this.#parentLayer) {
            // Gunakan metode publik untuk memanggil pembaruan elemen
            this.#parentLayer.updateElement();
        }
    }

    #selectImage(index) {
        // Reset seleksi semua gambar dalam layer
        this.element.querySelectorAll('.src-item').forEach(img => {
            img.classList.remove('item-selected');
            img.dataset.selected = 'false';
        });

        // Tandai gambar yang dipilih
        const selectedImage = this.element.querySelector(`.src-item[data-index="${index}"]`);
        if (selectedImage) {
            selectedImage.classList.add('item-selected');
            selectedImage.dataset.selected = 'true';
        }

        // Simpan status seleksi jika diperlukan
        this.#selectedImageIndex = index;

        console.log(`Image ${index} selected in layer "${this.#name}"`);
    }



    get name() {
        return this.#name;
    }

    set parentLayer(value) {
        this.#parentLayer = value;
    }

    get parentLayer() {
        return this.#parentLayer;
    }

    get x() {
        // Return posisi yang sesuai konteks: relative jika punya parent, absolute jika root
        return this.#parentLayer ? this.#relativeX : this.#x;
    }

    get y() {
        // Return posisi yang sesuai konteks: relative jika punya parent, absolute jika root
        return this.#parentLayer ? this.#relativeY : this.#y;
    }

    get rotation() {
        return this.#rotation;
    }

    get scale() {
        return this.#scale;
    }

    get isFlipX() {
        return this.#flipX;
    }

    get isFlipY() {
        return this.#flipY;
    }

    get skewX() {
        return this.#skewX;
    }

    get skewY() {
        return this.#skewY;
    }

    get minX() { return this.#minX; }
    get minY() { return this.#minY; }
    get maxX() { return this.#maxX; }
    get maxY() { return this.#maxY; }

    get selectedImageIndex() {
        return this.#selectedImageIndex;
    }

    set name(name) {
        this.#name = name;
    }

    set x(value) {
        if (this.#parentLayer) {
            // Jika punya parent, update relative position
            this.#relativeX = value;
        } else {
            // Jika root, update absolute position
            this.#x = value;
        }
        this.#updateElement(); // Perbarui posisi elemen DOM
        this.#notifyParentUpdate(); // Beritahu parent jika ada
    }

    set y(value) {
        if (this.#parentLayer) {
            // Jika punya parent, update relative position
            this.#relativeY = value;
        } else {
            // Jika root, update absolute position
            this.#y = value;
        }
        this.#updateElement(); // Perbarui posisi elemen DOM
        this.#notifyParentUpdate(); // Beritahu parent jika ada
    }

    set rotation(value) {
        this.#rotation = value;
        this.#updateElement(); // Perbarui rotasi elemen DOM
    }

    set scale(value) {
        this.#scale = value;
        this.#updateElement(); // Perbarui skala elemen DOM
    }

    set flipX(value) {
        this.#flipX = value;
        this.#updateElement(); // Perbarui status flipX elemen DOM
    }

    set flipY(value) {
        this.#flipY = value;
        this.#updateElement(); // Perbarui status flipY elemen DOM
    }

    set skewX(value) {
        this.#skewX = value;
        this.#updateElement(); // Perbarui skewX elemen DOM
    }

    set skewY(value) {
        this.#skewY = value;
        this.#updateElement(); // Perbarui skewY elemen DOM
    }

    set srcColors(colors) {
        this.#srcColors = colors;
        this.#updateElement();
    }

    get srcColors() {
        return this.#srcColors;
    }

    get src() {
        return this.#src;
    }

    set src(newSrc) {
        // Allow updating src array
        this.#src = Array.isArray(newSrc) ? newSrc : [newSrc];
        // Update DOM elements if they exist
        if (this.element) {
            // Update existing img elements or recreate them
            const imgElements = this.element.querySelectorAll('.src-item');
            this.#src.forEach((src, index) => {
                if (imgElements[index]) {
                    imgElements[index].src = src;
                } else {
                    // If img element doesn't exist, create it
                    const imgElement = document.createElement('img');
                    imgElement.draggable = false;
                    imgElement.classList.add('src-item');
                    imgElement.dataset.index = index;
                    imgElement.style.zIndex = index;
                    imgElement.src = src;
                    this.element.appendChild(imgElement);
                    imgElement.addEventListener('click', (e) => {
                        // 🔥 CRITICAL: Check Ctrl key - if Ctrl, let it bubble to layer handler for multi-select!
                        const isCtrl = e.ctrlKey || e.metaKey;
                        if (!isCtrl) {
                            e.stopPropagation();
                            this.#selectImage(index);
                        }
                        // If Ctrl pressed, let click bubble up to layer.element handler to handle multi-select toggle
                    });
                }
            });
        }
    }

    get width() {
        return this.#width;
    }

    get height() {
        return this.#height;
    }

    get childLayers() {
        return this.#childLayers;
    }

    get color() {
        return this.#color;
    }

    set color(value) {
        this.#color = value;
        this.#updateElement();
    }

    get opacity() {
        return this.#opacity;
    }

    set opacity(value) {
        // Accept 0-1 or 0-100
        let v = Number(value);
        if (isNaN(v)) return;
        if (v > 1) v = Math.min(100, v) / 100;
        this.#opacity = v;
        // Simpan ke options agar history/function lain bisa baca
        this.options = this.options || {};
        this.options.opacity = v;
        // Terapkan ke elemen utama
        if (this.element) this.element.style.opacity = v;
        // Terapkan ke semua src images
        this.element && this.element.querySelectorAll('.src-item').forEach(img => {
            img.style.opacity = v;
        });
    }

    /**
     * Update posisi per-src dengan delta
     */
    updateSrcPosition(index, dx, dy) {
        if (index in this.#srcProperties) {
            this.#srcProperties[index].posX = (this.#srcProperties[index].posX || 0) + dx;
            this.#srcProperties[index].posY = (this.#srcProperties[index].posY || 0) + dy;
            // Update options juga agar konsisten
            this.options[`posX${index}`] = this.#srcProperties[index].posX;
            this.options[`posY${index}`] = this.#srcProperties[index].posY;
            this.#updateElement();
        }
    }

    /**
     * Update layer options secara dinamis dan re-parse properties
     * Penting untuk TextShapeManager yang mengubah struktur src/options
     */
    updateOptions(newOptions) {
        if (!newOptions) return;

        // Merge options
        this.options = Object.assign(this.options || {}, newOptions);

        // Update basic properties if present
        if ('name' in newOptions) this.#name = newOptions.name;
        if ('x' in newOptions) this.x = newOptions.x;
        if ('y' in newOptions) this.y = newOptions.y;
        if ('rotation' in newOptions) this.rotation = newOptions.rotation;
        if ('scale' in newOptions) this.scale = newOptions.scale;
        if ('skewX' in newOptions) this.skewX = newOptions.skewX;
        if ('skewY' in newOptions) this.skewY = newOptions.skewY;

        // Update dimensions if present (allow null to reset)
        if ('width' in newOptions) this.width = newOptions.width;
        if ('height' in newOptions) this.height = newOptions.height;

        // Re-parse complex properties
        this.#parseColorOptions(this.options);
        this.#parseSrcProperties(this.options);

        // Force update visual
        this.#updateElement();
    }

    set width(value) {
        this.#width = value;

        // If value is null, allow auto-detection when image loads
        if (value === null && this.element) {
            // Re-trigger image loading for auto-dimension detection
            const imgElements = this.element.querySelectorAll('.src-item');
            imgElements.forEach((img, index) => {
                const newImg = new Image();
                newImg.onload = () => {
                    if (!this.#width) {
                        this.#width = newImg.naturalWidth;
                        this.#updateElement();
                    }
                };
                newImg.src = img.src;
            });
        } else {
            // Perbarui ukuran untuk elemen src yang dipilih
            const selectedImg = this.element.querySelector('.src-item.item-selected');
            if (selectedImg) {
                selectedImg.style.width = `${value}px`;
            } else if (this.element) {
                this.#updateElement(); // Perbarui seluruh elemen jika tidak ada seleksi spesifik
            }
        }
    }

    set height(value) {
        this.#height = value;

        // If value is null, allow auto-detection when image loads
        if (value === null && this.element) {
            // Re-trigger image loading for auto-dimension detection
            const imgElements = this.element.querySelectorAll('.src-item');
            imgElements.forEach((img, index) => {
                const newImg = new Image();
                newImg.onload = () => {
                    if (!this.#height) {
                        this.#height = newImg.naturalHeight;
                        this.#updateElement();
                    }
                };
                newImg.src = img.src;
            });
        } else {
            const selectedImg = this.element.querySelector('.src-item.item-selected');
            if (selectedImg) {
                selectedImg.style.height = `${value}px`;
            } else if (this.element) {
                this.#updateElement();
            }
        }
    }


    set selected(value) {
        this.selectedState = value;

        if (this.element) {
            if (value) {
                this.element.classList.add('selected');
                // Jika ini group layer, tampilkan border
                if (this.#childLayers.length > 0) {
                    this.element.style.border = '2px solid #007bff';
                    this.element.style.pointerEvents = 'auto';
                }
                // Tandai semua elemen src di dalam layer sebagai selected (item-level)
                this.element.querySelectorAll('.src-item').forEach(img => {
                    img.classList.add('item-selected');
                    img.dataset.selected = 'true';
                });
            } else {
                this.element.classList.remove('selected');
                // Jika ini group layer, hapus border
                if (this.#childLayers.length > 0) {
                    this.element.style.border = 'none';
                    this.element.style.pointerEvents = 'none';
                }
                this.element.querySelectorAll('.src-item').forEach(img => {
                    img.classList.remove('item-selected');
                    img.dataset.selected = 'false';
                    this.#resetInputs();
                });
            }
        }
    }

    attach(dstRoot, ondragstart = null) {
        dstRoot.appendChild(this.element);
        // expose reference to this instance on the DOM element for easy lookup
        this.element.__layerInstance = this;
        if (ondragstart) {
            this.#ondragstart = (e) => {
                // Jika selector multi aktif, izinkan toggle selection via touchstart pada layer yang belum dipilih
                if (window.__selectorActive) {
                    const selector = window.selectorInstance;
                    const isSelectedDOM = this.element && this.element.classList && this.element.classList.contains('selected');
                    const instanceSelected = selector && Array.isArray(selector.selectedLayers) && (selector.selectedLayers.includes(this) || selector.selectedLayers.includes(this.element));

                    // If touchstart (mobile), toggle selection instead of starting drag
                    if (e.changedTouches && e.changedTouches.length > 0 && !isSelectedDOM && !instanceSelected) {
                        e.stopPropagation();
                        // Toggle selection ON
                        this.element.classList.add('selected');
                        this.selected = true;
                        if (selector && Array.isArray(selector.selectedLayers)) {
                            selector.selectedLayers.push(this);
                        }
                        window.frameworkDisplay?.updateSelectionVisuals?.();
                        updateMenuLayerSelectionForMultiSelect?.();
                        return;
                    }

                    // For non-touch (mouse) clicks, rely on click handler to toggle selection
                    if (!isSelectedDOM && !instanceSelected) {
                        e.stopPropagation();
                        return; // don't start drag if not selected
                    }
                    // else: allow drag for selected layers
                }

                // Jika sudah ada touch-drag aktif dari jari lain, abaikan touchstart ini
                if (e.changedTouches && e.changedTouches.length > 0) {
                    const startId = e.changedTouches[0].identifier;
                    if (startId !== null && window.touchDragActive && window.touchDragId !== null && window.touchDragId !== startId) {
                        // If the touched layer is selected, allow it as an additional pointer; otherwise ignore
                        const isSelectedDOM = this.element && this.element.classList && this.element.classList.contains('selected');
                        const selector = window.selectorInstance;
                        const instanceSelected = selector && Array.isArray(selector.selectedLayers) && (selector.selectedLayers.includes(this) || selector.selectedLayers.includes(this.element));
                        if (!isSelectedDOM && !instanceSelected) {
                            e.stopPropagation();
                            return;
                        }
                    }
                }
                ondragstart(e, this);
            };

            this.element.addEventListener('mousedown', this.#ondragstart);
            this.element.addEventListener('touchstart', this.#ondragstart);
        }

        // Add click handler untuk multi-select (jika function tersedia)
        if (typeof addLayerClickHandler === 'function') {
            addLayerClickHandler(this);
        }

        // Inisialisasi child layers dan set parent reference
        this.#childLayers.forEach(child => {
            child.#parentLayer = this; // Set parent reference
            // Inisialisasi relative position ke current absolute position
            // Ini memastikan child tidak "pindah" saat pertama kali di-grup
            child.#relativeX = child.#x;
            child.#relativeY = child.#y;
            // Attach child ke content wrapper (jika ada) agar terlindungi dari parent transform
            const attachTarget = this.#contentWrapper || this.element;
            child.attach(attachTarget, ondragstart);
            // mark child's root as inner-child/grouped so CSS and logic can detect it
            if (child.element) {
                child.element.classList.add('src-group');
                child.element.dataset.innerchild = 'true';
            }
        });
    }

    detach() {
        if (this.element.parentElement) {
            this.element.parentElement.removeChild(this.element);
        }
        if (this.#ondragstart) {
            this.element.removeEventListener('mousedown', this.#ondragstart);
            this.element.removeEventListener('touchstart', this.#ondragstart);
        }
        // Detach child layers
        this.#childLayers.forEach(child => child.detach());
    }

    // Public method untuk update element (dipanggil dari luar)
    updateElement() {
        this.#updateElement();
    }

    /**
     * Recolor SVG dengan mengubah fill/stroke ke warna baru
     * Menggunakan approach: parse + selective replace + smart regex
     * @param {string} svgText - SVG text content
     * @param {string} newColor - Warna baru hex (#RRGGBB atau #RRGGBBAA)
     * @returns {string} - Modified SVG text
     */
    #recolorSVG(svgText, newColor) {
        try {
            // APPROACH 1: Smart regex replacement untuk solid colors di fill/stroke
            // Pattern: cari fill="COLOR" atau stroke="COLOR" tapi SKIP url(#...) references

            let modified = svgText;

            // 1. Replace fill attributes yang bukan reference (url)
            modified = modified.replace(/fill="(?!url|none|currentColor)([^"]*)"/gi, `fill="${newColor}"`);

            // 2. Replace stroke attributes yang bukan reference (url)  
            modified = modified.replace(/stroke="(?!url|none|currentColor)([^"]*)"/gi, `stroke="${newColor}"`);

            // 3. Replace fill dalam inline styles
            modified = modified.replace(/fill:\s*(?!url|none|currentColor)([^;]+)/gi, `fill: ${newColor}`);

            // 4. Replace stroke dalam inline styles
            modified = modified.replace(/stroke:\s*(?!url|none|currentColor)([^;]+)/gi, `stroke: ${newColor}`);

            // 5. Replace stop-color untuk gradasi
            modified = modified.replace(/stop-color="(?!url|none|currentColor)([^"]*)"/gi, `stop-color="${newColor}"`);
            modified = modified.replace(/stop-color:\s*(?!url|none|currentColor)([^;]+)/gi, `stop-color: ${newColor}`);

            console.log(`[Layer: ${this.#name}] SVG recolored with regex approach - target color ${newColor}`);
            return modified;
        } catch (error) {
            console.error(`Error recoloring SVG for layer "${this.#name}":`, error);
            return svgText; // Return original jika ada error
        }
    }
}

// Fungsi untuk membuat grup atau layer
function createLayers(layersData, parent = null) {
    const container = parent || document.createElement('div');

    layersData.forEach(data => {
        if (data.group) {
            const groupContainer = document.createElement('div');
            groupContainer.classList.add('layer-group');
            groupContainer.dataset.groupName = data.group.groupName;

            createLayers(data.group.layers, groupContainer);
            container.appendChild(groupContainer);
        } else {
            const layer = new Layer(data.layerName, data.src, data.options, data.childLayers || []);
            layer.attach(container, (e, layer) => console.log('Drag start:', layer.name));
        }
    });

    return container;
}

function createLayerFromObject(layerData) {
    if (!layerData || !layerData.layerName || !layerData.src) {
        console.error('Invalid layer data:', layerData);
        return null;
    }

    return new Layer(
        layerData.layerName,
        layerData.src || [],
        layerData.options,
        layerData.childLayers || []
    );
}