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
        <html lang="id">

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

                body,
                html {
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                }

                /* Media query buat nyesuain layout tergantung lebar layar */
                @media (min-width: 1000px) { /* Adjust breakpoint as needed */
                    /* Panel2 - Tombol untuk memindahkan posisi kerangka */
                    .panel2-move-button-container {
                        grid-template-columns: repeat(4, 1fr);
                    }
                }

                /* Main container - horizontal layout */
                .main-container {
                    display: flex;
                    width: 100%;
                    height: 100%;
                    position: relative;
                    background-color: #333;
                    /* Resets: Added to hide white gaps */
                }

                /* Pemisah antara baris pada panel */
                .empty-gap {
                    min-height: 20px;
                }

                /* Framework container (Panel3) */
                .panel3.framework-container {
                    border: 5px solid #f44336;
                    /* Red Frame */
                    border-radius: 12px;
                    box-sizing: border-box;
                    /* Include border in size */
                    padding: 0 !important;
                    margin: 0;
                    margin-right: -5px;
                    /* Overlap to remove white gap */
                    background-color: white;
                    z-index: 150;
                    background-size: cover;
                    overflow: auto;
                    flex-shrink: 0;
                    position: relative;
                    display: none;
                    width: 0;
                    min-height: 100%;
                }

                /* Panel group - flex container untuk panel1 dan panel2 */
                .panel-group {
                    display: flex;
                    flex-direction: column;
                    width: 100%;
                    height: 100%;
                    /* Occupy full height of parent */
                    background-color: transparent;
                    overflow: hidden;
                    /* Prevent strange scrollbars on the group itself */
                    flex: 1;
                    margin: 0;
                    padding: 0;
                    position: relative;
                }

                /* Panel1 - UNLIMITED content canvas FULL SIZE */
                .panel1.container {
                    margin: 0;
                    padding: 0;
                    background: none;
                    background-size: cover;
                    width: 100%;
                    height: 100%;
                    flex: 1;
                    /* Take all available space */
                    overflow: auto;
                    /* Scrollable jika content melebihi */
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    box-sizing: border-box;
                    z-index: 1;
                    /* Behind panel2 */
                    touch-action: pan-x pan-y;
                    /* Allow natural touch scrolling */
                    -webkit-user-select: none;
                    /* Prevent text selection during touch drag */
                    user-select: none;
                }

                /* Panel1 Layer Container - Support CSS positioning untuk centering vs top-left */
                /* DEFAULT: left: 0, top: 0, transform-origin: top left, size limited to parent */
                /* CENTER: left: 0, top: 0, transform-origin: center center, size unlimited (no width/height constraint) */
                .panel1-layercontainer {
                    position: absolute;
                    left: 0;
                    top: 0;
                    z-index: 1;
                    transform-origin: top left;
                    transform: scale(1);
                    /* PENTING: min-width/min-height untuk memastikan minimal size = parent */
                    /* Tapi JANGAN gunakan width/height 100% - let content grow beyond parent untuk unlimited canvas */
                    min-width: 100%;
                    min-height: 100%;
                    /* overflow visible to allow content outside bounds */
                    overflow: visible;
                    pointer-events: auto;
                    /* Default: allow layer interaction */
                }

                .panel1-layercontainer.locked {
                    pointer-events: none;
                    /* Block ALL events to layer container */
                }

                /* Panel1 Layer Pan Lock - Overlay transparent untuk mengunci layer saat drag mode aktif */
                .panel1-layerpanlock {
                    position: absolute;
                    left: 0;
                    top: 0;
                    z-index: 1000;
                    /* TINGGI: block semua lainnya kecuali ini */
                    background-color: transparent;
                    cursor: grab;
                    pointer-events: none;
                    /* DEFAULT: hidden */
                    display: none;
                    /* Hidden by default */
                    touch-action: pan-x pan-y;
                    /* Allow natural touch scroll */
                }

                .panel1-layerpanlock.active {
                    display: block;
                    /* PENTING: pointer-events AUTO untuk block layer touchstart/mousedown */
                    /* TAPI touch-action: pan-x pan-y membiarkan browser handle scroll otomatis */
                    pointer-events: auto;
                    touch-action: pan-x pan-y;
                }

                /* Drag Overlay - Invisible layer to catch fast mouse movements */
                #dragOverlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 20000;
                    /* Above everything including splitters */
                    cursor: grabbing;
                    display: none;
                    /* Hidden by default */
                    background: transparent;
                }

                /* Panel2 - Controls panel OVERLAY di atas panel1 */
                .panel2.input-container {
                    margin: 0;
                    padding: 0;
                    background-size: cover;
                    width: 100%;
                    height: auto;
                    overflow-y: auto;
                    max-height: 100%;
                    /* Maksimal viewport height */
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    display: flex;
                    flex-direction: column;
                    align-items: initial;
                    justify-content: initial;
                    box-sizing: border-box;
                    /* NEW STYLING */
                    border: 5px solid #29b6f6;
                    /* Blue Water Frame */
                    border-radius: 12px 12px 0 0;
                    /* Radius on top only usually looks better, but user asked for 12px */
                    border-radius: 12px;
                    /* PADDING REMOVED as requested */
                    padding: 0 !important;
                    /* Ensure background is opaque so content from panel 1 doesn't bleed weirdly if they overlap */
                    background-color: white;
                    z-index: 100;
                    /* High Z-index as requested */
                }

                /* Panel2 - Tombol untuk memindahkan posisi kerangka */
                .panel2-move-button-container {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(min(250px, 100%), 1fr));
                    gap: 12px;
                }

                /* Panel2 - Slider dengan nilai input */
                .panel2-slider-container {
                    display: grid;
                    align-items: center;
                    grid-template-columns: 1fr 120px;
                    gap: 5px;
                }

                /* CORNER MOVE HANDLE */
                #splitterCorner {
                    position: absolute;
                    width: 40px;
                    /* Large hit area */
                    height: 40px;
                    background: transparent;
                    z-index: 2000;
                    /* Highest, above panels */
                    cursor: move;
                    /* 4-way arrow */
                    display: none;
                    transform: translate(-50%, -50%);
                    border-radius: 50%;
                }
            </style>
        </head>

        <body>

            <!-- Main layout container -->
            <div class="main-container" id="mainContainer">
                <!-- GLOBAL DRAG OVERLAY to fix fast-drag "sticking" issues -->
                <div id="dragOverlay"></div>

                <!-- Panel kiri: Panel3 (Framework) -->
                <div class="panel3 framework-container" id="panel3" style="display: none; width: 0%;">
                </div>

                <!-- Corner Handle (Intersection) -->
                <div id="splitterCorner"></div>

                <!-- Panel tengah: Panel1 (Canvas) dan Panel2 (Controls) -->
                <div class="panel-group" id="panelGroup">
                    <!-- Panel atas -->
                    <div class="panel1 container" id="panel1">
                        <!-- Layer container untuk responsive positioning centering -->
                        <div class="panel1-layercontainer" id="panel1-layercontainer"></div>
                    </div>

                    <!-- Panel bawah -->
                    <div class="panel2 input-container" id="panel2">

                        <!-- Tombol arah -->
                        <label for="zoomSlider">Zoom Panel1:</label>
                        <div class="panel2-slider-container">
                            <input type="range" id="zoomSlider" min="10" max="10000" step="1" value="100" oninput="handleZoom(this.value)">
                            <input type="text" id="zoomInput" oninput="handleZoomInput(this.value)">
                        </div>

                        <label for="sensitivitySlider">Sensitivitas:</label>
                        <div class="panel2-slider-container">
                            <input type="range" id="sensitivitySlider" min="0.1" max="100" step="0.1" value="0.1" oninput="handleSensitivity(this.value)">
                            <input type="text" id="sensitivityInput" readonly>
                        </div>
                        <div class="empty-gap"></div>
                        <div class="panel2-move-button-container">
                            <button class="button" id="move-up" onmousedown="startMove('up')"
                            ontouchstart="startMove('up')">🔼</button>
                            <button class="button" id="move-down" onmousedown="startMove('down')"
                            ontouchstart="startMove('down')">🔽</button>
                            <button class="button" id="move-left" onmousedown="startMove('left')"
                            ontouchstart="startMove('left')">◀️️</button>
                            <button class="button" id="move-right" onmousedown="startMove('right')"
                            ontouchstart="startMove('right')">▶️️</button>
                        </div>
                        <div class="empty-gap"></div>
                        <button id="openFrameworkBtn" onclick="toggleFrameworkPanel()" style="background-color: #ff9800; color: white;">📂 Buka Kerangka</button>
                        
                        <input type="file" id="imageUpload1" accept="image/*">
                        <button onclick="setBackground('panel1')">Setel background panel atas</button>
                        <input type="file" id="imageUpload2" accept="image/*">
                        <button onclick="setBackground('panel2')">Setel background panel bawah</button>
                        <label for="characterName">Nama Karakter:</label>
                        <input type="text" id="characterName" oninput="handleCharacterName(this.value)">
                        
                        <input type="file" id="imageUpload3" accept="image/*">
                        <button onclick="setBackground('panel3')">Setel background kerangka</button>
                        <div class="empty-gap"></div>
                        
                        <label for="opacitySlider1">Opasitas Panel1:</label>
                        <div class="panel2-slider-container">
                            <input type="range" id="opacitySlider1" class="opacitySlider" min="0" max="100" value="100" oninput="setOpacity('panel1')">
                            <input type="text" id="opacityInput1" class="opacityInput" readonly>
                        </div>
                        <div class="empty-gap"></div>
                        
                        <label for="opacitySlider2">Opasitas Panel2:</label>
                        <div class="panel2-slider-container">
                            <input type="range" id="opacitySlider2" class="opacitySlider" min="0" max="100" value="100" oninput="setOpacity('panel2')">
                            <input type="text" id="opacityInput2" class="opacityInput" readonly>
                        </div>
                        <div class="empty-gap"></div>
                        
                        <label for="opacitySlider3">Opasitas Panel3 (Kerangka):</label>
                        <div class="panel2-slider-container">
                            <input type="range" id="opacitySlider3" class="opacitySlider" min="0" max="100" value="100" oninput="setOpacity('panel3')">
                            <input type="text" id="opacityInput3" class="opacityInput" readonly>
                        </div>
                        <div class="empty-gap"></div>
                        
                        <label for="centerOriginToggle">
                            <input type="checkbox" id="centerOriginToggle" onchange="toggleCenterOrigin(this.checked)">
                            Pusatkan Origin (0,0) ke Tengah Layar
                        </label>
                        
                        <label for="dragPanel1Toggle">
                            <input type="checkbox" id="dragPanel1Toggle" onchange="toggleDragPanel1(this.checked)">
                            Nyalakan untuk menyeret panel1
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
                        <div class="panel2-slider-container">
                            <input type="range" id="rotationControl" min="0" max="360" value="0" oninput="handleRotation(this.value)">
                            <div id="rotationIndicator">0</div>
                        </div>
                        <div class="empty-gap"></div>
                        
                        <label for="skewXControl">Skew X:</label>
                        <div class="panel2-slider-container">
                            <input type="range" id="skewXSlider" min="-45" max="45" value="0" oninput="handleSkewXSlider(this.value)">
                            <input type="text" id="skewXControl" placeholder="0" oninput="handleSkewX(this.value)">
                        </div>
                        <div class="empty-gap"></div>
                        
                        <label for="skewYControl">Skew Y:</label>
                        <div class="panel2-slider-container">
                            <input type="range" id="skewYSlider" min="-45" max="45" value="0" oninput="handleSkewYSlider(this.value)">
                            <input type="text" id="skewYControl" placeholder="0" oninput="handleSkewY(this.value)">
                        </div>
                        <div class="empty-gap"></div>

                        <button onclick="moveLayerUp()">Naikkan</button>
                        <button onclick="moveLayerDown()">Turunkan</button>
                        <button onclick="exportAsSVG()">Ekspor sebagai SVG</button>
                        <input type="text" id="svgFileName" placeholder="Nama file SVG">
                        <button onclick="exportAsHTML()">Ekspor sebagai HTML</button>
                        <input type="text" id="htmlFileName" placeholder="Nama file HTML">
                        <br><br>
                        <button onclick="exportStudioScene()" style="background-color: #4CAF50; color: white;">Ekspor Prasetel
                            Studio (.gss/.gsj)</button>
                        <button onclick="importStudioScene()" style="background-color: #9C27B0; color: white;">Impor Prasetel /
                            Konfigurasi Studio</button>

                        <br>
                        <button id="toggleSelectorBtn">Nyalakan Seleksi</button>
                        <button id="groupBtn" onclick="groupSelectedLayers()">Grupkan</button>
                        <button id="ungroupBtn" onclick="ungroupSelectedLayers()">Pisahkan Grup</button>
                        <button id="ungroupSrcBtn" onclick="ungroupSrcLayers()">Pisahkan Src</button>
                        <button id="mergeBtn" onclick="mergeSelectedLayersSrc()">Gabung Src</button>
                        <button id="duplicateBtn" onclick="duplicateSelectedLayers()">Duplikasi</button>
                        <button id="copyBtn" onclick="copySelectedLayers()">Salin</button>
                        <button id="pasteBtn" onclick="pasteCopiedLayers()">Tempel</button>
                        <button id="deleteBtn" onclick="deleteSelectedLayer()">Hapus Lapisan</button>

                        <!-- Multiplier Menu -->
                        <div id="multiplier-container"
                            style="margin-top: 15px; border: 2px solid #512da8; padding: 15px; border-radius: 12px; background: linear-gradient(135deg, #f3e5f5 0%, #ede7f6 100%); box-shadow: 0 4px 15px rgba(103, 58, 183, 0.15); transition: all 0.3s ease;">
                            <h3
                                style="color: #4527a0; margin: 0 0 12px 0; font-size: 18px; display: flex; align-items: center; gap: 8px;">
                                <span style="font-size: 22px;">🔄</span> Multiplier (Cermin & Ubin)
                            </h3>
                            <div
                                style="display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 12px; align-items: start;">
                                <label
                                    style="font-weight: bold; cursor: pointer; color: #311b92; display: flex; align-items: center; gap: 5px;">
                                    <input type="checkbox" id="multiplierEnabled"
                                        onchange="handleMultiplierEnabled(this.checked)"
                                        style="width: 18px; height: 18px; cursor: pointer;"> Aktifkan
                                </label>

                                <div style="display: flex; flex-direction: column; gap: 4px;">
                                    <span style="font-size: 12px; color: #5e35b1; font-weight: bold;">Tipe Perulangan</span>
                                    <select id="multiplierRepeatType" onchange="handleMultiplierRepeatType(this.value)"
                                        style="padding: 6px; border-radius: 6px; border: 1px solid #b39ddb; background: white; cursor: pointer;">
                                        <option value="sederet">Sederet (Lurus)</option>
                                        <option value="mirror">Cermin (Mirror)</option>
                                    </select>
                                </div>

                                <div style="display: flex; flex-direction: column; gap: 4px;">
                                    <span style="font-size: 12px; color: #5e35b1; font-weight: bold;">Sumbu (Axis)</span>
                                    <div
                                        style="display: flex; gap: 10px; background: white; padding: 6px; border-radius: 6px; border: 1px solid #b39ddb;">
                                        <label
                                            style="cursor: pointer; display: flex; align-items: center; gap: 4px; font-size: 13px;">
                                            <input type="checkbox" id="multiplierAxisX" value="x"
                                                onchange="handleMultiplierAxisChange()"> X
                                        </label>
                                        <label
                                            style="cursor: pointer; display: flex; align-items: center; gap: 4px; font-size: 13px;">
                                            <input type="checkbox" id="multiplierAxisY" value="y"
                                                onchange="handleMultiplierAxisChange()"> Y
                                        </label>
                                    </div>
                                </div>

                                <div style="display: flex; flex-direction: column; gap: 4px;">
                                    <span style="font-size: 12px; color: #5e35b1; font-weight: bold;">Jumlah Copy</span>
                                    <div style="display: flex; gap: 5px; align-items: center;">
                                        <input type="number" id="multiplierCount" min="0" max="100" value="0"
                                            style="padding: 6px; border: 1px solid #b39ddb; border-radius: 6px; flex: 1; transition: border 0.3s;"
                                            oninput="handleMultiplierCount(this.value)">
                                        <label
                                            style="cursor: pointer; display: flex; align-items: center; gap: 3px; font-size: 11px; white-space: nowrap;">
                                            <input type="checkbox" id="multiplierUnlimited"
                                                onchange="handleMultiplierUnlimited(this.checked)"
                                                style="width: 14px; height: 14px;"> ∞
                                        </label>
                                    </div>
                                </div>

                                <div style="display: flex; flex-direction: column; gap: 4px;">
                                    <span style="font-size: 12px; color: #5e35b1; font-weight: bold;">Jarak (Gap)</span>
                                    <input type="number" id="multiplierGap" value="0"
                                        style="padding: 6px; border: 1px solid #b39ddb; border-radius: 6px; width: 100%; transition: border 0.3s;"
                                        oninput="handleMultiplierGap(this.value)">
                                </div>

                                <div style="display: flex; flex-direction: column; gap: 4px;">
                                    <span style="font-size: 12px; color: #5e35b1; font-weight: bold;">Rotasi Iterasi (°)</span>
                                    <input type="number" id="multiplierRotation" value="0" min="-360" max="360" step="1"
                                        style="padding: 6px; border: 1px solid #b39ddb; border-radius: 6px; width: 100%; transition: border 0.3s;"
                                        oninput="handleMultiplierRotation(this.value)">
                                </div>

                                <div style="display: flex; flex-direction: column; gap: 4px;">
                                    <span style="font-size: 12px; color: #5e35b1; font-weight: bold;">Tipe Cermin</span>
                                    <select id="multiplierMirrorType" onchange="handleMultiplierMirrorType(this.value)"
                                        style="padding: 6px; border-radius: 6px; border: 1px solid #b39ddb; background: white; cursor: pointer;">
                                        <option value="1">q|p / d|b (Standard)</option>
                                        <option value="2">q|p / p|q (Flip Horizontal)</option>
                                        <option value="3">q|p / p|d (Atas Flip, Bawah Normal)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <button id="resetBtn" onclick="resetStudio()" style="background-color: #ff6b6b;">Reset Studio</button>

                        <!-- Shortcut dan History Buttons -->
                        <div
                            style="margin-top: 10px; padding: 10px; border-top: 2px solid #ddd; border-bottom: 2px solid #ddd;">
                            <button id="undoBtn"
                                onclick="if(typeof window.HistoryManager !== 'undefined') window.HistoryManager.undo()"
                                title="Ctrl+Z" style="background-color: #5cb85c; color: white;">↶ Undo</button>
                            <button id="redoBtn"
                                onclick="if(typeof window.HistoryManager !== 'undefined') window.HistoryManager.redo()"
                                title="Ctrl+Y" style="background-color: #5cb85c; color: white;">↷ Redo</button>
                            <button id="historyBtn"
                                onclick="if(typeof window.openHistoryWindow !== 'undefined') window.openHistoryWindow()"
                                title="View Edit History" style="background-color: #0275d8; color: white;">📋 History</button>
                        </div>

                        <button id="settingsBtn" onclick="openSettingsWindow()"
                            style="background-color: #4a5ba7; color: white;">⚙️ Setelan</button>

                        <input type="file" id="svgUpload" accept=".svg" multiple style="display:none"
                            onchange="addImage(event)">
                        <button onclick="document.getElementById('svgUpload').click()">Tambahkan SVG</button>
                        <input type="file" id="imageUpload" accept="image/*" multiple style="display:none"
                            onchange="addImage(event)">
                        <button onclick="document.getElementById('imageUpload').click()">Tambahkan Sisipan</button>
                        <button id="addHtmlShapeBtn" onclick="openHtmlShapeStudio()"
                            style="background-color: #5E6CC9; color: white; transition: all 0.2s;">Tambahkan Markah Web</button>


                        <!-- Layer SRC Manager Container -->
                        <div id="menusrcContainer" style="margin-top: 15px; border-top: 2px solid #ddd; padding-top: 15px;">
                        </div>

                        <!-- Child Layers Manager Container -->
                        <div id="menulayerContainer" style="margin-top: 15px; border-top: 2px solid #333; padding-top: 15px;">
                        </div>
                    </div>
                </div>
            </div>

            <!-- Skrip -->
            <script src="js/colorcode/javascript.js"></script>
            <script src="js/windowhandler.js"></script>
            <script src="js/mainmenu/studiopose.js"></script>
            <script src="js/studiocharacter/htmlshape.js"></script>
            <script src="js/studiocharacter/multiplier.js"></script>
            <script src="js/studiocharacter/layer.js"></script>
            <script src="js/studiocharacter/history.js"></script>
            <script src="js/studiocharacter/historywindow.js"></script>
            <script src="js/studiocharacter/function.js"></script>
            <script src="js/studiocharacter/studiopose.js"></script>
            <script src="js/studiocharacter/multiplier_ui.js"></script>
            <script src="js/studiocharacter/textshape.js"></script>
            <script src="js/studiocharacter/pausestudio.js"></script>
            <script src="js/studiocharacter/bgm.js"></script>
            <script src="js/studiocharacter/splitter.js"></script>
            <script src="js/studiocharacter/background.js"></script>
            <script src="js/studiocharacter/opacity.js"></script>
            <script src="js/studiocharacter/selector.js"></script>
            <script src="js/studiocharacter/key.js"></script>
            <script src="js/studiocharacter/sensivity.js"></script>
            <script src="js/studiocharacter/centerorigin.js"></script>
            <script src="js/studiocharacter/upload.js"></script>
            <script src="js/studiocharacter/export.js"></script>
            <script src="js/studiocharacter/layersrcmanager.js"></script>
            <script src="js/studiocharacter/menulayer.js"></script>
            <script src="js/studiocharacter/studiocharactermenuintegration.js"></script>
            <script src="js/studiocharacter/bgconfig.js"></script>
            <script src="js/studiocharacter/framework.js"></script>
            <!-- Rigging System -->
            <script src="js/studiocharacter/joint.js"></script>
            <script src="js/studiocharacter/bone.js"></script>
            <script src="js/studiocharacter/spine.js"></script>
            <script src="js/studiocharacter/menurigging.js"></script>
            <!-- Skrip -->

            <script>
                // ========== PANEL3 HANDLER ==========
                // Toggle Framework Panel visibility dan horizontal splitter
                function toggleFrameworkPanel() {
                    const panel3 = document.getElementById('panel3');
                    const panelGroup = document.getElementById('panelGroup');
                    const panel1 = document.getElementById('panel1');
                    const mainContainer = document.getElementById('mainContainer');

                    if (panel3.style.display === 'none' || panel3.offsetWidth === 0) {
                        // Show panel3 - panel1 akan didorong/pushed dan bisa grow
                        panel3.style.display = 'block';
                        panel3.style.width = '200px'; // Default width
                        panelGroup.style.flex = '1';
                        // Ensure panel1 can grow when panel3 is shown
                        panel1.style.minHeight = '0';
                    } else {
                        // Hide panel3 - panel1 bisa unlimited growth
                        panel3.style.width = '0%';
                        panel3.style.display = 'none';
                        // Allow panel1 to grow unlimited when panel3 is hidden
                        panel1.style.minHeight = 'auto';
                    }
                }

                // Initialize layer container pada startup SEBELUM centerorigin.js load
                document.addEventListener('DOMContentLoaded', function () {
                    const layerContainer = document.getElementById('panel1-layercontainer');
                    if (layerContainer) {
                        // Set default positioning untuk pojok kiri atas
                        layerContainer.style.left = '0px';
                        layerContainer.style.top = '0px';
                        layerContainer.style.transformOrigin = 'top left';
                        layerContainer.style.transform = 'scale(1)';

                        // Set dataset state
                        layerContainer.dataset.centerOriginActive = 'false';
                        layerContainer.dataset.centerPositionMode = 'false';

                        // Create panel1 layer pan lock overlay
                        const panel1 = document.getElementById('panel1');
                        if (panel1) {
                            const lockOverlay = document.createElement('div');
                            lockOverlay.id = 'panel1-layerpanlock';
                            lockOverlay.className = 'panel1-layerpanlock';
                            panel1.appendChild(lockOverlay);
                            console.log('✅ Panel1 layer pan lock overlay created');
                        }

                        console.log('✅ Panel1 layer container initialized to default state (top-left)');
                    }
                });

                // ========== CORNER DRAG & SYNC LOGIC ==========
                document.addEventListener('DOMContentLoaded', function () {
                    const splitterCorner = document.getElementById('splitterCorner');
                    const panel3 = document.getElementById('panel3');
                    const panelGroup = document.getElementById('panelGroup');
                    const mainContainer = document.getElementById('mainContainer');
                    const panel1 = document.getElementById('panel1');
                    const panel2 = document.getElementById('panel2');

                    let isDraggingCorner = false;

                    // Sync Function: Move corner to intersection of Panel3 Right and Panel2 Top
                    function syncCorner() {
                        if (!splitterCorner || !panel2 || panel3.style.display === 'none') {
                            if (splitterCorner) splitterCorner.style.display = 'none';
                            return;
                        }

                        // Check if panel3 is visible
                        if (panel3.offsetWidth > 5) {
                            splitterCorner.style.display = 'block';

                            const mainRect = mainContainer.getBoundingClientRect();
                            const panel2Rect = panel2.getBoundingClientRect();
                            const panel3Rect = panel3.getBoundingClientRect();

                            // Pos X: Right edge of Panel3 (minus mainRect.left)
                            const x = panel3Rect.right - mainRect.left;

                            // Pos Y: Top edge of Panel2 relative to container
                            const y = panel2Rect.top - mainRect.top;

                            splitterCorner.style.left = x + 'px';
                            splitterCorner.style.top = y + 'px';
                        } else {
                            splitterCorner.style.display = 'none';
                        }
                    }

                    // Loop sync using requestAnimationFrame for smoothness
                    function loopSync() {
                        syncCorner();
                        requestAnimationFrame(loopSync);
                    }
                    loopSync();

                    // Drag Logic
                    if (splitterCorner) {
                        splitterCorner.addEventListener('mousedown', function (e) { startCornerDrag(e); });
                        splitterCorner.addEventListener('touchstart', function (e) { startCornerDrag(e); });
                    }

                    function startCornerDrag(e) {
                        e.preventDefault();
                        isDraggingCorner = true;

                        // Show overlay
                        const overlay = document.getElementById('dragOverlay');
                        if (overlay) overlay.style.display = 'block';
                        document.body.style.userSelect = 'none';
                        document.body.style.cursor = 'move';

                        if (e.type === 'mousedown') {
                            document.addEventListener('mousemove', handleCornerDrag);
                            document.addEventListener('mouseup', stopCornerDrag);
                        } else {
                            document.addEventListener('touchmove', handleCornerDrag, { passive: false });
                            document.addEventListener('touchend', stopCornerDrag);
                        }
                    }

                    function handleCornerDrag(e) {
                        if (!isDraggingCorner) return;
                        e.preventDefault();

                        let clientX, clientY;
                        if (e.touches && e.touches.length > 0) {
                            clientX = e.touches[0].clientX;
                            clientY = e.touches[0].clientY;
                        } else {
                            clientX = e.clientX;
                            clientY = e.clientY;
                        }

                        // 1. Handle Horizontal (Panel3 Width)
                        const containerRect = mainContainer.getBoundingClientRect();
                        let newWidth = clientX - containerRect.left;
                        const minWidth = 0;
                        const maxWidth = containerRect.width * 0.9;
                        const width = Math.max(minWidth, Math.min(newWidth, maxWidth));

                        if (width < 20) {
                            // Close if dragged too far left
                            panel3.style.width = '0px';
                            panel3.style.display = 'none';
                        } else {
                            panel3.style.width = width + 'px';
                            panel3.style.display = 'block';
                        }

                        // 2. Handle Vertical (Panel2 Top Drag)
                        const mainRect = mainContainer.getBoundingClientRect();
                        const winH = mainRect.height;
                        const pointerYRel = clientY - mainRect.top;

                        // Calculate height from bottom
                        let hPx = winH - pointerYRel;
                        let hPct = (hPx / winH) * 100;
                        hPct = Math.min(Math.max(hPct, 5), 95);

                        panel2.style.height = hPct + '%';

                        // Force sync immediately
                        syncCorner();
                    }

                    function stopCornerDrag() {
                        isDraggingCorner = false;
                        document.removeEventListener('mousemove', handleCornerDrag);
                        document.removeEventListener('mouseup', stopCornerDrag);
                        document.removeEventListener('touchmove', handleCornerDrag);
                        document.removeEventListener('touchend', stopCornerDrag);

                        // Hide overlay
                        const overlay = document.getElementById('dragOverlay');
                        if (overlay) overlay.style.display = 'none';
                        document.body.style.userSelect = '';
                        document.body.style.cursor = '';
                    }
                });

                // Update origin offset on resize - handled by centerorigin.js
                // centerorigin.js sudah menangani resize events dan responsive positioning

                // ========== PANEL1 DRAG/PAN HANDLER ==========
                let isDraggingPanel1 = false;
                let dragStartX = 0;
                let dragStartY = 0;
                let scrollStartLeft = 0;
                let scrollStartTop = 0;
                let dragPanel1Enabled = false;

                function toggleDragPanel1(enabled) {
                    dragPanel1Enabled = enabled;
                    const panel1 = document.getElementById('panel1');
                    const layerContainer = document.getElementById('panel1-layercontainer');
                    const lockOverlay = document.getElementById('panel1-layerpanlock');

                    if (dragPanel1Enabled) {
                        panel1.style.cursor = 'grab';

                        // Lock layer container - block ALL events
                        if (layerContainer) {
                            layerContainer.classList.add('locked');
                            console.log('✅ Panel1 layer container LOCKED');
                        }

                        // Show lock overlay - block semua event ke layer
                        if (lockOverlay) {
                            // Set overlay position to match scrollable content area (not viewport!)
                            // Use scrollWidth/scrollHeight to cover entire content, not just visible viewport
                            lockOverlay.style.left = '0px';
                            lockOverlay.style.top = '0px';
                            lockOverlay.style.width = panel1.scrollWidth + 'px';
                            lockOverlay.style.height = panel1.scrollHeight + 'px';

                            lockOverlay.classList.add('active');
                            lockOverlay.style.cursor = 'grab';
                            console.log('✅ Panel1 layer pan lock ENABLED - Scrollable area:', {
                                width: panel1.scrollWidth,
                                height: panel1.scrollHeight
                            });
                        }

                        console.log('✅ Panel1 drag mode ENABLED');
                    } else {
                        panel1.style.cursor = 'default';
                        isDraggingPanel1 = false;

                        // Unlock layer container
                        if (layerContainer) {
                            layerContainer.classList.remove('locked');
                            console.log('✅ Panel1 layer container UNLOCKED');
                        }

                        // Hide lock overlay - allow layer interaction
                        if (lockOverlay) {
                            lockOverlay.classList.remove('active');
                            lockOverlay.style.cursor = 'default';
                            console.log('✅ Panel1 layer pan lock DISABLED');
                        }

                        console.log('❌ Panel1 drag mode DISABLED');
                    }
                }

                // Initialize drag handler pada DOMContentLoaded
                document.addEventListener('DOMContentLoaded', function () {
                    const panel1 = document.getElementById('panel1');
                    const lockOverlay = document.getElementById('panel1-layerpanlock');

                    if (!panel1) return;

                    // Update lock overlay position on window resize
                    window.addEventListener('resize', function () {
                        if (dragPanel1Enabled && lockOverlay && lockOverlay.classList.contains('active')) {
                            lockOverlay.style.width = panel1.scrollWidth + 'px';
                            lockOverlay.style.height = panel1.scrollHeight + 'px';
                            console.log('📏 Overlay resized to scrollable area:', {
                                width: panel1.scrollWidth,
                                height: panel1.scrollHeight
                            });
                        }
                    });

                    // Update overlay saat scroll/zoom mengubah content size
                    panel1.addEventListener('scroll', function () {
                        if (dragPanel1Enabled && lockOverlay && lockOverlay.classList.contains('active')) {
                            // Update overlay size setiap kali scroll (karena zoom juga trigger layout change)
                            lockOverlay.style.width = panel1.scrollWidth + 'px';
                            lockOverlay.style.height = panel1.scrollHeight + 'px';
                        }
                    });

                    // Monitor for zoom/transform changes - update overlay untuk match content
                    const observeLayerChanges = () => {
                        if (dragPanel1Enabled && lockOverlay && lockOverlay.classList.contains('active')) {
                            const newWidth = panel1.scrollWidth;
                            const newHeight = panel1.scrollHeight;
                            const currentWidth = parseFloat(lockOverlay.style.width);
                            const currentHeight = parseFloat(lockOverlay.style.height);

                            // Update jika ada perubahan ukuran (dari zoom)
                            if (newWidth !== currentWidth || newHeight !== currentHeight) {
                                lockOverlay.style.width = newWidth + 'px';
                                lockOverlay.style.height = newHeight + 'px';
                                console.log('🔍 Overlay updated after zoom:', {
                                    width: newWidth,
                                    height: newHeight
                                });
                            }
                        }
                    };

                    // Check overlay size every 100ms when drag mode is active
                    setInterval(observeLayerChanges, 100);

                    // MOUSE HANDLER - Drag/Pan untuk mouse
                    if (lockOverlay) {
                        lockOverlay.addEventListener('mousedown', function (e) {
                            if (!dragPanel1Enabled) return;

                            isDraggingPanel1 = true;
                            dragStartX = e.clientX;
                            dragStartY = e.clientY;
                            scrollStartLeft = panel1.scrollLeft;
                            scrollStartTop = panel1.scrollTop;

                            // Mouse drag - overlay already blocking due to pointer-events: auto
                            lockOverlay.style.cursor = 'grabbing';
                            panel1.style.cursor = 'grabbing';
                            console.log('🖱️ Mouse drag START on overlay');
                            e.preventDefault();
                        });
                    }

                    // Mouse down - start drag
                    panel1.addEventListener('mousedown', function (e) {
                        if (!dragPanel1Enabled) return;

                        // Jangan drag jika click pada input/button
                        const target = e.target;
                        if (target.tagName === 'INPUT' || target.tagName === 'BUTTON' ||
                            target.tagName === 'SELECT' || target.tagName === 'LABEL' ||
                            target.closest('label') || target.closest('[onclick]')) {
                            return;
                        }

                        isDraggingPanel1 = true;
                        dragStartX = e.clientX;
                        dragStartY = e.clientY;
                        scrollStartLeft = panel1.scrollLeft;
                        scrollStartTop = panel1.scrollTop;

                        panel1.style.cursor = 'grabbing';
                        console.log('🖱️ Panel1 mouse drag START');
                        e.preventDefault();
                    });

                    // Mouse move - pan canvas
                    document.addEventListener('mousemove', function (e) {
                        if (!isDraggingPanel1 || !dragPanel1Enabled) return;

                        const deltaX = e.clientX - dragStartX;
                        const deltaY = e.clientY - dragStartY;

                        // Invert delta untuk natural pan feeling (drag kanan = scroll kiri)
                        panel1.scrollLeft = scrollStartLeft - deltaX;
                        panel1.scrollTop = scrollStartTop - deltaY;
                    });

                    // Mouse up - end drag
                    document.addEventListener('mouseup', function (e) {
                        if (!isDraggingPanel1) return;

                        isDraggingPanel1 = false;
                        console.log('🖱️ Mouse drag END');

                        if (dragPanel1Enabled) {
                            panel1.style.cursor = 'grab';
                            if (lockOverlay) {
                                lockOverlay.style.cursor = 'grab';
                            }
                        } else {
                            panel1.style.cursor = 'default';
                            if (lockOverlay) {
                                lockOverlay.style.cursor = 'default';
                            }
                        }
                    });

                    // TOUCH HANDLER - Natural scrolling untuk touch/mobile
                    // Overlay punya pointer-events: auto + touch-action: pan-x pan-y
                    // Ini berarti: block layer interaction TAPI allow scroll otomatis
                    panel1.addEventListener('touchstart', function (e) {
                        if (dragPanel1Enabled) {
                            const target = e.target;
                            if (target.tagName !== 'INPUT' && target.tagName !== 'BUTTON' &&
                                target.tagName !== 'SELECT' && !target.closest('label')) {
                                // Set flag - overlay akan block touch ke layer
                                isDraggingPanel1 = true;
                                console.log('📱 Touch START - overlay blocking + scroll allowed via touch-action');
                            }
                        }
                    }, { passive: true }); // passive: true agar tidak preventDefault scroll

                    document.addEventListener('touchend', function (e) {
                        if (isDraggingPanel1) {
                            isDraggingPanel1 = false;
                            console.log('📱 Touch END');
                        }
                    });

                    console.log('✅ Panel1 drag handler initialized (Mouse: drag/pan | Touch: natural scroll)');
                });

            </script>

        </html>
    `;

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