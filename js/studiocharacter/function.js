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

// function.js - Keyboard Shortcuts Handler

(function() {
    // Helper: select/deselect layer by element
    function toggleLayerSelection(layer) {
      if (!layer) return;
      if (layer.element.classList.contains('selected')) {
        layer.element.classList.remove('selected');
        layer.selected = false;
      } else {
        layer.element.classList.add('selected');
        layer.selected = true;
      }
    }

    // Helper: select all layers
    function selectAllLayers() {
      if (typeof layers !== 'undefined') {
        layers.forEach(l => {
          l.element.classList.add('selected');
          l.selected = true;
        });
      }
    }

    // Helper: deselect all layers
    function deselectAllLayers() {
      if (typeof layers !== 'undefined') {
        layers.forEach(l => {
          l.element.classList.remove('selected');
          l.selected = false;
        });
      }
    }

  // Global click handler (install once) - handle ctrl+click toggle, single select, and deselect outside panels
  document.addEventListener('click', function(e) {
    const isCtrl = e.ctrlKey || e.metaKey;
    const panel1 = document.getElementById('panel1');
    const panel2 = document.getElementById('panel2');
    const panel3 = document.getElementById('panel3');
    const splitter = document.getElementById('splitter');

    // If click is inside panel1
    if (panel1 && panel1.contains(e.target)) {
      const layerEl = e.target.closest('.layer');

      if (layerEl) {
        // Layer clicked
        const layer = typeof layers !== 'undefined' ? layers.find(l => l.element === layerEl) : null;
        if (!layer) return;

        if (isCtrl) {
          // Toggle selection (multi-select)
          toggleLayerSelection(layer);

          // Update global selected reference - set to last toggled-on layer
          if (layer.element.classList.contains('selected')) {
            window.selected = layer;
          } else if (window.selected === layer) {
            // If we just untoggled the active selected, fallback to another selected or null
            const remaining = document.querySelector('.layer.selected, .layer-group.selected');
            if (remaining) {
              const remainingLayer = layers.find(l => l.element === remaining);
              window.selected = remainingLayer || null;
            } else {
              window.selected = null;
            }
          }

          // Sync menu/framework visuals for multi-select if helpers exist
          if (typeof updateMenuLayerSelectionForMultiSelect === 'function') updateMenuLayerSelectionForMultiSelect();
          if (typeof syncMultiSelectToFramework === 'function') syncMultiSelectToFramework();

          // Update layerName input to reflect new multi-selection
          if (typeof window.updateLayerNameInputFromSelection === 'function') window.updateLayerNameInputFromSelection();

          e.stopPropagation();
          return;
        } else {
          // Single select - use existing selectLayer logic to keep consistency
          if (typeof selectLayer === 'function') selectLayer(layer);
          // Update layerName input after selecting
          if (typeof window.updateLayerNameInputFromSelection === 'function') window.updateLayerNameInputFromSelection();
          e.stopPropagation();
          return;
        }
      } else {
        // Click on empty area inside panel1 => deselect all
        if (typeof deselectAllLayers === 'function') deselectAllLayers();
        if (typeof syncDeselectionAcrossAllPanels === 'function') syncDeselectionAcrossAllPanels();        if (typeof window.updateLayerNameInputFromSelection === 'function') window.updateLayerNameInputFromSelection();        e.stopPropagation();
        return;
      }
    }

    // Click outside panel1/panel2/panel3/splitter => deselect
    if (
      !(panel1 && panel1.contains(e.target)) &&
      !(panel2 && panel2.contains(e.target)) &&
      !(panel3 && panel3.contains(e.target)) &&
      !(splitter && splitter.contains(e.target))
    ) {
      if (typeof deselectAllLayers === 'function') deselectAllLayers();
      if (typeof syncDeselectionAcrossAllPanels === 'function') syncDeselectionAcrossAllPanels();
      if (typeof window.updateLayerNameInputFromSelection === 'function') window.updateLayerNameInputFromSelection();
      return;
    }
  }, false);

  // Handle all keyboard shortcuts
  document.addEventListener('keydown', function(e) {
    // Check if we're in an input field - don't intercept shortcuts then
    const isInput = e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA';
    
    // Ctrl/Cmd modifiers
    const isCtrl = e.ctrlKey || e.metaKey;

    // ============================================
    // Ctrl+A: Select All Layer di panel1
    // ============================================
    if (isCtrl && e.key.toLowerCase() === 'a' && !isInput) {
      e.preventDefault();
      selectAllLayers();
      return;
    }

    
    // ============================================
    // Ctrl+Z: Undo
    // ============================================
    if (isCtrl && e.key.toLowerCase() === 'z' && !e.shiftKey) {
      e.preventDefault();
      if (typeof window.HistoryManager !== 'undefined') {
        window.HistoryManager.undo();
      }
      return;
    }

    // ============================================
    // Ctrl+Y: Redo
    // ============================================
    if (isCtrl && e.key.toLowerCase() === 'y') {
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
            const centerOffsetX = parseFloat(layerContainer.dataset.centerOffsetX) || 0;
            const centerOffsetY = parseFloat(layerContainer.dataset.centerOffsetY) || 0;
            layerContainer.style.transform = `translate(-${centerOffsetX}px, -${centerOffsetY}px) scale(${newScale})`;
        } else {
            layerContainer.style.transform = `scale(${newScale})`;
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
            const centerOffsetX = parseFloat(layerContainer.dataset.centerOffsetX) || 0;
            const centerOffsetY = parseFloat(layerContainer.dataset.centerOffsetY) || 0;
            layerContainer.style.transform = `translate(-${centerOffsetX}px, -${centerOffsetY}px) scale(${newScale})`;
        } else {
            layerContainer.style.transform = `scale(${newScale})`;
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
    // Delete / Ctrl+Del / Ctrl+Shift+Del handling
    // ============================================
    if (!isInput && e.key === 'Delete') {
      e.preventDefault();
      // Ctrl+Shift+Del => ungroup inner children (ungroupSelectedLayer)
      if (isCtrl && e.shiftKey) {
        if (typeof ungroupSelectedLayer === 'function') {
          ungroupSelectedLayer();
        }
        return;
      }
      // Ctrl+Del => ungroup src into separate layers
      if (isCtrl && !e.shiftKey) {
        if (typeof ungroupSrcLayers === 'function') {
          ungroupSrcLayers();
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
      console.log('Color picker - Show color dialog');
      
      if (typeof selected !== 'undefined' && selected !== null) {
        const input = document.createElement('input');
        input.type = 'color';
        input.value = selected.options?.color || '#000000';
        input.onchange = function(e) {
          if (typeof selected !== 'undefined' && selected !== null) {
            selected.options = selected.options || {};
            selected.options.color = e.target.value;
            console.log('Color changed to: ' + e.target.value);
            
            // Record history
            if (typeof window.HistoryManager !== 'undefined') {
              window.HistoryManager.recordAction('color', {
                layerName: selected.layerName,
                color: e.target.value,
                action: 'Change color'
              });
            }
          }
        };
        input.click();
      }
      return;
    }
  });

  // Export untuk diakses global
  window.StudioShortcuts = {
    init: function() {
      console.log('Studio Shortcuts initialized');
    }
  };

})();
