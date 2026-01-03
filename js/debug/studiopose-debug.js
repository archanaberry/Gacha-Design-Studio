// Helper/Debug file untuk Studio Pose Frame
// Gunakan di console browser untuk debugging dan testing

/**
 * QUICK REFERENCE - Studio Pose Frame Functions
 * Copy & paste di console browser untuk test
 */

// ============================================
// 1. CHECK LOADING STATUS
// ============================================

// Check semua wrapper functions sudah ada
function checkStudioFunctions() {
  const requiredFunctions = [
    'Layer', 'createLayers', 'createLayerFromObject',
    'setBackground', 'setOpacity',
    'Selector',
    'handleSensitivity', 'addImage',
    'exportAsSVG', 'exportAsHTML',
    'startMove', 'stopMove', 'moveLayer',
    'handleXCoord', 'handleYCoord', 'handleRotation', 'handleScale',
    'handleFlipHorizontal', 'handleFlipVertical',
    'moveLayerUp', 'moveLayerDown', 'deleteSelectedLayer',
    'handleLayerName'
  ];

  console.log('=== STUDIO FUNCTIONS CHECK ===');
  let allGood = true;
  requiredFunctions.forEach(fn => {
    const exists = typeof window[fn] !== 'undefined';
    const status = exists ? '✓' : '✗';
    console.log(`${status} window.${fn}`);
    if (!exists) allGood = false;
  });
  console.log(`\n${allGood ? '✓ ALL FUNCTIONS LOADED' : '✗ SOME FUNCTIONS MISSING'}`);
  return allGood;
}

// Check layers data
function checkLayers() {
  console.log('=== LAYERS DATA ===');
  if (typeof window.layers !== 'undefined' && Array.isArray(window.layers)) {
    console.log(`Total layers: ${window.layers.length}`);
    window.layers.forEach((layer, idx) => {
      console.log(`  [${idx}] ${layer.layerName || 'Unknown'}`);
    });
    return true;
  } else {
    console.log('✗ window.layers not found or not array');
    return false;
  }
}

// Check DOM elements
function checkDOM() {
  console.log('=== DOM ELEMENTS CHECK ===');
  const elements = ['panel1', 'panel2', 'splitter', 'studio-loading'];
  let allGood = true;
  elements.forEach(id => {
    const el = document.getElementById(id);
    const status = el ? '✓' : '✗';
    console.log(`${status} #${id}`);
    if (!el) allGood = false;
  });
  return allGood;
}

// Check CSS loaded
function checkCSS() {
  console.log('=== CSS CHECK ===');
  const container = document.querySelector('.studiopose-frame');
  if (container) {
    console.log('✓ .studiopose-frame class found');
    const style = window.getComputedStyle(container);
    console.log(`  display: ${style.display}`);
    console.log(`  width: ${style.width}`);
    return true;
  } else {
    console.log('✗ .studiopose-frame not found');
    return false;
  }
}

// Complete health check
function studioHealthCheck() {
  console.log('\n╔════════════════════════════════════════╗');
  console.log('║  GACHA DESIGN STUDIO - HEALTH CHECK   ║');
  console.log('╚════════════════════════════════════════╝\n');

  const checks = {
    'Functions': checkStudioFunctions(),
    'Layers Data': checkLayers(),
    'DOM Elements': checkDOM(),
    'CSS Styling': checkCSS()
  };

  console.log('\n╔════════════════════════════════════════╗');
  const allGood = Object.values(checks).every(v => v);
  if (allGood) {
    console.log('║  ✓✓✓ STUDIO READY ✓✓✓                ║');
  } else {
    console.log('║  ⚠ SOME ISSUES DETECTED               ║');
  }
  console.log('╚════════════════════════════════════════╝\n');

  return checks;
}

// ============================================
// 2. TESTING FUNCTIONS
// ============================================

// Test sensivity
function testSensitivity() {
  console.log('Testing sensitivity...');
  window.handleSensitivity(50);
  const input = document.getElementById('sensitivityInput');
  if (input) {
    console.log(`✓ Sensitivity value: ${input.value || input.textContent}`);
  }
}

// Test movement
async function testMovement() {
  console.log('Testing movement controls...');
  const directions = ['up', 'down', 'left', 'right'];
  for (const dir of directions) {
    window.startMove(dir);
    console.log(`→ startMove('${dir}')`);
    await new Promise(r => setTimeout(r, 100));
    window.stopMove();
    console.log(`← stopMove()`);
    await new Promise(r => setTimeout(r, 100));
  }
  console.log('✓ Movement test complete');
}

// Test layer manipulation
function testLayerManipulation() {
  console.log('Testing layer manipulation...');
  
  if (window.selected) {
    console.log(`Current selected: ${window.selected.name}`);
    
    window.handleRotation(45);
    console.log('✓ handleRotation(45)');
    
    window.handleScale(1.5);
    console.log('✓ handleScale(1.5)');
    
    window.handleFlipHorizontal(true);
    console.log('✓ handleFlipHorizontal(true)');
  } else {
    console.warn('⚠ No layer selected');
  }
}

// ============================================
// 3. UTILITY FUNCTIONS
// ============================================

// Get selected layer info
function getSelectedInfo() {
  console.log('=== SELECTED LAYER INFO ===');
  if (window.selected) {
    const layer = window.selected;
    console.log(`Name: ${layer.name || 'Unknown'}`);
    console.log(`X: ${layer.x || 0}`);
    console.log(`Y: ${layer.y || 0}`);
    console.log(`Rotation: ${layer.rotation || 0}`);
    console.log(`Scale: ${layer.scale || 1}`);
    console.log(`Flip X: ${layer.flipX || false}`);
    console.log(`Flip Y: ${layer.flipY || false}`);
    return layer;
  } else {
    console.log('No layer selected');
    return null;
  }
}

// List all keyboard shortcuts (expected from key.js)
function listKeyboardShortcuts() {
  console.log('=== KEYBOARD SHORTCUTS (Expected) ===');
  console.log('Arrow Keys: Move selected layer');
  console.log('Up/Down: Move layer up/down in order');
  console.log('Delete: Delete selected layer');
  console.log('(Check js/studiocharacter/key.js for actual implementation)');
}

// Get panel sizes
function getPanelSizes() {
  const panel1 = document.getElementById('panel1');
  const panel2 = document.getElementById('panel2');
  const splitter = document.getElementById('splitter');
  
  console.log('=== PANEL SIZES ===');
  if (panel1) {
    console.log(`Panel1: ${panel1.offsetWidth}x${panel1.offsetHeight}px`);
  }
  if (panel2) {
    console.log(`Panel2: ${panel2.offsetWidth}x${panel2.offsetHeight}px`);
  }
  if (splitter) {
    console.log(`Splitter: ${splitter.offsetHeight}px high`);
  }
}

// ============================================
// 4. SHORTCUTS
// ============================================

// Quick init if frame not initialized
function quickInitFrame() {
  if (window.__pendingStudioPose) {
    const container = document.querySelector('.studiopose-frame') || 
                     document.getElementById('studio-container') ||
                     document.body;
    console.log('Initializing Studio Pose Frame...');
    window.__pendingStudioPose(container);
  } else {
    console.warn('✗ window.__pendingStudioPose not available');
  }
}

// Reset all controls
function resetControls() {
  document.getElementById('sensitivitySlider').value = 1;
  document.getElementById('opacitySlider1').value = 100;
  document.getElementById('opacitySlider2').value = 100;
  document.getElementById('rotationControl').value = 0;
  document.getElementById('scale').value = 1;
  document.getElementById('flipHorizontal').checked = false;
  document.getElementById('flipVertical').checked = false;
  console.log('✓ All controls reset');
}

// ============================================
// AUTO-EXPOSE FUNCTIONS
// ============================================

// Expose ke window untuk mudah diakses
if (!window.__studioDebugUtils) {
  window.__studioDebugUtils = {
    checkStudioFunctions,
    checkLayers,
    checkDOM,
    checkCSS,
    studioHealthCheck,
    testSensitivity,
    testMovement,
    testLayerManipulation,
    getSelectedInfo,
    listKeyboardShortcuts,
    getPanelSizes,
    quickInitFrame,
    resetControls
  };
  
  console.log('✓ Studio Debug Utils loaded');
  console.log('Run: studioHealthCheck() for quick diagnosis');
  console.log('Run: window.__studioDebugUtils to see all available functions');
}

// ============================================
// EXPORTED FOR CONSOLE USE
// ============================================

// Copy ke console:
// window.__studioDebugUtils.studioHealthCheck()
// window.__studioDebugUtils.testMovement()
// window.__studioDebugUtils.getSelectedInfo()
// dll
