/**
 * DEBUG SCRIPT untuk Test Ctrl+A dan Ctrl+Click Multi-Select
 * Jalankan di browser console (F12) setelah studio pose terbuka
 */

console.log('='.repeat(60));
console.log('🧪 DEBUG SCRIPT: Ctrl+A dan Ctrl+Click Multi-Select Test');
console.log('='.repeat(60));

// ============================================
// 1. Check script loading order
// ============================================
console.log('\n📋 1. CHECKING SCRIPT LOAD ORDER:\n');

const checks = {
    'Layer class': typeof Layer !== 'undefined',
    'studiopose.js functions': typeof selectAllLayersUnified === 'function',
    'function.js Ctrl handler': typeof keydown === 'function' || document.onkeydown !== null,
    'selector.js instance': typeof window.selectorInstance !== 'undefined',
    'layers array': typeof layers !== 'undefined' && Array.isArray(layers),
    'panel1 element': document.getElementById('panel1') !== null,
    'layer.selected property': layers && layers.length > 0 && 'selected' in layers[0]
};

Object.entries(checks).forEach(([name, result]) => {
    const icon = result ? '✅' : '❌';
    console.log(`${icon} ${name}: ${result}`);
});

// ============================================
// 2. Check layer count
// ============================================
console.log('\n📊 2. CURRENT LAYERS:\n');
if (typeof layers !== 'undefined' && layers.length > 0) {
    console.log(`Total layers: ${layers.length}`);
    layers.forEach((layer, idx) => {
        console.log(`  [${idx}] ${layer.name || 'Unnamed'} - Selected: ${layer.selected || false}`);
    });
} else {
    console.log('❌ No layers found! Create some layers first.');
}

// ============================================
// 3. Manual test selectAllLayersUnified()
// ============================================
console.log('\n🔧 3. TEST selectAllLayersUnified():\n');
console.log('Running selectAllLayersUnified()...');
try {
    selectAllLayersUnified();
    console.log('✅ selectAllLayersUnified() executed successfully!');
    console.log('Selected count:', window.selectorInstance?.selectedLayers?.length || 0);
} catch (e) {
    console.error('❌ Error:', e.message);
}

// ============================================
// 4. Check selector.selectedLayers
// ============================================
console.log('\n🎯 4. SELECTOR STATE:\n');
if (window.selectorInstance) {
    console.log('selectorInstance exists:', window.selectorInstance);
    console.log('selectedLayers:', window.selectorInstance.selectedLayers);
    console.log('selectedLayers count:', window.selectorInstance.selectedLayers?.length || 0);
} else {
    console.log('❌ window.selectorInstance not found!');
}

// ============================================
// 5. Test single layer multi-select
// ============================================
console.log('\n👆 5. MANUAL MULTI-SELECT TEST:\n');
console.log('Instructions:');
console.log('1. Create 3+ layers if not already created');
console.log('2. Click layer 1 normally');
console.log('3. Hold Ctrl and click layer 2');
console.log('4. Hold Ctrl and click layer 3');
console.log('5. Check console for "🔥 Ctrl+Click handler" logs');
console.log('6. Run: window.selectorInstance.selectedLayers');
console.log('   to see which layers are selected');

// ============================================
// 6. Quick test commands
// ============================================
console.log('\n⚡ 6. QUICK TEST COMMANDS:\n');
console.log('Copy-paste these in console to test:\n');

console.log('// Test 1: Select all');
console.log('selectAllLayersUnified();\n');

console.log('// Test 2: Check selected layers');
console.log('console.log("Selected:", window.selectorInstance.selectedLayers);\n');

console.log('// Test 3: Deselect all');
console.log('if(typeof deselectAllLayersUnified === "function") deselectAllLayersUnified(); else console.log("Function not found");\n');

console.log('// Test 4: Check layer elements class');
console.log('document.querySelectorAll(".layer.selected").forEach(el => console.log("Selected element:", el.textContent));\n');

// ============================================
// 7. Event listener check
// ============================================
console.log('\n🎧 7. EVENT LISTENER CHECK:\n');
console.log('Checking if click handler is registered (this is limited in browser console)...');
console.log('Look at these handlers during next click/key:');
console.log('- 📍 Click detected: [log message]');
console.log('- 🔥 Ctrl+Click handler: [log message]');
console.log('- 🎯 selectAllLayersUnified triggered!: [for Ctrl+A]');

console.log('\n' + '='.repeat(60));
console.log('✨ DEBUG COMPLETE - Ready to test!\n');
console.log('Next steps:');
console.log('1. Open Developer Tools > Console (F12)');
console.log('2. Test Ctrl+A - Check console for ✅ messages');
console.log('3. Test Ctrl+Click - Check console for 🔥 messages');
console.log('4. Run commands above to inspect state');
console.log('='.repeat(60));
