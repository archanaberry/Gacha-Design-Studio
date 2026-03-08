/****************************************************************/
//                                                              //
//  -------------------Gacha Design Studio--------------------  //
//  Created by: Archana Berry                                   //
//  Assets credits: Lunime, OGL (Open Game License), MIT CC     //
//  Version resource: v0.001_alpha                              //
//  File: function.js                                           //
//  Type: module[shortcuts]                                     //
//  Desc: Keyboard shortcuts handler untuk studio editor        //
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

// function.js - Keyboard Shortcuts Handler & Multi-Select Management
// 🔥 UNIFIED MULTISELECT SYSTEM - Menggunakan selector.selectedLayers sebagai source of truth

(function () {
  // 🔥 Helper: Update selector.selectedLayers dengan layer instances
  function syncSelectorSelectedLayers(layerArray) {
    const selector = window.selectorInstance;
    if (selector && Array.isArray(selector.selectedLayers)) {
      selector.selectedLayers = (layerArray || []).slice();
      console.log('✅ selector.selectedLayers synced:', selector.selectedLayers.map(l => l?.name || 'unknown'));
    }
  }

  // Helper: select/deselect layer by element
  function toggleLayerSelection(layer) {
    if (!layer) return;
    if (layer.element.classList.contains('selected')) {
      // About to deselect logic
      if (layer.selected && window.currentLayerStateModified && window.HistoryManager) {
        window.HistoryManager.recordAction('edit');
        window.currentLayerStateModified = false;
      }

      layer.element.classList.remove('selected');
      layer.selected = false;
    } else {
      layer.element.classList.add('selected');
      layer.selected = true;
    }
  }

  // 🔥 REFACTORED: select all layers dengan proper selector sync
  function selectAllLayers() {
    if (typeof layers !== 'undefined') {
      const selectedLayers = [];
      layers.forEach(l => {
        l.element.classList.add('selected');
        l.selected = true;
        selectedLayers.push(l);
      });

      // 🔥 CRITICAL: Sync dengan selector.selectedLayers
      syncSelectorSelectedLayers(selectedLayers);

      // Update display
      if (typeof updateMenuLayerSelectionForMultiSelect === 'function') updateMenuLayerSelectionForMultiSelect();
      if (typeof syncMultiSelectToFramework === 'function') syncMultiSelectToFramework();
      if (typeof updateCoordInput === 'function') updateCoordInput();

      console.log('✅ Ctrl+A: All layers selected (' + selectedLayers.length + ')');
    }
  }

  // 🔥 REFACTORED: deselect all layers
  function deselectAllLayers() {

    // 🔥 HISTORY STRATEGY: RECORD ON DESELECT
    // If we had a modified layer active, record its state BEFORE we lose selection context
    if (window.currentLayerStateModified && window.HistoryManager) {
      console.log('📝 Deselect triggered: Recording history for modified state');
      window.HistoryManager.recordAction('edit'); // Generic 'edit' action
      window.currentLayerStateModified = false;
    }

    if (typeof layers !== 'undefined') {
      layers.forEach(l => {
        l.element.classList.remove('selected');
        l.selected = false;
      });

      // 🔥 CRITICAL: Clear selector.selectedLayers
      syncSelectorSelectedLayers([]);

      // Clear global selected reference
      window.selected = null;

      // Reset Text Studio to Create Mode
      if (window.textShapeManager && typeof window.textShapeManager.resetToCreateMode === 'function') {
        window.textShapeManager.resetToCreateMode();
      }

      // Update display
      if (typeof syncDeselectionAcrossAllPanels === 'function') syncDeselectionAcrossAllPanels();

      console.log('✅ All layers deselected');
    }
  }

  // 🔥 Global click handler - Handle deselect logic with Ctrl key awareness
  // Ctrl+Click dan layer selection logic sudah di-handle di studiopose.js addLayerClickHandler!
  document.addEventListener('click', function (e) {
    const panel1 = document.getElementById('panel1');
    const  = document.getElementById('panel2');
    const panel3 = document.getElementById('panel3');
    const splitter = document.getElementById('splitter');

    // 🔥 Fix: Jika selector aktif atau baru selesai drag, abaikan deselect global
    if (window.__selectorActive || window.justFinishedDrag) return;

    // 🔥 CRITICAL: Check if Ctrl is pressed - if so, skip ALL deselect logic to allow multi-select!
    const isCtrl = e.ctrlKey || e.metaKey;
    if (isCtrl) {
      console.log('🔒 Ctrl pressed - skipping auto-deselect, allowing multi-select to continue');
      return; // Don't deselect anything when Ctrl held!
    }

    // Click outside panel1/panel2/panel3/splitter => deselect
    if (
      !(panel1 && panel1.contains(e.target)) &&
      !(panel2 && panel2.contains(e.target)) &&
      !(panel3 && panel3.contains(e.target)) &&
      !(splitter && splitter.contains(e.target)) &&
      !e.target.closest('#textShapeContainer') &&
      !e.target.closest('#menusrcContainer')
    ) {
      console.log('🌍 Clicked outside all panels, deselect');
      deselectAllLayers();
      if (typeof window.updateLayerNameInputFromSelection === 'function') window.updateLayerNameInputFromSelection();
      return;
    }

    // Click in empty area of panel1 => deselect (but NOT when clicking on layer items themselves)
    if (panel1 && panel1.contains(e.target)) {
      const layerEl = e.target.closest('.layer, .layer-group');
      if (!layerEl) {
        // 🔥 Fix: Check if we just finished a drag. If it was a real drag, maybe ignore the sync click.
        // But for background "deselect" click, we usually want it to work.
        // If the user says it takes "two clicks", the first one might be ignored by a flag.

        console.log('🏜️ Clicked empty area in panel1');
        deselectAllLayers();
        if (typeof window.updateLayerNameInputFromSelection === 'function') window.updateLayerNameInputFromSelection();
        return;
      }
      // 🔥 If clicked ON a layer element (not empty), don't deselect - let addLayerClickHandler manage it
      return;
    }
  }, false);  // 🔥 Use bubbling phase so layer handlers (capture phase) fire first

  // 🔥 Handle all keyboard shortcuts
  document.addEventListener('keydown', function (e) {
    // Check if we're in an input field - don't intercept shortcuts then
    const isInput = e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA';

    // Ctrl/Cmd modifiers
    const isCtrl = e.ctrlKey || e.metaKey;

    // ============================================
    // Ctrl+A: Select All Layer di panel1
    // ============================================
    if (isCtrl && e.key.toLowerCase() === 'a' && !isInput) {
      e.preventDefault();
      // 🔥 Use unified selector function dari studiopose.js
      if (typeof selectAllLayersUnified === 'function') {
        selectAllLayersUnified();
      } else {
        selectAllLayers();
      }
      console.log('✅ Ctrl+A triggered');
      return;
    }

    // ============================================
    // Ctrl+Z: Undo
    // ============================================
    if (isCtrl && e.key.toLowerCase() === 'z' && !e.shiftKey) {
      e.preventDefault();
      // 🔥 Trigger deselect check first: if user is editing a layer and hits Undo,
      // we must "commit" the current edit to history first (if any)
      // BUT typically Undo should UNDO the current state.
      // If we record now, we save the current state, then undo goes back to previous.

      // Force save current state if modified
      if (window.currentLayerStateModified && window.HistoryManager) {
        window.HistoryManager.recordAction('edit');
        window.currentLayerStateModified = false;
      }

      if (typeof window.HistoryManager !== 'undefined') {
        window.HistoryManager.undo();
      }
      return;
    }

    // ============================================
    // Ctrl+Y: Redo
    // ============================================
    if (isCtrl && (e.key.toLowerCase() === 'y' || (e.key.toLowerCase() === 'z' && e.shiftKey))) {
      e.preventDefault();
      if (typeof window.HistoryManager !== 'undefined') {
        window.HistoryManager.redo();
      }
      return;
    }

    // ============================================
    // Ctrl+C: Copy (gunakan fungsi existing)
    // ============================================
    if (isCtrl && e.key.toLowerCase() === 'c' && !isInput) {
      e.preventDefault();
      if (typeof copySelectedLayers === 'function') {
        copySelectedLayers();
        console.log('Layer copied via Ctrl+C');
      }
      return;
    }

    // ============================================
    // Ctrl+V: Paste (gunakan fungsi existing)
    // ============================================
    if (isCtrl && e.key.toLowerCase() === 'v' && !isInput) {
      e.preventDefault();
      if (typeof pasteCopiedLayers === 'function') {
        pasteCopiedLayers();
        console.log('Layer pasted via Ctrl+V');

        // Record history
        if (typeof window.HistoryManager !== 'undefined') {
          window.HistoryManager.recordAction('paste', {
            layerName: 'Pasted Layer',
            action: 'Paste layer'
          });
        }
      }
      return;
    }

    // ============================================
    // Ctrl+D: Duplicate (gunakan fungsi existing)
    // ============================================
    if (isCtrl && e.key.toLowerCase() === 'd' && !isInput) {
      e.preventDefault();
      if (typeof duplicateSelectedLayers === 'function') {
        duplicateSelectedLayers();
        console.log('Layer duplicated via Ctrl+D');

        // Record history
        if (typeof window.HistoryManager !== 'undefined') {
          window.HistoryManager.recordAction('duplicate', {
            layerName: selected ? selected.name : 'Unknown',
            action: 'Duplicate layer'
          });
        }
      }
      return;
    }

    // ============================================
    // Ctrl+P: Zoom In (+)
    // ============================================
    if (isCtrl && e.key.toLowerCase() === 'p' && !isInput) {
      e.preventDefault();
      const layerContainer = document.getElementById('panel1-layercontainer') || document.getElementById('panel1');
      if (layerContainer) {
        const currentScale = parseFloat(layerContainer.dataset.scale) || 1;
        const newScale = Math.min(currentScale + 0.1, 3);
        layerContainer.dataset.scale = newScale;

        // Preserve center origin translate jika aktif
        const isCenterOriginActive = layerContainer.dataset.centerOriginActive === 'true';
        if (isCenterOriginActive) {
          // Center origin mode: translate(50%, 50%) untuk origin di center
          layerContainer.style.transform = `translate(50%, 50%) scale(${newScale})`;
        } else {
          // Default mode: translate(0, 0) untuk origin di pojok kiri atas
          layerContainer.style.transform = `translate(0, 0) scale(${newScale})`;
        }

        console.log('Zoom in: ' + Math.round(newScale * 100) + '%');

        // Update zoom slider and input
        const zoomSlider = document.getElementById('zoomSlider');
        const zoomInput = document.getElementById('zoomInput');
        if (zoomSlider) zoomSlider.value = Math.round(newScale * 100);
        if (zoomInput) zoomInput.value = Math.round(newScale * 100) + '%';

        // Update guide canvas
        if (typeof drawGuideCanvas === 'function') {
          drawGuideCanvas();
        }

        // Record history
        if (typeof window.HistoryManager !== 'undefined') {
          window.HistoryManager.recordAction('zoom', {
            scale: newScale,
            action: 'Zoom in'
          });
        }
      }
      return;
    }

    // ============================================
    // Ctrl+M: Zoom Out (-)
    // ============================================
    if (isCtrl && e.key.toLowerCase() === 'm' && !isInput) {
      e.preventDefault();
      const layerContainer = document.getElementById('panel1-layercontainer') || document.getElementById('panel1');
      if (layerContainer) {
        const currentScale = parseFloat(layerContainer.dataset.scale) || 1;
        const newScale = Math.max(currentScale - 0.1, 0.1);
        layerContainer.dataset.scale = newScale;

        // Preserve center origin translate jika aktif
        const isCenterOriginActive = layerContainer.dataset.centerOriginActive === 'true';
        if (isCenterOriginActive) {
          // Center origin mode: translate(50%, 50%) untuk origin di center
          layerContainer.style.transform = `translate(50%, 50%) scale(${newScale})`;
        } else {
          // Default mode: translate(0, 0) untuk origin di pojok kiri atas
          layerContainer.style.transform = `translate(0, 0) scale(${newScale})`;
        }

        console.log('Zoom out: ' + Math.round(newScale * 100) + '%');

        // Update zoom slider and input
        const zoomSlider = document.getElementById('zoomSlider');
        const zoomInput = document.getElementById('zoomInput');
        if (zoomSlider) zoomSlider.value = Math.round(newScale * 100);
        if (zoomInput) zoomInput.value = Math.round(newScale * 100) + '%';

        // Update guide canvas
        if (typeof drawGuideCanvas === 'function') {
          drawGuideCanvas();
        }

        // Record history
        if (typeof window.HistoryManager !== 'undefined') {
          window.HistoryManager.recordAction('zoom', {
            scale: newScale,
            action: 'Zoom out'
          });
        }
      }
      return;
    }

    // ============================================
    // Ctrl+B: Toggle Bounding Mode
    // ============================================
    if (isCtrl && e.key.toLowerCase() === 'b' && !isInput) {
      e.preventDefault();
      if (typeof toggleBoundingMode === 'function') {
        toggleBoundingMode();
      } else {
        // Simple toggle if function not defined yet
        window.boundingMode = !window.boundingMode;
        console.log('Bounding Mode:', window.boundingMode ? 'ON' : 'OFF');
        // Update UI if needed
        if (typeof updateBoundingModeUI === 'function') updateBoundingModeUI();
      }
      return;
    }

    // ============================================
    // Ctrl+G: Group Selected Layers
    // ============================================
    if (isCtrl && e.key.toLowerCase() === 'g' && !e.shiftKey && !isInput) {
      e.preventDefault();
      if (typeof groupSelectedLayers === 'function') {
        groupSelectedLayers();
      }
      return;
    }

    // ============================================
    // Ctrl+Shift+G: Merge Inner Group to Src (Convert to Multi-Src Layer)
    // ============================================
    if (isCtrl && e.shiftKey && e.key.toLowerCase() === 'g' && !isInput) {
      e.preventDefault();
      if (typeof mergeSelectedLayersSrc === 'function') {
        console.log('🔄 Converting Inner Group to Src/Merging Layers...');
        mergeSelectedLayersSrc();
      }
      return;
    }

    // ============================================
    // Delete / Ctrl+Del / Ctrl+Shift+Del handling
    // ============================================
    if (!isInput && e.key === 'Delete') {
      e.preventDefault();

      // Ctrl+Del => Smart Ungroup (Inner/Src)
      if (isCtrl) {
        if (typeof smartUngroup === 'function') {
          smartUngroup();
        } else if (typeof ungroupSelectedLayers === 'function') {
          // Fallback to existing ungroup
          ungroupSelectedLayers();
        }
        return;
      }

      // Just Delete => remove selected
      if (!isCtrl && !e.shiftKey) {
        if (typeof deleteSelectedLayer === 'function') {
          deleteSelectedLayer();
        }
        return;
      }
    }

    // ============================================
    // Ctrl+Shift+D: Deep Debug (Example) or other combinations
    // ============================================
    // ============================================
    // Ctrl+Shift+D: Deep Debug (Log Layer Info)
    // ============================================
    if (isCtrl && e.shiftKey && e.key.toLowerCase() === 'd' && !isInput) {
      e.preventDefault();
      console.log('🐞 Deep Debug Info:');
      const sel = getSelectedLayers();
      if (sel.length > 0) {
        sel.forEach(l => console.log(l));
        console.table(sel.map(l => ({ name: l.name, x: l.x, y: l.y, parent: l.parentLayer?.name || 'root' })));
      } else {
        console.log('No layers selected.');
      }
      return;
    }

    // ============================================
    // Ctrl+J: Join Stroke/Fill (optional)
    // ============================================
    if (isCtrl && e.key.toLowerCase() === 'j' && !isInput) {
      e.preventDefault();
      console.log('Join Stroke/Fill - Not yet implemented');
      return;
    }

    // ============================================
    // Ctrl+Alt+C: Open Color Picker
    // ============================================
    if (isCtrl && e.altKey && e.key.toLowerCase() === 'c' && !isInput) {
      e.preventDefault();

      if (typeof selected !== 'undefined' && selected !== null) {
        // Determine current color for the picker
        let currentColor = '#000000';
        const sIdx = selected.selectedImageIndex;

        if (sIdx !== null && typeof selected.srcColors === 'object') {
          currentColor = selected.srcColors[sIdx] || selected.color || '#000000';
        } else {
          currentColor = selected.color || '#000000';
        }

        const input = document.createElement('input');
        input.type = 'color';
        input.value = currentColor;

        input.onchange = function (ev) {
          if (typeof selected !== 'undefined' && selected !== null) {
            const newColor = ev.target.value;
            const idx = selected.selectedImageIndex;

            if (idx !== null) {
              // Apply color to specific src
              const colors = Object.assign({}, selected.srcColors || {});
              colors[idx] = newColor;
              selected.srcColors = colors; // Trigger setter
              console.log(`Color of src${idx} changed to: ${newColor}`);
            } else {
              // Apply global color
              selected.color = newColor; // Trigger setter
              console.log(`Global color changed to: ${newColor}`);
            }

            // Flag modification for history (Record on Deselect)
            window.currentLayerStateModified = true;
          }
        };
        input.click();
      }
      return;
    }
  });

  // 🔥 Export untuk diakses global - UNIFIED MULTISELECT API
  window.StudioShortcuts = {
    init: function () {
      console.log('✅ Studio Shortcuts initialized with unified multi-select system');
      window.boundingMode = false; // Init bounding mode state
    },
    selectAll: selectAllLayers,
    deselectAll: deselectAllLayers,
    toggleSelection: toggleLayerSelection,
    syncSelector: syncSelectorSelectedLayers
  };

})();
