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
  // Pastikan History tersedia
  if (typeof window.HistoryManager === 'undefined') {
    console.warn('HistoryManager not loaded yet');
  }

  // Handle all keyboard shortcuts
  document.addEventListener('keydown', function(e) {
    // Check if we're in an input field - don't intercept shortcuts then
    const isInput = e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA';
    
    // Ctrl/Cmd modifiers
    const isCtrl = e.ctrlKey || e.metaKey;
    
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
      const panel = document.getElementById('panel1');
      if (panel) {
        const currentScale = parseFloat(panel.dataset.scale) || 1;
        const newScale = Math.min(currentScale + 0.1, 3);
        panel.dataset.scale = newScale;
        panel.style.transform = `scale(${newScale})`;
        console.log('Zoom in: ' + Math.round(newScale * 100) + '%');
        
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
      const panel = document.getElementById('panel1');
      if (panel) {
        const currentScale = parseFloat(panel.dataset.scale) || 1;
        const newScale = Math.max(currentScale - 0.1, 0.1);
        panel.dataset.scale = newScale;
        panel.style.transform = `scale(${newScale})`;
        console.log('Zoom out: ' + Math.round(newScale * 100) + '%');
        
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
