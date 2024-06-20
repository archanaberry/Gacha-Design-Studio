//document.addEventListener('DOMContentLoaded', function() {
//    const container = document.getElementById('panel1'); // Ganti dengan id panel karakter SVG Anda
//    const toggleSelectorBtn = document.getElementById('toggleSelectorBtn');
//    let startX, startY, isDragging = false;
//    let selectorActive = false;
//    let selectedLayers = [];
//    const selectionBox = document.createElement('div');
//    selectionBox.className = 'selection-box';
//    container.appendChild(selectionBox);
//  
//    function setSelectionBox(x, y, w, h) {
//        selectionBox.style.left = x + 'px';
//        selectionBox.style.top = y + 'px';
//        selectionBox.style.width = Math.abs(w) + 'px';
//        selectionBox.style.height = Math.abs(h) + 'px';
//  
//        // Flip the box if necessary
//        if (w < 0) {
//            selectionBox.style.left = (x + w) + 'px';
//        }
//        if (h < 0) {
//            selectionBox.style.top = (y + h) + 'px';
//        }
//    }
//  
//    function clearSelectionBox() {
//        selectionBox.style.width = '0px';
//        selectionBox.style.height = '0px';
//    }
//  
//    function toggleSelector() {
//        selectorActive = !selectorActive;
//        if (selectorActive) {
//            toggleSelectorBtn.textContent = "Matikan Seleksi";
//        } else {
//            toggleSelectorBtn.textContent = "Nyalakan Seleksi";
//            clearSelectionBox();
//        }
//    }
//  
//    function selectLayersInBox(box) {
//        selectedLayers = [];
//        const layers = document.querySelectorAll('.layer');
//        layers.forEach(layer => {
//            const layerRect = layer.getBoundingClientRect();
//            if (box.left <= layerRect.right && box.right >= layerRect.left && 
//                box.top <= layerRect.bottom && box.bottom >= layerRect.top) {
//                layer.classList.add('selected');
//                selectedLayers.push(layer);
//            }
//        });
//    }
//  
//    function deselectAllLayers() {
//        selectedLayers.forEach(layer => {
//            layer.classList.remove('selected');
//        });
//        selectedLayers = [];
//    }
//  
//    function moveSelectedLayers(dx, dy) {
//        selectedLayers.forEach(layer => {
//            const layerRect = layer.getBoundingClientRect();
//            layer.style.left = layerRect.left + dx + 'px';
//            layer.style.top = layerRect.top + dy + 'px';
//        });
//    }
//  
//    container.addEventListener('mousedown', function(e) {
//        if (!selectorActive) return;
//        startX = e.clientX;
//        startY = e.clientY;
//        isDragging = true;
//        clearSelectionBox();
//        deselectAllLayers();
//    });
//  
//    container.addEventListener('mousemove', function(e) {
//        if (!selectorActive || !isDragging) return;
//        const currentX = e.clientX;
//        const currentY = e.clientY;
//        const width = currentX - startX;
//        const height = currentY - startY;
//        setSelectionBox(startX, startY, width, height);
//    });
//  
//    container.addEventListener('mouseup', function(e) {
//        if (!selectorActive || !isDragging) return;
//        isDragging = false;
//        const box = selectionBox.getBoundingClientRect();
//        selectLayersInBox(box);
//        clearSelectionBox();
//    });
//  
//    // Touch events
//    container.addEventListener('touchstart', function(e) {
//        if (!selectorActive) return;
//        const touch = e.touches[0];
//        startX = touch.clientX;
//        startY = touch.clientY;
//        isDragging = true;
//        clearSelectionBox();
//        deselectAllLayers();
//    }, {passive: true});
//  
//    container.addEventListener('touchmove', function(e) {
//        if (!selectorActive || !isDragging) return;
//        const touch = e.touches[0];
//        const currentX = touch.clientX;
//        const currentY = touch.clientY;
//        const width = currentX - startX;
//        const height = currentY - startY;
//        setSelectionBox(startX, startY, width, height);
//        e.preventDefault();
//    }, {passive: false});
//  
//    container.addEventListener('touchend', function(e) {
//        if (!selectorActive || !isDragging) return;
//        isDragging = false;
//        const box = selectionBox.getBoundingClientRect();
//        selectLayersInBox(box);
//        clearSelectionBox();
//    });
//  
//    // Keyboard events
//    document.addEventListener('keydown', function(e) {
//        if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
//            if (!selectedLayers.length) return;
//            const dx = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
//            const dy = e.key === 'ArrowDown' ? 1 : e.key === 'ArrowUp' ? -1 : 0;
//            moveSelectedLayers(dx, dy);
//        }
//    });
//  
//    toggleSelectorBtn.addEventListener('click', toggleSelector);
//});
//



document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('panel1');
    const toggleSelectorBtn = document.getElementById('toggleSelectorBtn');
    let startX, startY, isDragging = false;
    let selectorActive = false;
    let selectedLayers = [];
    const selectionBox = document.createElement('div');
    selectionBox.className = 'selection-box';
    container.appendChild(selectionBox);

    let interval; // Untuk interval tombol D-Pad

    function setSelectionBox(x, y, w, h) {
        selectionBox.style.left = x + 'px';
        selectionBox.style.top = y + 'px';
        selectionBox.style.width = Math.abs(w) + 'px';
        selectionBox.style.height = Math.abs(h) + 'px';

        if (w < 0) {
            selectionBox.style.left = (x + w) + 'px';
        }
        if (h < 0) {
            selectionBox.style.top = (y + h) + 'px';
        }
    }

    function clearSelectionBox() {
        selectionBox.style.width = '0px';
        selectionBox.style.height = '0px';
    }

    function toggleSelector() {
        selectorActive = !selectorActive;
        if (selectorActive) {
            toggleSelectorBtn.textContent = "Matikan Seleksi";
        } else {
            toggleSelectorBtn.textContent = "Nyalakan Seleksi";
            clearSelectionBox();
        }
    }

    function selectLayersInBox(box) {
        const layers = document.querySelectorAll('.layer');
        selectedLayers = [];
        layers.forEach(layer => {
            const layerRect = layer.getBoundingClientRect();
            if (box.left <= layerRect.right && box.right >= layerRect.left &&
                box.top <= layerRect.bottom && box.bottom >= layerRect.top) {
                layer.classList.add('selected');
                selectedLayers.push({
                    element: layer,
                    name: layer.dataset.name,
                    x: parseFloat(layer.style.left) || 0,
                    y: parseFloat(layer.style.top) || 0,
                    width: layer.offsetWidth,
                    height: layer.offsetHeight,
                    flipHorizontal: layer.dataset.flipHorizontal === 'true',
                    flipVertical: layer.dataset.flipVertical === 'true',
                    rotation: parseFloat(layer.dataset.rotation) || 0,
                    zoom: parseFloat(layer.dataset.zoom) || 1
                });
            }
        });
        console.log(`Lapisan yang dipilih: ${selectedLayers.length}`);
        updateLayerNameInput();
        updateCoordInput();
    }

    function deselectAllLayers() {
        selectedLayers.forEach(layerObj => {
            layerObj.element.classList.remove('selected');
        });
        console.log(`Lapisan yang tidak dipilih: ${selectedLayers.length}`);
        selectedLayers = [];
        updateLayerNameInput();
        updateCoordInput();
    }

    function updateLayerNameInput() {
        const layerNames = selectedLayers.map(layerObj => layerObj.name).join(", ");
        document.getElementById('layerName').value = layerNames;
    }

    function updateCoordInput() {
        if (selectedLayers.length > 0) {
            const selected = selectedLayers[0]; // Asumsikan hanya satu lapisan yang dipilih
            document.getElementById('xCoord').value = selected.x;
            document.getElementById('yCoord').value = selected.y;
        } else {
            document.getElementById('xCoord').value = '';
            document.getElementById('yCoord').value = '';
        }
    }

    function moveSelectedLayers(dx, dy) {
        selectedLayers.forEach(layerObj => {
            const layer = layerObj.element;
            layerObj.x += dx;
            layerObj.y += dy;
            layer.style.left = layerObj.x + 'px';
            layer.style.top = layerObj.y + 'px';
        });
        updateCoordInput();
    }

    const sensitivity = 10;

    function moveLayer(direction) {
        if (!selectedLayers.length) return;

        let dx = 0, dy = 0;
        switch (direction) {
            case 'up':
                dy = -sensitivity;
                break;
            case 'down':
                dy = sensitivity;
                break;
            case 'left':
                dx = -sensitivity;
                break;
            case 'right':
                dx = sensitivity;
                break;
        }
        moveSelectedLayers(dx, dy);
    }

    function startMove(direction) {
        moveLayer(direction);
        interval = setInterval(() => moveLayer(direction), 100);
    }

    function stopMove() {
        clearInterval(interval);
    }

    document.addEventListener('keydown', function(e) {
        const arrowKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
        if (!arrowKeys.includes(e.key) || !selectorActive) return;
        moveLayer(e.key.replace('Arrow', '').toLowerCase());
    });

    container.addEventListener('mousedown', function(e) {
        if (!selectorActive) return;
        startX = e.clientX;
        startY = e.clientY;
        isDragging = true;
        clearSelectionBox();
        deselectAllLayers();
    });

    container.addEventListener('mousemove', function(e) {
        if (!selectorActive || !isDragging) return;
        const currentX = e.clientX;
        const currentY = e.clientY;
        const width = currentX - startX;
        const height = currentY - startY;
        setSelectionBox(startX, startY, width, height);
    });

    container.addEventListener('mouseup', function(e) {
        if (!selectorActive || !isDragging) return;
        isDragging = false;
        const box = selectionBox.getBoundingClientRect();
        selectLayersInBox(box);
        clearSelectionBox();
    });

    container.addEventListener('touchstart', function(e) {
        if (!selectorActive) return;
        const touch = e.touches[0];
        startX = touch.clientX;
        startY = touch.clientY;
        isDragging = true;
        clearSelectionBox();
        deselectAllLayers();
    }, { passive: true });

    container.addEventListener('touchmove', function(e) {
        if (!selectorActive || !isDragging) return;
        const touch = e.touches[0];
        const currentX = touch.clientX;
        const currentY = touch.clientY;
        const width = currentX - startX;
        const height = currentY - startY;
        setSelectionBox(startX, startY, width, height);
        e.preventDefault();
    }, { passive: false });

    container.addEventListener('touchend', function(e) {
        if (!selectorActive || !isDragging) return;
        isDragging = false;
        const box = selectionBox.getBoundingClientRect();
        selectLayersInBox(box);
        clearSelectionBox();
    });

    toggleSelectorBtn.addEventListener('click', toggleSelector);

    window.startMove = function(direction) {
        startMove(direction);
    };

    window.stopMove = function() {
        stopMove();
    };

    document.addEventListener('mouseup', stopMove);
    document.addEventListener('touchend', stopMove);
    document.addEventListener('touchcancel', stopMove);
});
