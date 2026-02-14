//  -------------------Gacha Design Studio--------------------  //
//  Created by: Archana Berry                                   //
//  Assets credits: Lunime, OGL (Open Game License), MIT CC     //
//  Version resource: v0.001_alpha                              //
//  File: upload.js                                             //
//  Type: module[design]                                        //
//  Desc: Handling file uploads (SVG/Images) and Drag n Drop    //
//                                                              //
//  ----------------------------------------------------------  //

// Helper function untuk mendapatkan panel1-layercontainer
function getPanel1LayerContainer() {
    return document.getElementById('panel1-layercontainer') ||
        document.getElementById('panel1') ||
        document.querySelector('.container');
}

/**
 * Helper terpadu untuk memproses layer baru setelah dibuat
 * Memastikan layer terhubung ke sistem pointer, selector, dan framework
 */
function finalizeNewLayer(newLayer) {
    const container = getPanel1LayerContainer();
    if (!container) {
        console.error('Container not found for adding layer');
        return;
    }

    // 1. Tambahkan ke array global layers
    if (window.layers) {
        window.layers.push(newLayer);
    } else if (typeof layers !== 'undefined') {
        layers.push(newLayer);
    }

    // 2. Hubungkan ke Unified Pointer System (Multi-touch, drag, selection)
    if (typeof attachLayerToPointerSystem === 'function') {
        attachLayerToPointerSystem(newLayer);
    } else {
        // Fallback jika unified API belum siap
        newLayer.attach(container, typeof onlayerdragstart === 'function' ? onlayerdragstart : null);
    }

    // 3. Pastikan layer berada di container yang tepat (panel1-layercontainer)
    if (newLayer.element.parentElement !== container) {
        container.appendChild(newLayer.element);
    }

    // 4. Sinkronisasi dengan Selector state
    if (window.__selectorActive) {
        newLayer.element.style.pointerEvents = 'none';
    } else {
        newLayer.element.style.pointerEvents = 'auto';
    }

    // 5. Otomatis pilih layer yang baru di-import agar user bisa langsung edit
    if (typeof selectLayer === 'function') {
        selectLayer(newLayer);
    }

    // 6. Update framework display di panel3
    if (window.frameworkDisplay && typeof window.frameworkDisplay.update === 'function') {
        window.frameworkDisplay.update(window.layers || layers);
    }

    console.log(`✅ Layer "${newLayer.name}" imported and finalized.`);
}

// Accept multiple SVG files, parse _lX suffix to order layers
async function addSVGFiles(files) {
    if (!files || files.length === 0) return;

    // Filter only .svg files
    const svgFiles = Array.from(files).filter(f => f.name.toLowerCase().endsWith('.svg'));
    if (!svgFiles.length) return;

    // Group files by base name (strip _lX suffix)
    const groups = {};
    const suffixRe = /(.+?)_l(\d+)\.svg$/i;

    svgFiles.forEach(f => {
        const m = f.name.match(suffixRe);
        let base, idx;
        if (m) {
            base = m[1];
            idx = parseInt(m[2], 10);
        } else {
            base = f.name.replace(/\.svg$/i, '');
            idx = 0;
        }

        if (!groups[base]) groups[base] = [];
        groups[base].push({ file: f, index: idx });
    });

    for (const base of Object.keys(groups)) {
        // Sort by index DESC so that lower index (0) will be topmost (appended last or high z-index)
        // Standard in this studio: lower index = base, higher = top parts
        groups[base].sort((a, b) => b.index - a.index);

        const dataUrls = await Promise.all(groups[base].map(entry => readFileAsDataURL(entry.file)));

        const newLayer = new Layer(base, dataUrls);
        finalizeNewLayer(newLayer);
    }
}

// Accept multiple image files
async function addImageFiles(files) {
    if (!files || files.length === 0) return;

    const imageFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (!imageFiles.length) return;

    for (const file of imageFiles) {
        const dataUrl = await readFileAsDataURL(file);
        const name = file.name.replace(/\.[^/.]+$/, '');
        const newLayer = new Layer(name, [dataUrl]);
        finalizeNewLayer(newLayer);
    }
}

function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const fr = new FileReader();
        fr.onload = () => resolve(fr.result);
        fr.onerror = reject;
        fr.readAsDataURL(file);
    });
}

// Drag & drop support
document.addEventListener('DOMContentLoaded', () => {
    // Listen on panel1 root or layercontainer
    const panel = document.getElementById('panel1') || document.getElementById('panel1-layercontainer');
    if (!panel) return;

    panel.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    });

    panel.addEventListener('drop', (e) => {
        e.preventDefault();
        const dt = e.dataTransfer;
        if (!dt || !dt.files || dt.files.length === 0) return;
        addFiles(dt.files);
    });
});

// Function to add files, detecting SVG or image
async function addFiles(files) {
    if (!files || files.length === 0) return;

    // Process mix of SVGs and images
    const fileList = Array.from(files);
    const svgFiles = fileList.filter(f => f.name.toLowerCase().endsWith('.svg'));
    const imageFiles = fileList.filter(f => f.type.startsWith('image/') && !f.name.toLowerCase().endsWith('.svg'));

    if (svgFiles.length > 0) await addSVGFiles(svgFiles);
    if (imageFiles.length > 0) await addImageFiles(imageFiles);
}

// Backwards-compatible single-file handler (used by HTML input onchange)
function addImage(event) {
    if (!event || !event.target || !event.target.files) return;
    addFiles(event.target.files);
    // Reset input value so same file can be uploaded again
    event.target.value = '';
}

