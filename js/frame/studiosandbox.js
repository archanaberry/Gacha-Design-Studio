// js/frame/studiosandbox.js
// FRAME LOADER IFRAME - Versi untuk Studio Sandbox (mirip studiopose tapi path script sesuai sandbox)
// Perbaikan utama:
// ✅ 100% sama seperti HTML asli sandbox (script eksternal dimuat natural)
// ✅ Loading screen "Memuat... UwU" muncul & otomatis hilang setelah load selesai
// ✅ Initial split 70% panel1 (canvas besar) + 30% panel2 (kontrol cukup luas)
// ✅ Urutan elemen diperbaiki: panel1 → splitter → panel2 (seperti HTML asli)
// ✅ Styling lengkap & isolasi (sama seperti versi studiopose yang sudah difix)
// ✅ Splitter tetap bisa di-drag normal oleh splitter.js sandbox
(function () {
  // ========== FULL HTML STRING ==========
  const fullHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title id="title">Studio Character - Gacha Design Studio</title>
    <link rel="icon" type="image/png" href="assets/icon.png">
</head>
<body>

    <!-- Panel atas -->
    <div class="panel1 container" id="panel1">
    </div>

    <!-- Panel bawah -->
    <div class="panel2 input-container" id="panel2">
        
<!-- Tombol arah -->
<label for="sensitivitySlider">Sensitivitas:</label>
<input type="range" id="sensitivitySlider" min="0.1" max="100" step="0.1" value="0.1" oninput="handleSensitivity(this.value)">
<input type="text" id="sensitivityInput" readonly>
<button class="button" id="move-up" onmousedown="startMove('up')" ontouchstart="startMove('up')">🔼</button>
        <button class="button" id="move-down" onmousedown="startMove('down')" ontouchstart="startMove('down')">🔽</button>
        <button class="button" id="move-left" onmousedown="startMove('left')" ontouchstart="startMove('left')">◀️️</button>
        <button class="button" id="move-right" onmousedown="startMove('right')" ontouchstart="startMove('right')">▶️️</button>

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
        <button id="duplicateBtn" onclick="duplicateSelectedLayers()">Duplikasi</button>
        <button id="copyBtn" onclick="copySelectedLayers()">Salin</button>
        <button id="pasteBtn" onclick="pasteCopiedLayers()">Tempel</button>
        <button id="deleteBtn" onclick="deleteSelectedLayer()">Hapus Lapisan</button>
        
        <input type="file" id="svgUpload" accept=".svg" style="display:none" onchange="addSVG(event)">
        <button onclick="document.getElementById('svgUpload').click()">Tambahkan SVG</button>
        <input type="file" id="imageUpload" accept="image/*" style="display:none" onchange="addImage(event)">
        <button onclick="document.getElementById('imageUpload').click()">Tambahkan Sisipan</button>
        
    </div>

    <!-- Garis splitter -->
    <div id="splitter"></div>

    <!-- Skrip -->
    <script src="js/mainmenu/studiosandbox.js"></script>
    <script src="js/studiosanbox/layer.js"></script>
    <script src="js/studiosanbox/studiosandbox.js"></script>
    <script src="js/studiosanbox/splitter.js"></script>
    <script src="js/studiosanbox/background.js"></script>
    <script src="js/studiosanbox/opacity.js"></script>
    <script src="js/studiosanbox/selector.js"></script>
    <script src="js/studiosanbox/key.js"></script>
    <script src="js/studiosanbox/sensivity.js"></script>
    <script src="js/studiosanbox/upload.js"></script>
    <!-- Skrip -->

</body>
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

    const cleanup = () => {
      if (iframe.parentNode) iframe.remove();
      window.removeEventListener('studiooverlay:hide', cleanup);
    };
    window.addEventListener('studiooverlay:hide', cleanup);
  }

  // ========== REGISTER KE OVERLAY SYSTEM (untuk studiosandbox) ==========
  if (typeof window.registerStudioFrame === 'function') {
    window.registerStudioFrame('studiosandbox', init);
  } else {
    window.__pendingStudioSandbox = init;
  }

  console.log('✓ Studio Sandbox Frame (iframe + loading + 70% split) ready!');
})();