/**
 * MULTISELECT DIAGNOSTIC SCRIPT
 * Paste ini di browser console untuk diagnose multi-select issue
 * 
 * copy-paste seluruh script ini ke console, tekan Enter
 */

console.log('%c🔍 MULTISELECT DIAGNOSTIC STARTED', 'color: blue; font-size: 14px; font-weight: bold');

// ============================================
// TEST 1: Check jika calculateBoundingBox accessible
// ============================================
console.log('\n%c📌 TEST 1: calculateBoundingBox() Function', 'color: purple; font-weight: bold');
console.log('Type:', typeof calculateBoundingBox);
console.log('Is callable?', typeof calculateBoundingBox === 'function');

if (typeof calculateBoundingBox === 'function') {
    console.log('✅ calculateBoundingBox() is ACCESSIBLE in global scope');
} else {
    console.error('❌ calculateBoundingBox() NOT FOUND! Need to check key.js load order');
}

// ============================================
// TEST 2: Check getSelectedLayers
// ============================================
console.log('\n%c📌 TEST 2: getSelectedLayers() Function', 'color: purple; font-weight: bold');
console.log('Type:', typeof getSelectedLayers);

if (typeof getSelectedLayers === 'function') {
    console.log('✅ getSelectedLayers() is ACCESSIBLE');
    const selectedLayers = getSelectedLayers();
    console.log('Current selected layers:', selectedLayers);
    console.log('Count:', selectedLayers.length);
    
    if (selectedLayers.length > 0) {
        console.log('First layer details:', {
            name: selectedLayers[0].name,
            x: selectedLayers[0].x,
            y: selectedLayers[0].y,
            hasElement: !!selectedLayers[0].element
        });
    }
} else {
    console.error('❌ getSelectedLayers() NOT FOUND!');
}

// ============================================
// TEST 3: Check updateCoordInput
// ============================================
console.log('\n%c📌 TEST 3: updateCoordInput() Function', 'color: purple; font-weight: bold');
console.log('Type:', typeof updateCoordInput);

if (typeof updateCoordInput === 'function') {
    console.log('✅ updateCoordInput() is ACCESSIBLE');
} else {
    console.error('❌ updateCoordInput() NOT FOUND!');
}

// ============================================
// TEST 4: Check window.selectorInstance
// ============================================
console.log('\n%c📌 TEST 4: window.selectorInstance (Multi-Select)', 'color: purple; font-weight: bold');
console.log('Exists?', !!window.selectorInstance);

if (window.selectorInstance) {
    console.log('selectorInstance properties:');
    console.log('  - selectedLayers:', window.selectorInstance.selectedLayers);
    console.log('  - selectedLayers length:', window.selectorInstance.selectedLayers?.length || 0);
    console.log('  - isActive:', window.selectorInstance.isActive);
    
    if (window.selectorInstance.selectedLayers && window.selectorInstance.selectedLayers.length > 0) {
        console.log('✅ selectedLayers populated with', window.selectorInstance.selectedLayers.length, 'layers');
        window.selectorInstance.selectedLayers.forEach((layer, idx) => {
            console.log(`  Layer ${idx}:`, {
                name: layer.name || layer.__layerInstance?.name,
                x: layer.x || layer.__layerInstance?.x,
                y: layer.y || layer.__layerInstance?.y,
                element: !!layer.element || !!layer.__layerInstance?.element
            });
        });
    } else {
        console.warn('⚠️ selectedLayers is EMPTY - box select mungkin belum triggered');
    }
} else {
    console.warn('⚠️ window.selectorInstance not initialized');
}

// ============================================
// TEST 5: Check window.selected (single select)
// ============================================
console.log('\n%c📌 TEST 5: window.selected (Single Select)', 'color: purple; font-weight: bold');
console.log('Exists?', !!window.selected);

if (window.selected) {
    console.log('selected layer:', {
        name: window.selected.name,
        x: window.selected.x,
        y: window.selected.y,
        hasElement: !!window.selected.element
    });
    console.log('✅ Single selection available');
} else {
    console.log('ℹ️ No single selection');
}

// ============================================
// TEST 6: Check multiDragState
// ============================================
console.log('\n%c📌 TEST 6: window.multiDragState (Touch Drag)', 'color: purple; font-weight: bold');
console.log('Exists?', !!window.multiDragState);
console.log('Type:', window.multiDragState?.constructor.name);

if (window.multiDragState && window.multiDragState.size > 0) {
    console.log('✅ multiDragState active with', window.multiDragState.size, 'pointers');
    console.log('Details:', Array.from(window.multiDragState.entries()).map(([pid, info]) => ({
        pointerId: pid,
        type: info.type,
        layerName: info.layer?.name,
        layerCount: Array.isArray(info.layers) ? info.layers.length : 1
    })));
} else {
    console.log('ℹ️ multiDragState empty (no active touch drag)');
}

// ============================================
// TEST 7: Test calculateBoundingBox manually
// ============================================
console.log('\n%c📌 TEST 7: calculateBoundingBox() Manual Test', 'color: purple; font-weight: bold');

if (typeof calculateBoundingBox === 'function') {
    const testLayers = getSelectedLayers();
    if (testLayers.length > 1) {
        console.log('Testing with', testLayers.length, 'selected layers...');
        const bbox = calculateBoundingBox(testLayers);
        console.log('Result:', bbox);
        
        if (bbox && bbox.x !== undefined && bbox.y !== undefined) {
            console.log('✅ Bounding box calculated successfully:', {
                x: bbox.x,
                y: bbox.y,
                width: bbox.width,
                height: bbox.height
            });
        } else {
            console.error('❌ Bounding box return invalid result', bbox);
        }
    } else if (testLayers.length === 1) {
        console.log('ℹ️ Only 1 layer selected - need multi-select to test bounding box');
    } else {
        console.log('ℹ️ No layers selected - select layers first');
    }
} else {
    console.error('❌ calculateBoundingBox not accessible');
}

// ============================================
// TEST 8: Check Panel2 input elements
// ============================================
console.log('\n%c📌 TEST 8: Panel2 Input Elements', 'color: purple; font-weight: bold');

const inputs = {
    xCoord: document.getElementById('xCoord'),
    yCoord: document.getElementById('yCoord'),
    layerName: document.getElementById('layerName'),
    width: document.getElementById('width'),
    height: document.getElementById('height'),
    scale: document.getElementById('scale'),
    rotation: document.getElementById('rotationControl'),
    opacity: document.getElementById('opacitySlider1')
};

console.log('Input elements status:');
Object.entries(inputs).forEach(([name, el]) => {
    console.log(`  ${name}: ${el ? '✅ exists' : '❌ MISSING'}`);
});

// ============================================
// TEST 9: Manual updateCoordInput call
// ============================================
console.log('\n%c📌 TEST 9: Manual updateCoordInput() Call', 'color: purple; font-weight: bold');

if (typeof updateCoordInput === 'function') {
    console.log('Calling updateCoordInput()...');
    try {
        updateCoordInput();
        console.log('✅ updateCoordInput() executed without error');
        
        // Check jika values updated
        const xVal = document.getElementById('xCoord')?.value;
        const nameVal = document.getElementById('layerName')?.value;
        console.log('Display values after update:');
        console.log('  xCoord:', xVal);
        console.log('  layerName:', nameVal);
    } catch (err) {
        console.error('❌ updateCoordInput() threw error:', err);
    }
} else {
    console.error('❌ updateCoordInput not accessible');
}

// ============================================
// TEST 10: Check layer.element accessibility
// ============================================
console.log('\n%c📌 TEST 10: Layer.element Accessibility', 'color: purple; font-weight: bold');

const selected = getSelectedLayers();
if (selected.length > 0) {
    selected.forEach((layer, idx) => {
        console.log(`Layer ${idx} (${layer.name}):`, {
            hasElement: !!layer.element,
            elementType: layer.element?.tagName,
            elementClasses: layer.element?.className,
            clientWidth: layer.element?.clientWidth,
            clientHeight: layer.element?.clientHeight,
            directWidth: layer.width,
            directHeight: layer.height
        });
    });
} else {
    console.log('No layers selected');
}

// ============================================
// SUMMARY
// ============================================
console.log('\n%c========== DIAGNOSTIC SUMMARY ==========', 'color: green; font-weight: bold');

const checks = {
    'calculateBoundingBox accessible': typeof calculateBoundingBox === 'function',
    'getSelectedLayers accessible': typeof getSelectedLayers === 'function',
    'updateCoordInput accessible': typeof updateCoordInput === 'function',
    'selectorInstance exists': !!window.selectorInstance,
    'Panel2 inputs exist': Object.values(inputs).every(el => !!el),
    'Layers selected': getSelectedLayers().length > 0
};

Object.entries(checks).forEach(([name, result]) => {
    console.log(`${result ? '✅' : '❌'} ${name}`);
});

console.log('\n%c========== NEXT STEPS ==========', 'color: orange; font-weight: bold');
console.log(`
1. If calculateBoundingBox is ❌ MISSING:
   → Check that key.js line ~220 has calculateBoundingBox() function
   → Verify key.js is loaded AFTER layer.js
   → Check browser console for syntax errors in key.js

2. If layers are not selected (❌):
   → Click "Nyalakan Seleksi" button
   → Drag box to select multiple layers
   → Run this diagnostic again

3. If values still not updating:
   → Open browser DevTools → Sources tab
   → Add breakpoint in updateCoordInput() line that says "const selectedLayers = getSelectedLayers();"
   → Select layers and observe if breakpoint hits
   → Check selectedLayers value in debugger

4. If calculateBoundingBox returns null:
   → Check data in layers[0].element
   → Verify layer.element exists and has clientWidth/clientHeight
   → Check browser console for DOM errors
`);

console.log('%c✅ DIAGNOSTIC COMPLETE - Check results above', 'color: green; font-size: 12px; font-weight: bold');
