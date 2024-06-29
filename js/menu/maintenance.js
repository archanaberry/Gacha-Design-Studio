function showMaintenance(message) {
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

  header.addEventListener('mousedown', startDrag);
  header.addEventListener('touchstart', startDragTouch);
  resizer.addEventListener('mousedown', startResize);
  resizer.addEventListener('touchstart', startResizeTouch);

  function startDrag(e) {
    e.preventDefault();
    isDragging = true;
    offsetX = e.clientX - container.offsetLeft;
    offsetY = e.clientY - container.offsetTop;
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDrag);
  }

  function startDragTouch(e) {
    e.preventDefault();
    isDragging = true;
    const touch = e.touches[0];
    offsetX = touch.clientX - container.offsetLeft;
    offsetY = touch.clientY - container.offsetTop;
    document.addEventListener('touchmove', dragTouch);
    document.addEventListener('touchend', stopDragTouch);
  }

  function startResize(e) {
    e.preventDefault();
    isResizing = true;
    offsetX = e.clientX - container.offsetWidth;
    offsetY = e.clientY - container.offsetHeight;
    document.addEventListener('mousemove', resize);
    document.addEventListener('mouseup', stopResize);
  }

  function startResizeTouch(e) {
    e.preventDefault();
    isResizing = true;
    const touch = e.touches[0];
    offsetX = touch.clientX - container.offsetWidth;
    offsetY = touch.clientY - container.offsetHeight;
    document.addEventListener('touchmove', resizeTouch);
    document.addEventListener('touchend', stopResizeTouch);
  }

  function drag(e) {
    e.preventDefault();
    if (!isDragging) return;
    container.style.left = e.clientX - offsetX + 'px';
    container.style.top = e.clientY - offsetY + 'px';
  }

  function dragTouch(e) {
    e.preventDefault();
    if (!isDragging) return;
    const touch = e.touches[0];
    container.style.left = touch.clientX - offsetX + 'px';
    container.style.top = touch.clientY - offsetY + 'px';
  }

  function stopDrag() {
    isDragging = false;
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', stopDrag);
  }

  function stopDragTouch() {
    isDragging = false;
    document.removeEventListener('touchmove', dragTouch);
    document.removeEventListener('touchend', stopDragTouch);
  }

  function resize(e) {
    e.preventDefault();
    if (!isResizing) return;
    container.style.width = e.clientX - offsetX + 'px';
    container.style.height = e.clientY - offsetY + 'px';
  }

  function resizeTouch(e) {
    e.preventDefault();
    if (!isResizing) return;
    const touch = e.touches[0];
    container.style.width = touch.clientX - offsetX + 'px';
    container.style.height = touch.clientY - offsetY + 'px';
  }

  function stopResize() {
    isResizing = false;
    document.removeEventListener('mousemove', resize);
    document.removeEventListener('mouseup', stopResize);
  }

  function stopResizeTouch() {
    isResizing = false;
    document.removeEventListener('touchmove', resizeTouch);
    document.removeEventListener('touchend', stopResizeTouch);
  }

function closeMaintenancePopup() {
  document.getElementById('maintenancePopup').style.display = 'none';
  document.getElementById('overlay').style.display = 'none';
}

function centerPopup(popup) {
  popup.style.left = '50%';
  popup.style.top = '50%';
  //popup.style.transform = 'translate(-50%, -50%)';
}
}