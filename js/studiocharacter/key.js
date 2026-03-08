/****************************************************************/
//                                                              //
//  -------------------Gacha Design Studio--------------------  //
//  Created by: Archana Berry                                   //
//  Assets credits: Lunime, OGL (Open Game License), MIT CC     //
//  Version resource: v0.001_alpha                              //
//  File: background.js                                         //
//  Type: module[design]                                        //
//  Desc: Function for controling studio sprite shapes part     //
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

// background.js

let interval;

/**
 * ============================================================
 * ENHANCED: updateCoordInput()
 * Mendukung SINGLE-SELECT dan MULTI-SELECT dengan BOUNDING BOX
 * Sync SEMUA properties: x, y, rotation, scale, width, height,
 * opacity, flipX, flipY, skewX, skewY, layerName, dst
 * 
 * MULTI-SELECT: Hitung bounding box dari semua selected layers
 * Display: top-left position, size, concatenated names dengan index
 * ============================================================
 */
function updateCoordInput() {
    // Get all input elements
    const xCoordInput = document.getElementById('xCoord');
    const yCoordInput = document.getElementById('yCoord');
    const layerNameInput = document.getElementById('layerName');
    const widthInput = document.getElementById('width');
    const heightInput = document.getElementById('height');
    const scaleInput = document.getElementById('scale');
    const rotationControl = document.getElementById('rotationControl');
    const rotationIndicator = document.getElementById('rotationIndicator');
    const flipHorizontal = document.getElementById('flipHorizontal');
    const flipVertical = document.getElementById('flipVertical');
    const opacitySlider1 = document.getElementById('opacitySlider1');
    const opacityInput1 = document.getElementById('opacityInput1');
    const skewXControl = document.getElementById('skewXControl');
    const skewXSlider = document.getElementById('skewXSlider');
    const skewYControl = document.getElementById('skewYControl');
    const skewYSlider = document.getElementById('skewYSlider');

    // Get currently selected layers
    const selectedLayers = getSelectedLayers();
    if (!selectedLayers || selectedLayers.length === 0) return;

    // 🔥 NEW: Detect if currently actively dragging (multiDragState has entries)
    const isActiveDrag = (typeof window.multiDragState !== 'undefined') && window.multiDragState.size > 0;

    // ========== SINGLE-SELECT (1 layer) ==========
    if (selectedLayers.length === 1) {
        const layer = selectedLayers[0];

        // Position X, Y
        let displayX = layer.x || 0;
        let displayY = layer.y || 0;
        if (typeof getDisplayCoord === 'function') {
            const disp = getDisplayCoord(displayX, displayY);
            displayX = disp.x;
            displayY = disp.y;
        }
        if (xCoordInput) xCoordInput.value = Math.round(displayX);
        if (yCoordInput) yCoordInput.value = Math.round(displayY);
        if (xCoordInput) xCoordInput.style.color = 'inherit';
        if (yCoordInput) yCoordInput.style.color = 'inherit';

        // Layer Name - handle array format
        const names = Array.isArray(layer.name) ? layer.name : [layer.name];
        if (layerNameInput) {
            layerNameInput.value = names.join(', ');
            layerNameInput.style.color = 'inherit';
        }

        // Size
        if (widthInput && layer.element) widthInput.value = layer.element.clientWidth || '';
        if (heightInput && layer.element) heightInput.value = layer.element.clientHeight || '';
        if (widthInput) widthInput.style.color = 'inherit';
        if (heightInput) heightInput.style.color = 'inherit';

        // Scale, Rotation
        if (scaleInput) scaleInput.value = layer.scale || 1;
        if (rotationControl) rotationControl.value = layer.rotation || 0;
        if (rotationIndicator) rotationIndicator.innerText = layer.rotation || 0;

        // Flip
        if (flipHorizontal) flipHorizontal.checked = layer.isFlipX || false;
        if (flipVertical) flipVertical.checked = layer.isFlipY || false;

        // Opacity
        const opacity = (layer.opacity !== undefined) ? layer.opacity * 100 : 100;
        if (opacitySlider1) opacitySlider1.value = opacity;
        if (opacityInput1) opacityInput1.value = Math.round(opacity) + '%';
        if (opacityInput1) opacityInput1.style.color = 'inherit';

        // Skew
        if (skewXControl) skewXControl.value = layer.skewX || 0;
        if (skewXSlider) skewXSlider.value = layer.skewX || 0;
        if (skewYControl) skewYControl.value = layer.skewY || 0;
        if (skewYSlider) skewYSlider.value = layer.skewY || 0;

        console.log('✅ updateCoordInput: Single-select display updated', {
            name: names.join(', '),
            x: displayX,
            y: displayY,
            scale: layer.scale,
            rotation: layer.rotation
        });
    }
    // ========== MULTI-SELECT (N layers) - DENGAN BOUNDING BOX ==========
    else {
        // Calculate bounding box dari semua selected layers
        const bbox = calculateBoundingBox(selectedLayers);

        if (!bbox) {
            console.warn('⚠️ Cannot calculate bounding box for selected layers');
            return;
        }

        // Display bounding box position (top-left corner)
        let displayX = bbox.x;
        let displayY = bbox.y;
        if (typeof getDisplayCoord === 'function') {
            const disp = getDisplayCoord(displayX, displayY);
            displayX = disp.x;
            displayY = disp.y;
        }

        // 🔥 NEW: Determine color based on drag state
        // BLUE = actively dragging (multiDragState has pointers)
        // RED = multi-selected but NOT dragging (idle multi-select)
        const multiSelectColor = isActiveDrag ? '#2196F3' : '#E53935';  // Blue: dragging, Red: idle
        const multiSelectIcon = isActiveDrag ? '🔵' : '🔴';

        // Position - show bounding box dengan color indicator (blue or red)
        if (xCoordInput) {
            xCoordInput.value = Math.round(displayX);
            xCoordInput.style.color = multiSelectColor;
            xCoordInput.title = selectedLayers.length + ' layers - ' + (isActiveDrag ? 'DRAGGING' : 'SELECTED');
        }
        if (yCoordInput) {
            yCoordInput.value = Math.round(displayY);
            yCoordInput.style.color = multiSelectColor;
            yCoordInput.title = selectedLayers.length + ' layers - ' + (isActiveDrag ? 'DRAGGING' : 'SELECTED');
        }

        // Layer Names - show count + concatenated names dengan format "N: kepala, kaki, badan"
        const allNames = selectedLayers.flatMap(l => {
            if (Array.isArray(l.name)) return l.name;
            return [l.name];
        });

        if (layerNameInput) {
            // Format: "3: kepala, kaki, badan" atau "4: a, b, c, d"
            // dengan icon 🔵 (dragging) atau 🔴 (idle)
            layerNameInput.value = multiSelectIcon + ' ' + selectedLayers.length + ': ' + allNames.join(', ');
            layerNameInput.style.color = multiSelectColor;
            layerNameInput.title = selectedLayers.length + ' layers ' + (isActiveDrag ? 'ACTIVELY DRAGGING' : 'MULTI-SELECTED (can drag again)');
        }

        // Size - show bounding box size (width x height)
        if (widthInput) {
            widthInput.value = Math.round(bbox.width);
            widthInput.style.color = multiSelectColor;
            widthInput.title = 'Bounding Box Width';
        }
        if (heightInput) {
            heightInput.value = Math.round(bbox.height);
            heightInput.style.color = multiSelectColor;
            heightInput.title = 'Bounding Box Height';
        }

        // Scale - show "mixed" indicator jika berbeda
        const allSameScale = selectedLayers.every(l => l.scale === selectedLayers[0].scale);
        if (scaleInput) {
            scaleInput.value = allSameScale ? (selectedLayers[0].scale || 1) : 'mixed';
            scaleInput.style.color = allSameScale ? 'inherit' : '#ff9800';
        }

        // Rotation
        const allSameRotation = selectedLayers.every(l => l.rotation === selectedLayers[0].rotation);
        if (rotationControl) {
            rotationControl.value = allSameRotation ? (selectedLayers[0].rotation || 0) : 0;
            rotationControl.style.color = allSameRotation ? 'inherit' : '#ff9800';
        }
        if (rotationIndicator) {
            rotationIndicator.innerText = allSameRotation ? (selectedLayers[0].rotation || 0) : 'mixed';
            rotationIndicator.style.color = allSameRotation ? 'inherit' : '#ff9800';
        }

        // Flip - indeterminate state bila mixed
        const allSameFlipX = selectedLayers.every(l => l.isFlipX === selectedLayers[0].isFlipX);
        const allSameFlipY = selectedLayers.every(l => l.isFlipY === selectedLayers[0].isFlipY);

        if (flipHorizontal) {
            flipHorizontal.checked = allSameFlipX ? (selectedLayers[0].isFlipX || false) : false;
            flipHorizontal.indeterminate = !allSameFlipX;
        }
        if (flipVertical) {
            flipVertical.checked = allSameFlipY ? (selectedLayers[0].isFlipY || false) : false;
            flipVertical.indeterminate = !allSameFlipY;
        }

        // Opacity - average jika berbeda
        const avgOpacity = selectedLayers.reduce((sum, l) => sum + (l.opacity || 1), 0) / selectedLayers.length * 100;
        const allSameOpacity = selectedLayers.every(l => (l.opacity || 1) === (selectedLayers[0].opacity || 1));
        if (opacitySlider1) {
            opacitySlider1.value = allSameOpacity ? ((selectedLayers[0].opacity || 1) * 100) : avgOpacity;
            opacitySlider1.style.color = allSameOpacity ? 'inherit' : '#ff9800';
        }
        if (opacityInput1) {
            opacityInput1.value = allSameOpacity ? (Math.round((selectedLayers[0].opacity || 1) * 100) + '%') : 'avg ' + Math.round(avgOpacity) + '%';
            opacityInput1.style.color = allSameOpacity ? 'inherit' : '#ff9800';
        }

        // Skew
        const allSameSkewX = selectedLayers.every(l => l.skewX === selectedLayers[0].skewX);
        const allSameSkewY = selectedLayers.every(l => l.skewY === selectedLayers[0].skewY);

        if (skewXControl) {
            skewXControl.value = allSameSkewX ? (selectedLayers[0].skewX || 0) : 'mixed';
            skewXControl.style.color = allSameSkewX ? 'inherit' : '#ff9800';
        }
        if (skewXSlider) {
            skewXSlider.value = allSameSkewX ? (selectedLayers[0].skewX || 0) : 0;
            skewXSlider.style.color = allSameSkewX ? 'inherit' : '#ff9800';
        }
        if (skewYControl) {
            skewYControl.value = allSameSkewY ? (selectedLayers[0].skewY || 0) : 'mixed';
            skewYControl.style.color = allSameSkewY ? 'inherit' : '#ff9800';
        }
        if (skewYSlider) {
            skewYSlider.value = allSameSkewY ? (selectedLayers[0].skewY || 0) : 0;
            skewYSlider.style.color = allSameSkewY ? 'inherit' : '#ff9800';
        }

        console.log('✅ updateCoordInput: MULTI-SELECT dengan BOUNDING BOX display updated', {
            count: selectedLayers.length,
            names: allNames.join(', '),
            bbox: {
                x: Math.round(displayX),
                y: Math.round(displayY),
                width: Math.round(bbox.width),
                height: Math.round(bbox.height)
            }
        });
    }
}

/**
 * Calculate bounding box dari array of layers
 * PENTING: Digunakan untuk multi-select aggregate display
 * Support multiple fallbacks untuk width/height
 * 
 * @param {Array<Layer>} layers - array of Layer instances
 * @returns {Object} { x, y, width, height } - top-left corner dan size dari bounding box
 *                   atau null jika tidak bisa hitung
 */
function calculateBoundingBox(layers) {
    if (!layers || layers.length === 0) return null;

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    let hasValidLayer = false;

    for (const layer of layers) {
        if (!layer) continue;

        // Allow undefined x/y (default to 0)
        const x = (typeof layer.x === 'number') ? layer.x : 0;
        const y = (typeof layer.y === 'number') ? layer.y : 0;

        // Try to get width/height - multiple fallbacks
        let width = 0;
        let height = 0;

        // Priority 1: element.clientWidth/Height (most reliable)
        if (layer.element && layer.element.clientWidth > 0 && layer.element.clientHeight > 0) {
            width = layer.element.clientWidth;
            height = layer.element.clientHeight;
        }
        // Priority 2: layer.width/height properties
        else if (typeof layer.width === 'number' && layer.width > 0) {
            width = layer.width;
            height = typeof layer.height === 'number' ? layer.height : 0;
        }
        // Priority 3: Try getBoundingClientRect if element exists
        else if (layer.element && typeof layer.element.getBoundingClientRect === 'function') {
            try {
                const rect = layer.element.getBoundingClientRect();
                if (rect.width > 0 && rect.height > 0) {
                    width = rect.width;
                    height = rect.height;
                }
            } catch (err) {
                // getBoundingClientRect error, continue with default
            }
        }
        // Priority 4: Default to 50x50 untuk placeholder (jika element ada tapi no size)
        else if (layer.element) {
            width = 50;
            height = 50;
        }

        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x + width);
        maxY = Math.max(maxY, y + height);

        hasValidLayer = true;

        console.log(`📦 Layer "${layer.name}": x=${x}, y=${y}, w=${width}, h=${height}`);
    }

    // Return null hanya jika TIDAK ada layer valid sama sekali
    if (!hasValidLayer) {
        console.error('❌ calculateBoundingBox: No valid layers found');
        return null;
    }

    // Safety check
    if (!isFinite(minX) || !isFinite(minY) || !isFinite(maxX) || !isFinite(maxY)) {
        console.warn('⚠️ calculateBoundingBox: Invalid coordinates', { minX, minY, maxX, maxY });
        return null;
    }

    const bbox = {
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY
    };

    console.log('📦 Bounding Box Result:', bbox);
    return bbox;
}

/**
 * Get currently selected layers
 * Support both single-select (window.selected) dan multi-select (selector.selectedLayers)
 * @returns {Array<Layer>}
 */
function getSelectedLayers() {
    const selected = window.selected;
    const selector = window.selectorInstance;

    // Multi-select mode: layers dari selector
    if (selector && Array.isArray(selector.selectedLayers) && selector.selectedLayers.length > 0) {
        return selector.selectedLayers.map(s => {
            // Normalize ke Layer instance
            if (s && typeof s === 'object' && typeof s.x !== 'undefined') return s;
            if (s && s.__layerInstance) return s.__layerInstance;
            return null;
        }).filter(l => l !== null);
    }

    // Single-select mode: layer dari window.selected
    if (selected && typeof selected === 'object' && typeof selected.x !== 'undefined') {
        return [selected];
    }

    return [];
}


// Flag untuk tracking tombol fisik yang sedang ditekan agar tidak double interval
let activeKey = null;

function moveLayer(direction) {
    const selectedLayers = getSelectedLayers();
    if (selectedLayers.length === 0) return;

    // Ambil sensitivitas dari global window.sensitivity
    let step = window.sensitivity || 1;

    selectedLayers.forEach(layer => {
        switch (direction) {
            case 'up':
                layer.y -= step;
                break;
            case 'down':
                layer.y += step;
                break;
            case 'left':
                layer.x -= step;
                break;
            case 'right':
                layer.x += step;
                break;
        }
    });

    // 🔥 Rig Link: Synchronize bones for all moved layers
    // Calculate dx/dy for this frame
    let dx = 0, dy = 0;
    switch (direction) {
        case 'up': dy = -step; break;
        case 'down': dy = step; break;
        case 'left': dx = -step; break;
        case 'right': dx = step; break;
    }

    selectedLayers.forEach(layer => {
        if (layer.spine && typeof layer.spine.onLayerMove === 'function') {
            // Pass movement delta and exclude currently moved layers (to avoid double move if group selected)
            layer.spine.onLayerMove(dx, dy, selectedLayers);
        }
    });

    updateCoordInput();
}

/**
 * Memulai pergerakan kontinu (digunakan oleh tombol HTML dan Keyboard HID)
 * Sync firerate ke 16ms (~60fps)
 */
function startMove(direction) {
    if (interval) clearInterval(interval);
    moveLayer(direction);
    // Firerate disamakan ke 16ms (sekitar 60fps)
    interval = setInterval(() => moveLayer(direction), 16);
}

function stopMove() {
    if (interval) {
        clearInterval(interval);
        interval = null;
    }
    activeKey = null;
}

// Keyboard arrow keys handling dengan firerate sync
document.addEventListener('keydown', function (event) {
    // Hiraukan jika sedang di input field
    if (event.target && (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA')) return;

    let direction = null;
    switch (event.key) {
        case 'ArrowUp':
            direction = 'up';
            break;
        case 'ArrowDown':
            direction = 'down';
            break;
        case 'ArrowLeft':
            direction = 'left';
            break;
        case 'ArrowRight':
            direction = 'right';
            break;
    }

    if (direction) {
        event.preventDefault();
        // Cegah browser auto-repeat (kita pakai interval sendiri agar firerate konsisten)
        if (activeKey === event.key) return;
        activeKey = event.key;
        startMove(direction);
    }
});

// Keyup listener untuk menghentikan pergerakan keyboard HID
document.addEventListener('keyup', function (event) {
    if (activeKey === event.key) {
        stopMove();
    }
});

document.addEventListener('mouseup', stopMove);
document.addEventListener('touchend', stopMove);
document.addEventListener('touchcancel', stopMove);

/**
 * Handle ESC key untuk membuka settings di studio
 * Handle Ctrl+Alt+R untuk manual refresh center origin
 */
document.addEventListener('keydown', function (event) {
    // ESC key = 27 atau event.key === 'Escape'
    if (event.key === 'Escape' || event.keyCode === 27) {
        console.log('studiocharacter/key.js: ESC key pressed - opening settings');
        if (typeof window.openSettingsWindow === 'function') {
            event.preventDefault();
            window.openSettingsWindow();
        }
    }

    // Ctrl+Alt+R untuk refresh center origin (sinkronisasi dengan zoom saat ini)
    if (event.ctrlKey && event.altKey && (event.key === 'r' || event.key === 'R')) {
        event.preventDefault();
        console.log('studiocharacter/key.js: Ctrl+Alt+R pressed - refreshing center origin');
        if (typeof refreshCenterOrigin === 'function') {
            refreshCenterOrigin();
            console.log('✅ Center origin refreshed via keyboard shortcut');
        }
    }
});

/**
 * Handle Android back button (backbutton event dari Cordova atau device plugin)
 * Juga handle dengan window popstate untuk browser back button
 */
document.addEventListener('backbutton', function (event) {
    console.log('studiocharacter/key.js: Android back button pressed - opening settings');
    if (typeof window.openSettingsWindow === 'function') {
        event.preventDefault();
        window.openSettingsWindow();
    }
});

// Fallback untuk browser back button (jika tidak ada Cordova)
window.addEventListener('popstate', function (event) {
    console.log('studiocharacter/key.js: Browser back button detected');
    // Prevent default back navigation
    event.preventDefault();
    if (typeof window.openSettingsWindow === 'function') {
        window.openSettingsWindow();
    }
});