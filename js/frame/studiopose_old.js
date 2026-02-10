// js/frame/studiopose.js
// FRAME LOADER IFRAME - Versi fix layout: initial split 70% panel1 + 30% panel2 (canvas atas lebih besar seperti studio editor biasa)
// Perbaikan utama:
// ✅ Initial height di-set secara eksplisit setelah load (panel1 = 70%, panel2 = ~30% - splitter)
// ✅ Ini membuat panel1 tinggi (canvas besar) & panel2 cukup luas untuk semua kontrol tanpa terlalu kecil/terlimit
// ✅ Tetap 100% sama seperti HTML asli (script eksternal dimuat natural, handler inline jalan)
// ✅ Loading screen tetap ada & otomatis hilang
// ✅ splitter.js tetap bisa drag dari posisi initial ini (persis seperti HTML asli jika ada initial di sana)
(function () {
  // ========== FULL HTML STRING ==========
  const fullHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title id="title">Studio Character - Gacha Design Studio</title>
    <link rel="icon" type="image/png" href="assets/icon.png">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body, html {
            width: 100%;
            height: 100%;
            overflow: hidden;
        }

        /* Main container - horizontal layout */
        .main-container {
            display: flex;
            width: 100%;
            height: 100%;
            position: relative;
        }

        /* Framework container (Panel3) */
        .panel3.framework-container {
            background: none;
            background-size: cover;
            overflow: auto;
            flex-shrink: 0;
            border-right: 1px solid #ccc;
            position: relative;
            display: none;
            width: 0;
            min-height: 100%;
        }

        /* Horizontal splitter */
        .splitter-horizontal {
            width: 5px;
            height: 100%;
            background-color: #999;
            cursor: ew-resize;
            z-index: 20;
            flex-shrink: 0;
            display: none;
        }

        .splitter-horizontal:hover {
            background-color: #666;
        }

        /* Panel group - flex container untuk panel1 dan panel2 */
        .panel-group {
            display: flex;
            flex-direction: column;
            flex: 1;
            width: 100%;
            height: 100%;
            position: relative; /* Important for absolute positioning of panel1 dan panel2 */
            min-height: 0;
        }

        /* Panel1 - UNLIMITED content canvas FULL SIZE */
        .panel1.container {
            margin: 0;
            padding: 0;
            background: none;
            background-size: cover;
            width: 100%;
            height: 100%;
            flex: 1; /* Take all available space */
            overflow: auto; /* Scrollable jika content melebihi */
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            display: flex;
            flex-direction: column;
            box-sizing: border-box;
            z-index: 1; /* Behind panel2 */
        }

        /* Vertical splitter */
        #splitter {
            width: 100%;
            height: 10px;
            background-color: #999;
            cursor: ns-resize;
            z-index: 10;
            flex-shrink: 0;
            position: absolute;
            bottom: 120px; /* Adjust based on panel2 height */
            left: 0;
            right: 0;
        }

        #splitter:hover {
            background-color: #666;
        }

        /* Panel2 - Controls panel OVERLAY di atas panel1 */
        .panel2.input-container {
            margin: 0;
            padding: 0;
            background: none;
            background-size: cover;
            width: 100%;
            height: auto;
            overflow-y: auto;
            max-height: 100%; /* Maksimal viewport height */
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            display: flex;
            flex-direction: column;
            align-items: initial;
            justify-content: initial;
            box-sizing: border-box;
            z-index: 20; /* Di atas panel1 */
        }
    </style>
</head>
<body>

    <!-- Main layout container -->
    <div class="main-container" id="mainContainer">
        <!-- Panel kiri: Panel3 (Framework) -->
        <div class="panel3 framework-container" id="panel3" style="display: none; width: 0%;">
        </div>

        <!-- Splitter horizontal (Panel3 - Panel1/2) -->
        <div id="splitterH" class="splitter-horizontal"></div>

        <!-- Panel tengah: Panel1 (Canvas) dan Panel2 (Controls) -->
        <div class="panel-group" id="panelGroup">
            <!-- Panel atas -->
            <div class="panel1 container" id="panel1">
            </div>

            <!-- Panel bawah -->
            <div class="panel2 input-container" id="panel2">
        
<!-- Tombol arah -->
<label for="zoomSlider">Zoom Panel1:</label>
<input type="range" id="zoomSlider" min="0" max="10000" step="1" value="100" oninput="handleZoom(this.value)">
<input type="text" id="zoomInput" oninput="handleZoomInput(this.value)">
<label for="sensitivitySlider">Sensitivitas:</label>
<input type="range" id="sensitivitySlider" min="0.1" max="100" step="0.1" value="0.1" oninput="handleSensitivity(this.value)">
<input type="text" id="sensitivityInput" readonly>
<button class="button" id="move-up" onmousedown="startMove('up')" ontouchstart="startMove('up')">🔼</button>
        <button class="button" id="move-down" onmousedown="startMove('down')" ontouchstart="startMove('down')">🔽</button>
        <button class="button" id="move-left" onmousedown="startMove('left')" ontouchstart="startMove('left')">◀️️</button>
        <button class="button" id="move-right" onmousedown="startMove('right')" ontouchstart="startMove('right')">▶️️</button>

        <button id="openFrameworkBtn" onclick="toggleFrameworkPanel()" style="background-color: #ff9800; color: white;">📂 Buka Kerangka</button>

        <input type="file" id="imageUpload1" accept="image/*">
        <button onclick="setBackground('panel1')">Setel background panel atas</button>
        <input type="file" id="imageUpload2" accept="image/*">
        <button onclick="setBackground('panel2')">Setel background panel bawah</button>
        <label for="characterName">Nama Karakter:</label>
        <input type="text" id="characterName" oninput="handleCharacterName(this.value)">
        
        <input type="file" id="imageUpload3" accept="image/*">
        <button onclick="setBackground('panel3')">Setel background kerangka</button>
        
        <label for="opacitySlider1">Opasitas Panel1:</label>
        <input type="range" id="opacitySlider1" class="opacitySlider" min="0" max="100" value="100" oninput="setOpacity('panel1')">
        <input type="text" id="opacityInput1" class="opacityInput" readonly>

        <label for="opacitySlider2">Opasitas Panel2:</label>
        <input type="range" id="opacitySlider2" class="opacitySlider" min="0" max="100" value="100" oninput="setOpacity('panel2')">
        <input type="text" id="opacityInput2" class="opacityInput" readonly>

        <label for="opacitySlider3">Opasitas Panel3 (Kerangka):</label>
        <input type="range" id="opacitySlider3" class="opacitySlider" min="0" max="100" value="100" oninput="setOpacity('panel3')">
        <input type="text" id="opacityInput3" class="opacityInput" readonly>

        <label for="centerOriginToggle">
            <input type="checkbox" id="centerOriginToggle" onchange="toggleCenterOrigin(this.checked)">
            Pusatkan Origin (0,0) ke Tengah Layar
        </label>

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
        
        <label for="skewXControl">Skew X:</label>
        <input type="text" id="skewXControl" placeholder="0" oninput="handleSkewX(this.value)">
        <input type="range" id="skewXSlider" min="-45" max="45" value="0" oninput="handleSkewXSlider(this.value)">
        
        <label for="skewYControl">Skew Y:</label>
        <input type="text" id="skewYControl" placeholder="0" oninput="handleSkewY(this.value)">
        <input type="range" id="skewYSlider" min="-45" max="45" value="0" oninput="handleSkewYSlider(this.value)">
        
        <button onclick="moveLayerUp()">Naikkan</button>
        <button onclick="moveLayerDown()">Turunkan</button>
        <button onclick="exportAsSVG()">Ekspor sebagai SVG</button>
        <input type="text" id="svgFileName" placeholder="Nama file SVG">
        <button onclick="exportAsHTML()">Ekspor sebagai HTML</button>
        <input type="text" id="htmlFileName" placeholder="Nama file HTML">
        
        <br>
        <button id="toggleSelectorBtn">Nyalakan Seleksi</button>
        <button id="groupBtn" onclick="groupSelectedLayer()">Grupkan</button>
        <button id="ungroupBtn" onclick="ungroupSelectedLayer()">Pisahkan Grup</button>
        <button id="ungroupSrcBtn" onclick="ungroupSrcLayers()">Pisahkan Src</button>
        <button id="mergeBtn" onclick="mergeSelectedLayersSrc()">Gabung Src</button>
        <button id="duplicateBtn" onclick="duplicateSelectedLayers()">Duplikasi</button>
        <button id="copyBtn" onclick="copySelectedLayers()">Salin</button>
        <button id="pasteBtn" onclick="pasteCopiedLayers()">Tempel</button>
        <button id="deleteBtn" onclick="deleteSelectedLayer()">Hapus Lapisan</button>
        <button id="resetBtn" onclick="resetStudio()" style="background-color: #ff6b6b;">Reset Studio</button>
        
        <!-- Shortcut dan History Buttons -->
        <div style="margin-top: 10px; padding: 10px; border-top: 2px solid #ddd; border-bottom: 2px solid #ddd;">
          <button id="undoBtn" onclick="if(typeof window.HistoryManager !== 'undefined') window.HistoryManager.undo()" title="Ctrl+Z" style="background-color: #5cb85c; color: white;">↶ Undo</button>
          <button id="redoBtn" onclick="if(typeof window.HistoryManager !== 'undefined') window.HistoryManager.redo()" title="Ctrl+Y" style="background-color: #5cb85c; color: white;">↷ Redo</button>
          <button id="historyBtn" onclick="if(typeof window.openHistoryWindow !== 'undefined') window.openHistoryWindow()" title="View Edit History" style="background-color: #0275d8; color: white;">📋 History</button>
        </div>
        
        <button id="settingsBtn" onclick="openSettingsWindow()" style="background-color: #4a5ba7; color: white;">⚙️ Setelan</button>
        
        <input type="file" id="svgUpload" accept=".svg" multiple style="display:none" onchange="addImage(event)">
        <button onclick="document.getElementById('svgUpload').click()">Tambahkan SVG</button>
        <input type="file" id="imageUpload" accept="image/*" multiple style="display:none" onchange="addImage(event)">
        <button onclick="document.getElementById('imageUpload').click()">Tambahkan Sisipan</button>
        
        <!-- Layer SRC Manager Container -->
        <div id="menusrcContainer" style="margin-top: 15px; border-top: 2px solid #ddd; padding-top: 15px;"></div>
        
        <!-- Child Layers Manager Container -->
        <div id="menulayerContainer" style="margin-top: 15px; border-top: 2px solid #333; padding-top: 15px;"></div>
            </div>

            <!-- Garis splitter vertikal (Panel1 - Panel2) -->
            <div id="splitter" class="splitter-vertical"></div>
        </div>
    </div>

    <!-- Skrip -->
    <script src="js/windowhandler.js"></script>
    <script src="js/mainmenu/studiopose.js"></script>
    <script src="js/studiocharacter/layer.js"></script>
    <script src="js/studiocharacter/history.js"></script>
    <script src="js/studiocharacter/historywindow.js"></script>
    <script src="js/studiocharacter/function.js"></script>
    <script src="js/studiocharacter/studiopose.js"></script>
    <script src="js/studiocharacter/textshape.js"></script>
    <script src="js/studiocharacter/pausestudio.js"></script>
    <script src="js/studiocharacter/bgm.js"></script>
    <script src="js/studiocharacter/splitter.js"></script>
    <script src="js/studiocharacter/background.js"></script>
    <script src="js/studiocharacter/opacity.js"></script>
    <script src="js/studiocharacter/selector.js"></script>
    <script src="js/studiocharacter/key.js"></script>
    <script src="js/studiocharacter/sensivity.js"></script>
    <script src="js/studiocharacter/upload.js"></script>
    <script src="js/studiocharacter/export.js"></script>
    <script src="js/studiocharacter/layersrcmanager.js"></script>
    <script src="js/studiocharacter/menulayer.js"></script>
    <script src="js/studiocharacter/bgconfig.js"></script>
    <script src="js/studiocharacter/framework.js"></script>
    <!-- Skrip -->

    <script>
    // ========== PANEL3 HANDLER ==========
    // Toggle Framework Panel visibility dan horizontal splitter
    function toggleFrameworkPanel() {
        const panel3 = document.getElementById('panel3');
        const panelGroup = document.getElementById('panelGroup');
        const splitterH = document.getElementById('splitterH');
        const panel1 = document.getElementById('panel1');
        const mainContainer = document.getElementById('mainContainer');
        
        if (panel3.style.display === 'none' || panel3.offsetWidth === 0) {
            // Show panel3 - panel1 akan didorong/pushed dan bisa grow
            panel3.style.display = 'block';
            panel3.style.width = '200px'; // Default width
            panelGroup.style.flex = '1';
            splitterH.style.display = 'block';
            // Ensure panel1 can grow when panel3 is shown
            panel1.style.minHeight = '0';
        } else {
            // Hide panel3 - panel1 bisa unlimited growth
            panel3.style.width = '0%';
            panel3.style.display = 'none';
            splitterH.style.display = 'none';
            // Allow panel1 to grow unlimited when panel3 is hidden
            panel1.style.minHeight = 'auto';
        }
    }

    // Initialize splitter for panel3 (horizontal - left to right)
    document.addEventListener('DOMContentLoaded', function() {
        const splitterH = document.getElementById('splitterH');
        const panel3 = document.getElementById('panel3');
        const panel1 = document.getElementById('panel1');
        const mainContainer = document.getElementById('mainContainer');
        let isDraggingH = false;

        if (splitterH && mainContainer) {
            splitterH.addEventListener('mousedown', function(e) {
                isDraggingH = true;
                document.addEventListener('mousemove', handleHorizontalDrag);
                document.addEventListener('mouseup', stopHorizontalDrag);
            });

            splitterH.addEventListener('touchstart', function(e) {
                isDraggingH = true;
                document.addEventListener('touchmove', handleHorizontalDrag, { passive: false });
                document.addEventListener('touchend', stopHorizontalDrag);
            });

            function handleHorizontalDrag(e) {
                if (!isDraggingH) return;
                
                let clientX;
                if (e.touches && e.touches.length > 0) {
                    clientX = e.touches[0].clientX;
                } else if (e.clientX) {
                    clientX = e.clientX;
                } else {
                    return;
                }
                
                const containerRect = mainContainer.getBoundingClientRect();
                const newWidth = clientX - containerRect.left;
                const minWidth = 0;
                const maxWidth = containerRect.width; // Unlimited - can expand to screen edge
                
                const width = Math.max(minWidth, Math.min(newWidth, maxWidth));
                panel3.style.width = width + 'px';
                
                // Check if width is approximately 0, if so hide the panel
                if (width < 10) {
                    panel3.style.width = '0px';
                }
            }

            function stopHorizontalDrag() {
                isDraggingH = false;
                document.removeEventListener('mousemove', handleHorizontalDrag);
                document.removeEventListener('mouseup', stopHorizontalDrag);
                document.removeEventListener('touchmove', handleHorizontalDrag);
                document.removeEventListener('touchend', stopHorizontalDrag);
                
                // If panel3 width is 0, hide it completely
                if (panel3.offsetWidth < 10) {
                    panel3.style.display = 'none';
                    splitterH.style.display = 'none';
                    // Allow panel1 to grow unlimited when panel3 is completely hidden
                    panel1.style.minHeight = 'auto';
                }
            }
        }
    });

    // Update origin offset on resize if centered
    window.addEventListener('resize', function() {
        if (isOriginCentered) {
            // Re-apply transform dengan ukuran baru
            if (window.parent && window.parent.postMessage) {
                window.parent.postMessage({
                    type: 'originChanged',
                    centered: true
                }, '*');
            }
        }
    });

    // ========== CENTER ORIGIN TOGGLE ==========
    let isOriginCentered = false;
    let centerOffsetX = 0;
    let centerOffsetY = 0;

    function toggleCenterOrigin(checked) {
        console.log('toggleCenterOrigin called with:', checked);
        // Kirim pesan ke parent window untuk toggle transform
        if (window.parent && window.parent.postMessage) {
            window.parent.postMessage({
                type: 'originChanged',
                centered: checked
            }, '*');
        }
        
        isOriginCentered = checked;
    }

    // Update offset on resize if centered
    window.addEventListener('resize', function() {
        if (isOriginCentered) {
            console.log('Resize detected, re-sending originChanged');
            if (window.parent && window.parent.postMessage) {
                window.parent.postMessage({
                    type: 'originChanged',
                    centered: true
                }, '*');
            }
        }
    });

    </script>
</html>`;

  // ========== INIT FUNCTION ==========
  function init(container) {
    container.innerHTML = '';

    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.top = '0';
    iframe.style.left = '0';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.style.background = 'white';

    iframe.srcdoc = fullHTML;

    container.appendChild(iframe);

    // Simpan referensi iframe untuk akses dari parent
    window.studioIframe = iframe;

    const cleanup = () => {
      if (iframe.parentNode) iframe.remove();
      window.removeEventListener('studiooverlay:hide', cleanup);
    };
    window.addEventListener('studiooverlay:hide', cleanup);
  }

  // ========== REGISTER ==========
  if (typeof window.registerStudioFrame === 'function') {
    window.registerStudioFrame('studiopose', init);
  } else {
    window.__pendingStudioPose = init;
  }

  console.log('✓ Studio Pose Frame (iframe) ready!');
})();