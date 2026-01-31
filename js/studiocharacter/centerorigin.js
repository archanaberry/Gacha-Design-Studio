/****************************************************************/
//                                                              //
//  -------------------Gacha Design Studio--------------------  //
//  Created by: Archana Berry                                   //
//  Assets credits: Lunime, OGL (Open Game License), MIT CC     //
//  Version resource: v0.001_alpha                              //
//  File: centerorigin.js                                       //
//  Type: module[design]                                        //
//  Desc: Handle center origin (0,0) positioning at screen center //
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

// centerorigin.js


/**
 * Hitung center offset untuk origin (0,0) di tengah layar
 * @returns {Object} { offsetX, offsetY, offsetXPercent, offsetYPercent }
 */
function calculateCenterOffset() {
    const layerContainer = document.getElementById('panel1-layercontainer');
    const panel1 = document.getElementById('panel1');
    const panelGroup = document.getElementById('panelGroup');
    
    if (!layerContainer) return { offsetX: 0, offsetY: 0, offsetXPercent: 0, offsetYPercent: 0 };
    
    // PRIORITAS 1: Gunakan panel-group sebagai reference (true visible container)
    let width = 0, height = 0;
    
    if (panelGroup) {
        const rect = panelGroup.getBoundingClientRect();
        width = rect.width;
        height = rect.height;
    }
    
    // PRIORITAS 2: Fallback ke layerContainer
    if (width === 0 || height === 0) {
        const rect = layerContainer.getBoundingClientRect();
        if (width === 0) width = rect.width;
        if (height === 0) height = rect.height;
    }
    
    // PRIORITAS 3: Fallback ke panel1
    if (width === 0 && panel1) {
        const panel1Rect = panel1.getBoundingClientRect();
        width = panel1Rect.width || panel1.scrollWidth || panel1.offsetWidth || panel1.clientWidth || window.innerWidth;
    }
    if (height === 0 && panel1) {
        const panel1Rect = panel1.getBoundingClientRect();
        height = panel1Rect.height || panel1.scrollHeight || panel1.offsetHeight || panel1.clientHeight || window.innerHeight;
    }
    
    // Ensure minimum values
    if (width === 0) width = window.innerWidth;
    if (height === 0) height = window.innerHeight;
    
    const centerX = width / 2;
    const centerY = height / 2;
    const centerXPercent = 50; // 50% dari width
    const centerYPercent = 50; // 50% dari height
    
    return {
        offsetX: centerX,
        offsetY: centerY,
        offsetXPercent: centerXPercent,
        offsetYPercent: centerYPercent,
        containerWidth: width,
        containerHeight: height
    };
}

/**
 * Toggle center origin - ubah origin (0,0) dari top-left ke center
 * @param {boolean} enabled - true untuk enable center origin, false untuk normal
 */
function toggleCenterOrigin(enabled) {
    centerOriginActive = enabled;
    const layerContainer = document.getElementById('panel1-layercontainer');
    
    if (!layerContainer) return;
    
    if (enabled) {
        // Aktifkan center origin
        const offset = calculateCenterOffset();
        const centerOffset = offset.offsetX; // centerX
        const centerOffsetY = offset.offsetY; // centerY
        
        // Set transform-origin ke center
        layerContainer.style.transformOrigin = 'center center';
        
        // Apply translate ONLY untuk visual offset - TIDAK mengubah layer.x/layer.y
        const currentTransform = layerContainer.style.transform;
        const scaleMatch = currentTransform.match(/scale\(([\d.]+)\)/);
        const scale = scaleMatch ? scaleMatch[1] : 1;
        
        // Transform membuat visual (0,0) menjadi di tengah, tapi layer.x/layer.y tetap normal
        layerContainer.style.transform = `translate(-${centerOffset}px, -${centerOffsetY}px) scale(${scale})`;
        
        // Store state
        layerContainer.dataset.centerOriginActive = 'true';
        layerContainer.dataset.centerOffsetX = centerOffset;
        layerContainer.dataset.centerOffsetY = centerOffsetY;
        
        console.log('Center origin ENABLED - Origin (0,0) at center (visual only)');
        console.log(`Offset: ${centerOffset}px, ${centerOffsetY}px`);
        
        // Trigger layer re-render dengan memanggil updateCoordInput untuk refresh visual
        if (typeof updateCoordInput === 'function') {
            updateCoordInput();
        }
        
    } else {
        // Matikan center origin - kembali ke normal
        const currentTransform = layerContainer.style.transform;
        const scaleMatch = currentTransform.match(/scale\(([\d.]+)\)/);
        const scale = scaleMatch ? scaleMatch[1] : 1;
        
        // Remove translate, hanya scale
        layerContainer.style.transform = `scale(${scale})`;
        
        // Clear state
        layerContainer.dataset.centerOriginActive = 'false';
        delete layerContainer.dataset.centerOffsetX;
        delete layerContainer.dataset.centerOffsetY;
        
        console.log('Center origin DISABLED - Origin (0,0) at top-left');
        
        // Trigger layer re-render dengan memanggil updateCoordInput untuk refresh visual
        if (typeof updateCoordInput === 'function') {
            updateCoordInput();
        }
    }
}

/**
 * Update center origin offset saat zoom atau resize
 * Memastikan origin tetap di center meskipun zoom berubah
 */
function updateCenterOriginTransform() {
    if (!centerOriginActive) return;
    
    const layerContainer = document.getElementById('panel1-layercontainer');
    if (!layerContainer) return;
    
    // Get current scale dari transform
    const currentTransform = layerContainer.style.transform;
    const scaleMatch = currentTransform.match(/scale\(([\d.]+)\)/);
    const scale = scaleMatch ? parseFloat(scaleMatch[1]) : 1;
    
    // Recalculate center offset
    const offset = calculateCenterOffset();
    const centerOffsetX = offset.offsetX;
    const centerOffsetY = offset.offsetY;
    
    // Update transform dengan maintained scale
    layerContainer.style.transform = `translate(-${centerOffsetX}px, -${centerOffsetY}px) scale(${scale})`;
    
    // Store untuk reference
    layerContainer.dataset.centerOffsetX = centerOffsetX;
    layerContainer.dataset.centerOffsetY = centerOffsetY;
    
    console.log(`Center origin updated: offset (${centerOffsetX}, ${centerOffsetY}), scale ${scale}`);
}

/**
 * Saat window resize, update center offset jika center origin aktif
 */
window.addEventListener('resize', () => {
    if (centerOriginActive) {
        updateCenterOriginTransform();
    }
});

