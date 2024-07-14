let interval;

function updateCoordInput() {
    document.getElementById('xCoord').value = selected.x;
    document.getElementById('yCoord').value = selected.y;
}

function moveLayer(direction) {
    if (!selected) return;

    switch (direction) {
        case 'up':
            selected.y -= sensitivity;
            break;
        case 'down':
            selected.y += sensitivity;
            break;
        case 'left':
            selected.x -= sensitivity;
            break;
        case 'right':
            selected.x += sensitivity;
            break;
    }
    updateCoordInput();
}

function startMove(direction) {
    moveLayer(direction);
    interval = setInterval(() => moveLayer(direction), 0.1);
}

function stopMove() {
    clearInterval(interval);
}

document.addEventListener('mouseup', stopMove);
document.addEventListener('touchend', stopMove);
document.addEventListener('touchcancel', stopMove);