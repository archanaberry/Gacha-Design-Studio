/****************************************************************/
//                                                              //
//  -------------------Gacha Design Studio--------------------  //
//  Created by: Archana Berry                                   //
//  Assets credits: Lunime, OGL (Open Game License), MIT CC     //
//  Version resource: v0.001_alpha                              //
//  File: studioopen.js (diperbaiki total)                       //
//  Type: module[music]                                         //
//  Desc: Overlay netral/transparan sebagai wadah kosong saja   //
//                                                              //
//  ----------------------------------------------------------  //
//                                                              //
//  Perbaikan utama:                                            //
//  - Overlay sekarang benar-benar NETRAL & BEBAS               //
//  - Tidak ada panel1/panel2 fixed, tidak ada flex row         //
//  - Tidak ada footer otomatis, tidak ada batasan layout       //
//  - overlayRoot hanya wadah fullscreen transparan (background none)
//  - Frame (studiopose.js) bebas isi apa saja langsung ke overlayRoot
//  - Helpers dihilangkan total (tidak dibutuhkan lagi)         //
//  - Kompatibel dengan studiopose.js yang isi layout full seperti HTML asli
//                                                              //
//**************************************************************//

document.addEventListener("DOMContentLoaded", function () {
    // CSS tetap sama (untuk popup menu studio)
    var styles = `
@font-face {
  font-family: "Comfortaa";
  src: url("../../assets/font/Comfortaa-Regular.ttf") format("truetype");
}
@font-face {
  font-family: "Comfortaa-Bold";
  src: url("../../assets/font/Comfortaa-Bold.ttf") format("truetype");
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
.title {
    color: white;
    position: sticky;
    font-family: "Comfortaa", sans-serif;
    -webkit-text-stroke: 1.5px #000;
    white-space: pre-line;
}
.message {
    color: black;
    overflow-y: auto;
    user-select: text;
    min-height: 15%;
    max-height: 80%;
}
.header2 {
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
    right: 10px;
    top: 10px;
    font-size: 1.5rem;
    cursor: pointer;
    color: white;
}
.shadow {
    box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.75);
}
.content {
    padding: 16px;
}
.studio-button {
    background-color: #5E6CC9;
    border: 3px solid #000;
    font-size: 1rem;
    color: white;
    padding: 20px 30px;
    border-radius: 10px;
    cursor: pointer;
    display: block;
    margin: 20px auto;
    font-family: "Comfortaa", sans-serif;
    -webkit-text-stroke: 1.5px #fff;
}
#overlay {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.5);
    z-index: 999;
}
#studioPopup {
    display: none;
    position: fixed;
    top: 50%;
    left: 50%;
    z-index: 1000;
}
.resizer2 {
    width: 10px;
    height: 10px;
    position: absolute;
    bottom: 0;
    right: 0;
    cursor: se-resize;
}
#fadeOverlay {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0);
    z-index: 2147483647;
    pointer-events: none;
}
.fade-in-black {
    animation: fadeInToBlack 1.5s ease-in-out forwards;
}
.fade-out-black {
    animation: fadeOutFromBlack 1.5s ease-in-out forwards;
}
.fade-in-menu {
    animation: fadeInMenu 1.5s ease-in-out forwards;
}
.fade-out-menu {
    animation: fadeOutMenu 1.5s ease-in-out forwards;
}
@keyframes fadeInToBlack {
    0% {
        background-color: rgba(0, 0, 0, 0);
    }
    100% {
        background-color: rgba(0, 0, 0, 1);
    }
}
@keyframes fadeOutFromBlack {
    0% {
        background-color: rgba(0, 0, 0, 1);
    }
    100% {
        background-color: rgba(0, 0, 0, 0);
    }
}
@keyframes fadeInMenu {
    0% {
        background-color: rgba(0, 0, 0, 1);
    }
    100% {
        background-color: rgba(0, 0, 0, 0);
    }
}
@keyframes fadeOutMenu {
    0% {
        background-color: rgba(0, 0, 0, 0);
    }
    100% {
        background-color: rgba(0, 0, 0, 1);
    }
}
    `;

    var styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    // We don't need the old overlay/popup HTML anymore - windowhandler.js creates its own

    // Fungsi popup menggunakan windowhandler.js API
    window.openStudio = function(message) {
        // Check if windowhandler is available
        if (typeof window.openWindow !== 'function') {
            console.error('windowhandler.js API not loaded');
            return;
        }

        var studioContent = `
            <div class="content message" id="studioMessage">${message || ''}</div>
            <button class="studio-button" onclick="openPoser()">Buka studio pose</button>
            <button class="studio-button" onclick="openSandbox()">Buka studio kotak pasir</button>
        `;

            // Create studio window using windowhandler API
            // compute safe center spawn (10% top/bottom gap)
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
                content: studioContent,
                footer: '<div style="width:100%;display:flex;justify-content:center;"><button class="footer-btn wh-ok-btn" onclick="window.closeWindow(window.currentStudioWindowId)">Close</button></div>',
                width: '50%',
                height: 'auto',
                position: { top: _pos.top, left: _pos.left },
                lockUnderlay: false,
                overlayOpacity: 0.4
            });

        // Get the window ID from the manager
        var windowIds = window.windowManager.getWindowIds();
        window.currentStudioWindowId = windowIds[windowIds.length - 1];
    }

    window.closeStudioPopup = function () {
        if (window.currentStudioWindowId && typeof window.closeWindow === 'function') {
            window.closeWindow(window.currentStudioWindowId);
        }
    }
});

// Overlay system — sekarang NETRAL & TRANSPARAN (hanya wadah kosong)
(function () {
    if (window.StudioOverlay) return;

    var overlayRoot = document.createElement('div');
    overlayRoot.className = 'studio-overlay-root';
    overlayRoot.style.display = 'none';
    overlayRoot.style.position = 'fixed';
    overlayRoot.style.inset = '0';
    overlayRoot.style.zIndex = '2147483646';
    overlayRoot.style.background = 'none'; // transparan total (frame akan set background sendiri)
    //overlayRoot.style.overflow = 'hidden'; // biar frame control sendiri
    overlayRoot.style.fontFamily = 'Comfortaa, sans-serif';

    if (document.body) {
        document.body.appendChild(overlayRoot);
    } else {
        document.addEventListener('DOMContentLoaded', () => document.body.appendChild(overlayRoot));
    }

    var frames = {};

    // Create fade overlay element
    var fadeOverlay = document.createElement('div');
    fadeOverlay.id = 'fadeOverlay';
    if (document.body) {
        document.body.appendChild(fadeOverlay);
    } else {
        document.addEventListener('DOMContentLoaded', () => document.body.appendChild(fadeOverlay));
    }

    function registerFrame(name, initFn) {
        if (!name || typeof initFn !== 'function') return;
        frames[name] = initFn;
    }

    function showOverlay(mode, push) {
        if (!mode) return;

        overlayRoot.style.display = 'block';
        overlayRoot.style.pointerEvents = 'auto';
        overlayRoot.innerHTML = ''; // kosong total — frame bebas isi apa saja

        // Start fade-in effect (1.5 seconds)
        fadeOverlay.style.display = 'block';
        fadeOverlay.classList.remove('fade-out-black');
        fadeOverlay.classList.add('fade-in-black');

        // After fade-in completes (1.5s), start loading parallel, then fade-out
        setTimeout(() => {
            // Show loading state while studio loads in parallel
            if (frames[mode]) {
                try {
                    // Initialize frame while loading overlay is still black
                    frames[mode](overlayRoot);
                } catch (e) {
                    console.error('frame init error', e);
                    overlayRoot.innerHTML = '<h2 style="color:red;padding:20px;">Error loading frame: ' + mode + '</h2>';
                }
            } else {
                overlayRoot.innerHTML = '<h2 style="padding:20px;">Loading ' + mode + '...</h2>';
            }

            // Wait for loading time (1.5 seconds) in parallel
            setTimeout(() => {
                // Now fade-out the black overlay to reveal the studio (1.5 seconds)
                fadeOverlay.classList.remove('fade-in-black');
                // Force reflow to trigger animation
                void fadeOverlay.offsetWidth;
                fadeOverlay.classList.add('fade-out-black');

                // After fade-out completes, hide the overlay
                setTimeout(() => {
                    fadeOverlay.classList.remove('fade-out-black');
                    fadeOverlay.style.display = 'none';
                }, 1500);
            }, 1500);
        }, 1500);

        if (push !== false) {
            var newUrl = new URL(window.location);
            newUrl.searchParams.set('mode', mode);
            history.pushState({ mode: mode }, '', newUrl.toString());
        }
        // notify frames that overlay is shown
        try { window.dispatchEvent(new CustomEvent('studiooverlay:show', { detail: { mode: mode } })); } catch (e) {}
    }

    function hideOverlay(push) {
        // Start fade-in menu effect only (main menu fades in from black - 1.5 seconds)
        fadeOverlay.style.display = 'block';
        fadeOverlay.classList.remove('fade-out-menu', 'fade-in-black', 'fade-out-black');
        fadeOverlay.classList.add('fade-in-menu');

        // DON'T hide overlayRoot immediately! Let it fade naturally
        // overlayRoot akan di-hide setelah fade animation selesai

        // After fade-in menu completes (1.5 seconds), hide overlay
        setTimeout(() => {
            fadeOverlay.classList.remove('fade-in-menu');
            fadeOverlay.style.display = 'none';
            
            // NOW hide overlayRoot setelah fade complete
            overlayRoot.style.display = 'none';
            overlayRoot.style.pointerEvents = 'none';
            overlayRoot.innerHTML = ''; // bersihkan saat tutup
        }, 1500);

        if (push !== false) {
            var newUrl = new URL(window.location);
            newUrl.searchParams.delete('mode');
            history.pushState({}, '', newUrl.toString());
        }
        // notify frames that overlay is hidden so they can cleanup
        try { window.dispatchEvent(new CustomEvent('studiooverlay:hide')); } catch (e) {}
    }

    window.registerStudioFrame = registerFrame;
    window.StudioOverlay = {
        show: function (mode) { showOverlay(mode, true); },
        hide: function () { hideOverlay(true); },
        isShown: function () { return overlayRoot.style.display !== 'none'; },
        currentMode: function () {
            var urlParams = new URLSearchParams(window.location.search);
            return urlParams.get('mode');
        }
    };

    window.addEventListener('popstate', function () {
        var urlParams = new URLSearchParams(window.location.search);
        var mode = urlParams.get('mode');
        if (mode && (mode === 'studiopose' || mode === 'studiosandbox')) {
            showOverlay(mode, false);
        } else {
            hideOverlay(false);
        }
    });

    // Pending frame (jika load sebelum register)
    if (window.__pendingStudioPose) {
        registerFrame('studiopose', window.__pendingStudioPose);
        delete window.__pendingStudioPose;
    }
    if (window.__pendingStudioSandbox) {
        registerFrame('studiosandbox', window.__pendingStudioSandbox);
        delete window.__pendingStudioSandbox;
    }
})();

// Open studio tetap sama
function openPoser() {
    closeStudioPopup();
    setTimeout(function() {
        var attempts = 0;
        var tryShow = function() {
            if (window.StudioOverlay && typeof window.StudioOverlay.show === 'function') {
                window.StudioOverlay.show('studiopose');
            } else {
                attempts++;
                if (attempts < 8) {
                    setTimeout(tryShow, 250);
                } else {
                    console.warn('Studio overlay not available: studiopose');
                    window.location.href = '?mode=studiopose';
                }
            }
        };
        tryShow();
    }, 250);
}

function openSandbox() {
    closeStudioPopup();
    setTimeout(function() {
        var attempts = 0;
        var tryShow = function() {
            if (window.StudioOverlay && typeof window.StudioOverlay.show === 'function') {
                window.StudioOverlay.show('studiosandbox');
            } else {
                attempts++;
                if (attempts < 8) {
                    setTimeout(tryShow, 250);
                } else {
                    console.warn('Studio overlay not available: studiosandbox');
                    window.location.href = '?mode=studiosandbox';
                }
            }
        };
        tryShow();
    }, 250);
}