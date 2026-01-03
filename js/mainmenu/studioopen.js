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
    padding: 5%;
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
    `;

    var styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    // HTML popup menu studio tetap sama
    var overlay = document.createElement("div");
    overlay.id = "overlay";
    document.body.appendChild(overlay);

    var studioPopup = `
    <div id="studioPopup" class="container background shadow">
        <div class="header2" id="header2">
            <h2 class="title">Gacha Design Studio</h2>
            <button class="close-button" onclick="closeStudioPopup()">&times;</button>
        </div>
        <div class="content message" id="studioMessage"></div>
        <div class="resizer2" id="resizer2"></div>
        <button class="studio-button" onclick="openPoser()">Buka studio pose</button>
        <button class="studio-button" onclick="openSandbox()">Buka studio kotak pasir</button>
    </div>
    `;

    document.body.insertAdjacentHTML('beforeend', studioPopup);

    // Fungsi popup tetap sama (drag, resize, fade, dll.)
    window.openStudio = function(message) {
        var overlay = document.getElementById('overlay');
        var popup = document.getElementById('studioPopup');
        var messageDiv = document.getElementById('studioMessage');

        if (message) {
            messageDiv.textContent = message;
        }

        overlay.style.display = 'block';
        popup.style.display = 'block';

        centerPopup(popup);

        var header2 = document.getElementById("header2");
        var resizer2 = document.getElementById("resizer2");
        var container = popup;
        var offsetX, offsetY;
        var isDragging = false;
        var isResizing = false;

        function startDrag(e) {
            e.preventDefault();
            isDragging = true;
            offsetX = e.clientX - container.offsetLeft;
            offsetY = e.clientY - container.offsetTop;
            document.addEventListener("mousemove", drag);
            document.addEventListener("mouseup", stopDrag);
        }

        function startDragTouch(e) {
            e.preventDefault();
            isDragging = true;
            var touch = e.touches[0];
            offsetX = touch.clientX - container.offsetLeft;
            offsetY = touch.clientY - container.offsetTop;
            document.addEventListener("touchmove", dragTouch);
            document.addEventListener("touchend", stopDragTouch);
        }

        function drag(e) {
            e.preventDefault();
            if (!isDragging) return;
            container.style.left = e.clientX - offsetX + "px";
            container.style.top = e.clientY - offsetY + "px";
        }

        function dragTouch(e) {
            e.preventDefault();
            if (!isDragging) return;
            var touch = e.touches[0];
            container.style.left = touch.clientX - offsetX + "px";
            container.style.top = touch.clientY - offsetY + "px";
        }

        function stopDrag() {
            isDragging = false;
            document.removeEventListener("mousemove", drag);
            document.removeEventListener("mouseup", stopDrag);
        }

        function stopDragTouch() {
            isDragging = false;
            document.removeEventListener("touchmove", dragTouch);
            document.removeEventListener("touchend", stopDragTouch);
        }

        function startResize(e) {
            e.preventDefault();
            isResizing = true;
            offsetX = e.clientX - container.offsetWidth;
            offsetY = e.clientY - container.offsetHeight;
            document.addEventListener("mousemove", resize);
            document.addEventListener("mouseup", stopResize);
        }

        function startResizeTouch(e) {
            e.preventDefault();
            isResizing = true;
            var touch = e.touches[0];
            offsetX = touch.clientX - container.offsetWidth;
            offsetY = touch.clientY - container.offsetHeight;
            document.addEventListener("touchmove", resizeTouch);
            document.addEventListener("touchend", stopResizeTouch);
        }

        function resize(e) {
            e.preventDefault();
            if (!isResizing) return;
            container.style.width = e.clientX - offsetX + "px";
            container.style.height = e.clientY - offsetY + "px";
        }

        function resizeTouch(e) {
            e.preventDefault();
            if (!isResizing) return;
            var touch = e.touches[0];
            container.style.width = touch.clientX - offsetX + "px";
            container.style.height = touch.clientY - offsetY + "px";
        }

        function stopResize() {
            isResizing = false;
            document.removeEventListener("mousemove", resize);
            document.removeEventListener("mouseup", stopResize);
        }

        function stopResizeTouch() {
            isResizing = false;
            document.removeEventListener("touchmove", resizeTouch);
            document.removeEventListener("touchend", stopResizeTouch);
        }

        header2.addEventListener("mousedown", startDrag);
        header2.addEventListener("touchstart", startDragTouch);
        resizer2.addEventListener("mousedown", startResize);
        resizer2.addEventListener("touchstart", startResizeTouch);
    }

    window.closeStudioPopup = function () {
        var popup = document.getElementById('studioPopup');
        var overlay = document.getElementById('overlay');

        if (!popup || !overlay) return;

        fadeOut(popup, 300, function () {
            popup.style.display = 'none';
            popup.style.opacity = '';

            fadeOut(overlay, 200, function () {
                overlay.style.display = 'none';
                overlay.style.opacity = '';
            });
        });
    };

    function fadeOut(element, duration, callback) {
        var op = 1;
        var timer = setInterval(function () {
            if (op <= 0.1){
                clearInterval(timer);
                element.style.display = 'none';
                if (callback) callback();
            }
            element.style.opacity = op;
            element.style.filter = 'alpha(opacity=' + op * 100 + ")";
            op -= op * 0.1;
        }, duration / 50);
    }

    function centerPopup(popup) {
        popup.style.left = '25%';
        popup.style.top = '25%';
        popup.style.height = 'auto';
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
    overlayRoot.style.overflow = 'hidden'; // biar frame control sendiri
    overlayRoot.style.fontFamily = 'Comfortaa, sans-serif';

    if (document.body) {
        document.body.appendChild(overlayRoot);
    } else {
        document.addEventListener('DOMContentLoaded', () => document.body.appendChild(overlayRoot));
    }

    var frames = {};

    function registerFrame(name, initFn) {
        if (!name || typeof initFn !== 'function') return;
        frames[name] = initFn;
    }

    function showOverlay(mode, push) {
        if (!mode) return;

        overlayRoot.style.display = 'block';
        overlayRoot.innerHTML = ''; // kosong total — frame bebas isi apa saja

        if (frames[mode]) {
            try {
                // Panggil init dengan overlayRoot sebagai container utama (bukan p1/p2 terbatas)
                // Helpers dihilangkan (tidak perlu lagi)
                frames[mode](overlayRoot);
            } catch (e) {
                console.error('frame init error', e);
                overlayRoot.innerHTML = '<h2 style="color:red;padding:20px;">Error loading frame: ' + mode + '</h2>';
            }
        } else {
            overlayRoot.innerHTML = '<h2 style="padding:20px;">Loading ' + mode + '...</h2>';
        }

        if (push !== false) {
            var newUrl = new URL(window.location);
            newUrl.searchParams.set('mode', mode);
            history.pushState({ mode: mode }, '', newUrl.toString());
        }
    }

    function hideOverlay(push) {
        overlayRoot.style.display = 'none';
        overlayRoot.innerHTML = ''; // bersihkan saat tutup

        if (push !== false) {
            var newUrl = new URL(window.location);
            newUrl.searchParams.delete('mode');
            history.pushState({}, '', newUrl.toString());
        }
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