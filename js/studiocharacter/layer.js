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
    #cachedBoundingBox = null; // Cache bounding box untuk outline selection yang stabil
    #srcDimensions = []; // Simpan semua dimensi src untuk backup/fallback
    #srcLoadPromises = []; // Array dari Promise untuk track ketika setiap src image selesai load
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
         */
        const srcPropertyNames = ['posX', 'posY', 'opacity', 'rotation', 'scale', 'skewX', 'skewY', 'flipX', 'flipY', 'width', 'height', 'color'];
        
        for (let i = 0; i < this.#src.length; i++) {
            if (!this.#srcProperties[i]) {
                this.#srcProperties[i] = {};
            }
            
            // Parse setiap property dengan suffix nomor src
            srcPropertyNames.forEach(prop => {
                const keyWithSuffix = `${prop}${i}`;
                if (keyWithSuffix in options) {
                    this.#srcProperties[i][prop] = options[keyWithSuffix];
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
        console.log(`%c[Layer: ${this.#name}] === INITIALIZING ELEMENT ===`, 'color: #FFB6C1; font-weight: bold; font-size: 12px');
        console.log(`%c  Total src count: ${this.#src.length}`, 'color: #FFD700; font-size: 11px');
        
        this.element = document.createElement('div');
        this.element.classList.add('layer');
        
        if (this.#childLayers.length > 0) {
            this.element.classList.add('layer-group');
            // Hapus styling frame - gunakan styling bawaan saja
        }
        
        let maxWidth = 0, maxHeight = 0;
        let imageDimensions = [];
        let totalImagesLoaded = 0;
        
        this.#src.forEach((src, index) => {
            const imgElement = document.createElement('img');
            imgElement.draggable = false;
            imgElement.classList.add('src-item');
            imgElement.dataset.index = index; // Tambahkan indeks untuk identifikasi
            
            // Set z-index berdasarkan urutan src untuk memastikan rendering order yang benar
            // src0 (index 0) = z-index 0, src1 (index 1) = z-index 1, dst
            imgElement.style.zIndex = index;
            
            // PENTING: Buat Promise untuk tracking kapan image ini sudah load
            // Ini memungkinkan kita menunggu SEMUA image load tanpa timeout
            const loadPromise = new Promise((resolve, reject) => {
                // Load image to get dimensions
                const img = new Image();
                img.onload = () => {
                    imageDimensions[index] = { width: img.naturalWidth, height: img.naturalHeight };
                    totalImagesLoaded++;
                    
                    // Calculate max dimensions untuk layer container
                    if (img.naturalWidth > maxWidth || img.naturalHeight > maxHeight) {
                        maxWidth = Math.max(maxWidth, img.naturalWidth);
                        maxHeight = Math.max(maxHeight, img.naturalHeight);
                    }
                    
                    // Set layer dimensions HANYA pada image pertama yang loaded, atau gunakan yang sudah ada
                    if (totalImagesLoaded === 1 && !this.#width) {
                        this.#width = img.naturalWidth;
                        this.#height = img.naturalHeight;
                        console.log(`[Layer: ${this.#name}] Initial dimensions set from src0: ${this.#width}x${this.#height}`);
                    }
                    
                    // Store natural dimensions di dataset agar bisa diakses nanti
                    imgElement.dataset.naturalWidth = img.naturalWidth;
                    imgElement.dataset.naturalHeight = img.naturalHeight;
                    
                    // JUGA simpan di private array untuk backup/fallback
                    this.#srcDimensions[index] = { width: img.naturalWidth, height: img.naturalHeight };
                    console.log(`%c[Layer: ${this.#name}] src${index} loaded: ${img.naturalWidth}x${img.naturalHeight}`, 'color: #98D8C8; font-size: 10px');
                    
                    // RESOLVE Promise - sinyal bahwa image ini sudah load
                    resolve({ index, width: img.naturalWidth, height: img.naturalHeight });
                };
                img.onerror = () => {
                    console.warn(`Failed to load image: ${src}`);
                    totalImagesLoaded++;
                    
                    // REJECT atau resolve dengan fallback dimension
                    reject(new Error(`Failed to load src${index}`));
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
                        img.src = dataUrl; // Trigger img.onload
                    }).catch(e => {
                        console.error(`Failed to load SVG for layer "${this.#name}" src${index}:`, e);
                        imgElement.src = src;
                        img.src = src; // Trigger img.onload
                    });
                } else {
                    imgElement.src = src;
                    img.src = src; // Load untuk get dimensions - trigger img.onload
                }
            }); // END Promise constructor
            
            // SIMPAN Promise ke array agar bisa di-wait kemudian
            this.#srcLoadPromises[index] = loadPromise;
            
            this.element.appendChild(imgElement);
            console.log(`%c[Layer: ${this.#name}] src${index} img element appended to DOM`, 'color: #A8E6CF; font-size: 10px');
            
            // Terapkan per-src properties pada img element
            this.#applySrcProperties(imgElement, index);
            
            // Tambahkan event listener untuk seleksi
            imgElement.addEventListener('click', (e) => {
                e.stopPropagation(); // Hindari seleksi layer utama
                this.#selectImage(index);
            });
            // Terapkan opacity per src pada saat inisialisasi
            const opacityForSrc = this.#getPropertyForSrc('opacity', index, this.#opacity, 1);
            imgElement.style.opacity = opacityForSrc;
        });
    
        // Inisialisasi child layers
        this.#childLayers.forEach(child => child.attach(this.element));
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
        
        // Store per-src offset untuk digunakan di #updateElement
        imgElement.dataset.posXOffset = posXForSrc ?? 0;
        imgElement.dataset.posYOffset = posYForSrc ?? 0;
    }
    
    //
    #selectSrc(imgElement, index) {
    // Hapus seleksi pada semua elemen src
    this.element.querySelectorAll('.src-item').forEach(img => {
        img.classList.remove('src-selected');
    });

    // Tandai elemen yang dipilih
    imgElement.classList.add('src-selected');
    console.log(`Selected src at index ${index} for layer "${this.#name}"`);
}
    //

    #updateElement() {
        if (!this.element) {
            console.warn('Element is not defined for layer:', this.#name);
            return; // Keluar jika elemen tidak ada
        }
    
        // Atur posisi dan ukuran elemen utama
        const offsetX = window.originOffsetX || 0;
        const offsetY = window.originOffsetY || 0;
        this.element.style.left = (this.#x + offsetX) + 'px'; // Posisi horizontal
        this.element.style.top = (this.#y + offsetY) + 'px'; // Posisi vertikal
        
        // Jika ini adalah grouped layer, hitung bounding box dari children
        if (this.#childLayers.length > 0) {
            const bounds = this.#calculateGroupBounds();
            this.element.style.width = bounds.width + 'px';
            this.element.style.height = bounds.height + 'px';
            // Border hanya tampil jika selected
            this.element.style.boxSizing = 'border-box';
            this.element.style.background = 'transparent';
            this.element.style.pointerEvents = 'none'; // Izinkan klik melewati ke children
        } else {
            this.element.style.width = this.#width + 'px'; // Lebar
            this.element.style.height = this.#height + 'px'; // Tinggi
            // Jangan set border di sini, biarkan CSS .layer.selected yang mengatur outline/border
            this.element.style.pointerEvents = 'auto';
        }
    
        // Cari elemen gambar di dalam elemen utama (hanya untuk non-grouped layers)
        if (this.#childLayers.length === 0) {
            const imgElements = this.element.querySelectorAll('img.src-item');
        
            // Periksa keberadaan imgElements sebelum mengakses style-nya
            if (imgElements && imgElements.length > 0) {
                imgElements.forEach((imgElement, index) => {
                    // PENTING: Setiap img harus menggunakan ukuran INDIVIDUALNYA, bukan ukuran layer
                    // Jika ada per-src width/height, gunakan itu
                    const widthForSrc = this.#getPropertyForSrc('width', index, null, null);
                    const heightForSrc = this.#getPropertyForSrc('height', index, null, null);
                    
                    // Gunakan per-src dimensions, atau natural dimensions dari img
                    const naturalWidth = parseInt(imgElement.dataset.naturalWidth) || this.#width;
                    const naturalHeight = parseInt(imgElement.dataset.naturalHeight) || this.#height;
                    
                    const finalWidth = widthForSrc || naturalWidth || this.#width;
                    const finalHeight = heightForSrc || naturalHeight || this.#height;
                    
                    if (finalWidth) imgElement.style.width = finalWidth + 'px';
                    if (finalHeight) imgElement.style.height = finalHeight + 'px';
                    
                    // Pastikan img tetap pada ukuran natural-nya jika tidak ada override
                    imgElement.style.objectFit = 'contain'; // Pertahankan aspect ratio
                    imgElement.style.objectPosition = 'center'; // Posisikan di center
                    
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
    
    /**
     * Hitung bounding box actual dari semua img elements yang di-render
     * Ini digunakan untuk outline selection agar mencakup semua src images
     */
    #calculateRealBoundingBox() {
        if (this.#childLayers.length > 0) {
            // Untuk group layers, gunakan calculateGroupBounds
            return this.#calculateGroupBounds();
        }

        // Untuk non-group layers, hitung dari SEMUA img elements
        // PENTING: Gunakan kombinasi dataset + #srcDimensions array untuk memastikan SEMUA src tercakup
        const imgElements = this.element?.querySelectorAll('img.src-item') || [];
        let totalMaxWidth = 0, totalMaxHeight = 0;
        let foundSrcCount = 0;

        console.group(`%c[Layer: ${this.#name}] === BOUNDING BOX CALCULATION (Dataset + Backup Array) ===`, 'color: #FF6B6B; font-weight: bold; font-size: 14px');
        console.log(`%cTotal src images found in DOM: ${imgElements.length}`, 'color: #4ECDC4; font-weight: bold');
        console.log(`%cTotal src stored in #srcDimensions: ${this.#srcDimensions.length}`, 'color: #4ECDC4; font-weight: bold');

        imgElements.forEach((img, idx) => {
            const index = parseInt(img.dataset.index);
            
            console.group(`%csrc${index} - Dimension Lookup`, 'color: #95E1D3; font-weight: bold');
            
            // PRIMARY: Coba ambil dari dataset (sudah diset saat load)
            let naturalWidth = img.dataset.naturalWidth ? parseInt(img.dataset.naturalWidth) : null;
            let naturalHeight = img.dataset.naturalHeight ? parseInt(img.dataset.naturalHeight) : null;
            
            console.log(`%cFrom dataset:`, 'color: #FFD93D; font-weight: bold');
            console.log(`  - naturalWidth: ${naturalWidth}px`);
            console.log(`  - naturalHeight: ${naturalHeight}px`);
            
            // FALLBACK: Jika dataset kosong/0, cek #srcDimensions array
            if (!naturalWidth || naturalWidth <= 0 || !naturalHeight || naturalHeight <= 0) {
                if (this.#srcDimensions[index]) {
                    naturalWidth = this.#srcDimensions[index].width;
                    naturalHeight = this.#srcDimensions[index].height;
                    console.log(`%c📌 Using #srcDimensions backup: ${naturalWidth}x${naturalHeight}`, 'color: #FF9900; font-weight: bold');
                }
            }
            
            // Gunakan dimensi jika valid
            if (naturalWidth > 0 && naturalHeight > 0) {
                totalMaxWidth = Math.max(totalMaxWidth, naturalWidth);
                totalMaxHeight = Math.max(totalMaxHeight, naturalHeight);
                foundSrcCount++;
                console.log(`%c✅ ADDED: w=${naturalWidth}, h=${naturalHeight}`, 'color: #52B788; font-weight: bold');
            } else {
                console.log(`%c❌ SKIPPED: No valid dimensions available`, 'color: #FF6B6B; font-weight: bold');
            }
            
            console.log(`%cAccumulated Max so far: ${totalMaxWidth}x${totalMaxHeight}`, 'color: #F38181; font-weight: bold');
            console.groupEnd();
        });

        console.log(`%c═══════════════════════════════════`, 'color: #AA96DA');
        console.log(`%cFinal Bounding Box: ${totalMaxWidth}x${totalMaxHeight}`, 'color: #AA96DA; font-weight: bold; font-size: 13px');
        console.log(`%c✅ Srcs included: ${foundSrcCount}/${imgElements.length}`, 'color: #AA96DA');
        console.log(`%c═══════════════════════════════════`, 'color: #AA96DA');
        console.groupEnd();

        return {
            x: 0,
            y: 0,
            width: totalMaxWidth,
            height: totalMaxHeight
        };
    }

    #notifyParentUpdate() {
        // Jika ini adalah child layer, beritahu parent untuk update bounds
        if (this.#parentLayer) {
            this.#parentLayer.#updateElement();
        }
    }

    #calculateGroupBounds() {
        // Hitung bounding box dari semua child layers
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        
        this.#childLayers.forEach(child => {
            const x = child.x;
            const y = child.y;
            const width = child.element?.clientWidth || child.width || 0;
            const height = child.element?.clientHeight || child.height || 0;
            
            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
            maxX = Math.max(maxX, x + width);
            maxY = Math.max(maxY, y + height);
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
    
    #selectImage(index) {
        // Reset seleksi semua gambar dalam layer
        this.element.querySelectorAll('.src-item').forEach(img => {
            img.classList.remove('src-selected');
        });
    
        // Tandai gambar yang dipilih
        const selectedImage = this.element.querySelector(`.src-item[data-index="${index}"]`);
        if (selectedImage) {
            selectedImage.classList.add('src-selected');
        }
    
        // Simpan status seleksi jika diperlukan
        this.selectedImageIndex = index;
    
        console.log(`Image ${index} selected in layer "${this.#name}"`);
    }    

    /**
     * @param {boolean} selected
     */
    set selected(value) {
        this.selectedState = value;
        
        if (!this.element) {
            return;
        }
    
        if (value) {
            this.element.classList.add('selected');
            
            // PENTING: Ketika layer di-select, hitung bounding box actual dari SEMUA img elements SEKALI SAJA
            // Untuk outline selection agar mencakup semua src yang ada
            if (this.#childLayers.length === 0) {
                // Untuk non-group layers, calculate real bounding box dari semua src
                // HANYA SATU KALI - JANGAN pernah recalculate sampai deselect
                // Cache ini akan digunakan untuk stable outline saat layer bergerak
                
                const calculateAndCacheBoundsOnce = async () => {
                    // Check jika sudah ada cache, jangan recalculate
                    if (this.#cachedBoundingBox) {
                        console.log(`%c[Layer: ${this.#name}] ℹ️  Using CACHED bounding box: ${this.#cachedBoundingBox.width}x${this.#cachedBoundingBox.height}`, 'color: #90EE90; font-size: 11px');
                        return;
                    }
                    
                    console.log(`%c[Layer: ${this.#name}] ⏳ WAITING for ALL src to load...`, 'color: #FFB84D; font-weight: bold; font-size: 12px');
                    console.log(`%c   Total Promise pending: ${this.#srcLoadPromises.length}`, 'color: #FFB84D; font-size: 11px');
                    
                    // NATIVE APPROACH: Tunggu SEMUA Promise load sebelum hitung bounding box
                    // Promise.allSettled untuk tidak error jika ada src yang gagal load
                    try {
                        await Promise.allSettled(this.#srcLoadPromises);
                        console.log(`%c[Layer: ${this.#name}] ✅ ALL SRC LOADED - Now calculating bounding box...`, 'color: #6BCB77; font-weight: bold; font-size: 12px');
                    } catch (e) {
                        console.warn(`%c[Layer: ${this.#name}] ⚠️  Some src failed to load:`, 'color: #FFB84D; font-size: 11px', e);
                    }
                    
                    const bounds = this.#calculateRealBoundingBox();
                    
                    // Cache bounding box agar TIDAK PERNAH BERUBAH LAGI
                    this.#cachedBoundingBox = bounds;
                    
                    // Set element width/height ke bounding box max untuk outline
                    // HANYA untuk styling outline selection, bukan mengubah actual width/height
                    if (bounds.width > 0 && bounds.height > 0) {
                        this.element.style.width = bounds.width + 'px';
                        this.element.style.height = bounds.height + 'px';
                        console.log(`%c[Layer: ${this.#name}] ✅ BOUNDING BOX LOCKED: ${bounds.width}x${bounds.height} (STABIL - tidak akan berubah)`, 'color: #4D96FF; font-weight: bold; font-size: 12px');
                    } else {
                        console.warn(`%c[Layer: ${this.#name}] ⚠️  Invalid bounds (0 dimensions): ${bounds.width}x${bounds.height}`, 'color: #FFB84D; font-weight: bold; font-size: 12px');
                    }
                };
                
                // Jalankan calculation dengan async/await - NATIVE, TIDAK ADA TIMEOUT!
                calculateAndCacheBoundsOnce();
            }
        } else {
            this.element.classList.remove('selected');
            // Kembalikan ke width/height normal ketika deselect
            this.element.style.width = this.#width + 'px';
            this.element.style.height = this.#height + 'px';
            // Clear cache ketika deselect
            console.log(`%c[Layer: ${this.#name}] 🟢 DESELECTED - Cache cleared, ready for next selection`, 'color: #FF6B9D; font-size: 11px');
            this.#cachedBoundingBox = null;
            this.#resetInputs(); // Panggil fungsi untuk membersihkan input
        }
    }

    get name() {
        return this.#name;
    }
    
    get x() {
        return this.#x;
    }
    
    get y() {
        return this.#y;
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

    get selected() {
        return this.selectedState;
    }

    set name(name) {
        this.#name = name;
    }

    set x(value) {
        this.#x = value;
        this.#updateElement(); // Perbarui posisi elemen DOM
        this.#notifyParentUpdate(); // Beritahu parent jika ada
    }
    
    set y(value) {
        this.#y = value;
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
                        e.stopPropagation();
                        this.#selectImage(index);
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
            const selectedImg = this.element.querySelector('.src-item.src-selected');
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
            const selectedImg = this.element.querySelector('.src-item.src-selected');
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
                // Tandai semua elemen src di dalam layer
                this.element.querySelectorAll('.src-item').forEach(img => {
                    img.classList.add('src-selected');
                });
            } else {
                this.element.classList.remove('selected');
                // Jika ini group layer, hapus border
                if (this.#childLayers.length > 0) {
                    this.element.style.border = 'none';
                    this.element.style.pointerEvents = 'none';
                }
                this.element.querySelectorAll('.src-item').forEach(img => {
                    img.classList.remove('src-selected');
                    this.#resetInputs();
                });
            }
        }
    }

    attach(dstRoot, ondragstart = null) {
        dstRoot.appendChild(this.element);
        if (ondragstart) {
            this.#ondragstart = (e) => {
                // Jika selector multi aktif, jangan jalankan drag individual
                // e.stopPropagation() untuk mencegah event bubbling ke container
                if (window.__selectorActive) {
                    e.stopPropagation();
                    return;
                }
                ondragstart(e, this);
            };

            this.element.addEventListener('mousedown', this.#ondragstart, { passive: false });
            this.element.addEventListener('touchstart', this.#ondragstart, { passive: false });
        }

        // Add click handler untuk multi-select (jika function tersedia)
        if (typeof addLayerClickHandler === 'function') {
            addLayerClickHandler(this);
        }

        // Inisialisasi child layers dan set parent reference
        this.#childLayers.forEach(child => {
            child.#parentLayer = this; // Set parent reference
            child.attach(this.element, ondragstart);
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