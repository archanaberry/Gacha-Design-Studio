// Fungsi global agar tidak ReferenceError
window.openBgPicker = function() {
    var bgFileInput = document.getElementById('bgFileInput');
    if (bgFileInput) bgFileInput.click();
};
/****************************************************************/
//                                                              //
//  -------------------Gacha Design Studio--------------------  //
//  Created by: Archana Berry                                   //
//  Assets credits: Lunime, OGL (Open Game License), MIT CC     //
//  Version resource: v0.001_alpha                              //
//  File: mainmenu.js                                           //
//  Type: module[menu]                                          //
//  Desc: Mainmenu layout's and all utility                     //
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

// mainmenu.js

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
        position: absolute;
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

// Fungsi global agar tidak ReferenceError
window.openBgPicker = function() {
    var bgFileInput = document.getElementById('bgFileInput');
    if (bgFileInput) bgFileInput.click();
};
    .title {
        color: white;
        position: sticky;
        font-family: "Comfortaa", sans-serif; /* ganti font menjadi font lokal */
        -webkit-text-stroke: 1.5px #000; /* Stroke untuk outline */
        white-space: pre-line;
    }

    .message {
        color: black;
        overflow-y: auto;
        user-select: text;
        min-height: 15%;
        max-height: 80%;
    }

    .header {
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
        padding: 5%;
    }
 
    .ok-button {
        background-color: #5E6CC9;
        border: 3px solid #000;
        font-size: 1rem;
        color: white;
        padding: 20px 30px;
        border-radius: 10px;
        cursor: pointer;
        display: block;
        margin: 0 auto;
        font-family: "Comfortaa", sans-serif; /* ganti font menjadi font lokal */
        -webkit-text-stroke: 1.5px #fff; /* Stroke untuk outline */
        bottom: 20px;
    }

    #overlay {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.5);
        z-index: 998;
    }

    #maintenancePopup {
        display: none;
        position: fixed;
        top: 50%;
        left: 50%;
        z-index: 1000;
    }

    .resizer {
        width: 10px;
        height: 10px;
        position: absolute;
        bottom: 0;
        right: 0;
        cursor: se-resize;
    }
    `;

    var styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    // We don't need the old overlay/popup HTML anymore - windowhandler.js creates its own

    // Function definitions using windowhandler.js API
    window.showMaintenance = function(message) {
        console.log('Pesan pemeliharaan:', message); // Console log for debugging

        // Check if windowhandler is available
        if (typeof window.openWindow !== 'function') {
            console.error('windowhandler.js API not loaded');
            return;
        }

        var maintenanceContent = `
            <div class="content message" id="maintenanceMessage">${message || ''}</div>
        `;

        // Create maintenance window using windowhandler API
            // Create maintenance window using windowhandler API
            function computeSafePosition(width, height) {
                function pctOf(v) { if (!v || typeof v !== 'string') return null; var s=v.trim(); if (s.endsWith('%')) return parseFloat(s.slice(0,-1)); return null; }
                var w = pctOf(width); var h = pctOf(height);
                var left = (w !== null) ? (10 + (80 - w) / 2) : 25;
                var top = (h !== null) ? (10 + (80 - h) / 2) : 25;
                return { left: left + '%', top: top + '%' };
            }
            var _pos = computeSafePosition('50%', 'auto');
            openWindow({
                title: 'Gacha Design Studio',
                content: maintenanceContent,
                footer: '<button class="footer-btn wh-ok-btn" onclick="window.closeWindow(window.currentMaintenanceWindowId)">OK</button>',
                width: '50%',
                height: 'auto',
                position: { top: _pos.top, left: _pos.left },
                lockUnderlay: false,
                overlayOpacity: 0.4
            });

        // Get the window ID from the manager
        var windowIds = window.windowManager.getWindowIds();
        window.currentMaintenanceWindowId = windowIds[windowIds.length - 1];
    }

    window.closeMaintenancePopup = function() {
        if (window.currentMaintenanceWindowId && typeof window.closeWindow === 'function') {
            window.closeWindow(window.currentMaintenanceWindowId);
        }
    }

    function centerPopup(popup) {
        popup.style.left = '25%';
        popup.style.top = '25%';
        popup.style.height = 'auto';
    }

    // Handler untuk mengganti background main menu
    var bgFileInput = document.getElementById('bgFileInput');
    if (bgFileInput) {
        bgFileInput.addEventListener('change', function (e) {
            var file = e.target.files[0];
            if (!file) return;
            var reader = new FileReader();
            reader.onload = function (evt) {
                var mainMenuBg = document.getElementById('mainMenuBg');
                if (mainMenuBg) {
                    mainMenuBg.src = evt.target.result;
                }
            };
            reader.readAsDataURL(file);
        });
    }
});
