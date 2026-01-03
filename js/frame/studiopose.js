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

  // ========== DAFTAR SCRIPT YANG AKAN DIMUAT ==========
  const scriptsToLoad = [
    'js/studiocharacter/layer.js',
    'js/studiocharacter/studiopose.js',
    'js/studiocharacter/splitter.js',
    'js/studiocharacter/background.js',
    'js/studiocharacter/opacity.js',
    'js/studiocharacter/selector.js',
    'js/studiocharacter/key.js',
    'js/studiocharacter/sensivity.js',
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
<input type="file" id="imageUpload" accept="image/*" style="display:none" onchange="addImage(event)">
<button onclick="document.getElementById('imageUpload').click()">Tambahkan Sisipan</button>
  `;

  // ========== CSS STYLING (Match dengan studiopose.html) ==========
  const styleEl = document.createElement('style');
  styleEl.innerHTML = `
/* Gaya untuk garis splitter */
#splitter {
    position: absolute;
    width: 100%;
    height: 10px; /* Atur tinggi garis splitter */
    background-color: blue;
    cursor: ns-resize; /* Ubah kursor saat di atas garis splitter */
}

body, html {
    margin: 0;
    padding: 0;
    height: 100%;
    overflow: hidden;
}

.studiopose-frame {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    font-family: Arial, sans-serif;
    overflow: hidden;
}

.studiopose-frame .container {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    flex: 1;
    position: relative;
}

.panel1, .panel2 {
    margin: 0;
    background: none;
    background-size: cover;
    height: 100%;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    position: relative;
}

.studiopose-frame #panel1 {
    flex: 1;
    background: #f5f5f5;
    border: 1px solid #ddd;
    overflow: auto;
    position: relative;
}

.studiopose-frame #panel2 {
    flex: 1;
    background: white;
    border-top: 1px solid #ddd;
    overflow-y: auto;
    overflow-x: hidden;
}

.panel2 {
    position: absolute;
    bottom: 0px;
    left: 0px;
    right: 0px;
}

#imageUpload1, #imageUpload2 {
    margin-bottom: 10px;
}

#imageUpload1,
#imageUpload2 {
    margin-bottom: 20px;
}

.input-container {
    width: 100%;
    height: calc(100% - 5px); /* Atur tinggi panel dengan CSS Grid */
    overflow: auto;
}

/* Menonaktifkan pemilihan teks pada semua elemen kecuali input */
body *:not(input) {
    user-select: none;
}

/* Gaya tambahan untuk input */
input {
    /* Pastikan untuk memungkinkan pemilihan teks di dalam input */
    user-select: text;
}

.layer {
    position: absolute;
    left: 0px;
    top: 0px;
    z-index: 0;
}

.layer > :not(:first-child) {
    position: absolute;
    top: 0;
    left: 0;
}

.layer.selected {
    outline: 1px solid blue;
}

#rotationControl {
    width: 200px;
}

#rotationIndicator {
    text-align: center;
    margin-top: 5px;
}

/* Gaya untuk Selector */
.selection-box {
    position: absolute;
    z-index: 999;
    border: 1px solid #007bff;
    background-color: rgba(0, 123, 255, 0.3);
}

/* Input boxes */
#xCoord {
    width: 200px;
    height: 50px;
    border-radius: 10px;
    border: 5px solid green;
    background-color: lightgreen;
    font-size: 22px;
}

#yCoord {
    width: 200px;
    height: 50px;
    border-radius: 10px;
    border: 5px solid blue;
    background-color: lightblue;
    font-size: 22px;
}

/* Common style for other input boxes */
input[type="text"]:not(#xCoord):not(#yCoord) {
    width: 200px;
    height: 50px;
    border-radius: 10px;
    border: 5px solid black;
    font-size: 22px;
}

/* Button styles */
.button {
    border: 5px solid black;
    border-radius: 10px;
    font-size: 22px;
    cursor: pointer;
    width: 200px;
    height: 50px;
    background-color: lightcoral;
}

.button:hover {
    background-color: coral;
}

.button:active {
    background-color: red;
}

#studio-loading {
    position: absolute;
    inset: 0;
    background: white;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    font-size: 28px;
    color: #5E6CC9;
    z-index: 99999;
    gap: 20px;
}

#studio-loading small {
    font-size: 14px;
    color: #666;
}
  `;
  document.head.appendChild(styleEl);

  // ========== FUNGSI INIT ==========
  function init(container) {
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

      // Hapus loading indicator
      if (loading.parentNode) {
        loading.remove();
      }
      console.log('✓✓✓ Gacha Design Studio siap! ✓✓✓');
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