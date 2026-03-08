/****************************************************************/
//                                                              //
//  -------------------Gacha Design Studio--------------------  //
//  Created by: Archana Berry                                   //
//  Assets credits: Lunime, OGL (Open Game License), MIT CC     //
//  Version resource: v0.001_alpha                              //
//  File: export.js                                             //
//  Type: module[design]                                        //
//  Desc: Function export character to svg or etc format's      //
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

// export.js

/**
 * Convert image URL/src to base64 data URL
 * Supports both external URLs dan data URLs
 * Optimized for SVGs to preserve vector quality
 */
async function imageToBase64(src) {
    if (src.startsWith('data:')) return src;

    try {
        // Coba gunakan fetch untuk kualitas lebih baik (terutama SVG)
        const response = await fetch(src);
        const blob = await response.blob();
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
        });
    } catch (e) {
        console.warn(`[imageToBase64] Fetch failed for ${src}, falling back to canvas:`, e);
        return new Promise((resolve) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = function () {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                resolve(canvas.toDataURL());
            };
            img.onerror = function () {
                resolve(src);
            };
            img.src = src;
        });
    }
}

/**
 * Ekspor karakter sebagai HTML
 * Hanya mengambil hasil dari panel1 dan mengganti nama dengan 'exported'
 * Termasuk layer grup lainnya jika terdefinisi (misal: exported_xxx)
 * Panel2 dan splitter tidak ikutsertakan
 * Semua assets di-inline sebagai base64
 */
function exportAsHTML() {
    const panel1 = document.getElementById('panel1');

    if (!panel1 || !panel1.children.length) {
        alert('Tidak ada layer untuk diekspor di panel1');
        return;
    }

    // Buat div wrapper untuk hasil ekspor
    const exportedDiv = document.createElement('div');
    exportedDiv.id = 'exported';
    exportedDiv.style.backgroundColor = 'transparent';
    exportedDiv.style.position = 'relative';

    // Salin semua layer dari panel1
    Array.from(panel1.children).forEach((child) => {
        const clonedLayer = child.cloneNode(true);

        // Ubah nama ID jika ada
        if (clonedLayer.id) {
            clonedLayer.id = `exported_${clonedLayer.id}`;
        } else {
            // Jika tidak ada ID, berikan nama default
            clonedLayer.id = `exported_layer_${Math.random().toString(36).substr(2, 9)}`;
        }

        // Bersihkan style yang tidak perlu
        clonedLayer.style.cursor = '';
        clonedLayer.style.outline = '';

        // Hapus event listeners
        const clone = clonedLayer.cloneNode(true);
        clone.id = clonedLayer.id;
        clone.style.cssText = clonedLayer.style.cssText;

        exportedDiv.appendChild(clone);
    });

    // Process semua img src untuk convert ke base64
    const allImages = exportedDiv.querySelectorAll('img');
    const imageConversions = Array.from(allImages).map(img => {
        return imageToBase64(img.src).then(base64Src => {
            img.src = base64Src;
        });
    });

    // Tunggu semua image selesai di-convert
    Promise.all(imageConversions).then(() => {
        // Generate HTML yang bersih dengan inline assets
        const htmlContent = `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Karakter Ekspor</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background-color: #f0f0f0;
        }
        
        #exported {
            background-color: transparent;
            position: relative;
        }
        
        .layer, .layer-group {
            position: absolute;
        }
        
        .layer img, .layer-group img {
            max-width: 100%;
            height: auto;
            display: block;
        }
    </style>
</head>
<body>
    ${exportedDiv.innerHTML}
</body>
</html>`;

        // Unduh file HTML
        const blob = new Blob([htmlContent], { type: 'text/html; charset=utf-8' });
        const url = window.URL.createObjectURL(blob);

        const fileName = document.getElementById('htmlFileName')?.value || 'character';
        const link = document.createElement('a');
        link.href = url;
        link.download = `${fileName}.html`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        alert('Karakter berhasil diekspor sebagai HTML (dengan inline assets)');
    });
}

/**
 * Ekspor karakter sebagai SVG
 * Jika objek ada ruang kosong di kiri, akan dirapatkan ke 0.0
 * Membuat SVG yang bersih hanya untuk karakter
 * Semua assets di-inline sebagai base64
 */
function exportAsSVG() {
    const panel1 = document.getElementById('panel1');

    if (!panel1 || !panel1.children.length) {
        alert('Tidak ada layer untuk diekspor di panel1');
        return;
    }

    // Hitung bounding box dari semua layer
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    const svgNS = "http://www.w3.org/2000/svg";
    const imageElements = [];

    // Proses setiap layer dan collect semua images
    Array.from(panel1.children).forEach((layerElement) => {
        const rect = layerElement.getBoundingClientRect();
        const panel1Rect = panel1.getBoundingClientRect();

        // Hitung posisi relatif terhadap panel1
        const x = rect.left - panel1Rect.left;
        const y = rect.top - panel1Rect.top;
        const width = rect.width;
        const height = rect.height;

        // Update bounding box
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x + width);
        maxY = Math.max(maxY, y + height);

        // Salin layer ke SVG
        const images = layerElement.querySelectorAll('img');
        images.forEach((img) => {
            const imgRect = img.getBoundingClientRect();
            const imgX = imgRect.left - panel1Rect.left;
            const imgY = imgRect.top - panel1Rect.top;

            imageElements.push({
                src: img.src,
                x: imgX,
                y: imgY,
                width: imgRect.width,
                height: imgRect.height
            });
        });
    });

    // Convert semua image ke base64
    const imageConversions = imageElements.map(imgData => {
        return imageToBase64(imgData.src).then(base64Src => {
            imgData.base64Src = base64Src;
        });
    });

    // Tunggu semua image selesai di-convert
    Promise.all(imageConversions).then(() => {
        // Sekarang buat SVG dengan base64 inline
        const svg = document.createElementNS(svgNS, "svg");
        const group = document.createElementNS(svgNS, "g");

        // Tambahkan logika untuk mengelompokkan innerchild
        const innerChildGroups = new Map();
        imageElements.forEach(imgData => {
            const groupKey = imgData.group || 'default';
            if (!innerChildGroups.has(groupKey)) {
                const innerGroup = document.createElementNS(svgNS, "g");
                innerChildGroups.set(groupKey, innerGroup);
                group.appendChild(innerGroup);
            }
            const innerGroup = innerChildGroups.get(groupKey);

            const image = document.createElementNS(svgNS, "image");
            image.setAttribute('href', imgData.base64Src);
            image.setAttribute('x', imgData.x);
            image.setAttribute('y', imgData.y);
            image.setAttribute('width', imgData.width);
            image.setAttribute('height', imgData.height);
            innerGroup.appendChild(image);
        });

        // Rapakan ke 0.0 jika ada celah di kiri
        const svgWidth = Math.max(maxX - minX, 1);
        const svgHeight = Math.max(maxY - minY, 1);

        svg.setAttribute('viewBox', `0 0 ${svgWidth} ${svgHeight}`);
        svg.setAttribute('width', svgWidth);
        svg.setAttribute('height', svgHeight);
        svg.setAttribute('xmlns', svgNS);

        group.setAttribute('transform', `translate(${-minX}, ${-minY})`);
        svg.appendChild(group);

        // Convert ke string
        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(svg);

        // Format SVG dengan pretty print
        const formattedSVG = `<?xml version="1.0" encoding="UTF-8"?>
${svgString}`;

        // Unduh file SVG
        const blob = new Blob([formattedSVG], { type: 'image/svg+xml; charset=utf-8' });
        const url = window.URL.createObjectURL(blob);

        const fileName = document.getElementById('svgFileName')?.value || 'character';
        const link = document.createElement('a');
        link.href = url;
        link.download = `${fileName}.svg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        alert('Karakter berhasil diekspor sebagai SVG (dengan inline assets)');
    });
}

/**
 * Ekspor scene studio ke format .gss atau .gsj
 */
function exportStudioScene() {
    // Dialog konten sesuai permintaan
    const dialogHTML = `
        <div style="padding: 20px; text-align: center; font-family: 'Comfortaa', sans-serif;">
            <p style="font-size: 16px; margin-bottom: 15px; color: #333;">
                <strong>Ekspor Gacha Scene Studio</strong>
            </p>
            <p style="font-size: 14px; color: #666; line-height: 1.6;">
                Anda mau ekspor Gacha Scene Studio mau sebagai format Javascript (.gss) atau JSON (.gsj)?
            </p>
            
            <div style="margin: 15px 0; display: flex; justify-content: center; align-items: center; gap: 8px; background: #eee; padding: 10px; border-radius: 8px;">
                <input type="checkbox" id="includeAssetsToggle" style="width: 18px; height: 18px; cursor: pointer;">
                <label for="includeAssetsToggle" style="font-size: 14px; cursor: pointer; color: #333; font-weight: bold;">Sertakan aset (Base64)</label>
            </div>

            <div style="margin-top: 15px; background: #f9f9f9; padding: 10px; border-radius: 8px; border: 1px dashed #ccc; text-align: left;">
                <p style="font-size: 12px; color: #888;">
                    <strong>.gss</strong>: Format kode Javascript dengan deklarasi aset di awal.<br>
                    <strong>.gsj</strong>: Format data JSON dengan objek aset terintegrasi.
                </p>
            </div>
        </div>
    `;

    // Footer buttons - Menggunakan styling WindowHandler
    const footerHTML = `
        <div style="display: flex; gap: 10px; justify-content: center; width: 100%; flex-wrap: wrap;">
            <button class="footer-btn" style="background-color: #5E6CC9; padding: 8px 16px;" onclick="performExport('gss')">
                Ekspor .gss
            </button>
            <button class="footer-btn" style="background-color: #4CAF50; padding: 8px 16px;" onclick="performExport('gsj')">
                Ekspor .gsj
            </button>
            <button class="footer-btn" style="background-color: #9C27B0; padding: 8px 16px;" onclick="importStudioScene()">
                Impor Scene
            </button>
            <button class="footer-btn" style="background-color: #f44336; padding: 8px 16px;" onclick="window.closeWindow(window.__exportWindowId)">
                Batal
            </button>
        </div>
    `;

    // Buka window menggunakan WindowHandler
    const windowId = openWindow({
        title: 'gacha design studio -',
        content: dialogHTML,
        footer: footerHTML,
        width: '450px'
    });

    // Sesuai permintaan: pakai api di windowhandler.js (nanti setelah - isi "Ekspor kode studio?")
    if (typeof continueWindowTittle === 'function') {
        continueWindowTittle(windowId, ' Ekspor kode studio?');
    }

    // Simpan ID window untuk menutupnya nanti
    window.__exportWindowId = windowId;
}

/**
 * Trigger file picker untuk impor scene
 */
window.importStudioScene = function () {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.gss,.gsj,.json,.js';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) performSceneFileImport(file);
    };
    input.click();
};

/**
 * Membaca dan memproses file impor
 */
function performSceneFileImport(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const content = e.target.result;
        let data = null;

        try {
            if (file.name.endsWith('.gsj') || file.name.endsWith('.json')) {
                data = JSON.parse(content);
            } else {
                // Format .gss (Javascript)
                const assetsMatch = content.match(/const\s+assets\s*=\s*(\{[\s\S]*?\});/);
                const inlinedMatch = content.match(/const\s+inlined\s*=\s*(\{[\s\S]*?\});/);
                const bg0Match = content.match(/const\s+background0\s*=\s*("[^"]*");/);
                const layersMatch = content.match(/const\s+layers\s*=\s*(\[[\s\S]*\]);?/);

                if (layersMatch && layersMatch[1]) {
                    data = { layers: new Function(`return ${layersMatch[1]}`)() };
                    if (assetsMatch) data.assets = new Function(`return ${assetsMatch[1]}`)();
                    if (inlinedMatch) data.inlined = new Function(`return ${inlinedMatch[1]}`)();
                    if (bg0Match) data.background0 = new Function(`return ${bg0Match[1]}`)();
                } else {
                    const raw = new Function(`return ${content}`)();
                    data = Array.isArray(raw) ? { layers: raw } : raw;
                }
            }

            if (data) {
                const layersToLoad = data.layers || (Array.isArray(data) ? data : null);
                if (!layersToLoad) throw new Error('Data layers tidak ditemukan.');

                // Satukan data aset menggunakan mapping ID (angka)
                let combinedAssets = null;
                const assetMap = data.assets || {};
                const b64Map = data.inlined || {};

                combinedAssets = {};
                // Resolusi ID -> Content (Base64 prioritas, lalu Nama File)
                for (const id in assetMap) {
                    combinedAssets[id] = b64Map[id] || assetMap[id];
                }

                // Gunakan background0 jika ada
                loadStudioScene(layersToLoad, combinedAssets, data.background0 || data.background);

                if (window.__exportWindowId) window.closeWindow(window.__exportWindowId);
                alert('Scene berhasil dimuat!');
            } else {
                throw new Error('Format data tidak valid');
            }
        } catch (err) {
            console.error('Import failed:', err);
            alert('Gagal memuat scene: ' + err.message);
        }
    };
    reader.readAsText(file);
}

/**
 * Memasukkan data scene ke dalam studio
 * @param {Array} layerDataList - Array of layer objects
 * @param {Object} assets - Map of path to base64
 * @param {string} background - Base64 background panel1
 */
function loadStudioScene(layerDataList, assets = null, background = null) {
    if (!window.layers) {
        alert('Gagal: window.layers tidak ditemukan.');
        return;
    }

    // 1. Detach semua layer lama dari DOM
    window.layers.forEach(l => {
        if (typeof l.detach === 'function') {
            l.detach();
        } else if (l.element && l.element.parentNode) {
            l.element.remove();
        }
    });

    // 2. Bersihkan array global
    window.layers.length = 0;

    // 3. Handle Background jika ada
    if (background) {
        const panel1Root = document.getElementById('panel1-root') || document.getElementById('panel1');
        if (panel1Root) {
            panel1Root.style.backgroundImage = `url('${background}')`;
            if (typeof updateBgConfig === 'function') {
                updateBgConfig('panel1', background, 100);
            }
        }
    }

    // 4. Reconstruct layers
    const container = document.getElementById('panel1-layercontainer') || document.getElementById('panel1') || document.querySelector('.container');

    layerDataList.forEach(data => {
        if (typeof createLayerFromObject === 'function') {
            // Jika ada aset embedded, ganti src dengan base64
            if (assets && data.src) {
                data.src = data.src.map(s => assets[s] || s);
            }
            // Rekursif untuk child layers
            const processChildAssets = (child) => {
                if (assets && child.src) {
                    child.src = child.src.map(s => assets[s] || s);
                }
                if (child.childLayers) child.childLayers.forEach(processChildAssets);
            };
            if (data.childLayers) data.childLayers.forEach(processChildAssets);

            const newLayer = createLayerFromObject(data);
            if (newLayer) {
                window.layers.push(newLayer);

                // Re-attach visual
                // Re-attach visual using Unified Pointer System (modern) or legacy fallback
                if (typeof attachLayerToPointerSystem === 'function') {
                    attachLayerToPointerSystem(newLayer);
                } else if (typeof newLayer.attach === 'function') {
                    const dragHandler = typeof onLayerPointerDown === 'function' ? onLayerPointerDown : null;
                    newLayer.attach(container, dragHandler);
                }

                // Re-integrate bone jika ada spineData (fleksibel)
                if (data.options && data.options.spineData && window.Spine) {
                    newLayer.spine = new window.Spine(newLayer);
                }

                // Re-integrate HTML Shape khusus
                if ((data.isHtmlShape || (data.options && data.options.isHtmlShape)) && typeof window.hsRehydrateHtmlShape === 'function') {
                    window.hsRehydrateHtmlShape(newLayer, data.htmlShapeData);
                }
            }
        }
    });

    // 5. Update UI
    if (typeof deselectAllLayersUnified === 'function') deselectAllLayersUnified();
    if (typeof updateCoordInput === 'function') updateCoordInput();
    if (typeof renderLayer === 'function') renderLayer();
    if (typeof updateMenuLayer === 'function') updateMenuLayer();

    console.log(`✅ Loaded ${layerDataList.length} layers into studio.`);
}

/**
 * Menjalankan proses ekspor berdasarkan format yang dipilih
 * @param {string} format - 'gss' atau 'gsj'
 */
window.performExport = async function (format) {
    if (!window.layers || window.layers.length === 0) {
        alert('Tidak ada layer di studio untuk diekspor!');
        return;
    }

    const includeAssets = document.getElementById('includeAssetsToggle')?.checked;

    if (includeAssets) {
        console.log('📦 Menyiapkan aset untuk ekspor (Optimized External Mode)...');
    }

    // 1. Persiapkan pemetaan aset terpadu (Selalu buat ID agar irit)
    const pathToId = {};
    const idToShortName = {};
    const idToB64 = {};
    let assetCounter = 0;

    // Kumpulkan semua data layer mentah
    const rawLayerDataList = window.layers.map(layer => getSerializedLayerData(layer));

    // Ekstrak semua path unik dan beri ID numerik
    const collectPaths = (data) => {
        if (data.src && Array.isArray(data.src)) {
            data.src.forEach(path => {
                if (!path || path.startsWith('data:')) return;
                if (pathToId[path] === undefined) {
                    const id = assetCounter++;
                    pathToId[path] = id;
                    idToShortName[id] = path.split('/').pop();
                }
            });
        }
        if (data.childLayers) data.childLayers.forEach(collectPaths);
    };
    rawLayerDataList.forEach(collectPaths);

    // Konversi ke Base64 jika diminta
    if (includeAssets) {
        for (const [path, id] of Object.entries(pathToId)) {
            idToB64[id] = await imageToBase64(path);
        }
    }

    // Ganti src string dengan integer ID (Lebih irit ditiap layer)
    const replaceWithIds = (data) => {
        if (data.src && Array.isArray(data.src)) {
            data.src = data.src.map(src => {
                return (pathToId[src] !== undefined) ? pathToId[src] : src;
            });
        }
        if (data.childLayers) data.childLayers.forEach(replaceWithIds);
    };
    rawLayerDataList.forEach(replaceWithIds);

    // Handle Background secara dinamis
    let backgrounds = {};
    const panel1Root = document.getElementById('panel1-root') || document.getElementById('panel1');
    const bgStyle = panel1Root?.style.backgroundImage;
    if (bgStyle && bgStyle !== 'none') {
        const bgUrl = bgStyle.slice(5, -2).replace(/"/g, "");
        backgrounds['background0'] = includeAssets ? await imageToBase64(bgUrl) : bgUrl.split('/').pop();
    }

    let content = '';
    const extension = format === 'gss' ? '.gss' : '.gsj';
    const mimeType = format === 'gss' ? 'text/javascript' : 'application/json';
    const fileName = `studio_scene_${Date.now()}${extension}`;

    if (format === 'gss') {
        content = `// Gacha Design Studio Export (Highly Optimized)\n`;
        content += `const assets = ${JSON.stringify(idToShortName, null, 2)};\n\n`;
        if (includeAssets) {
            content += `const inlined = ${JSON.stringify(idToB64, null, 2)};\n\n`;
        }
        for (const [key, val] of Object.entries(backgrounds)) {
            content += `const ${key} = ${JSON.stringify(val)};\n`;
        }
        if (Object.keys(backgrounds).length > 0) content += `\n`;
        content += `const layers = ${JSON.stringify(rawLayerDataList, null, 2)};`;
    } else {
        let sortedObj = {};
        sortedObj.assets = idToShortName;
        if (includeAssets) sortedObj.inlined = idToB64;
        Object.assign(sortedObj, backgrounds);
        sortedObj.layers = rawLayerDataList;
        content = JSON.stringify(sortedObj, null, 2);
    }

    // Trigger unduhan file
    try {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } catch (err) {
        console.error('Export failed:', err);
        alert('Gagal mengekspor file: ' + err.message);
    }

    if (window.__exportWindowId) {
        window.closeWindow(window.__exportWindowId);
    }

    console.log(`✅ Scene exported (Optimized) as ${format.toUpperCase()}: ${fileName}`);
};

/**
 * Mengonversi instance Layer ke objek data mentah yang rapi
 * @param {Layer} layer - Instance dari kelas Layer
 * @returns {Object} - Objek data serializable
 */
window.getSerializedLayerData = function (layer) {
    // Integrasi bone (fleksibel)
    if (layer.spine && typeof layer.spine.save === 'function') {
        layer.spine.save();
    }

    // Kumpulkan properties terbaru dari getters instance
    const currentOptions = {
        posX: layer.x,
        posY: layer.y,
        x: layer.x,
        y: layer.y,
        rotation: layer.rotation || 0,
        scale: layer.scale || 1,
        flipX: !!layer.isFlipX,
        flipY: !!layer.isFlipY,
        skewX: layer.skewX || 0,
        skewY: layer.skewY || 0,
        minX: layer.minX || 0,
        minY: layer.minY || 0,
        width: layer.width,
        height: layer.height,
        opacity: layer.opacity !== undefined ? layer.opacity : 1,
        color: layer.color || null,
        isHtmlShape: layer.isHtmlShape || false
    };

    // Capture multiplier state
    if (layer.multiplier && layer.multiplier.options) {
        currentOptions.multiplier = Object.assign({}, layer.multiplier.options);
    }

    // Capture per-source properties and colors
    for (let i = 0; i < layer.src.length; i++) {
        // Colors
        const color = (layer.srcColors && layer.srcColors[i]) || (layer.options && layer.options[`color${i}`]);
        if (color) currentOptions[`color${i}`] = color;

        // Position/Opacity/etc per source
        const props = ['posX', 'posY', 'rotation', 'scale', 'opacity', 'flipX', 'flipY', 'width', 'height'];
        props.forEach(p => {
            const val = layer.options[`${p}${i}`];
            if (val !== undefined) currentOptions[`${p}${i}`] = val;
        });
    }

    const options = Object.assign({}, layer.options || {}, currentOptions);

    const data = {
        layerName: layer.name,
        src: layer.src,
        options: options
    };

    if (layer.isHtmlShape || (layer.options && layer.options.isHtmlShape)) {
        data.isHtmlShape = true;
        if (options) options.isHtmlShape = true;
        data.htmlShapeData = layer.htmlShapeData;
    }

    // Rekursif jika ada child layers (Grup)
    if (layer.childLayers && layer.childLayers.length > 0) {
        data.childLayers = layer.childLayers.map(child => getSerializedLayerData(child));
    }

    return data;
}
