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
    #width = null; // Tambahkan properti width
    #height = null; // Tambahkan properti height
    #src = [];
    #childLayers = [];
    #ondragstart = null;

    constructor(name, src, options = {}, childLayers = []) {
        this.#name = name;
        this.#src = Array.isArray(src) ? src : [src];
        this.x = 0; // Posisi awal x
        this.y = 0; // Posisi awal y
        this.rotation = 0; // Rotasi awal
        this.scale = 1; // Skala awal
        this.selected = false; // Status seleksi
        this.#flipX = false; // Apakah horizontal flipped
        this.#flipY = false; // Apakah vertical flipped   
        this.#width = options.width || null; // Lebar awal
        this.#height = options.height || null; // Tinggi awal     
        this.element = null; // Referensi ke elemen DOM
        this.#childLayers = childLayers.map(child =>
            new Layer(child.layerName, child.src, child.options, child.childLayers || [])
        );

        this.#initElement();

        // Set initial options
        if (options) {
            if ('x' in options) this.#x = options.x;
            if ('y' in options) this.#y = options.y;
            if ('rotation' in options) this.#rotation = options.rotation;
            if ('scale' in options) this.#scale = options.scale;
            if ('flipX' in options) this.#flipX = options.flipX; // Gunakan #flipX
            if ('flipY' in options) this.#flipY = options.flipY; // Gunakan #flipY
        }
        this.#updateElement();
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
        
        this.#src.forEach((src, index) => {
            const imgElement = document.createElement('img');
            imgElement.src = src;
            imgElement.draggable = false;
            imgElement.classList.add('src-item');
            imgElement.dataset.index = index; // Tambahkan indeks untuk identifikasi
            this.element.appendChild(imgElement);
            
            // Tambahkan event listener untuk seleksi
            imgElement.addEventListener('click', (e) => {
                e.stopPropagation(); // Hindari seleksi layer utama
                this.#selectImage(index);
            });
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
        this.element.style.left = this.#x + 'px'; // Posisi horizontal
        this.element.style.top = this.#y + 'px'; // Posisi vertikal
        this.element.style.width = this.#width + 'px'; // Lebar
        this.element.style.height = this.#height + 'px'; // Tinggi
    
        // Cari elemen gambar di dalam elemen utama
        const imgElement = this.element.querySelector('img');
    
        // Periksa keberadaan imgElement sebelum mengakses style-nya
        if (imgElement) {
            if (this.#width) imgElement.style.width = this.#width + 'px';
            if (this.#height) imgElement.style.height = this.#height + 'px';
        } else {
            console.warn('Image element not found in layer:', this.#name);
        }
    
        // Terapkan transformasi (rotasi, skala, flip)
        const transforms = [
            `rotate(${this.#rotation}deg)`,
            `scale(${this.#scale})`,
        ];
        if (this.#flipX) transforms.push('scaleX(-1)');
        if (this.#flipY) transforms.push('scaleY(-1)');
        this.element.style.transform = transforms.join(' ');
    
        // Perbarui label nama layer
        const nameLabel = this.element.querySelector('.layer-name');
        if (nameLabel) {
            nameLabel.textContent = this.#name;
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

    //
    set selected(value) {
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
    //

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

    get selected() {
        return this.selectedState;
    }

    set name(name) {
        this.#name = name;
    }

    set x(value) {
        this.#x = value;
        this.#updateElement(); // Perbarui posisi elemen DOM
    }
    
    set y(value) {
        this.#y = value;
        this.#updateElement(); // Perbarui posisi elemen DOM
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
                // Tandai semua elemen src di dalam layer
                this.element.querySelectorAll('.src-item').forEach(img => {
                    img.classList.add('src-selected');
                });
            } else {
                this.element.classList.remove('selected');
                this.element.querySelectorAll('.src-item').forEach(img => {
                    img.classList.remove('src-selected');
                    this.#resetInputs();
                });
            }
        }
    }

    attach(dstRoot, ondragstart) {
        dstRoot.appendChild(this.element);
        this.#ondragstart = (e) => {
            ondragstart(e, this);
        };

        this.element.addEventListener('mousedown', this.#ondragstart);
        this.element.addEventListener('touchstart', this.#ondragstart);
    }

    detach() {
        this.element.parentElement.removeChild(this.element);
        this.element.removeEventListener('mousedown', this.#ondragstart);
        this.element.removeEventListener('touchstart', this.#ondragstart);
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