/****************************************************************/
//                                                              //
//  -------------------Gacha Design Studio--------------------  //
//  Created by: Archana Berry                                   //
//  Assets credits: Lunime, OGL (Open Game License), MIT CC     //
//  Version resource: v0.001_alpha                              //
//  File: history.js                                            //
//  Type: module[history]                                       //
//  Desc: History Manager untuk undo/redo dan snapshot system   //
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

// history.js - Undo/Redo History Manager

(function() {
  
  // HistoryManager - Mengelola undo/redo dan snapshot
  window.HistoryManager = {
    // Stack untuk undo (past actions)
    undoStack: [],
    
    // Stack untuk redo (actions yang di-undo)
    redoStack: [],
    
    // Maximum history states
    maxHistory: 50,
    
    // Current state snapshot
    currentSnapshot: null,

    /**
     * Record action untuk history
     * @param {string} actionType - Tipe action
     * @param {object} data - Data yang berubah
     */
    recordAction: function(actionType, data) {
      // Create snapshot dari state saat ini
      const snapshot = this.createSnapshot(actionType, data);
      
      // Clear redo stack ketika action baru dilakukan
      this.redoStack = [];
      
      // Add ke undo stack
      this.undoStack.push(snapshot);
      
      // Limit history size
      if (this.undoStack.length > this.maxHistory) {
        this.undoStack.shift();
      }
      
      // Update current snapshot
      this.currentSnapshot = snapshot;
      
      console.log('Action recorded:', actionType, snapshot.description);
    },

    /**
     * Create snapshot dari current state
     * @param {string} actionType
     * @param {object} data
     * @returns {object} snapshot object
     */
    createSnapshot: function(actionType, data) {
      const timestamp = new Date();
      
      // Capture selected layer data jika ada
      let layerData = null;
      if (typeof selected !== 'undefined' && selected !== null) {
        layerData = {
          name: selected.layerName || selected.name,
          x: selected.x || selected.options?.x || 0,
          y: selected.y || selected.options?.y || 0,
          scale: selected.scale || selected.options?.scale || 1,
          rotation: selected.rotation || selected.options?.rotation || 0,
          width: selected.width,
          height: selected.height,
          opacity: selected.options?.opacity || 1,
          flipX: selected.isFlipX,
          flipY: selected.isFlipY
        };
      }
      
      // Capture all layers data
      let allLayersData = null;
      if (typeof layers !== 'undefined') {
        allLayersData = layers.map(layer => ({
          name: layer.layerName || layer.name,
          x: layer.x || layer.options?.x || 0,
          y: layer.y || layer.options?.y || 0,
          scale: layer.scale || layer.options?.scale || 1,
          rotation: layer.rotation || layer.options?.rotation || 0,
          width: layer.width,
          height: layer.height
        }));
      }
      
      // Create thumbnail
      const thumbnail = this.createCanvasThumbnail();
      
      return {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: timestamp,
        actionType: actionType,
        actionData: data,
        layerData: layerData,
        allLayersData: allLayersData,
        thumbnail: thumbnail,
        description: this.getActionDescription(actionType, data)
      };
    },

    /**
     * Create thumbnail dari canvas
     * @returns {string} data URL dari canvas
     */
    createCanvasThumbnail: function() {
      try {
        const panel = document.getElementById('panel1');
        if (!panel) return null;
        
        // Create canvas untuk thumbnail
        const canvas = document.createElement('canvas');
        canvas.width = 100;
        canvas.height = 100;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) return null;
        
        // Fill background
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw border
        ctx.strokeStyle = '#ddd';
        ctx.lineWidth = 1;
        ctx.strokeRect(0, 0, canvas.width, canvas.height);
        
        // Add text
        ctx.fillStyle = '#999';
        ctx.font = '11px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Snapshot', 50, 50);
        
        return canvas.toDataURL('image/png');
      } catch(e) {
        console.warn('Could not create thumbnail:', e);
        return null;
      }
    },

    /**
     * Get description untuk action
     * @param {string} actionType
     * @param {object} data
     * @returns {string} description
     */
    getActionDescription: function(actionType, data) {
      const descriptions = {
        'move': `Move: ${data?.layerName || 'Layer'}`,
        'resize': `Resize: ${data?.layerName || 'Layer'}`,
        'rotate': `Rotate: ${data?.layerName || 'Layer'}`,
        'scale': `Scale: ${data?.layerName || 'Layer'}`,
        'opacity': `Opacity: ${data?.layerName || 'Layer'}`,
        'color': `Color: ${data?.layerName || 'Layer'}`,
        'colorChange': `Color Change: ${data?.layerName || 'Layer'}`,
        'duplicate': `Duplicate: ${data?.originalName || data?.layerName || 'Layer'}`,
        'delete': `Delete: ${data?.layerName || 'Layer'}`,
        'paste': `Paste: ${data?.layerName || 'Layer'}`,
        'flip': `Flip: ${data?.layerName || 'Layer'}`,
        'zoom': `Zoom ${data?.action || ''}`,
        'group': `Group layers`,
        'ungroup': `Ungroup layers`,
        'upload': `Upload image`,
        'background': `Change background`,
        'rename': `Rename: ${data?.oldName || 'Layer'}`
      };
      
      return descriptions[actionType] || `${actionType}: ${data?.action || ''}`;
    },

    /**
     * Undo last action
     */
    undo: function() {
      if (this.undoStack.length === 0) {
        console.log('Nothing to undo');
        return;
      }
      
      // Save current state to redo
      if (this.currentSnapshot !== null) {
        this.redoStack.push(this.currentSnapshot);
      }
      
      // Pop dari undo stack
      const snapshot = this.undoStack.pop();
      this.currentSnapshot = snapshot;
      
      console.log('Undo:', snapshot.description);
      console.log('Undo Count:', this.undoStack.length, 'Redo Count:', this.redoStack.length);
    },

    /**
     * Redo last undone action
     */
    redo: function() {
      if (this.redoStack.length === 0) {
        console.log('Nothing to redo');
        return;
      }
      
      // Save current to undo
      if (this.currentSnapshot !== null) {
        this.undoStack.push(this.currentSnapshot);
      }
      
      // Pop dari redo stack
      const snapshot = this.redoStack.pop();
      this.currentSnapshot = snapshot;
      
      console.log('Redo:', snapshot.description);
      console.log('Undo Count:', this.undoStack.length, 'Redo Count:', this.redoStack.length);
    },

    /**
     * Get history list untuk display
     * @returns {array} array of snapshots
     */
    getHistory: function() {
      return this.undoStack.map((snapshot, index) => ({
        index: index,
        id: snapshot.id,
        timestamp: snapshot.timestamp,
        description: snapshot.description,
        actionType: snapshot.actionType,
        thumbnail: snapshot.thumbnail,
        layerData: snapshot.layerData
      }));
    },

    /**
     * Clear all history
     */
    clearHistory: function() {
      this.undoStack = [];
      this.redoStack = [];
      this.currentSnapshot = null;
      console.log('History cleared');
    },

    /**
     * Get count untuk undo/redo
     */
    getUndoCount: function() {
      return this.undoStack.length;
    },

    getRedoCount: function() {
      return this.redoStack.length;
    }
  };

  // Monitor panel2 controls untuk auto-record history
  // Ini akan merekam setiap perubahan nilai dari input/slider
  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
      const panel2 = document.getElementById('panel2');
      if (panel2) {
        // Monitor input fields untuk change
        panel2.addEventListener('input', function(e) {
          if (e.target.type === 'range' || e.target.type === 'text' || e.target.type === 'number') {
            const inputId = e.target.id;
            const value = e.target.value;
            
            // Determine action type based on input id
            let actionType = 'edit';
            let actionName = '';
            
            if (inputId.includes('opacity')) actionType = 'opacity', actionName = 'Opacity changed';
            else if (inputId.includes('rotation') || inputId === 'rotationControl') actionType = 'rotate', actionName = 'Rotation changed';
            else if (inputId.includes('scale')) actionType = 'scale', actionName = 'Scale changed';
            else if (inputId.includes('Coord') || inputId.includes('xCoord') || inputId.includes('yCoord')) actionType = 'move', actionName = 'Position changed';
            else if (inputId.includes('width') || inputId.includes('height')) actionType = 'resize', actionName = 'Size changed';
            else if (inputId.includes('layerName')) actionType = 'rename', actionName = 'Renamed';
            
            // Record after small delay untuk menghindari terlalu banyak records
            clearTimeout(e.target._recordTimeout);
            e.target._recordTimeout = setTimeout(function() {
              if (typeof window.HistoryManager !== 'undefined') {
                window.HistoryManager.recordAction(actionType, {
                  layerName: selected ? (selected.layerName || selected.name) : 'Layer',
                  inputId: inputId,
                  value: value,
                  action: actionName
                });
              }
            }, 300);
          }
        }, true);

        // Monitor checkbox changes (flip)
        panel2.addEventListener('change', function(e) {
          if (e.target.type === 'checkbox') {
            const checkboxId = e.target.id;
            if (checkboxId.includes('flip')) {
              if (typeof window.HistoryManager !== 'undefined') {
                window.HistoryManager.recordAction('flip', {
                  layerName: selected ? (selected.layerName || selected.name) : 'Layer',
                  checkboxId: checkboxId,
                  checked: e.target.checked,
                  action: 'Flipped'
                });
              }
            }
          }
        }, true);
      }
    }, 500);
  });

  console.log('✓ HistoryManager initialized');

})();
