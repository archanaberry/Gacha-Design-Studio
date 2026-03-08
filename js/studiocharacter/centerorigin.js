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

    if (!layerContainer) return { offsetX: 0, offsetY: 0, offsetXPercent: 50, offsetYPercent: 50 };

    // PRIORITAS 1: Gunakan panel1 sebagai reference container (actual visible area)
    let width = 0, height = 0;

    if (panel1) {
        // Gunakan client dimensions untuk responsive sizing
        width = panel1.clientWidth || panel1.offsetWidth || 0;
        height = panel1.clientHeight || panel1.offsetHeight || 0;
    }

    // PRIORITAS 2: Fallback ke getBoundingClientRect untuk viewport-relative dimensions
    if (width === 0 || height === 0) {
        const rect = panel1 ? panel1.getBoundingClientRect() : layerContainer.getBoundingClientRect();
        if (width === 0) width = rect.width || window.innerWidth;
        if (height === 0) height = rect.height || window.innerHeight;
    }

    // Ensure minimum values
    if (width === 0) width = window.innerWidth;
    if (height === 0) height = window.innerHeight;

    // Hitung center point
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
 * MENGGUNAKAN CSS POSITIONING (left/top), BUKAN transform translate
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
        // ✅ Aktifkan center origin: SIMPLE approach
        // Position top-left corner ke center viewport
        // Scale dari top-left → membesar ke right & down dari viewport center
        // NO positioning adjustment saat zoom!
        const offset = calculateCenterOffset();
        const centerX = offset.offsetX;  // pixel offset dari left
        const centerY = offset.offsetY;  // pixel offset dari top

        // Get current zoom scale (jika ada)
        const currentTransform = layerContainer.style.transform || '';
        const scaleMatch = currentTransform.match(/scale\(([\d.]+)\)/);
        const scale = scaleMatch ? parseFloat(scaleMatch[1]) : 1;

        // Set positioning ke center viewport - dan INI AKAN TETAP FIXED saat zoom!
        layerContainer.style.left = centerX + 'px';
        layerContainer.style.top = centerY + 'px';
        layerContainer.style.transformOrigin = 'top left';
        layerContainer.style.transform = `scale(${scale})`;

        // Store state untuk reference
        layerContainer.dataset.centerOriginActive = 'true';
        layerContainer.dataset.centerOffsetX = centerX;
        layerContainer.dataset.centerOffsetY = centerY;
        layerContainer.dataset.centerPositionMode = 'true';
        layerContainer.dataset.scale = scale;

        // Update checkbox to match state
        const checkbox = document.getElementById('centerOriginToggle');
        if (checkbox && !checkbox.checked) {
            checkbox.checked = true;
        }

        console.log('✅ Center origin ENABLED - Top-left corner di center viewport');
        console.log(`📍 Center point: (${centerX.toFixed(0)}px, ${centerY.toFixed(0)}px) | Scale: ${scale}`);

        // Trigger layer re-render
        if (typeof updateCoordInput === 'function') {
            updateCoordInput();
        }

    } else {
        // Matikan center origin - kembali ke default (pojok kiri atas)
        // Get current zoom scale untuk maintain zoom after disable
        const currentTransform = layerContainer.style.transform || '';
        const scaleMatch = currentTransform.match(/scale\(([\d.]+)\)/);
        const scale = scaleMatch ? scaleMatch[1] : 1;

        // Reset ke default: positioning top-left, transform hanya scale
        // JANGAN UBAH INI - Default pojok kiri atas sudah bekerja sempurna
        layerContainer.style.left = '0';
        layerContainer.style.top = '0';
        layerContainer.style.transformOrigin = 'top left';  // Scale dari top-left
        layerContainer.style.transform = `scale(${scale})`;
        // Hanya scale, no translate untuk default mode

        // Clear state
        layerContainer.dataset.centerOriginActive = 'false';
        delete layerContainer.dataset.centerOffsetX;
        delete layerContainer.dataset.centerOffsetY;
        delete layerContainer.dataset.centerPositionMode;

        // Update checkbox to match state
        const checkbox = document.getElementById('centerOriginToggle');
        if (checkbox && checkbox.checked) {
            checkbox.checked = false;
        }

        console.log('❌ Center origin DISABLED - Origin (0,0) at top-left corner');

        // Trigger layer re-render untuk refresh visual
        if (typeof updateCoordInput === 'function') {
            updateCoordInput();
        }
    }
}

/**
 * Update center origin positioning saat resize
 * SIMPLE approach: recalculate viewport center, update left/top positioning
 * Keep existing zoom scale - jangan ubah!
 */
function updateCenterOriginTransform() {
    if (!centerOriginActive) return;

    const layerContainer = document.getElementById('panel1-layercontainer');
    if (!layerContainer) return;

    // Get current zoom scale dari transform (keep existing scale!)
    const currentTransform = layerContainer.style.transform || '';
    const scaleMatch = currentTransform.match(/scale\(([\d.]+)\)/);
    const scale = scaleMatch ? parseFloat(scaleMatch[1]) : 1;

    // Recalculate center offset saat resize (RESPONSIVE)
    const offset = calculateCenterOffset();
    const centerX = offset.offsetX;
    const centerY = offset.offsetY;

    // Update positioning (left/top) ke new center viewport
    // Scale tetap sama - jangan ubah!
    layerContainer.style.left = centerX + 'px';
    layerContainer.style.top = centerY + 'px';
    layerContainer.style.transformOrigin = 'top left';
    layerContainer.style.transform = `scale(${scale})`;

    // Update stored offsets
    layerContainer.dataset.centerOffsetX = centerX;
    layerContainer.dataset.centerOffsetY = centerY;
    layerContainer.dataset.scale = scale;

    console.log(`🔄 Center origin repositioned for resize: (${centerX.toFixed(0)}px, ${centerY.toFixed(0)}px), scale ${scale}`);
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
 * Saat window/container resize, update center offset jika center origin aktif
 * Membuat center origin responsif dengan ukuran panel1
 */
window.addEventListener('resize', () => {
    if (centerOriginActive) {
        updateCenterOriginTransform();
        console.log('📐 Responsive update: Center origin adjusted for new container size');
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
        layerContainer.style.transform = `translate(50%, 50%) scale(${scale})`;
        layerContainer.style.transformOrigin = 'center center';
        layerContainer.style.height = '100%';
        layerContainer.style.width = '100%';

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
 * MENGGUNAKAN CSS POSITIONING, BUKAN transform translate
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

    // Ensure layer container has proper default state - pojok kiri atas
    // MENGGUNAKAN CSS POSITIONING (left, top), BUKAN transform translate
    const currentTransform = layerContainer.style.transform || '';
    const scaleMatch = currentTransform.match(/scale\(([\d.]+)\)/);
    const scale = scaleMatch ? scaleMatch[1] : 1;

    // Default state: pojok kiri atas dengan transform-origin top left
    layerContainer.style.left = '0px';
    layerContainer.style.top = '0px';
    layerContainer.style.transformOrigin = 'top left';
    layerContainer.style.transform = `scale(${scale})`;  // HANYA scale, tanpa translate

    // Clear dataset state
    layerContainer.dataset.centerOriginActive = 'false';
    delete layerContainer.dataset.centerPositionMode;

    console.log('✅ Center origin initialized to default state (top-left corner)');
}

/**
 * Auto-initialize when DOM is ready
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCenterOrigin);
} else {
    initializeCenterOrigin();
}

