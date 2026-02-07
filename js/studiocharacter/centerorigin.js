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

// Global state untuk track center origin active
let centerOriginActive = false;
let lastBrowserZoom = 1;
let zoomCheckInterval = null;

// Flag untuk skip initial zoom check dan prevent duplicate dialog
let zoomDetectionInitialized = false;
let isShowingZoomDialog = false;
let isResettingStudioNow = false;

/**
 * Get the current browser zoom level
 * Detects Chrome/browser zoom scaling (25% - 500%)
 * @returns {number} zoom level (0.25 = 25%, 1 = 100%, 5 = 500%, etc)
 */
function getBrowserZoom() {
    try {
        // Method 1: Gunakan window.outerWidth dan innerWidth untuk deteksi zoom
        // outerWidth = screen coordinates (unaffected by zoom)
        // innerWidth = CSS coordinates (affected by zoom)
        if (window.outerWidth && window.innerWidth) {
            const zoom = window.outerWidth / window.innerWidth;
            return zoom > 0.1 && zoom < 10 ? zoom : 1; // Clamp antara 10% - 1000%
        }
    } catch (e) {
        // Ignore errors
    }
    
    // Method 2: Try devicePixelRatio (less reliable untuk browser zoom)
    if (window.devicePixelRatio) {
        const dpr = window.devicePixelRatio;
        return dpr > 0.1 && dpr < 10 ? dpr : 1;
    }
    
    // Method 3: Fallback ke 1
    return 1;
}

/**
 * Hitung center offset untuk origin (0,0) di tengah layar
 * Memperhitungkan browser zoom level dan responsive sizing
 * @returns {Object} { offsetX, offsetY, offsetXPercent, offsetYPercent }
 */
function calculateCenterOffset() {
    const layerContainer = document.getElementById('panel1-layercontainer');
    const panel1 = document.getElementById('panel1');
    const panel0 = document.getElementById('panelGroup');
    
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
    // Ensure enabled is boolean
    enabled = Boolean(enabled);
    
    // Only proceed if state actually changed
    if (centerOriginActive === enabled) {
        console.log('⚠️ Center origin already ' + (enabled ? 'ENABLED' : 'DISABLED'));
        return;
    }
    
    centerOriginActive = enabled;
    const layerContainer = document.getElementById('panel1-layercontainer');
    
    if (!layerContainer) {
        console.error('❌ panel1-layercontainer not found');
        return;
    }
    
    if (enabled) {
        // Aktifkan center origin
        const offset = calculateCenterOffset();
        const centerOffsetX = offset.offsetX; // centerX
        const centerOffsetY = offset.offsetY; // centerY

        // Simpan posisi awal grup
        const initialTransform = layerContainer.style.transform;
        const translateMatch = initialTransform.match(/translate\(([^,]+),\s*([^\)]+)\)/);
        const initialTranslateX = translateMatch ? parseFloat(translateMatch[1]) : 0;
        const initialTranslateY = translateMatch ? parseFloat(translateMatch[2]) : 0;

        // Set transform-origin ke center
        layerContainer.style.transformOrigin = 'center center';

        // Terapkan transformasi baru dengan mempertahankan posisi awal
        const scaleMatch = initialTransform.match(/scale\(([^\)]+)\)/);
        const scale = scaleMatch ? scaleMatch[1] : 1;
        layerContainer.style.transform = `translate(calc(${initialTranslateX}px - 50% - ${centerOffsetX}px), calc(${initialTranslateY}px - 50% - ${centerOffsetY}px)) scale(${scale})`;
        
        // Store state
        layerContainer.dataset.centerOriginActive = 'true';
        layerContainer.dataset.centerOffsetX = centerOffsetX;
        layerContainer.dataset.centerOffsetY = centerOffsetY;
        
        // Update checkbox to match state
        const checkbox = document.getElementById('centerOriginToggle');
        if (checkbox && !checkbox.checked) {
            checkbox.checked = true;
        }
        
        console.log('✅ Center origin ENABLED - Origin (0,0) at center (visual only)');
        console.log(`📍 Offset: ${centerOffsetX}px, ${centerOffsetY}px`);
        
        // Trigger layer re-render dengan memanggil updateCoordInput untuk refresh visual
        if (typeof updateCoordInput === 'function') {
            updateCoordInput();
        }
        
    } else {
        // Matikan center origin - kembali ke normal
        const currentTransform = layerContainer.style.transform;
        const scaleMatch = currentTransform.match(/scale\(([\d.]+)\)/);
        const scale = scaleMatch ? scaleMatch[1] : 1;
        
        // Remove translate, hanya scale (atau translate(-50%, -50%) untuk basic centering)
        // Gunakan translate(-50%, -50%) untuk maintain center alignment
        layerContainer.style.transform = `translate(-50%, -50%) scale(${scale})`;
        
        // Clear state
        layerContainer.dataset.centerOriginActive = 'false';
        delete layerContainer.dataset.centerOffsetX;
        delete layerContainer.dataset.centerOffsetY;
        
        // Update checkbox to match state
        const checkbox = document.getElementById('centerOriginToggle');
        if (checkbox && checkbox.checked) {
            checkbox.checked = false;
        }
        
        console.log('❌ Center origin DISABLED - Origin (0,0) at top-left');
        
        // Trigger layer re-render dengan memanggil updateCoordInput untuk refresh visual
        if (typeof updateCoordInput === 'function') {
            updateCoordInput();
        }
    }
}

/**
 * Update center origin offset saat zoom atau resize
 * Memastikan origin tetap di center meskipun zoom berubah
 * Handles both browser zoom dan panel zoom
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
    
    // Get browser zoom untuk account dalam calculations
    const browserZoom = getBrowserZoom();
    
    // Update transform dengan maintained scale
    // PENTING: Menggunakan calc() untuk menggabungkan % (relative) dan px (absolute)
    // yang tidak terpengaruh browser zoom
    layerContainer.style.transform = `translate(calc(-50% - ${centerOffsetX}px), calc(-50% - ${centerOffsetY}px)) scale(${scale})`;
    
    // Store untuk reference
    layerContainer.dataset.centerOffsetX = centerOffsetX;
    layerContainer.dataset.centerOffsetY = centerOffsetY;
    
    console.log(`Center origin updated: offset (${centerOffsetX}, ${centerOffsetY}), scale ${scale}, browserZoom ${browserZoom}`);
}

/**
 * Tampilkan dialog warning zoom browser
 * Menginformasikan user bahwa zoom berubah dan perlu reset
 * @param {number} newZoom - zoom level yang baru (dalam %)
 */
function showZoomWarningDialog(newZoom) {
    // Prevent duplicate dialog
    if (isShowingZoomDialog || isResettingStudioNow) {
        return;
    }
    
    isShowingZoomDialog = true;
    
    const zoomPercent = Math.round(newZoom * 100);
    const warningContent = `
        <div style="font-family: Arial, sans-serif; padding: 16px 20px; line-height: 1.6; color: #333;">
            <p><strong>⚠️ Perubahan Zoom DPI Terdeteksi!</strong></p>
            <p>Zoom browser berubah menjadi <strong>${zoomPercent}%</strong></p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 15px 0;">
            <p style="font-size: 13px; color: #666;">
                <strong>Jika anda ingin tetap melanjutkan</strong> maka posisi origin nya <strong>berantakan</strong> dan ini membutuhkan <strong>reset studio</strong>.
            </p>
            <p style="font-size: 13px; color: #c00; background-color: #fff3cd; padding: 10px; border-radius: 4px;">
                ⚠️ <strong>Harap simpan pekerjaan mu</strong> jika tidak ingin hilang selama lamanya!
            </p>
        </div>
    `;
    
    // Use windowhandler to create dialog with 2 buttons
    if (typeof window.openWindow === 'function') {
        const dialogId = window.openWindow({
            title: 'Gacha Design Studio - Mendeteksi Perubahan Zoom DPI',
            content: warningContent,
            footer: `
                <button class="footer-btn" id="zoomResetBtn" style="background-color: #ff6b6b; color: white;">
                    Iya deh, reset saja
                </button>
                <button class="footer-btn" id="zoomIgnoreBtn" style="background-color: #5cb85c; color: white; margin-left: 10px;">
                    Abaikan saja
                </button>
            `,
            width: '840px',
            height: '117px'
        });
        
        // Attach button handlers
        setTimeout(() => {
            const resetBtn = document.getElementById('zoomResetBtn');
            const ignoreBtn = document.getElementById('zoomIgnoreBtn');
            
            if (resetBtn) {
                resetBtn.addEventListener('click', () => {
                    isShowingZoomDialog = false;
                    isResettingStudioNow = true;
                    
                    // Close dialog
                    if (typeof window.closeWindow === 'function') {
                        window.closeWindow(dialogId);
                    }
                    
                    // Reset studio (akan di-disable flag duplikat)
                    if (typeof resetStudio === 'function') {
                        resetStudio();
                    }
                    
                    // Reset flag
                    setTimeout(() => {
                        isResettingStudioNow = false;
                    }, 500);
                });
            }
            
            if (ignoreBtn) {
                ignoreBtn.addEventListener('click', () => {
                    isShowingZoomDialog = false;
                    
                    // Close dialog
                    if (typeof window.closeWindow === 'function') {
                        window.closeWindow(dialogId);
                    }
                    
                    console.log('⚠️ User mengabaikan zoom warning - posisi origin mungkin berantakan');
                });
            }
        }, 100);
    } else {
        console.warn('windowhandler tidak tersedia, skip dialog');
        isShowingZoomDialog = false;
    }
}

/**
 * Inisialisasi zoom detection untuk track browser zoom changes (25% - 500%)
 * Secara otomatis refresh center origin saat zoom berubah
 */
function initZoomDetection() {
    if (zoomCheckInterval) {
        clearInterval(zoomCheckInterval);
    }
    
    // Store initial zoom - ini tidak akan trigger dialog
    lastBrowserZoom = getBrowserZoom();
    zoomDetectionInitialized = true;
    
    // Check browser zoom setiap 100ms
    // Ini untuk mendeteksi user mengubah zoom level di Chrome (Ctrl+Plus, Ctrl+Minus)
    zoomCheckInterval = setInterval(() => {
        const currentZoom = getBrowserZoom();
        
        // Jika zoom berubah signifikan (> 1% change)
        if (Math.abs(currentZoom - lastBrowserZoom) / lastBrowserZoom > 0.01) {
            lastBrowserZoom = currentZoom;
            
            console.log(`🔍 Browser zoom changed to: ${(currentZoom * 100).toFixed(1)}%`);
            
            // ✅ BARU: Tampilkan dialog warning zoom (skip jika sedang reset)
            if (!isResettingStudioNow && zoomDetectionInitialized) {
                showZoomWarningDialog(currentZoom);
            }
            
            // Refresh center origin jika active
            if (centerOriginActive) {
                updateCenterOriginTransform();
                console.log('🔄 Center origin refreshed untuk follow zoom');
            }
            
            // Refresh guide canvas
            if (typeof drawGuideCanvas === 'function') {
                drawGuideCanvas();
            }
        }
    }, 100);
}

/**
 * Stop zoom detection (cleanup)
 */
function stopZoomDetection() {
    if (zoomCheckInterval) {
        clearInterval(zoomCheckInterval);
        zoomCheckInterval = null;
    }
}

/**
 * Manual refresh untuk sinkronisasi center origin dengan zoom saat ini
 * Berguna jika ada masalah sinkronisasi
 */
function refreshCenterOrigin() {
    const layerContainer = document.getElementById('panel1-layercontainer');
    if (!layerContainer) {
        console.warn('❌ panel1-layercontainer not found');
        return;
    }
    
    const browserZoom = getBrowserZoom();
    console.log(`🔄 Manual refresh: browserZoom=${(browserZoom * 100).toFixed(1)}%`);
    
    if (centerOriginActive) {
        // Re-calculate dan apply transforms
        updateCenterOriginTransform();
        console.log('✅ Center origin manually refreshed');
    } else {
        // Tetap apply basic centering
        const currentTransform = layerContainer.style.transform;
        const scaleMatch = currentTransform.match(/scale\(([\d.]+)\)/);
        const scale = scaleMatch ? scaleMatch[1] : 1;
        layerContainer.style.transform = `translate(-50%, -50%) scale(${scale})`;
        console.log('✅ Basic centering refreshed (center origin OFF)');
    }
    
    // Refresh visual
    if (typeof drawGuideCanvas === 'function') {
        drawGuideCanvas();
    }
}

/**
 * Saat window resize, update center offset jika center origin aktif
 */
window.addEventListener('resize', () => {
    if (centerOriginActive) {
        updateCenterOriginTransform();
    }
});

/**
 * RESET CENTER ORIGIN - Kembalikan ke state default (unchecked & no transform)
 * Dipanggil saat:
 * 1. Reset Studio button diklik
 * 2. Page reload
 * 3. Need manual reset
 */
function resetCenterOrigin() {
    console.log('🔄 Resetting center origin to default state...');
    
    // Set global state ke false
    centerOriginActive = false;
    lastBrowserZoom = 1;
    isShowingZoomDialog = false; // Prevent dialog saat reset
    
    // Reset checkbox
    const checkbox = document.getElementById('centerOriginToggle');
    if (checkbox) {
        checkbox.checked = false;
        console.log('✅ Checkbox unchecked');
    }
    
    // Reset layer container transform
    const layerContainer = document.getElementById('panel1-layercontainer');
    if (layerContainer) {
        // Get current zoom scale
        const currentTransform = layerContainer.style.transform;
        const scaleMatch = currentTransform.match(/scale\(([\d.]+)\)/);
        const scale = scaleMatch ? scaleMatch[1] : 1;
        
        // Reset transform to basic centering without offset
        layerContainer.style.transform = `translate(-50%, -50%) scale(${scale})`;
        
        // Clear dataset
        layerContainer.dataset.centerOriginActive = 'false';
        delete layerContainer.dataset.centerOffsetX;
        delete layerContainer.dataset.centerOffsetY;
        
        console.log('✅ Layer container transform reset');
    }
    
    // Refresh visual
    if (typeof drawGuideCanvas === 'function') {
        drawGuideCanvas();
    }
    if (typeof updateCoordInput === 'function') {
        updateCoordInput();
    }
    
    console.log('✅ Center origin fully reset to default state');
}

/**
 * INITIALIZE CENTER ORIGIN - Setup initial state on page load
 * Ensures checkbox dan transform states are synchronized
 */
function initializeCenterOrigin() {
    console.log('🔧 Initializing center origin...');
    
    const checkbox = document.getElementById('centerOriginToggle');
    const layerContainer = document.getElementById('panel1-layercontainer');
    
    if (!checkbox || !layerContainer) {
        console.warn('⚠️ Required elements not found for center origin init');
        return;
    }
    
    // Ensure checkbox is unchecked by default
    checkbox.checked = false;
    centerOriginActive = false;
    
    // Ensure layer container has proper default transform
    const currentTransform = layerContainer.style.transform;
    const scaleMatch = currentTransform.match(/scale\(([\d.]+)\)/);
    const scale = scaleMatch ? scaleMatch[1] : 1;
    
    layerContainer.style.transform = `translate(-50%, -50%) scale(${scale})`;
    layerContainer.dataset.centerOriginActive = 'false';
    
    console.log('✅ Center origin initialized to default state');
}

/**
 * Auto-initialize when DOM is ready
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCenterOrigin);
} else {
    initializeCenterOrigin();
}

