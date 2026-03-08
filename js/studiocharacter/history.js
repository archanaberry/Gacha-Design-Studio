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

// history.js - Undo/Redo History Manager (Recursive & Optimized)

(function () {

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
     * @param {object} data - Data tambahan (opsional)
     */
    recordAction: function (actionType, data) {
      // Create snapshot dari state saat ini (FULL Recursive State)
      const snapshot = this.createSnapshot(actionType, data);

      // Simple Redundancy Check: compare serialized JSON for equality
      if (this.currentSnapshot) {
        const newState = JSON.stringify(snapshot.state);
        const oldState = JSON.stringify(this.currentSnapshot.state);
        if (newState === oldState) {
          console.log(`[History] Action skipped (No state change): ${actionType}`);
          return;
        }
      }

      // Clear redo stack ketika action baru dilakukan
      this.redoStack = [];

      // Add ke undo stack
      this.undoStack.push(snapshot);

      // Limit history size
      if (this.undoStack.length > this.maxHistory) {
        this.undoStack.shift();
      }

      // Update current snapshot pointer
      this.currentSnapshot = snapshot;

      console.log(`[History] Action recorded: ${actionType} (${snapshot.description})`);
    },

    /**
     * Create snapshot dari current state (Menggunakan serialization logic dari export.js)
     * @param {string} actionType
     * @param {object} data
     * @returns {object} snapshot object
     */
    createSnapshot: function (actionType, data) {
      const timestamp = new Date();

      // 1. Capture ALL layers data recursively using export.js helper
      // This ensures we get specific properties, child layers, etc. exactly like .gss export
      let allLayersData = [];
      if (typeof window.layers !== 'undefined' && window.getSerializedLayerData) {
        allLayersData = window.layers.map(layer => window.getSerializedLayerData(layer));
      } else {
        console.warn('[History] window.layers or getSerializedLayerData not available');
      }

      // 2. Capture Background state
      let background = null;
      const panel1 = document.getElementById('panel1') || document.getElementById('panel1-root');
      if (panel1 && panel1.style.backgroundImage) {
        background = panel1.style.backgroundImage;
      }

      // 3. Create lightweight thumbnail (SVG string)
      // Generates a simple SVG representation of the current layers for the UI list
      const thumbnail = this.generateThumbnail(allLayersData);

      return {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: timestamp,
        actionType: actionType,
        actionData: data,
        state: {
          layers: allLayersData,
          background: background
        },
        thumbnail: thumbnail,
        description: this.getActionDescription(actionType, data)
      };
    },

    /**
     * Generate lightweight SVG thumbnail from layer data
     * @param {Array} layersData 
     * @returns {string} Data URL of SVG
     */
    generateThumbnail: function (layersData) {
      try {
        let svgContent = '';

        // Helper to recursively flatten and draw
        const processLayer = (layer, offsetX = 0, offsetY = 0, parentRotation = 0, parentScale = 1) => {
          const options = layer.options || {};
          const lx = (options.x || options.posX || 0);
          const ly = (options.y || options.posY || 0);
          const rotation = (options.rotation || 0);
          const scale = (options.scale || 1);
          const minX = options.minX || 0;
          const minY = options.minY || 0;

          // Absolute position/transform relative to parent
          // Mimic Layer.js: container is at posX + minX
          const absX = offsetX + lx + minX;
          const absY = offsetY + ly + minY;

          // Draw current layer srcs
          if (layer.src && Array.isArray(layer.src)) {
            layer.src.forEach((src, idx) => {
              if (src) {
                const sPosX = options[`posX${idx}`] || 0;
                const sPosY = options[`posY${idx}`] || 0;
                const sRotation = options[`rotation${idx}`] || 0;
                const sScale = options[`scale${idx}`] || 1;
                const sColor = options[`color${idx}`] || options.color;
                const sOpacity = options[`opacity${idx}`] !== undefined ? options[`opacity${idx}`] : (options.opacity || 1);

                // Mimic Layer.js: images are at posXForSrc - minX (relative to container)
                const finalX = absX + (sPosX - minX);
                const finalY = absY + (sPosY - minY);

                // For thumbnails, we use a simple representation
                // Filters in SVG for color tinting:
                let filter = '';
                if (sColor) {
                  // Simple hack: use a colored rect if it's too complex, 
                  // or just a filter if browser supports it in data URLs
                  // We'll use a colored overlay or just ignore for THUMBNAIL if too complex, 
                  // but let's try to add a colored box behind or similar tracker
                }

                if (!src.startsWith('data:')) {
                  svgContent += `<image href="${src}" x="${finalX}" y="${finalY}" width="${options[`width${idx}`] || layer.width || 50}" height="${options[`height${idx}`] || layer.height || 50}" opacity="${sOpacity}" transform="rotate(${rotation + sRotation}, ${finalX}, ${finalY}) scale(${scale * sScale})"/>`;
                  if (sColor) {
                    // Overlay color for thumbnail hint
                    svgContent += `<rect x="${finalX}" y="${finalY}" width="${options[`width${idx}`] || layer.width || 50}" height="${options[`height${idx}`] || layer.height || 50}" fill="${sColor}" fill-opacity="0.3" transform="rotate(${rotation + sRotation}, ${finalX}, ${finalY})"/>`;
                  }
                } else {
                  svgContent += `<rect x="${finalX}" y="${finalY}" width="${options[`width${idx}`] || layer.width || 50}" height="${options[`height${idx}`] || layer.height || 50}" fill="${sColor || '#ccc'}" stroke="#999" fill-opacity="0.5"/>`;
                }
              }
            });
          }

          // Process children
          if (layer.childLayers && Array.isArray(layer.childLayers)) {
            layer.childLayers.forEach(child => processLayer(child, absX - minX, absY - minY, rotation, scale));
          }
        };

        layersData.forEach(l => processLayer(l));

        // Wrap in SVG
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 1000 1000" style="background:#f0f0f0;">${svgContent}</svg>`;
        return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
      } catch (e) {
        console.warn('[History] Thumbnail generation failed', e);
        return null;
      }
    },

    /**
     * Get description untuk action
     */
    getActionDescription: function (actionType, data) {
      const descriptions = {
        'move': `Move: ${data?.layerName || 'Layer'}`,
        'resize': `Resize: ${data?.layerName || 'Layer'}`,
        'rotate': `Rotate: ${data?.layerName || 'Layer'}`,
        'scale': `Scale: ${data?.layerName || 'Layer'}`,
        'opacity': `Opacity Change`,
        'color': `Color Change`,
        'flip': `Flip Layer`,
        'duplicate': `Duplicate Layer`,
        'delete': `Delete Layer`,
        'paste': `Paste Layer`,
        'group': `Group Selection`,
        'ungroup': `Ungroup`,
        'import': `Import Scene`,
        'baseline': `Initial Scene`
      };

      return descriptions[actionType] || `${actionType}`;
    },

    /**
     * Record initial state as a baseline
     */
    recordBaseline: function () {
      if (this.undoStack.length === 0) {
        this.recordAction('baseline');
        console.log('[History] Baseline recorded');
      }
    },

    /**
     * Undo last action
     */
    undo: function () {
      if (this.undoStack.length === 0) {
        console.log('[History] Nothing to undo');
        return;
      }

      // 1. Push current ACTUAL state to redo stack before restoring old state
      // This ensures we can "Redo" to get back to where we were before Undo
      if (this.currentSnapshot) {
        this.redoStack.push(this.createSnapshot('redo_state'));
      } else {
        // If no current snapshot tracked, create one from current state
        this.redoStack.push(this.createSnapshot('original_state'));
      }

      // 2. Pop passed state
      const snapshot = this.undoStack.pop();
      if (!snapshot) return;

      // 3. Restore State
      this.restoreState(snapshot);

      // Update pointer
      this.currentSnapshot = snapshot;

      console.log(`[History] Undo performed: ${snapshot.description}`);
    },

    /**
     * Redo last undone action
     */
    redo: function () {
      if (this.redoStack.length === 0) {
        console.log('[History] Nothing to redo');
        return;
      }

      // 1. Push current state to undo
      if (this.currentSnapshot) {
        this.undoStack.push(this.currentSnapshot);
      }

      // 2. Pop future state
      const snapshot = this.redoStack.pop();

      // 3. Restore
      this.restoreState(snapshot);
      this.currentSnapshot = snapshot;

      console.log(`[History] Redo performed: ${snapshot.description}`);
    },

    /**
     * Restore studio state from a snapshot
     * Uses loadStudioScene from export.js to reconstruct the tree
     */
    restoreState: function (snapshot) {
      if (!snapshot || !snapshot.state) return;

      console.log('[History] Restoring state...', snapshot.id);

      try {
        // Restore Layers
        // We use loadStudioScene which handles clearing and rebuilding
        if (typeof loadStudioScene === 'function') {
          // Pass null for assets because they are embedded in src/options in our optimization
          // Pass background from state
          const bg = snapshot.state.background ? snapshot.state.background.replace(/url\(['"]?(.*?)['"]?\)/, '$1') : null;

          loadStudioScene(snapshot.state.layers, null, bg);
        } else {
          console.error('[History] loadStudioScene function not found!');
        }

        // Restore Selection if possible (optional)
        if (typeof deselectAllLayersUnified === 'function') deselectAllLayersUnified();

      } catch (e) {
        console.error('[History] Failed to restore state:', e);
      }
    },

    /**
     * Open Preview Window for a snapshot
     * Uses WindowHandler to show a "Mini Iframe" style preview
     */
    openPreviewWindow: function (historyIndexOrSnapshot) {
      let snapshot = historyIndexOrSnapshot;
      if (typeof historyIndexOrSnapshot === 'number') {
        snapshot = this.undoStack[historyIndexOrSnapshot];
      }

      if (!snapshot) return;

      if (typeof window.openWindow !== 'function') return;

      const previewId = `preview-${snapshot.id}`;

      // Content: A scaled container that renders the layer structure
      // We simulate an iframe using a transform-scaled div since actual iframes are heavy
      const contentVal = `
            <div id="preview-container-${snapshot.id}" 
                 style="width:100%; height:400px; background:#e0e0e0; overflow:hidden; position:relative; border:1px solid #ccc;">
                 <div id="preview-content-${snapshot.id}" 
                      style="width:1280px; height:720px; transform:scale(0.5); transform-origin:0 0; position:absolute;">
                    <!-- Layers will be rendered here -->
                 </div>
            </div>
            <div style="padding:10px; font-size:12px; color:#666;">
               <p>Zoom: Scroll | Pan: Drag (Not implemented in preview yet)</p>
            </div>
        `;

      const winId = window.openWindow({
        title: 'Preview Snapshot',
        content: contentVal,
        width: '680px',
        height: '500px',
        footer: `<button class="footer-btn" onclick="window.closeWindow('${previewId}')">Close Preview</button>`
      });

      // Render layers into the preview container
      setTimeout(() => {
        const container = document.getElementById(`preview-content-${snapshot.id}`);
        if (container && snapshot.state && snapshot.state.layers) {
          // Temporary render helper (simplified version of createLayers)
          this.renderPreviewLayers(container, snapshot.state.layers);
        }
      }, 100);
    },

    /**
     * Render layers into preview container (DOM Only, no behavior)
     */
    renderPreviewLayers: function (container, layers) {
      if (!layers || !Array.isArray(layers)) return;

      layers.forEach(lData => {
        const options = lData.options || {};

        const el = document.createElement('div');
        el.className = 'preview-layer';
        el.style.position = 'absolute';

        // Base Layer Transform
        const lx = options.x || options.posX || 0;
        const ly = options.y || options.posY || 0;
        const rot = options.rotation || 0;
        const scale = options.scale || 1;
        const opacity = options.opacity !== undefined ? options.opacity : 1;
        const minX = options.minX || 0;
        const minY = options.minY || 0;

        // 🔥 Mimic Layer.js: container is at posX + minX
        el.style.left = `${lx + minX}px`;
        el.style.top = `${ly + minY}px`;

        // Use auto if width/height is missing or zero to avoid clipping
        if (lData.width) el.style.width = `${lData.width}px`;
        if (lData.height) el.style.height = `${lData.height}px`;

        el.style.opacity = opacity;

        let transformStr = `rotate(${rot}deg) scale(${scale})`;
        if (options.flipX) transformStr += ' scaleX(-1)';
        if (options.flipY) transformStr += ' scaleY(-1)';
        el.style.transform = transformStr;
        el.style.transformOrigin = 'center center';

        // Content Wrapper for children protection
        const contentWrapper = document.createElement('div');
        contentWrapper.style.position = 'absolute';
        contentWrapper.style.top = '0';
        contentWrapper.style.left = '0';
        contentWrapper.style.width = '100%';
        contentWrapper.style.height = '100%';
        el.appendChild(contentWrapper);

        // Sources (Images)
        if (lData.src && Array.isArray(lData.src)) {
          lData.src.forEach((src, idx) => {
            if (src) {
              const img = document.createElement('img');
              img.src = src;
              img.style.position = 'absolute';

              // Per-Source properties
              const sPosX = (options[`posX${idx}`] || 0) - minX;
              const sPosY = (options[`posY${idx}`] || 0) - minY;
              const sRot = options[`rotation${idx}`] || 0;
              const sScale = options[`scale${idx}`] || 1;
              const sOpacity = options[`opacity${idx}`] !== undefined ? options[`opacity${idx}`] : 1;
              const sColor = options[`color${idx}`] || options.color;

              img.style.left = `${sPosX}px`;
              img.style.top = `${sPosY}px`;
              if (options[`width${idx}`]) img.style.width = `${options[`width${idx}`]}px`;
              if (options[`height${idx}`]) img.style.height = `${options[`height${idx}`]}px`;

              img.style.opacity = sOpacity;

              let sTransform = `rotate(${sRot}deg) scale(${sScale})`;
              if (options[`flipX${idx}`]) sTransform += ' scaleX(-1)';
              if (options[`flipY${idx}`]) sTransform += ' scaleY(-1)';
              img.style.transform = sTransform;

              // Color Tinting
              if (sColor) {
                img.style.filter = `drop-shadow(0 0 0 ${sColor})`;
              }

              contentWrapper.appendChild(img);
            }
          });
        }

        container.appendChild(el);

        // Children (Recursive)
        if (lData.childLayers && lData.childLayers.length > 0) {
          // Pass current absolute offset minus container shift
          this.renderPreviewLayers(contentWrapper, lData.childLayers);
        }
      });
    },

    /**
     * Get history list untuk display
     * @returns {array} array of snapshots
     */
    getHistory: function () {
      // Reverse to show newest on top usually, but index logic depends on UI
      // We'll return full stack
      return this.undoStack.map((snapshot, index) => ({
        index: index,
        id: snapshot.id,
        timestamp: snapshot.timestamp,
        description: snapshot.description,
        actionType: snapshot.actionType,
        thumbnail: snapshot.thumbnail,
        layerData: snapshot.state // expose state for preview
      }));
    },

    /**
     * Clear all history
     */
    clearHistory: function () {
      this.undoStack = [];
      this.redoStack = [];
      this.currentSnapshot = null;
      console.log('[History] Cleared');
      // Re-record baseline if scene is not empty
      if (window.layers && window.layers.length > 0) {
        this.recordBaseline();
      }
    }
  };

  // Monitor panel2 controls untuk flag modification state
  // Ini akan memberitahu sistem bahwa layer telah berubah, dan history akan direkam SAAT DESELECT
  document.addEventListener('DOMContentLoaded', function () {
    setTimeout(function () {
      // Record baseline initial state
      if (window.HistoryManager && typeof window.HistoryManager.recordBaseline === 'function') {
        window.HistoryManager.recordBaseline();
      }

      const panel2 = document.getElementById('panel2');
      if (panel2) {
        // Monitor input fields untuk change
        panel2.addEventListener('input', function (e) {
          if (e.target.type === 'range' || e.target.type === 'text' || e.target.type === 'number' || e.target.type === 'color' || e.target.tagName === 'SELECT') {
            window.currentLayerStateModified = true;
          }
        }, true);

        // Monitor checkbox changes (flip)
        panel2.addEventListener('change', function (e) {
          if (e.target.type === 'checkbox' || e.target.tagName === 'SELECT') {
            window.currentLayerStateModified = true;
          }
        }, true);
      }
    }, 3000);
  });

  console.log('✓ HistoryManager initialized (Recursive Tree Support)');

})();
