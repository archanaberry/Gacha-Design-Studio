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
 */
function imageToBase64(src) {
    return new Promise((resolve) => {
        // Jika sudah data URL, langsung return
        if (src.startsWith('data:')) {
            resolve(src);
            return;
        }
        
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = function() {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            resolve(canvas.toDataURL());
        };
        img.onerror = function() {
            // Jika gagal load, return src asli
            resolve(src);
        };
        img.src = src;
    });
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

        // Add semua images dengan base64
        imageElements.forEach(imgData => {
            const image = document.createElementNS(svgNS, "image");
            image.setAttribute('href', imgData.base64Src);
            image.setAttribute('x', imgData.x);
            image.setAttribute('y', imgData.y);
            image.setAttribute('width', imgData.width);
            image.setAttribute('height', imgData.height);
            
            group.appendChild(image);
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
