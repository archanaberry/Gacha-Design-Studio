
// multiplier_ui.js - Handlers for Layer Multiplier UI controls in Panel 2

(function () {
    // Sync UI with selected layer multiplier state
    function updateMultiplierUI() {
        const selectedLayers = typeof getSelectedLayers === 'function' ? getSelectedLayers() : [];
        const container = document.getElementById('multiplier-container');

        if (selectedLayers.length === 0) {
            if (container) container.style.opacity = '0.5';
            // Optional: reset inputs or disable them
            return;
        }

        if (container) container.style.opacity = '1';

        const layer = selectedLayers[0];
        if (!layer.multiplier) return;

        const opts = layer.multiplier.options;

        const elEnabled = document.getElementById('multiplierEnabled');
        const elRepeatType = document.getElementById('multiplierRepeatType');
        const elAxisX = document.getElementById('multiplierAxisX');
        const elAxisY = document.getElementById('multiplierAxisY');
        const elCount = document.getElementById('multiplierCount');
        const elUnlimited = document.getElementById('multiplierUnlimited');
        const elGap = document.getElementById('multiplierGap');
        const elRotation = document.getElementById('multiplierRotation');
        const elMirrorType = document.getElementById('multiplierMirrorType');

        if (elEnabled) elEnabled.checked = opts.enabled;
        if (elRepeatType) elRepeatType.value = opts.mode;

        // Handle AXIS as bitmask or array or discrete properties
        // For now, let's assume opts.axis can be 'x', 'y', or 'xy'
        if (elAxisX) elAxisX.checked = opts.axis.includes('x');
        if (elAxisY) elAxisY.checked = opts.axis.includes('y');

        if (elUnlimited) elUnlimited.checked = opts.unlimited || false;
        if (elCount) {
            elCount.value = opts.count;
            elCount.disabled = opts.unlimited || false;
        }
        if (elGap) elGap.value = opts.gap;
        if (elRotation) elRotation.value = opts.rotation || 0;
        if (elMirrorType) elMirrorType.value = opts.mirrorType || 1;
    }

    function recordMultiplierHistory(actionName) {
        if (typeof window.HistoryManager !== 'undefined') {
            const layers = typeof getSelectedLayers === 'function' ? getSelectedLayers() : [];
            if (layers.length > 0) {
                window.HistoryManager.recordAction('multiplier', {
                    layerName: layers[0].name,
                    action: `Multiplier ${actionName} changed`
                });
            }
        }
    }

    // Global handlers for UI events
    window.handleMultiplierEnabled = function (val) {
        const layers = typeof getSelectedLayers === 'function' ? getSelectedLayers() : [];
        layers.forEach(l => {
            if (l.multiplier) l.multiplier.setOptions({ enabled: val });
        });
        recordMultiplierHistory('Toggle');
    };

    window.handleMultiplierRepeatType = function (val) {
        const layers = typeof getSelectedLayers === 'function' ? getSelectedLayers() : [];
        layers.forEach(l => {
            if (l.multiplier) l.multiplier.setOptions({ mode: val });
        });
        recordMultiplierHistory('Repeat Type');
    };

    window.handleMultiplierAxisChange = function () {
        const elAxisX = document.getElementById('multiplierAxisX');
        const elAxisY = document.getElementById('multiplierAxisY');

        let axis = '';
        if (elAxisX && elAxisX.checked) axis += 'x';
        if (elAxisY && elAxisY.checked) axis += 'y';

        const layers = typeof getSelectedLayers === 'function' ? getSelectedLayers() : [];
        layers.forEach(l => {
            if (l.multiplier) l.multiplier.setOptions({ axis: axis || 'x' });
        });
        recordMultiplierHistory('Axis');
    };

    window.handleMultiplierCount = function (val) {
        const layers = typeof getSelectedLayers === 'function' ? getSelectedLayers() : [];
        const count = parseInt(val) || 0;
        layers.forEach(l => {
            if (l.multiplier) l.multiplier.setOptions({ count: count });
        });
        recordMultiplierHistory('Count');
    };

    window.handleMultiplierUnlimited = function (val) {
        const layers = typeof getSelectedLayers === 'function' ? getSelectedLayers() : [];
        const elCount = document.getElementById('multiplierCount');

        if (elCount) elCount.disabled = val;

        layers.forEach(l => {
            if (l.multiplier) l.multiplier.setOptions({ unlimited: val });
        });
        recordMultiplierHistory('Unlimited');
    };

    window.handleMultiplierGap = function (val) {
        const layers = typeof getSelectedLayers === 'function' ? getSelectedLayers() : [];
        const gap = parseFloat(val) || 0;
        layers.forEach(l => {
            if (l.multiplier) l.multiplier.setOptions({ gap: gap });
        });
        recordMultiplierHistory('Gap');
    };

    window.handleMultiplierRotation = function (val) {
        const layers = typeof getSelectedLayers === 'function' ? getSelectedLayers() : [];
        const rotation = parseFloat(val) || 0;
        layers.forEach(l => {
            if (l.multiplier) l.multiplier.setOptions({ rotation: rotation });
        });
        recordMultiplierHistory('Rotation');
    };

    window.handleMultiplierMirrorType = function (val) {
        const layers = typeof getSelectedLayers === 'function' ? getSelectedLayers() : [];
        const mirrorType = parseInt(val) || 1;
        layers.forEach(l => {
            if (l.multiplier) l.multiplier.setOptions({ mirrorType: mirrorType });
        });
        recordMultiplierHistory('Mirror Type');
    };

    // Listen for layer selection changes
    document.addEventListener('layerSelected', function () {
        updateMultiplierUI();
    });

    document.addEventListener('DOMContentLoaded', updateMultiplierUI);

    // Also export a sync function
    window.syncMultiplierUI = updateMultiplierUI;

    console.log('✅ Multiplier UI handlers initialized');
})();
