document.addEventListener("DOMContentLoaded", function() {
  function openSettings(message = "Sedang dalam perbaikan...") {
    var overlay = document.getElementById('overlay');
    var popup = document.getElementById('settingsPopup');
    var messageDiv = document.getElementById('settingsMessage');

    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'overlay';
      overlay.className = 'overlay'; // tambahkan kelas overlay
      document.body.appendChild(overlay);
    }

    if (!popup) {
      popup = document.createElement('div');
      popup.id = 'settingsPopup';
      popup.className = 'container'; // tambahkan kelas container
      popup.innerHTML = `
        <div class="header" id="header">
          <h2 class="title">Gacha Design Studio</h2>
          <button class="close-button" onclick="closeSettingsPopup()">&times;</button>
        </div>
        <div class="content message" id="settingsMessage"></div>
        <div class="resizer" id="resizer"></div>
        <button class="ok-button" onclick="closeSettingsPopup()">OK</button>
      `;
      document.body.appendChild(popup);
    }

    messageDiv = document.getElementById('settingsMessage');
    messageDiv.textContent = message;

    popup.style.display = 'block';
    overlay.style.display = 'block';

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

  function closeSettingsPopup() {
    document.getElementById('settingsPopup').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
  }

  function centerPopup(popup) {
    popup.style.left = '25%';
    popup.style.top = '25%';
    popup.style.height = 'auto';
  }

  // CSS and HTML as string
  const css = `
    /* Popup Styles */
    .container {
      width: 50%;
      height: 50%;
      border: 0px solid #ccc;
      position: fixed; /* Changed to fixed */
      border-radius: 13px;
      cursor: move;
      overflow: hidden;
      box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.75);
      background-color: white;
      z-index: 100000; /* Very high z-index */
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
      top: -15px;
    }

    #overlay {
      display: none;
      position: fixed; /* Changed to fixed */
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0,0,0,0.5);
      z-index: 99999; /* Very high z-index */
    }

    #settingsPopup {
      display: none;
      position: fixed; /* Changed to fixed */
      top: 50%;
      left: 50%;
      z-index: 100000; /* Very high z-index */
      transform: translate(-50%, -50%);
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

  // Append CSS and HTML to the document
  const styleElement = document.createElement('style');
  styleElement.textContent = css;
  document.head.appendChild(styleElement);

  const overlayHTML = '<div id="overlay"></div>';
  const popupHTML = `
    <div id="settingsPopup" class="container">
      <div class="header" id="header">
        <h2 class="title">Gacha Design Studio</h2>
        <button class="close-button" onclick="closeSettingsPopup()">&times;</button>
      </div>
      <div class="content message" id="settingsMessage"></div>
      <div class="resizer" id="resizer"></div>
      <button class="ok-button" onclick="closeSettingsPopup()">OK</button>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', popupHTML); // Masukkan popup terlebih dahulu
  document.body.insertAdjacentHTML('beforeend', overlayHTML); // Kemudian masukkan overlay
  
  // Expose functions globally
  window.openSettings = openSettings;
  window.closeSettingsPopup = closeSettingsPopup;
});
