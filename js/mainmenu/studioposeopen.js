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

    // Add HTML elements
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

    // Function definitions
    window.openStudio = function(message) {
        var overlay = document.getElementById('overlay');
        var popup = document.getElementById('studioPopup');
        var messageDiv = document.getElementById('studioMessage');

        messageDiv.textContent = message;

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

    window.closeStudioPopup = function() {
        fadeOut(document.getElementById('studioPopup'), 500, function() {
            document.getElementById('studioPopup').style.display = 'none';
            fadeOut(document.getElementById('overlay'), 500, function() {
                document.getElementById('overlay').style.display = 'none';
                document.body.removeChild(document.querySelector('mainmenu.html'));
            });
        });
    }

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

// Function to open Pose Studio
function openPoser() {
    closeStudioPopup();
    setTimeout(function() {
        window.location.href = 'studiopose.html';
    }, 500); // Adjust the timeout as needed
}

// Function to open Sandbox Studio
function openSandbox() {
    closeStudioPopup();
    setTimeout(function() {
        window.location.href = 'studiosandbox.html';
    }, 500); // Adjust the timeout as needed
}
