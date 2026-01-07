//  -------------------Gacha Design Studio--------------------  //
//  Created by: Archana Berry                                   //
//  Assets credits: Lunime, OGL (Open Game License), MIT CC     //
//  Version resource: v0.001_alpha                              //
//  File: upload.js                                             //
//  Type: module[design]                                        //
//  Desc: Handling multi selection layer                        //
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

//upload.js

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
            // no suffix, treat whole name (without extension) as base and index 0
            base = f.name.replace(/\.svg$/i, '');
            idx = 0;
        }

        if (!groups[base]) groups[base] = [];
        groups[base].push({ file: f, index: idx });
    });

    const container = document.querySelector('.container') || document.getElementById('panel1');

    // Jika container tidak ada, abort
    if (!container) {
        console.error('Container not found for adding images');
        return;
    }
    for (const base of Object.keys(groups)) {
        // Sort by index DESC so that lower index (0) will be appended last -> topmost
        groups[base].sort((a, b) => b.index - a.index);

        const dataUrls = await Promise.all(groups[base].map(entry => readFileAsDataURL(entry.file)));

        const newLayer = new Layer(base, dataUrls);
        layers.push(newLayer);
        newLayer.attach(container, onlayerdragstart);
        
        // Jika selector aktif, set pointer-events ke none
        if (window.__selectorActive) {
            newLayer.element.style.pointerEvents = 'none';
        }
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

// Drag & drop support on panel1 for unlimited files
document.addEventListener('DOMContentLoaded', () => {
    const panel = document.getElementById('panel1') || document.querySelector('.container');
    if (!panel) return;

    panel.addEventListener('dragover', (e) => {
        e.preventDefault();
    });

    panel.addEventListener('drop', (e) => {
        e.preventDefault();
        const dt = e.dataTransfer;
        if (!dt) return;
        const files = dt.files;
        addSVGFiles(files);
    });
});

// Backwards-compatible single-file handler (used by frame HTML button)
function addImage(event) {
    const files = event.target.files;
    if (!files) return;
    addSVGFiles(files);
}

function updateLayerElement(layer, key, src) {
    const imgElement = document.createElement('img');
    imgElement.src = src;
    imgElement.alt = key;
    imgElement.classList.add(key);
    imgElement.draggable = false;
    layer.element.appendChild(imgElement);
}
