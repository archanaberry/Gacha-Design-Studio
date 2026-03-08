/**
 * Menu Layer Logic
 * Handles global functions for menu layer interactions and selection syncing.
 */

console.log('%c[MenuLayer] Script loaded', 'color: #00ffaa; font-weight: bold');

// Global function to update the menu selection based on the canvas selection
window.updateMenuLayerSelectionForMultiSelect = function () {
    console.log('%c[MenuLayer] 🎯 updateMenuLayerSelectionForMultiSelect called', 'color: #00ffaa; font-weight: bold');

    if (!window.layerSrcManager) {
        console.warn('%c[MenuLayer] ⚠️ layerSrcManager not ready', 'color: orange; font-weight: bold');
        return;
    }

    if (!window.layerSrcManager.layerList) {
        console.warn('%c[MenuLayer] ⚠️ layerSrcManager.layerList not ready', 'color: orange; font-weight: bold');
        return;
    }

    // Get currently selected layers from the unified selector system
    let selectedLayers = [];
    if (window.selectorInstance && Array.isArray(window.selectorInstance.selectedLayers)) {
        selectedLayers = window.selectorInstance.selectedLayers;
        console.log(`%c[MenuLayer]   From selectorInstance: ${selectedLayers.length} layers`, 'color: #88ffcc');
    } else if (window.selected) {
        selectedLayers = [window.selected];
        console.log('%c[MenuLayer]   From window.selected: 1 layer', 'color: #88ffcc');
    }

    // Get all row elements in the menu
    const allRows = window.layerSrcManager.layerList.querySelectorAll('.menusrc-item-row');
    console.log(`%c[MenuLayer]   Menu has ${allRows.length} rows`, 'color: #88ffcc');

    // Create a Set of selected IDs for O(1) lookup
    const selectedIds = new Set();
    selectedLayers.forEach(layer => {
        if (layer.id) {
            selectedIds.add(layer.id);
        } else if (layer.__layerInstance && layer.__layerInstance.id) {
            selectedIds.add(layer.__layerInstance.id);
        }
    });

    console.log('%c[MenuLayer]   Selected IDs:', 'color: #88ffcc', Array.from(selectedIds));

    // Iterate through all rows and update classes
    let matchCount = 0;
    allRows.forEach(row => {
        // The row ID should match the layer ID
        // LayerSrcManager sets row.id = layer.id
        if (selectedIds.has(row.id)) {
            row.classList.add('selected');
            row.style.backgroundColor = '#e3f2fd';
            matchCount++;
            console.log(`%c[MenuLayer]     ✓ Highlighted row: ${row.id}`, 'color: #00ff88');
        } else {
            row.classList.remove('selected');
            row.style.backgroundColor = '';
        }
    });

    // If we want the menu to FILTER based on selection (as requested: "only show selected")
    // we should trigger a full render here.
    if (window.layerSrcManager && typeof window.layerSrcManager.render === 'function') {
        console.log('%c[MenuLayer] 🔄 Triggering filtered re-render...', 'color: #00ffaa');
        window.layerSrcManager.render();
    }

    console.log(`%c[MenuLayer] ✅ Menu selection updated: ${matchCount} matched`, 'color: #00ff00; font-weight: bold');

    // Update header thumbnail to match selection
    if (window.layerSrcManager && typeof window.layerSrcManager.syncHeaderSelection === 'function') {
        window.layerSrcManager.syncHeaderSelection();
    }
};

/**
 * Placeholder for framework sync if not defined
 */
if (typeof window.syncMultiSelectToFramework === 'undefined') {
    window.syncMultiSelectToFramework = function () {
        if (typeof updateFrameworkDisplay === 'function') {
            updateFrameworkDisplay();
        }
    };
}

console.log('%c[MenuLayer] Script initialization complete', 'color: #00ffaa; font-weight: bold');
