// js/frame/studiopose.js
// FRAME LOADER - Memuat semua script studiocharacter dengan proper initialization
// Sistem ini:
// ✅ Memuat script terpisah secara sequential
// ✅ Mencegah duplicate loading
// ✅ Mendeklarasikan semua fungsi yang diperlukan (wrapper references)
// ✅ Menginisialisasi layer dan komponen setelah semua script loaded
// ✅ 100% terisolasi dengan prefix `.studiopose-frame`

(function () {
  // ========== DEKLARASI WRAPPER FUNGSI (akan di-override oleh script yang dimuat) ==========
  
  // Fungsi dari layer.js
  window.Layer = window.Layer || class Layer {};
  window.createLayers = window.createLayers || function() { console.warn('createLayers not yet loaded'); };
  window.createLayerFromObject = window.createLayerFromObject || function() { console.warn('createLayerFromObject not yet loaded'); };
  
  // Fungsi dari studiopose.js
  window.layers = window.layers || [];
  window.selected = window.selected || null;
  
  // Fungsi dari splitter.js
  window.resizePanel = window.resizePanel || function() { console.warn('resizePanel not yet loaded'); };
  window.onMouseMove = window.onMouseMove || function() { console.warn('onMouseMove not yet loaded'); };
  window.onTouchMove = window.onTouchMove || function() { console.warn('onTouchMove not yet loaded'); };
  window.onMouseUp = window.onMouseUp || function() { console.warn('onMouseUp not yet loaded'); };
  window.onMouseDown = window.onMouseDown || function() { console.warn('onMouseDown not yet loaded'); };
  window.onTouchEnd = window.onTouchEnd || function() { console.warn('onTouchEnd not yet loaded'); };
  
  // Fungsi dari background.js
  window.setBackground = window.setBackground || function() { console.warn('setBackground not yet loaded'); };
  window.saveConfig = window.saveConfig || function() { console.warn('saveConfig not yet loaded'); };
  
  // Fungsi dari opacity.js
  window.setOpacity = window.setOpacity || function() { console.warn('setOpacity not yet loaded'); };
  window.setOpacitySlider = window.setOpacitySlider || function() { console.warn('setOpacitySlider not yet loaded'); };
  
  // Fungsi dari selector.js
  window.Selector = window.Selector || class Selector {};
  window.groupSelectedLayers = window.groupSelectedLayers || function() { console.warn('groupSelectedLayers not yet loaded'); };
  window.ungroupSelectedLayers = window.ungroupSelectedLayers || function() { console.warn('ungroupSelectedLayers not yet loaded'); };
  
  // Fungsi dari key.js
  window.updateCoordInput = window.updateCoordInput || function() { console.warn('updateCoordInput not yet loaded'); };
  window.moveLayer = window.moveLayer || function() { console.warn('moveLayer not yet loaded'); };
  window.startMove = window.startMove || function() { console.warn('startMove not yet loaded'); };
  window.stopMove = window.stopMove || function() { console.warn('stopMove not yet loaded'); };
  window.handleXCoord = window.handleXCoord || function() { console.warn('handleXCoord not yet loaded'); };
  window.handleYCoord = window.handleYCoord || function() { console.warn('handleYCoord not yet loaded'); };
  window.handleRotation = window.handleRotation || function() { console.warn('handleRotation not yet loaded'); };
  window.handleScale = window.handleScale || function() { console.warn('handleScale not yet loaded'); };
  window.handleFlipHorizontal = window.handleFlipHorizontal || function() { console.warn('handleFlipHorizontal not yet loaded'); };
  window.handleFlipVertical = window.handleFlipVertical || function() { console.warn('handleFlipVertical not yet loaded'); };
  window.moveLayerUp = window.moveLayerUp || function() { console.warn('moveLayerUp not yet loaded'); };
  window.moveLayerDown = window.moveLayerDown || function() { console.warn('moveLayerDown not yet loaded'); };
  window.deleteSelectedLayer = window.deleteSelectedLayer || function() { console.warn('deleteSelectedLayer not yet loaded'); };
  window.handleLayerName = window.handleLayerName || function() { console.warn('handleLayerName not yet loaded'); };
  window.updateLayerSize = window.updateLayerSize || function() { console.warn('updateLayerSize not yet loaded'); };
  window.handleCharacterName = window.handleCharacterName || function() { console.warn('handleCharacterName not yet loaded'); };
  
  // Fungsi dari sensivity.js
  window.handleSensitivity = window.handleSensitivity || function() { console.warn('handleSensitivity not yet loaded'); };
  
  // Fungsi dari upload.js
  window.addImage = window.addImage || function() { console.warn('addImage not yet loaded'); };
  window.addSVG = window.addSVG || function() { console.warn('addSVG not yet loaded'); };
  
  // Fungsi dari export.js
  window.exportAsSVG = window.exportAsSVG || function() { console.warn('exportAsSVG not yet loaded'); };
  window.exportAsHTML = window.exportAsHTML || function() { console.warn('exportAsHTML not yet loaded'); };
  
  // Fungsi callback dari studiopose.js
  window.onlayerdragstart = window.onlayerdragstart || function() { console.warn('onlayerdragstart not yet loaded'); };

  // ========== HELPER FUNCTION - ASSET UPLOAD KE PANEL1 ==========
  window.handleAssetUploadToPanel = function(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
      const panel1 = document.getElementById('panel1');
      if (!panel1) {
        console.warn('Panel1 not found');
        return;
      }
      
      // Buat element untuk asset
      let elem;
      if (file.type.includes('image')) {
        elem = document.createElement('img');
        elem.src = e.target.result;
      } else if (file.type === 'image/svg+xml' || file.name.endsWith('.svg')) {
        elem = document.createElement('object');
        elem.data = e.target.result;
        elem.type = 'image/svg+xml';
      } else {
        console.warn('File type not supported');
        return;
      }
      
      elem.style.position = 'absolute';
      elem.style.left = '0px';
      elem.style.top = '0px';
      elem.style.maxWidth = '200px';
      elem.style.maxHeight = '200px';
      elem.style.cursor = 'move';
      
      panel1.appendChild(elem);
      console.log('✓ Asset added to panel1:', file.name);
    };
    reader.readAsDataURL(file);
  };

  // ========== DAFTAR SCRIPT YANG AKAN DIMUAT ==========
  const scriptsToLoad = [
    'js/studiocharacter/layer.js',
    'js/studiocharacter/studiopose.js',
    'js/studiocharacter/splitter.js',
    'js/studiocharacter/background.js',
    'js/studiocharacter/opacity.js',
    'js/studiocharacter/selector.js',
    'js/studiocharacter/key.js',
    //'js/studiocharacter/sensivity.js',
    'js/studiocharacter/upload.js',
    'js/studiocharacter/export.js'
  ];

  // ========== HTML UNTUK PANEL2 CONTROLS (Match dengan studiopose.html) ==========
  const panel2HTML = `
<!-- Tombol arah -->
<label for="sensitivitySlider">Sensitivitas:</label>
<input type="range" id="sensitivitySlider" min="0.1" max="100" step="0.1" value="0.1" oninput="handleSensitivity(this.value)">
<input type="text" id="sensitivityInput" readonly>
<button class="button" id="move-up" onmousedown="startMove('up')" ontouchstart="startMove('up')">🔼</button>
<button class="button" id="move-down" onmousedown="startMove('down')" ontouchstart="startMove('down')">🔽</button>
<button class="button" id="move-left" onmousedown="startMove('left')" ontouchstart="startMove('left')">◀️</button>
<button class="button" id="move-right" onmousedown="startMove('right')" ontouchstart="startMove('right')">▶️</button>

<input type="file" id="imageUpload1" accept="image/*">
<button onclick="setBackground('panel1')">Setel background panel atas</button>
<input type="file" id="imageUpload2" accept="image/*">
<button onclick="setBackground('panel2')">Setel background panel bawah</button>
<label for="characterName">Nama Karakter:</label>
<input type="text" id="characterName" oninput="handleCharacterName(this.value)">

<label for="opacitySlider1">Opasitas Panel1:</label>
<input type="range" id="opacitySlider1" class="opacitySlider" min="0" max="100" value="100" oninput="setOpacity('panel1')">
<input type="text" id="opacityInput1" class="opacityInput" readonly>

<label for="opacitySlider2">Opasitas Panel2:</label>
<input type="range" id="opacitySlider2" class="opacitySlider" min="0" max="100" value="100" oninput="setOpacity('panel2')">
<input type="text" id="opacityInput2" class="opacityInput" readonly>

<label for="layerName">Layer:</label>
<input type="text" id="layerName" oninput="handleLayerName(this.value)">
<label for="xCoord">Posisi X:</label>
<input type="text" id="xCoord" oninput="handleXCoord(this.value)">
<label for="yCoord">Posisi Y:</label>
<input type="text" id="yCoord" oninput="handleYCoord(this.value)">
<label for="width">Lebar:</label>
<input type="number" id="width" placeholder="Lebar" oninput="updateLayerSize('width', this.value)">
<label for="height">Tinggi:</label>
<input type="number" id="height" placeholder="Tinggi" oninput="updateLayerSize('height', this.value)">        
<label for="scale">Skala:</label>
<input type="text" id="scale" oninput="handleScale(this.value)">
<label for="flipHorizontal">Flip Horizontal:</label>
<input type="checkbox" id="flipHorizontal" onchange="handleFlipHorizontal(this.checked)">
<label for="flipVertical">Flip Vertical:</label>
<input type="checkbox" id="flipVertical" onchange="handleFlipVertical(this.checked)">
<br>
<label for="rotationControl">Rotate:</label>
<input type="range" id="rotationControl" min="0" max="360" value="0" oninput="handleRotation(this.value)">
<div id="rotationIndicator">0</div>
<button onclick="moveLayerUp()">Naikkan</button>
<button onclick="moveLayerDown()">Turunkan</button>
<button onclick="exportAsSVG()">Ekspor sebagai SVG</button>
<input type="text" id="svgFileName" placeholder="Nama file SVG">
<button onclick="exportAsHTML()">Ekspor sebagai HTML</button>
<input type="text" id="htmlFileName" placeholder="Nama file HTML">

<br>
<button id="toggleSelectorBtn">Nyalakan Seleksi</button>
<button id="groupBtn" onclick="groupSelectedLayers()">Grupkan</button>
<button id="ungroupBtn" onclick="ungroupSelectedLayers()">Pisahkan</button>
<button id="deleteBtn" onclick="deleteSelectedLayer()">Hapus Lapisan</button>

<input type="file" id="svgUpload" accept=".svg" style="display:none" onchange="addSVG(event)">
<button onclick="document.getElementById('svgUpload').click()">Tambahkan SVG</button>
  `;

  // ========== CSS STYLING (Isolated, No Border, No Overflow to Non-Overlay) ==========
  const styleEl = document.createElement('style');
  styleEl.innerHTML = `
/* ===== STUDIOPOSE FRAME STYLES ONLY - ISOLATED ===== */

.studiopose-frame * {
  border-radius: 0 !important;
}

.studiopose-frame {
    display: flex !important;
    flex-direction: column !important;
    width: 100% !important;
    height: 100% !important;
    font-family: Arial, sans-serif !important;
    overflow: hidden !important;
    position: fixed !important;
    inset: 0 !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    margin: 0 !important;
    padding: 0 !important;
    border: none !important;
    border-radius: 0 !important;
    background: transparent !important;
    z-index: 9999 !important;
}

.studiopose-frame .container {
    display: flex !important;
    flex-direction: column !important;
    width: 100% !important;
    height: 100% !important;
    flex: 1 !important;
    position: relative !important;
    margin: 0 !important;
    padding: 0 !important;
    border: none !important;
    border-radius: 0 !important;
}

/* Panel1 - Canvas (NO BORDER, FULL SIZE) */
.studiopose-frame #panel1 {
    flex: 1 !important;
    background: white !important;
    overflow: auto !important;
    position: relative !important;
    margin: 0 !important;
    padding: 0 !important;
    cursor: default !important;
    border: none !important;
    border-radius: 0 !important;
}

/* Panel1 layer styling */
.studiopose-frame #panel1 .layer {
    position: absolute;
    left: 0px;
    top: 0px;
    z-index: 0;
    cursor: move;
    border-radius: 0 !important;
}

.studiopose-frame #panel1 .layer.selected {
    outline: 2px solid blue;
    outline-offset: 0;
}

.studiopose-frame #panel1 .layer > :not(:first-child) {
    position: absolute;
    top: 0;
    left: 0;
}

/* Selection box for multi-select */
.studiopose-frame .selection-box {
    position: absolute;
    z-index: 999;
    border: 2px dashed blue;
    background: rgba(173, 216, 230, 0.5);
    pointer-events: none;
    border-radius: 0 !important;
}

/* Panel2 - Controls (NO BORDER, FULL SIZE) */
.studiopose-frame #panel2 {
    flex: 1 !important;
    background: white !important;
    overflow-y: auto !important;
    overflow-x: hidden !important;
    position: relative !important;
    margin: 0 !important;
    padding: 0 !important;
    border: none !important;
    border-radius: 0 !important;
}

/* Splitter - TETAP SEPERTI ORIGINAL */
.studiopose-frame #splitter {
    height: 10px;
    width: 100%;
    background-color: blue;
    cursor: ns-resize;
    flex-shrink: 0;
    margin: 0;
    padding: 0;
    border: none;
    user-select: none;
}

/* Loading indicator */
.studiopose-frame #studio-loading {
    position: fixed;
    inset: 0;
    background: rgba(255, 255, 255, 0.95);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    font-size: 28px;
    color: #5E6CC9;
    z-index: 99999;
    gap: 20px;
    border: none;
}

.studiopose-frame #studio-loading small {
    font-size: 14px;
    color: #666;
}

/* ===== PANEL2 SPECIFIC STYLES - INPUT BOXES ===== */
.studiopose-frame #panel2 label {
    display: block;
    margin-top: 5px;
    margin-bottom: 3px;
    font-weight: normal;
    font-size: 14px;
}

.studiopose-frame #panel2 #xCoord {
    width: 200px;
    height: 50px;
    border-radius: 10px;
    border: 5px solid green;
    background-color: lightgreen;
    font-size: 22px;
}

.studiopose-frame #panel2 #yCoord {
    width: 200px;
    height: 50px;
    border-radius: 10px;
    border: 5px solid blue;
    background-color: lightblue;
    font-size: 22px;
}

.studiopose-frame #panel2 input[type="text"]:not(#xCoord):not(#yCoord) {
    width: 200px;
    height: 50px;
    border-radius: 10px;
    border: 5px solid black;
    font-size: 22px;
}

.studiopose-frame #panel2 input[type="range"] {
    width: 100px;
}

.studiopose-frame #panel2 .button {
    font-size: 22px;
    cursor: pointer;
    width: 200px;
    height: 50px;
    background-color: lightcoral;
    margin: 5px 0;
}

.studiopose-frame #panel2 .button:hover {
    background-color: coral;
}

.studiopose-frame #panel2 .button:active {
    background-color: red;
}

.studiopose-frame #panel2 #rotationControl {
    width: 200px;
}

.studiopose-frame #panel2 #rotationIndicator {
    text-align: center;
    margin-top: 5px;
}

/* File inputs */
.studiopose-frame #panel2 input[type="file"] {
    margin-bottom: 10px;
}

/* Disable text selection in panel1, allow in panel2 */
.studiopose-frame #panel1 {
    user-select: none;
}

.studiopose-frame #panel2 input,
.studiopose-frame #panel2 textarea {
    user-select: text;
}
  `;
  document.head.appendChild(styleEl);

  // ========== FUNGSI INIT ==========
  function init(container) {
    // track scripts we appended so we can remove them on cleanup
    var _addedScripts = [];
    // Tambah class untuk isolasi styling
    container.classList.add('studiopose-frame');

    // Buat layout dasar (HTML struktur) - Match dengan studiopose.html
    container.innerHTML = `
      <div class="container" style="display: flex; flex-direction: column; width: 100%; height: 100%; position: relative;">
        <div class="panel1 container" id="panel1"></div>
        <div id="splitter"></div>
        <div class="panel2 input-container" id="panel2"></div>
      </div>
    `;

    // Set innerHTML panel2 dengan controls
    document.getElementById('panel2').innerHTML = panel2HTML;

    // Loading indicator
    const loading = document.createElement('div');
    loading.id = 'studio-loading';
    loading.innerHTML = '<div>📦 Memuat Gacha Design Studio...</div><small>Tunggu sebentar ya UwU</small>';
    container.appendChild(loading);

    // ========== SCRIPT LOADER FUNCTION ==========
    const loadScript = (src) => {
      return new Promise((resolve, reject) => {
        // Cek apakah script sudah loaded
        if (document.querySelector(`script[src="${src}"]`)) {
          console.log(`✓ Skip (sudah loaded): ${src}`);
          resolve();
          return;
        }
        
        const script = document.createElement('script');
        script.src = src;
        script.async = false; // Sequential loading
        script.onload = () => {
          console.log(`✓ Loaded: ${src}`);
          // remember scripts we injected (only those we appended now)
          _addedScripts.push(script);
          resolve();
        };
        script.onerror = () => {
          console.warn(`⚠ Gagal load: ${src}`);
          reject(new Error(`Gagal load ${src}`));
        };
        document.head.appendChild(script);
      });
    };

    // ========== LOAD ALL SCRIPTS SEQUENTIALLY ==========
    let chain = Promise.resolve();
    scriptsToLoad.forEach(src => {
      chain = chain
        .then(() => loadScript(src))
        .catch(err => {
          console.error(`Error loading ${src}:`, err);
          // Lanjut ke script berikutnya meski ada error
        });
    });

    chain.then(() => {
      console.log('✓ Semua script loaded, melakukan inisialisasi...');
      
      // ========== ATTACH LAYERS KE PANEL1 ==========
      const panel1 = document.getElementById('panel1');
      if (typeof window.layers !== 'undefined' && Array.isArray(window.layers)) {
        console.log(`Attaching ${window.layers.length} layers ke panel1...`);
        window.layers.forEach((layerData, index) => {
          try {
            const layer = typeof window.createLayerFromObject === 'function'
              ? window.createLayerFromObject(layerData)
              : new window.Layer(layerData.layerName, layerData.src, layerData.options);
            
            if (typeof layer.attach === 'function' && typeof window.onlayerdragstart === 'function') {
              layer.attach(panel1, window.onlayerdragstart);
              console.log(`✓ Layer ${index}: ${layerData.layerName} attached`);
            }
          } catch (err) {
            console.warn(`⚠ Gagal attach layer ${index}:`, err);
          }
        });
      } else {
        console.warn('⚠ window.layers tidak ditemukan atau bukan array');
      }

      // ========== INIT SELECTOR JIKA TERSEDIA ==========
      if (typeof window.Selector === 'function') {
        try {
          const toggleBtn = document.getElementById('toggleSelectorBtn');
          if (toggleBtn) {
            new window.Selector(panel1, toggleBtn);
            console.log('✓ Selector initialized');
          }
        } catch (err) {
          console.warn('⚠ Gagal init Selector:', err);
        }
      }

      // ========== INIT SPLITTER JIKA TERSEDIA ==========
      if (typeof window.onMouseDown === 'function') {
        try {
          const splitter = document.getElementById('splitter');
          if (splitter) {
            splitter.addEventListener('mousedown', (e) => window.onMouseDown(e));
            splitter.addEventListener('touchstart', (e) => window.onMouseDown(e));
            console.log('✓ Splitter initialized');
          }
        } catch (err) {
          console.warn('⚠ Gagal init Splitter:', err);
        }
      }

      // ========== SETUP ASSET UPLOAD LISTENERS ==========
      try {
        const imageUploadInput = document.getElementById('imageUpload1');
        if (imageUploadInput) {
          imageUploadInput.addEventListener('change', (e) => {
            const files = e.target.files;
            if (files && files.length > 0) {
              const file = files[0];
              const reader = new FileReader();
              
              reader.onload = function(event) {
                const dataURL = event.target.result;
                const img = document.createElement('img');
                img.src = dataURL;
                img.style.position = 'absolute';
                img.style.cursor = 'move';
                img.style.maxWidth = '500px';
                img.style.maxHeight = '500px';
                img.style.top = '50px';
                img.style.left = '50px';
                img.classList.add('layer');
                
                const panel1 = document.getElementById('panel1');
                if (panel1) {
                  panel1.appendChild(img);
                  console.log('✓ Asset uploaded to panel1:', file.name);
                }
              };
              
              reader.onerror = function() {
                console.error('❌ Error reading file:', file.name);
              };
              
              reader.readAsDataURL(file);
            }
          });
          console.log('✓ Asset upload listener initialized');
        }
      } catch (err) {
        console.warn('⚠ Gagal setup asset upload:', err);
      }

      // Hapus loading indicator
      if (loading.parentNode) {
        loading.remove();
      }
      console.log('✓✓✓ Gacha Design Studio siap! ✓✓✓');
      // cleanup handler when overlay is hidden
      const _cleanup = function() {
        try {
          // remove dynamically added script tags
          _addedScripts.forEach(s => { try { s.remove(); } catch (e) {} });
        } catch (e) {}
        // remove any residual container content
        try { container.innerHTML = ''; } catch (e) {}
        // remove this listener after run
        try { window.removeEventListener('studiooverlay:hide', _cleanup); } catch (e) {}
        console.log('✓ Studio Pose Frame cleanup completed');
      };
      window.addEventListener('studiooverlay:hide', _cleanup);
    }).catch(err => {
      console.error('Fatal error:', err);
      if (loading) {
        loading.innerHTML = `<div style="color: red;">❌ Error: ${err.message}</div>`;
      }
    });
  }

  // ========== REGISTER KE OVERLAY SYSTEM ==========
  // Expose init function dan wrapper ke window object
  if (typeof window.registerStudioFrame === 'function') {
    window.registerStudioFrame('studiopose', init);
  } else {
    window.__pendingStudioPose = init;
  }

  // Export reference
  window.__studioPoseFrame = {
    init: init,
    scriptsToLoad: scriptsToLoad,
    panel2HTML: panel2HTML
  };

  console.log('✓ Studio Pose Frame loader ready');
})();