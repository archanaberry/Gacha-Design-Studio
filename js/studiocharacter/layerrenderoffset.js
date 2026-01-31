/****************************************************************/
//                                                              //
//  -------------------Gacha Design Studio--------------------  //
//  Created by: Archana Berry                                   //
//  Assets credits: Lunime, OGL (Open Game License), MIT CC     //
//  Version resource: v0.001_alpha                              //
//  File: layerrenderoffset.js                                  //
//  Type: module[design]                                        //
//  Desc: Handle layer rendering offset (visual only)          //
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

// layerrenderoffset.js

/**
 * Hitung default render offset untuk layer
 * Default posisi rendering adalah di tengah canvas (50% X, 50% Y)
 * Bukan di top-left (0,0)
 * 
 * Ini adalah VISUAL ONLY - tidak mempengaruhi layer.x dan layer.y storage
 */
function getLayerRenderOffset() {
    const layerContainer = document.getElementById('panel1-layercontainer');
    const panel1 = document.getElementById('panel1');
    const panelGroup = document.getElementById('panelGroup');
    
    if (!layerContainer) return { offsetX: 0, offsetY: 0 };
    
    // PRIORITAS 1: Gunakan panel-group (parent flex container) sebagai reference
    // Karena panel1 mungkin overlap dengan panel2/splitter dari absolute positioning
    let width = 0, height = 0;
    
    if (panelGroup) {
        const rect = panelGroup.getBoundingClientRect();
        width = rect.width;
        height = rect.height;
        
        console.log('� PanelGroup dimensions:', { width: rect.width, height: rect.height });
    }
    
    // PRIORITAS 2: Jika panelGroup tidak available, gunakan layerContainer
    if (width === 0 || height === 0) {
        const rect = layerContainer.getBoundingClientRect();
        if (width === 0) width = rect.width;
        if (height === 0) height = rect.height;
        
        console.log('📊 LayerContainer dimensions:', { width: rect.width, height: rect.height });
    }
    
    // PRIORITAS 3: Fallback ke client/scroll/offset dimensions
    if (width === 0) {
        width = layerContainer.scrollWidth || layerContainer.offsetWidth || layerContainer.clientWidth;
    }
    if (height === 0) {
        height = layerContainer.scrollHeight || layerContainer.offsetHeight || layerContainer.clientHeight;
    }
    
    // PRIORITAS 4: Fallback ke panel1 dimensions
    if (width === 0 && panel1) {
        const panel1Rect = panel1.getBoundingClientRect();
        width = panel1Rect.width;
        if (width === 0) {
            width = panel1.scrollWidth || panel1.offsetWidth || panel1.clientWidth || window.innerWidth;
        }
    }
    if (height === 0 && panel1) {
        const panel1Rect = panel1.getBoundingClientRect();
        height = panel1Rect.height;
        if (height === 0) {
            height = panel1.scrollHeight || panel1.offsetHeight || panel1.clientHeight || window.innerHeight;
        }
    }
    
    // Ensure minimum values
    if (width === 0) width = window.innerWidth;
    if (height === 0) height = window.innerHeight;
    
    // Default center position (50% dari width/height)
    const centerX = width / 2;
    const centerY = height / 2;
    
    console.log('✅ Final render offset:', { centerX, centerY, width, height });
    
    return {
        offsetX: centerX,
        offsetY: centerY,
        containerWidth: width,
        containerHeight: height
    };
}

/**
 * Hitung total visual offset untuk layer rendering
 * Kombinasi dari:
 * 1. Default center offset (50% canvas)
 * 2. Center origin offset (ketika center origin aktif)
 */
function getTotalLayerRenderOffset() {
    const renderOffset = getLayerRenderOffset();
    
    // Cek jika center origin aktif
    const layerContainer = document.getElementById('panel1-layercontainer');
    const isCenterOriginActive = layerContainer && layerContainer.dataset.centerOriginActive === 'true';
    
    if (isCenterOriginActive) {
        // Ketika center origin aktif, tidak ada offset tambahan
        // karena transform translate sudah handle di container
        return {
            offsetX: renderOffset.offsetX,
            offsetY: renderOffset.offsetY,
            centerOriginActive: true
        };
    }
    
    return {
        offsetX: renderOffset.offsetX,
        offsetY: renderOffset.offsetY,
        centerOriginActive: false
    };
}
