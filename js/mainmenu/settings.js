// settings.js

document.addEventListener("DOMContentLoaded", function () {
    // Add CSS styles
    var styles = `
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
        padding: 5%;
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
        align-items: center;
        margin-bottom: 10px;
    }

    .slider-container {
        display: flex;
        flex-direction: column;
        align-items: center;
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
        display: inline-block;
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
        width: 100%;
        height: 10px;
        background: url('slider-bar.svg') no-repeat center;
        background-size: cover;
        outline: none;
        opacity: 0.7;
        transition: opacity .15s ease-in-out;
    }

    .custom-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 20px;
        height: 20px;
        background: url('handle.svg') no-repeat center;
        background-size: cover;
        cursor: pointer;
    }

    .custom-slider::-moz-range-thumb {
        width: 20px;
        height: 20px;
        background: url('handle.svg') no-repeat center;
        background-size: cover;
        cursor: pointer;
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
    `;

    var styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    // Add HTML elements
    var overlay = document.createElement("div");
    overlay.id = "overlay";
    document.body.appendChild(overlay);

    var settingsPopup = `
    <div id="settingsPopup" class="container background shadow">
        <div class="header1" id="header1">
            <h2 class="title">Gacha Design Studio - Settings</h2>
            <button class="close-button" onclick="closeSettingsPopup()">&times;</button>
        </div>
        <div class="content" id="settingsContent">
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
            </div>
        </div>
        <div class="resizer1" id="resizer1"></div>
        <button class="ok-button" onclick="closeSettingsPopup()">OK</button>
    </div>
    `;

    document.body.insertAdjacentHTML('beforeend', settingsPopup);

    // Function definitions
    window.openSettings = function() {
        var overlay = document.getElementById('overlay');
        var popup = document.getElementById('settingsPopup');

        overlay.style.display = 'block';
        popup.style.display = 'block';

        centerPopup(popup);

        var header1 = document.getElementById("header1");
        var resizer1 = document.getElementById("resizer1");
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

        header1.addEventListener("mousedown", startDrag);
        header1.addEventListener("touchstart", startDragTouch);
        resizer1.addEventListener("mousedown", startResize);
        resizer1.addEventListener("touchstart", startResizeTouch);

        document.getElementById("masterVolumeSlider").addEventListener("input", updateVolumePercentage);
        document.getElementById("bgmVolumeSlider").addEventListener("input", updateVolumePercentage);
        document.getElementById("sfxVolumeSlider").addEventListener("input", updateVolumePercentage);
        document.getElementById("uiVolumeSlider").addEventListener("input", updateVolumePercentage);
    }

    window.closeSettingsPopup = function() {
        document.getElementById('settingsPopup').style.display = 'none';
        document.getElementById('overlay').style.display = 'none';
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
});
