/**
 * Studio Character Menu Integration
 * 
 * Bridges the gap between the StudioPose (Canvas) and LayerSrcManager (UI).
 * Initializes the Layer Manager and syncs state.
 */

// IMPORTANT: Immediately log that this script is loading
console.log('%c[MenuIntegration] Script loaded', 'color: #00ff00; font-weight: bold');

document.addEventListener('DOMContentLoaded', () => {
    console.log('%c[MenuIntegration] DOMContentLoaded fired', 'color: #00ff00; font-weight: bold');

    const container = document.getElementById('menulayerContainer');
    if (!container) {
        console.error('%c[MenuIntegration] ❌ menulayerContainer not found!', 'color: red; font-weight: bold');
        return;
    }

    console.log('%c[MenuIntegration] ✅ Container found:', 'color: green', container);

    // Check if LayerSrcManager class is defined
    if (typeof LayerSrcManager === 'undefined') {
        console.error('%c[MenuIntegration] ❌ LayerSrcManager class not defined! Check script load order.', 'color: red; font-weight: bold');
        return;
    }

    console.log('%c[MenuIntegration] ✅ LayerSrcManager class found', 'color: green');

    // Initialize LayerSrcManager
    try {
        window.layerSrcManager = new LayerSrcManager(container);
        console.log('%c[MenuIntegration] ✅ LayerSrcManager initialized successfully', 'color: green; font-weight: bold', window.layerSrcManager);
    } catch (error) {
        console.error('%c[MenuIntegration] ❌ Error initializing LayerSrcManager:', 'color: red; font-weight: bold', error);
        return;
    }

    // CRITICAL: Setup a polling check for layers
    let pollAttempts = 0;
    const maxPolls = 20; // Try for 10 seconds (20 * 500ms)

    const checkAndSyncLayers = () => {
        pollAttempts++;
        console.log(`%c[MenuIntegration] Poll attempt ${pollAttempts}/${maxPolls} - Checking for layers...`, 'color: #ffaa00');

        if (typeof window.layers !== 'undefined' && Array.isArray(window.layers) && window.layers.length > 0) {
            console.log(`%c[MenuIntegration] ✅ Found ${window.layers.length} layers! Syncing...`, 'color: green; font-weight: bold');
            window.syncLayersToMenu();
            return; // Stop polling
        }

        // Continue polling if layers not yet ready and we haven't exceeded max attempts
        if (pollAttempts < maxPolls) {
            console.log(`%c[MenuIntegration] ⏳ Layers not ready yet, will retry in 500ms...`, 'color: #ffaa00');
            setTimeout(checkAndSyncLayers, 500);
        } else {
            console.warn(`%c[MenuIntegration] ⚠️ Gave up waiting for layers after ${maxPolls} attempts`, 'color: orange; font-weight: bold');
        }
    };

    // Start polling after a short delay
    setTimeout(checkAndSyncLayers, 500);

    // CRITICAL: Set up MutationObserver to sync layers when DOM changes (add/remove/reorder)
    // This ensures menu updates whenever layers are added dynamically
    const layerContainer = document.getElementById('panel1-layercontainer');
    if (layerContainer) {
        let syncTimeout = null;
        const observer = new MutationObserver((mutations) => {
            // Guard: don't sync if manager is already performing an internal sync/reorder
            if (window.layerSrcManager && window.layerSrcManager.isSyncing) return;

            // Debounce to avoid excessive syncing
            clearTimeout(syncTimeout);
            syncTimeout = setTimeout(() => {
                console.log('%c[MenuIntegration] 📊 DOM mutation detected, syncing layers...', 'color: #00aaff; font-weight: bold');
                window.syncLayersToMenu();
            }, 200);
        });

        observer.observe(layerContainer, {
            childList: true,
            subtree: false, // Only top-level reordering/add/remove
            attributes: false // Ignore selection state changes (class="selected")
        });
        console.log('%c[MenuIntegration] ✅ MutationObserver attached to panel1-layercontainer', 'color: green');
    } else {
        console.warn('%c[MenuIntegration] ⚠️ panel1-layercontainer not found for MutationObserver', 'color: orange');
    }
});

/**
 * Syncs the global 'layers' array to the Menu UI
 * Completely rebuilds the menu list based on the current window.layers
 */
window.syncLayersToMenu = function () {
    console.log('%c[SyncLayers] ========== START ==========', 'color: #0088ff; font-weight: bold');

    if (!window.layerSrcManager) {
        console.warn('%c[SyncLayers] ⚠️ layerSrcManager not ready', 'color: orange; font-weight: bold');
        return;
    }

    if (!window.layers) {
        console.warn('%c[SyncLayers] ⚠️ window.layers not defined', 'color: orange; font-weight: bold');
        return;
    }

    console.log(`%c[SyncLayers] 📋 Syncing ${window.layers.length} layers to menu`, 'color: #0088ff; font-weight: bold');

    // Reset manager layers using internal method
    window.layerSrcManager.clear();

    // Re-add global layers (always use the real Layer object reference)
    window.layers.forEach((layer, index) => {
        // Ensure ID
        if (!layer.id) {
            layer.id = `layer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        }
        // Always add the real Layer object (not a pseudo-object)
        window.layerSrcManager.addLayer(layer);
    });

    // Bulk render at the end
    window.layerSrcManager.render();

    console.log(`%c[SyncLayers] ✅ Sync complete! Total in menu: ${window.layerSrcManager.layers.length}`, 'color: #00ff00; font-weight: bold');
    console.log('%c[SyncLayers] ========== END ==========', 'color: #0088ff; font-weight: bold');

    // Re-apply selection state
    if (typeof window.updateMenuLayerSelectionForMultiSelect === 'function') {
        window.updateMenuLayerSelectionForMultiSelect();
    }
};

/**
 * OVERRIDES: Hooks into studiopose.js functions to sync selection state
 */

// Save original functions if they exist
const originalSyncLayerSelection = window.syncLayerSelectionAcrossAllPanels;
const originalSyncDeselection = window.syncDeselectionAcrossAllPanels;

window.syncLayerSelectionAcrossAllPanels = function (layer, fromMenu = false) {
    // Call original implementation first (maintain legacy behavior)
    if (originalSyncLayerSelection) {
        originalSyncLayerSelection(layer, fromMenu);
    }

    // Sync to New LayerSrcManager (unless triggered by it to avoid loops)
    if (!fromMenu && window.updateMenuLayerSelectionForMultiSelect) {
        window.updateMenuLayerSelectionForMultiSelect();
    }
};

window.syncDeselectionAcrossAllPanels = function () {
    // Call original implementation first
    if (originalSyncDeselection) {
        originalSyncDeselection();
    }

    // Sync to New LayerSrcManager
    if (window.updateMenuLayerSelectionForMultiSelect) {
        window.updateMenuLayerSelectionForMultiSelect();
    }
};

// Listen for selection events from Menu Layer
// Listen for selection events from Menu Layer (dispatched globally on window)
// NOTE: The layerSelected event from LayerSrcManager now handles panel1 selection
//       directly inside selectLayer(). This handler is kept for backward compatibility
//       but should not duplicate the selection logic.
window.addEventListener('layerSelected', (e) => {
    const layerId = e.detail.layerId;
    console.log(`[Integration] Layer selected via Menu: ${layerId}`);
    // Selection is already handled inside LayerSrcManager.selectLayer()
    // No need to duplicate here
});

window.addEventListener('srcSelected', (e) => {
    const { srcIndex, srcPath } = e.detail;
    console.log(`[Integration] Src selected: ${srcIndex}`);
    // Logic to handle src selection if needed (e.g. open specific color picker tab)
});


console.log('%c[MenuIntegration] Script initialization complete', 'color: #00ff00; font-weight: bold');
