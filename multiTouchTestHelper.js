// 🔥 MULTI-TOUCH TESTING HELPER
// Paste this di Browser Console untuk test multi-touch

// Color codes untuk console output
const COLOR = {
    RESET: '\x1b[0m',
    GREEN: '\x1b[32m',
    RED: '\x1b[31m',
    YELLOW: '\x1b[33m',
    BLUE: '\x1b[34m',
    CYAN: '\x1b[36m'
};

function log(msg, color = 'RESET') {
    console.log(`${COLOR[color]}${msg}${COLOR.RESET}`);
}

// ========== TEST #1: Check selector.selectedLayers exists ==========
function testSelectorExists() {
    log('\n=== TEST #1: Selector Instance ===', 'CYAN');
    
    const selector = window.selectorInstance;
    if (!selector) {
        log('❌ window.selectorInstance is null/undefined', 'RED');
        return false;
    }
    
    log('✅ Selector exists', 'GREEN');
    
    if (!Array.isArray(selector.selectedLayers)) {
        log('⚠️ selector.selectedLayers is not an array yet (normal if no touches)', 'YELLOW');
    } else {
        log(`✅ selector.selectedLayers initialized (${selector.selectedLayers.length} layers)`, 'GREEN');
    }
    
    return true;
}

// ========== TEST #2: Check multiDragState tracking ==========
function testMultiDragStateTracking() {
    log('\n=== TEST #2: MultiDragState Tracking ===', 'CYAN');
    
    if (!window.multiDragState) {
        log('❌ window.multiDragState not found', 'RED');
        return false;
    }
    
    const pointerCount = window.multiDragState.size || 0;
    
    if (pointerCount === 0) {
        log(`⚠️ No pointers currently tracked (normal if not dragging)`, 'YELLOW');
        log('   Touch or click a layer to see pointers tracked', 'YELLOW');
    } else {
        log(`✅ Found ${pointerCount} active pointers:`, 'GREEN');
        
        Array.from(window.multiDragState.entries()).forEach(([pid, info]) => {
            const layerName = info.layer?.name || 'unknown';
            const type = info.type || 'unknown';
            log(`   - Pointer ${pid}: "${layerName}" (${type})`, 'GREEN');
        });
    }
    
    return true;
}

// ========== TEST #3: Check getSelectedLayers returns correct layers ==========
function testGetSelectedLayers() {
    log('\n=== TEST #3: getSelectedLayers() Function ===', 'CYAN');
    
    if (typeof getSelectedLayers !== 'function') {
        log('❌ getSelectedLayers function not found', 'RED');
        return false;
    }
    
    const selected = getSelectedLayers();
    
    if (!Array.isArray(selected)) {
        log('❌ getSelectedLayers returned non-array', 'RED');
        return false;
    }
    
    if (selected.length === 0) {
        log('⚠️ No layers selected (normal if nothing touched)', 'YELLOW');
    } else {
        log(`✅ getSelectedLayers returned ${selected.length} layers:`, 'GREEN');
        selected.forEach((layer, idx) => {
            const name = layer?.name || 'unnamed';
            log(`   ${idx + 1}. "${name}"`, 'GREEN');
        });
    }
    
    return true;
}

// ========== TEST #4: Check calculateBoundingBox ==========
function testCalculateBoundingBox() {
    log('\n=== TEST #4: calculateBoundingBox() Function ===', 'CYAN');
    
    if (typeof calculateBoundingBox !== 'function') {
        log('❌ calculateBoundingBox function not found', 'RED');
        return false;
    }
    
    const selected = getSelectedLayers();
    
    if (selected.length === 0) {
        log('⚠️ No layers selected - select some first', 'YELLOW');
        return true;
    }
    
    try {
        const bbox = calculateBoundingBox(selected);
        
        if (!bbox) {
            log('❌ calculateBoundingBox returned null/undefined', 'RED');
            return false;
        }
        
        log(`✅ Bounding box calculated:`, 'GREEN');
        log(`   X: ${bbox.x}`, 'GREEN');
        log(`   Y: ${bbox.y}`, 'GREEN');
        log(`   Width: ${bbox.width}`, 'GREEN');
        log(`   Height: ${bbox.height}`, 'GREEN');
        
        return true;
    } catch (err) {
        log(`❌ Error in calculateBoundingBox: ${err.message}`, 'RED');
        return false;
    }
}

// ========== TEST #5: Check Panel2 input elements ==========
function testPanel2Elements() {
    log('\n=== TEST #5: Panel2 Input Elements ===', 'CYAN');
    
    const inputs = {
        layerName: document.getElementById('layerName'),
        xCoord: document.getElementById('xCoord'),
        yCoord: document.getElementById('yCoord'),
        width: document.getElementById('width'),
        height: document.getElementById('height'),
        scale: document.getElementById('scale'),
        rotation: document.getElementById('rotationControl')
    };
    
    let allFound = true;
    Object.entries(inputs).forEach(([name, elem]) => {
        if (!elem) {
            log(`❌ Missing element: #${name}`, 'RED');
            allFound = false;
        } else {
            log(`✅ Found #${name}`, 'GREEN');
        }
    });
    
    return allFound;
}

// ========== TEST #6: Force updateCoordInput and check Panel2 ==========
function testUpdateCoordInput() {
    log('\n=== TEST #6: updateCoordInput() Execution ===', 'CYAN');
    
    if (typeof updateCoordInput !== 'function') {
        log('❌ updateCoordInput function not found', 'RED');
        return false;
    }
    
    try {
        updateCoordInput();
        log('✅ updateCoordInput() executed successfully', 'GREEN');
        
        const layerNameElem = document.getElementById('layerName');
        const xCoordElem = document.getElementById('xCoord');
        
        if (layerNameElem && xCoordElem) {
            const layerDisplay = layerNameElem.value;
            const xDisplay = xCoordElem.value;
            const selected = getSelectedLayers();
            
            log(`   Current display:`, 'GREEN');
            log(`   - Layer: "${layerDisplay}"`, 'GREEN');
            log(`   - X: ${xDisplay}`, 'GREEN');
            log(`   - Selected count: ${selected.length}`, 'GREEN');
        }
        
        return true;
    } catch (err) {
        log(`❌ Error in updateCoordInput: ${err.message}`, 'RED');
        return false;
    }
}

// ========== RUN ALL TESTS ==========
function runAllTests() {
    log('\n╔════════════════════════════════════════╗', 'CYAN');
    log('║  MULTI-TOUCH SYSTEM - FULL TEST SUITE  ║', 'CYAN');
    log('╚════════════════════════════════════════╝', 'CYAN');
    
    const results = [];
    
    results.push({ name: 'Selector Instance', pass: testSelectorExists() });
    results.push({ name: 'MultiDragState Tracking', pass: testMultiDragStateTracking() });
    results.push({ name: 'getSelectedLayers()', pass: testGetSelectedLayers() });
    results.push({ name: 'calculateBoundingBox()', pass: testCalculateBoundingBox() });
    results.push({ name: 'Panel2 Elements', pass: testPanel2Elements() });
    results.push({ name: 'updateCoordInput()', pass: testUpdateCoordInput() });
    
    // Summary
    log('\n╔════════════════════════════════════════╗', 'CYAN');
    log('║           TEST RESULTS SUMMARY         ║', 'CYAN');
    log('╚════════════════════════════════════════╝', 'CYAN');
    
    const passed = results.filter(r => r.pass).length;
    const total = results.length;
    
    results.forEach(r => {
        const icon = r.pass ? '✅' : '❌';
        const statusColor = r.pass ? 'GREEN' : 'RED';
        log(`${icon} ${r.name}`, statusColor);
    });
    
    log(`\n${icon} ${passed}/${total} tests passed`, passed === total ? 'GREEN' : 'YELLOW');
    
    if (passed === total) {
        log('\n🎉 System is ready for multi-touch testing!', 'GREEN');
    }
}

// ========== INTERACTIVE TESTING SCRIPT ==========
function interactiveMultiTouchTest() {
    log('\n╔════════════════════════════════════════╗', 'CYAN');
    log('║   INTERACTIVE MULTI-TOUCH TEST MODE    ║', 'CYAN');
    log('╚════════════════════════════════════════╝', 'CYAN');
    
    log('\nInstructions:', 'YELLOW');
    log('1. Click/touch on a layer in Panel1 (canvas)', 'YELLOW');
    log('2. Run: checkStatus() in console', 'YELLOW');
    log('3. For multi-touch: Touch 2+ layers with different fingers', 'YELLOW');
    log('4. Run: checkStatus() again to see all selected', 'YELLOW');
    
    window.checkStatus = function() {
        log('\n=== CURRENT STATUS ===', 'CYAN');
        
        const selected = getSelectedLayers();
        const touching = Array.from(window.multiDragState?.entries?.() || []);
        const selectorLayers = window.selectorInstance?.selectedLayers || [];
        
        log(`Selected layers (via getSelectedLayers): ${selected.length}`, 'BLUE');
        selected.forEach(l => log(`  - ${l.name}`, 'BLUE'));
        
        log(`Selector.selectedLayers: ${selectorLayers.length}`, 'BLUE');
        selectorLayers.forEach(l => {
            const name = l?.name || l?.__layerInstance?.name || 'unknown';
            log(`  - ${name}`, 'BLUE');
        });
        
        log(`Active touch pointers: ${touching.length}`, 'BLUE');
        touching.forEach(([pid, info]) => {
            log(`  - Pointer ${pid}: ${info.layer?.name} (${info.type})`, 'BLUE');
        });
        
        // Check Panel2 display
        log('\nPanel2 Display Values:', 'BLUE');
        const layerInput = document.getElementById('layerName');
        const xInput = document.getElementById('xCoord');
        const yInput = document.getElementById('yCoord');
        
        log(`  Layer: "${layerInput?.value || 'N/A'}"`, 'BLUE');
        log(`  X: "${xInput?.value || 'N/A'}"`, 'BLUE');
        log(`  Y: "${yInput?.value || 'N/A'}"`, 'BLUE');
    };
    
    log('\n✅ Ready! Run checkStatus() whenever you want to check status.\n', 'GREEN');
}

// ========== EXPORT HELPER FUNCTIONS ==========
window.multiTouchTest = {
    runAll: runAllTests,
    testSelector: testSelectorExists,
    testMultiDrag: testMultiDragStateTracking,
    testGetSelected: testGetSelectedLayers,
    testBoundingBox: testCalculateBoundingBox,
    testPanel2: testPanel2Elements,
    testUpdateCoord: testUpdateCoordInput,
    interactive: interactiveMultiTouchTest
};

// ========== AUTO-RUN ON LOAD ==========
log('\n╔════════════════════════════════════════╗', 'CYAN');
log('║   MULTI-TOUCH TEST HELPER LOADED ✅     ║', 'CYAN');
log('╚════════════════════════════════════════╝\n', 'CYAN');

log('Available commands:', 'YELLOW');
log('  • multiTouchTest.runAll()         - Run all tests', 'YELLOW');
log('  • multiTouchTest.testSelector()   - Test selector instance', 'YELLOW');
log('  • multiTouchTest.testMultiDrag()  - Test multiDragState tracking', 'YELLOW');
log('  • multiTouchTest.testGetSelected() - Test getSelectedLayers()', 'YELLOW');
log('  • multiTouchTest.testBoundingBox() - Test bounding box calc', 'YELLOW');
log('  • multiTouchTest.testPanel2()     - Test Panel2 elements', 'YELLOW');
log('  • multiTouchTest.testUpdateCoord() - Test coordinate update', 'YELLOW');
log('  • multiTouchTest.interactive()    - Interactive test mode (use checkStatus())', 'YELLOW');
log('\nQuick start: multiTouchTest.runAll()\n', 'GREEN');
