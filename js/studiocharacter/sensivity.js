/****************************************************************/
//                                                              //
//  -------------------Gacha Design Studio--------------------  //
//  Created by: Archana Berry                                   //
//  Assets credits: Lunime, OGL (Open Game License), MIT CC     //
//  Version resource: v0.001_alpha                              //
//  File: sensitivity.js                                        //
//  Type: module[design]                                        //
//  Desc: Handling value sensitivity for control                //
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

// sensitivity.js

let sensitivity = 0.1 // Nilai awal untuk sensitivitas

function handleSensitivity(value) {
    sensitivity = parseFloat(value);
    document.getElementById('sensitivityInput').value = sensitivity;
}

/**
 * Draw guide canvas dengan garis biru dash pada interval 10%
 * Bergap sesuai ukuran layar asli saat zoom <100%
 */
function drawGuideCanvas() {
    const canvas = document.getElementById('guideCanvas');
    const layerContainer = document.getElementById('panel1-layercontainer');
    
    if (!canvas || !layerContainer) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size ke panel1-layercontainer size
    const rect = layerContainer.getBoundingClientRect();
    canvas.width = layerContainer.offsetWidth;
    canvas.height = layerContainer.offsetHeight;
    
    // Get current scale dari transform
    const transform = layerContainer.style.transform;
    const scaleMatch = transform.match(/scale\(([0-9.]+)\)/);
    const scale = scaleMatch ? parseFloat(scaleMatch[1]) : 1;
    
    // Hanya gambar jika zoom <100%
    if (scale >= 1) {
        canvas.style.display = 'none';
        return;
    }
    
    canvas.style.display = 'block';
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set garis style
    ctx.strokeStyle = '#5dade2'; // Sky blue
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]); // Dash pattern: 5px line, 5px gap
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Hitung interval untuk grid (10% dari ukuran asli, responsif ke layar)
    // Karena canvas di-scale, kita perlu hitung berdasarkan ukuran asli
    const gridStep = Math.max(
        canvas.width * 0.1,  // 10% width
        canvas.height * 0.1  // 10% height
    );
    
    // Gambar garis vertikal
    for (let x = gridStep; x < canvas.width; x += gridStep) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    
    // Gambar garis horizontal
    for (let y = gridStep; y < canvas.height; y += gridStep) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
    
    // Gambar outline border tebal
    ctx.setLineDash([]); // Solid line untuk border
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#2196f3'; // Darker blue
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
}

function handleZoom(value) {
    const zoomValue = parseFloat(value);
    const layerContainer = document.getElementById('panel1-layercontainer');
    
    if (layerContainer) {
        const scale = zoomValue / 100; // 100% = scale 1
        layerContainer.dataset.scale = scale;
        
        // Preserve center origin translate jika aktif
        const isCenterOriginActive = layerContainer.dataset.centerOriginActive === 'true';
        if (isCenterOriginActive) {
            const centerOffsetX = parseFloat(layerContainer.dataset.centerOffsetX) || 0;
            const centerOffsetY = parseFloat(layerContainer.dataset.centerOffsetY) || 0;
            layerContainer.style.transform = `translate(-${centerOffsetX}px, -${centerOffsetY}px) scale(${scale})`;
        } else {
            layerContainer.style.transform = `scale(${scale})`;
        }
        
        // Gambar guide canvas jika zoom <100%
        drawGuideCanvas();
        
        document.getElementById('zoomInput').value = zoomValue + '%';
        
        // Record history
        if (typeof window.HistoryManager !== 'undefined') {
          window.HistoryManager.recordAction('zoom', {
            scale: scale,
            action: 'Zoom via slider'
          });
        }
    }
}

function handleZoomInput(value) {
    // Remove '%' if present
    let zoomValue = parseFloat(value.replace('%', ''));
    if (isNaN(zoomValue)) return;
    
    // Clamp to 0-10000
    zoomValue = Math.max(0, Math.min(10000, zoomValue));
    
    const layerContainer = document.getElementById('panel1-layercontainer');
    if (layerContainer) {
        const scale = zoomValue / 100; // 100% = scale 1
        layerContainer.dataset.scale = scale;
        
        // Preserve center origin translate jika aktif
        const isCenterOriginActive = layerContainer.dataset.centerOriginActive === 'true';
        if (isCenterOriginActive) {
            const centerOffsetX = parseFloat(layerContainer.dataset.centerOffsetX) || 0;
            const centerOffsetY = parseFloat(layerContainer.dataset.centerOffsetY) || 0;
            layerContainer.style.transform = `translate(-${centerOffsetX}px, -${centerOffsetY}px) scale(${scale})`;
        } else {
            layerContainer.style.transform = `scale(${scale})`;
        }
        
        // Gambar guide canvas jika zoom <100%
        drawGuideCanvas();
        
        document.getElementById('zoomSlider').value = zoomValue;
        document.getElementById('zoomInput').value = zoomValue + '%';
        
        // Record history
        if (typeof window.HistoryManager !== 'undefined') {
          window.HistoryManager.recordAction('zoom', {
            scale: scale,
            action: 'Zoom via input'
          });
        }
    }
}
