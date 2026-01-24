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
    #parentLayer = null; // Reference ke parent layer jika ini adalah child
    #opacity = 1; // 0-1
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

        this.#initElement();

        // Set initial options
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
            // Opacity
            if ('opacity' in options) {
                // Expect value 0-1; if user provided 0-100, normalize
                let val = options.opacity;
                if (val > 1) val = Math.min(100, val) / 100;
                this.#opacity = Number(val) || 0;
            }
        }
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

    #getColorForSrc(index) {
        // Return warna spesifik untuk src, atau warna layer umum, atau null
        if (index in this.#srcColors) {
            return this.#srcColors[index];
        }
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
        
        if (this.#childLayers.length > 0) {
            this.element.classList.add('layer-group');
            // Hapus styling frame - gunakan styling bawaan saja
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
                if (img.naturalWidth > maxWidth || img.naturalHeight > maxHeight) {
                    maxWidth = Math.max(maxWidth, img.naturalWidth);
                    maxHeight = Math.max(maxHeight, img.naturalHeight);
                    // Auto-set layer dimensions ke largest image jika belum ada
                    if (!this.#width) this.#width = maxWidth;
                    if (!this.#height) this.#height = maxHeight;
                }
            };
            img.onerror = () => {
                console.warn(`Failed to load image: ${src}`);
            };
            
            const colorForThis = this.#getColorForSrc(index);
            if (src.endsWith('.svg') && colorForThis) {
                fetch(src).then(r => r.text()).then(svgText => {
                    svgText = svgText.replace(/fill="[^"]*"/g, `fill="${colorForThis}"`);
                    svgText = svgText.replace(/stroke="[^"]*"/g, `stroke="${colorForThis}"`);
                    svgText = svgText.replace(/fill:\s*[^;]+/g, `fill:${colorForThis}`);
                    svgText = svgText.replace(/stroke:\s*[^;]+/g, `stroke:${colorForThis}`);
                    const dataUrl = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgText)));
                    imgElement.src = dataUrl;
                    img.src = dataUrl; // Also load for dimensions
                }).catch(e => {
                    console.error('Failed to load SVG', e);
                    imgElement.src = src;
                    img.src = src;
                });
            } else {
                imgElement.src = src;
                img.src = src; // Load untuk get dimensions
            }
            
            this.element.appendChild(imgElement);
            
            // Tambahkan event listener untuk seleksi
            imgElement.addEventListener('click', (e) => {
                e.stopPropagation(); // Hindari seleksi layer utama
                this.#selectImage(index);
            });
            // Terapkan opacity per src pada saat inisialisasi
            imgElement.style.opacity = this.#opacity;
        });
    
        // Inisialisasi child layers
        this.#childLayers.forEach(child => child.attach(this.element));
    }    
    //
    
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
            this.element.style.border = 'none';
            this.element.style.pointerEvents = 'auto';
        }
    
        // Cari elemen gambar di dalam elemen utama (hanya untuk non-grouped layers)
        if (this.#childLayers.length === 0) {
            const imgElement = this.element.querySelector('img');
        
            // Periksa keberadaan imgElement sebelum mengakses style-nya
            if (imgElement) {
                if (this.#width) imgElement.style.width = this.#width + 'px';
                if (this.#height) imgElement.style.height = this.#height + 'px';
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

    #notifyParentUpdate() {
        // Jika ini adalah child layer, beritahu parent untuk update bounds
        if (this.#parentLayer) {
            this.#parentLayer.#updateElement();
        }
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
        } else {
            this.element.classList.remove('selected');
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

    // Perbarui ukuran untuk elemen src yang dipilih
    const selectedImg = this.element.querySelector('.src-item.src-selected');
    if (selectedImg) {
        selectedImg.style.width = `${value}px`;
    } else {
        this.#updateElement(); // Perbarui seluruh elemen jika tidak ada seleksi spesifik
    }
}

    set height(value) {
    this.#height = value;

    const selectedImg = this.element.querySelector('.src-item.src-selected');
    if (selectedImg) {
        selectedImg.style.height = `${value}px`;
    } else {
        this.#updateElement();
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