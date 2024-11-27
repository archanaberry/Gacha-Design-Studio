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
        background-image: url('bg.png');
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

    // Add HTML elements
    var overlay = document.createElement("div");
    overlay.id = "overlay";
    document.body.appendChild(overlay);

    var maintenancePopup = `
    <div id="maintenancePopup" class="container background shadow">
        <div class="header" id="header">
            <h2 class="title">Gacha Design Studio</h2>
            <button class="close-button" onclick="closeMaintenancePopup()">&times;</button>
        </div>
        <div class="content message" id="maintenanceMessage"></div>
        <div class="resizer" id="resizer"></div>
        <button class="ok-button agreebutton" onclick="closeMaintenancePopup()">OK</button>
    </div>
    `;

    document.body.insertAdjacentHTML('beforeend', maintenancePopup);

    // Function definitions
    window.showMaintenance = function(message) {
        console.log('Pesan pemeliharaan:', message); // Console log for debugging

        var overlay = document.getElementById('overlay');
        var popup = document.getElementById('maintenancePopup');
        var messageDiv = document.getElementById('maintenanceMessage');

        messageDiv.textContent = message;

        overlay.style.display = 'block';
        popup.style.display = 'block';

        centerPopup(popup);

        var header = document.getElementById("header");
        var resizer = document.getElementById("resizer");
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

        header.addEventListener("mousedown", startDrag);
        header.addEventListener("touchstart", startDragTouch);
        resizer.addEventListener("mousedown", startResize);
        resizer.addEventListener("touchstart", startResizeTouch);
    }

    window.closeMaintenancePopup = function() {
        document.getElementById('maintenancePopup').style.display = 'none';
        document.getElementById('overlay').style.display = 'none';
    }

    function centerPopup(popup) {
        popup.style.left = '25%';
        popup.style.top = '25%';
        popup.style.height = 'auto';
    }
});
