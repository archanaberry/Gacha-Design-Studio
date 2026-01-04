/****************************************************************/
//                                                              //
//  -------------------Gacha Design Studio--------------------  //
//  Created by: Archana Berry                                   //
//  Assets credits: Lunime, OGL (Open Game License), MIT CC     //
//  Version resource: v0.001_alpha                              //
//  File: settings.js                                           //
//  Type: module[settings]                                      //
//  Desc: Setting ui window in mainmenu                         //
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

// settings.js
document.addEventListener("DOMContentLoaded", function () {
    // Add CSS styles
    var styles = `
/* Memuat font lokal */
@font-face {
  font-family: "Comfortaa"; /* Nama font */
  src: url("../../assets/font/Comfortaa-Regular.ttf") format("truetype"); /* Lokasi font */
}

/* Memuat font lokal */
@font-face {
  font-family: "Comfortaa-Bold"; /* Nama font */
  src: url("../../assets/font/Comfortaa-Bold.ttf") format("truetype"); /* Lokasi font */
}
    
    .container {
        width: 50%;
        height: 50%;
        border: 0px solid #ccc;
        display: flex;
        flex-direction: column;
        allign-items: flex-start;
        border-radius: 13px;
        cursor: move;
        overflow: hidden;
        box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.75);
        background-color: white;
    }

    .background {
        background-image: url('assets/ui/mainmenu/background.png');
        background-size: cover;
        background-color: white;
    }

    .title {
        color: white;
        position: sticky;
        font-family: "Comfortaa", sans-serif; /* ganti font menjadi font lokal */
        -webkit-text-stroke: 1.5px #000; /* Stroke untuk outline */
        white-space: pre-line;
    }

    .header1 {
        background-color: #5E6CC9;
        padding: 20px;
        justify-content: left;
        top: 0;
        cursor: move;
        user-select: none;
        display: flex;
        align-items: center;
        border-bottom: 1px solid #ccc;
        width: 100%;
    }

    .close-button {
        border: none;
        justify-content: space-between;
        background: none;
        position: absolute;
        left: 100%;
        transform: translateX(-160%);
        border: none;
        font-size: 5rem;
        cursor: pointer;
        color: white;
    }

    .shadow {
        box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.75);
    }

    .content {
        padding: 16px;
    }

    .setting-section {
        margin-bottom: 20px;
    }

    .setting-title {
        font-family: "Comfortaa", sans-serif;
        font-size: 1.5rem;
        margin-bottom: 10px;
        border-bottom: 1px solid #ccc;
        padding-bottom: 5px;
    }

    .switch {
        display: flex;
        flex-direction: column; /* susun vertikal */
        align-items: flex-start; /* label/toggle rata kiri */
        gap: 3px;
        margin-bottom: 10px;
    }

    .slider-container {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        margin-bottom: 20px;
    }

    .slider-label {
        margin-bottom: 5px;
        font-family: "Comfortaa", sans-serif;
    }

    .slider {
        width: 80%;
    }

    .percentage {
        margin-top: 5px;
        font-family: "Comfortaa", sans-serif;
    }

    .toggle-switch {
        position: relative;
        display: block;
        margin-top: 4px;
        width: 60px;
        height: 34px;
    }

    .toggle-switch input {
        opacity: 0;
        width: 0;
        height: 0;
    }

    .slider-switch {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        transition: .4s;
        border-radius: 34px;
    }

    .slider-switch:before {
        position: absolute;
        content: "";
        height: 26px;
        width: 26px;
        left: 4px;
        bottom: 4px;
        background-color: white;
        transition: .4s;
        border-radius: 50%;
    }

    input:checked + .slider-switch {
        background-color: #5E6CC9;
    }

    input:checked + .slider-switch:before {
        transform: translateX(26px);
    }

    .custom-slider {
        -webkit-appearance: none;
        appearance: none;
        width: 200px;
        height: 24px;
        background: none;
        outline: none;
        border: none;
        margin: 0;
        padding: 0;
        position: relative;
        transition: opacity .15s ease-in-out;
    }

    .custom-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 42px;
        height: 42px;
        background: url('/assets/ui/menu/thumb.svg') no-repeat center/contain;
        border: none;
        border-radius: 0;
        cursor: pointer;
        box-shadow: none;
        /* Geser thumb vertikal */
        transform: translateY(-8px); /* naik 20px */
    }

    .custom-slider::-moz-range-thumb {
        width: 32px;
        height: 32px;
        background: url('/assets/ui/menu/thumb.svg') no-repeat center/contain;
        border: none;
        border-radius: 0;
        cursor: pointer;
        box-shadow: none;
    }
    .custom-slider::-webkit-slider-runnable-track {
        height: 24px;
        background: url('/assets/ui/menu/track.svg') no-repeat center/100% 100%;
        border-radius: 0;
        border: none;
    }
    .custom-slider::-moz-range-track {
        height: 24px;
        background: url('/assets/ui/menu/track.svg') no-repeat center/100% 100%;
        border-radius: 0;
        border: none;
    }
    .custom-slider::-ms-fill-lower,
    .custom-slider::-ms-fill-upper {
        background: url('/assets/ui/menu/track.svg') no-repeat center/100% 100%;
        border: none;
    }
    .custom-slider:focus {
        outline: none;
    }
    .custom-slider::-ms-thumb {
        width: 32px;
        height: 32px;
        background: url('/assets/ui/menu/thumb.svg') no-repeat center/contain;
        border: none;
        border-radius: 0;
        cursor: pointer;
        box-shadow: none;
    }
    .custom-slider::-ms-tooltip {
        display: none;
    }
    .custom-slider {
        background: none !important;
    }

    #overlay {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.5);
        z-index: 1000;
    }

    #settingsPopup {
        display: none;
        position: fixed;
        top: 50%;
        left: 50%;
        z-index: 1000;
    }

    .resizer1 {
        width: 10px;
        height: 10px;
        position: absolute;
        bottom: 0;
        right: 0;
        cursor: se-resize;
    }
    
    .bgm-controls {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 20px;
    }

    .bgm-controls button {
        background-color: #5E6CC9;
        border: 1px;
        border-radius:10px;
        color: white;
        padding: 10px;
        font-size: 1rem;
        cursor: pointer;
    }

    .bgm-controls button:hover {
        background-color: #4a5ba7;
    }

    .bgm-controls #bgmTitle {
        margin: 0 20px;
        font-family: "Comfortaa", sans-serif;
        font-size: 1.2rem;
        text-align: center;
        flex-grow: 1;
    }
    `;

    var styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    // We don't need the old overlay/popup HTML anymore - windowhandler.js creates its own

    // Initialize audio settings from localStorage and expose global
    window.AudioSettings = {
        masterVolume: parseFloat(localStorage.getItem('masterVolume')) || 0.5,
        bgmVolume: parseFloat(localStorage.getItem('bgmVolume')) || 0.5,
        sfxVolume: parseFloat(localStorage.getItem('sfxVolume')) || 0.5,
        uiVolume: parseFloat(localStorage.getItem('uiVolume')) || 0.5,
        bgmEnabled: (localStorage.getItem('bgmEnabled') === null) ? true : (localStorage.getItem('bgmEnabled') === 'true')
    };

    // helper to broadcast audio settings to other modules
    function broadcastAudioSettings() {
        localStorage.setItem('masterVolume', window.AudioSettings.masterVolume);
        localStorage.setItem('bgmVolume', window.AudioSettings.bgmVolume);
        localStorage.setItem('sfxVolume', window.AudioSettings.sfxVolume);
        localStorage.setItem('uiVolume', window.AudioSettings.uiVolume);
        localStorage.setItem('bgmEnabled', window.AudioSettings.bgmEnabled);
        document.dispatchEvent(new CustomEvent('audioSettingsChanged', { detail: Object.assign({}, window.AudioSettings) }));
    }

    function centerPopup(popup) {
        popup.style.left = '25%';
        popup.style.top = '25%';
        popup.style.height = 'auto';
    }

    // Function definitions using windowhandler.js API
    window.openSettings = function() {
        // Check if windowhandler is available
        if (typeof window.openWindow !== 'function') {
            console.error('windowhandler.js API not loaded');
            return;
        }

        // Create HTML content for settings
        var settingsContent = `
            <div class="content">
            <div class="setting-section">
                <div class="setting-title">Audio</div>
                <div class="switch">
                    <label class="slider-label">BGM</label>
                    <label class="toggle-switch">
                        <input type="checkbox" id="bgmSwitch">
                        <span class="slider-switch"></span>
                    </label>
                </div>
                <div class="slider-container">
                    <label class="slider-label">Master Volume</label>
                    <input type="range" id="masterVolumeSlider" class="custom-slider" min="0" max="100" value="50">
                    <span id="masterVolumePercentage" class="percentage">50%</span>
                </div>
                <div class="slider-container">
                    <label class="slider-label">BGM Volume</label>
                    <input type="range" id="bgmVolumeSlider" class="custom-slider" min="0" max="100" value="50">
                    <span id="bgmVolumePercentage" class="percentage">50%</span>
                </div>
                <div class="slider-container">
                    <label class="slider-label">SFX Volume</label>
                    <input type="range" id="sfxVolumeSlider" class="custom-slider" min="0" max="100" value="50">
                    <span id="sfxVolumePercentage" class="percentage">50%</span>
                </div>
                <div class="slider-container">
                    <label class="slider-label">UI Volume</label>
                    <input type="range" id="uiVolumeSlider" class="custom-slider" min="0" max="100" value="50">
                    <span id="uiVolumePercentage" class="percentage">50%</span>
                </div>
                <div id="bgmControls" class="bgm-controls">
                    <button id="prevBGM">Previous</button>
                    <span id="bgmTitle">Loading...</span>
                    <button id="nextBGM">Next</button>
                </div>
            </div>
            </div>
        `;

        // Create settings window using windowhandler API
        openWindow({
            title: 'Gacha Design Studio - Settings',
            content: settingsContent,
            footer: '<div style="width:100%;display:flex;justify-content:center;"><button class="footer-btn wh-ok-btn" onclick="window.closeWindow(window.currentSettingsWindowId)">OK</button></div>',
            width: '50%',
            height: 'auto',
            lockUnderlay: false,
            overlayOpacity: 0.4
        });

        // Get the window ID from the manager
        var windowIds = window.windowManager.getWindowIds();
        window.currentSettingsWindowId = windowIds[windowIds.length - 1];

        // Restore stored values into the new window's controls
        setTimeout(function() {
            document.getElementById('masterVolumeSlider').value = Math.round(window.AudioSettings.masterVolume * 100);
            document.getElementById('masterVolumePercentage').textContent = Math.round(window.AudioSettings.masterVolume * 100) + '%';
            document.getElementById('bgmVolumeSlider').value = Math.round(window.AudioSettings.bgmVolume * 100);
            document.getElementById('bgmVolumePercentage').textContent = Math.round(window.AudioSettings.bgmVolume * 100) + '%';
            document.getElementById('sfxVolumeSlider').value = Math.round(window.AudioSettings.sfxVolume * 100);
            document.getElementById('sfxVolumePercentage').textContent = Math.round(window.AudioSettings.sfxVolume * 100) + '%';
            document.getElementById('uiVolumeSlider').value = Math.round(window.AudioSettings.uiVolume * 100);
            document.getElementById('uiVolumePercentage').textContent = Math.round(window.AudioSettings.uiVolume * 100) + '%';
            document.getElementById('bgmSwitch').checked = !!window.AudioSettings.bgmEnabled;

            // Attach event listeners to controls
            document.getElementById("masterVolumeSlider").addEventListener("input", updateVolumePercentage);
            document.getElementById("bgmVolumeSlider").addEventListener("input", updateVolumePercentage);
            document.getElementById("sfxVolumeSlider").addEventListener("input", updateVolumePercentage);
            document.getElementById("uiVolumeSlider").addEventListener("input", updateVolumePercentage);

            document.getElementById('masterVolumeSlider').addEventListener('input', function(e){
                var val = e.target.value / 100;
                window.AudioSettings.masterVolume = val;
                document.getElementById('masterVolumePercentage').textContent = Math.round(val*100) + '%';
                broadcastAudioSettings();
            });

            document.getElementById('sfxVolumeSlider').addEventListener('input', function(e){
                var val = e.target.value / 100;
                window.AudioSettings.sfxVolume = val;
                document.getElementById('sfxVolumePercentage').textContent = Math.round(val*100) + '%';
                broadcastAudioSettings();
            });

            document.getElementById('bgmSwitch').addEventListener('change', function(e){
                window.AudioSettings.bgmEnabled = !!e.target.checked;
                broadcastAudioSettings();
            });

            document.getElementById("bgmVolumeSlider").addEventListener("input", updateBGMVolume);
            document.getElementById("uiVolumeSlider").addEventListener("input", updateUIVolume);
            document.getElementById("prevBGM").addEventListener("click", function() {
                document.dispatchEvent(new CustomEvent("changeBGM", { detail: { direction: 'prev' } }));
            });
            document.getElementById("nextBGM").addEventListener("click", function() {
                document.dispatchEvent(new CustomEvent("changeBGM", { detail: { direction: 'next' } }));
            });
        }, 50);
    }

    window.closeSettingsPopup = function() {
        if (window.currentSettingsWindowId && typeof window.closeWindow === 'function') {
            window.closeWindow(window.currentSettingsWindowId);
        }
    }

    function centerPopup(popup) {
        popup.style.left = '25%';
        popup.style.top = '25%';
        popup.style.height = 'auto';
    }

    function updateVolumePercentage(event) {
        var slider = event.target;
        var percentage = slider.value + "%";
        var percentageSpan = slider.nextElementSibling;
        percentageSpan.textContent = percentage;
    }

    function updateBGMVolume() {
        var bgmVolume = document.getElementById("bgmVolumeSlider").value / 100;
        window.AudioSettings.bgmVolume = bgmVolume;
        document.getElementById('bgmVolumePercentage').textContent = Math.round(bgmVolume*100)+'%';
        broadcastAudioSettings();
    }

    function updateUIVolume() {
        var uiVolume = document.getElementById("uiVolumeSlider").value / 100;
        window.AudioSettings.uiVolume = uiVolume;
        document.getElementById('uiVolumePercentage').textContent = Math.round(uiVolume*100)+'%';
        broadcastAudioSettings();
    }
});