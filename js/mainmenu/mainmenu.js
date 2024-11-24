document.addEventListener("DOMContentLoaded", () => {
  // CSS styles for the maintenance popup
  const addStyles = () => {
    const styles = `
      .container {
        width: 50%;
        height: 50%;
        border: 0px solid #ccc;
        position: absolute;
        border-radius: 13px;
        cursor: move;
        overflow: hidden;
        box-shadow: 0px 0px 10px rgba(0,0,0,0.75);
        background-color: white;
      }

      .background {
        background-image: url('bg.png');
        background-size: cover;
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

      .header {
        background-color: #5E6CC9;
        padding: 20px;
        cursor: move;
        user-select: none;
        display: flex;
        align-items: center;
        border-bottom: 1px solid #ccc;
        width: 100%;
      }

      .close-button {
        background: none;
        position: absolute;
        left: 100%;
        transform: translateX(-160%);
        font-size: 5rem;
        cursor: pointer;
        color: white;
      }

      .shadow {
        box-shadow: 0px 0px 10px rgba(0,0,0,0.75);
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
        font-family: "Comfortaa", sans-serif;
        -webkit-text-stroke: 1.5px #fff;
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
        z-index: 999;
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
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
  };

  // HTML structure for maintenance popup
  const addPopupHTML = () => {
    const overlay = document.createElement("div");
    overlay.id = "overlay";
    document.body.appendChild(overlay);

    const maintenancePopup = `
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
  };

  // Center the popup in the screen
  const centerPopup = (popup) => {
    popup.style.left = '25%';
    popup.style.top = '25%';
    popup.style.height = 'auto';
  };

  // Drag functionality
  const enableDrag = (header, container) => {
    let offsetX, offsetY, isDragging = false;

    const startDrag = (e) => {
      e.preventDefault();
      isDragging = true;
      offsetX = e.clientX - container.offsetLeft;
      offsetY = e.clientY - container.offsetTop;
      document.addEventListener("mousemove", drag);
      document.addEventListener("mouseup", stopDrag);
    };

    const drag = (e) => {
      e.preventDefault();
      if (!isDragging) return;
      container.style.left = `${e.clientX - offsetX}px`;
      container.style.top = `${e.clientY - offsetY}px`;
    };

    const stopDrag = () => {
      isDragging = false;
      document.removeEventListener("mousemove", drag);
      document.removeEventListener("mouseup", stopDrag);
    };

    header.addEventListener("mousedown", startDrag);
  };

  // Resize functionality
  const enableResize = (resizer, container) => {
    let offsetX, offsetY, isResizing = false;

    const startResize = (e) => {
      e.preventDefault();
      isResizing = true;
      offsetX = e.clientX - container.offsetWidth;
      offsetY = e.clientY - container.offsetHeight;
      document.addEventListener("mousemove", resize);
      document.addEventListener("mouseup", stopResize);
    };

    const resize = (e) => {
      e.preventDefault();
      if (!isResizing) return;
      container.style.width = `${e.clientX - offsetX}px`;
      container.style.height = `${e.clientY - offsetY}px`;
    };

    const stopResize = () => {
      isResizing = false;
      document.removeEventListener("mousemove", resize);
      document.removeEventListener("mouseup", stopResize);
    };

    resizer.addEventListener("mousedown", startResize);
  };

  // Show the maintenance popup
  window.showMaintenance = (message) => {
    console.log('Pesan pemeliharaan:', message); // Console log for debugging

    const overlay = document.getElementById('overlay');
    const popup = document.getElementById('maintenancePopup');
    const messageDiv = document.getElementById('maintenanceMessage');
    const header = document.getElementById("header");
    const resizer = document.getElementById("resizer");

    messageDiv.textContent = message;

    overlay.style.display = 'block';
    popup.style.display = 'block';
    centerPopup(popup);

    enableDrag(header, popup);
    enableResize(resizer, popup);
  };

  // Close the maintenance popup
  window.closeMaintenancePopup = () => {
    document.getElementById('maintenancePopup').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
  };

  // Initialize
  const initialize = () => {
    addStyles();
    addPopupHTML();
  };

  initialize();
});
