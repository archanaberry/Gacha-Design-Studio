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
                selectedLayers.push(layer);
            }
        });
        console.log(`Lapisan yang dipilih: ${selectedLayers.length}`);
    }

    function deselectAllLayers() {
        selectedLayers.forEach(layer => {
            layer.classList.remove('selected');
        });
        selectedLayers = [];
        console.log(`Lapisan yang tidak dipilih: ${selectedLayers.length}`);
    }

    function groupLayers() {
        const group = document.createElement('div');
        group.classList.add('layer-group');
        selectedLayers.forEach(layer => {
            group.appendChild(layer);
        });
        container.appendChild(group);
        deselectAllLayers();
        selectedLayers.push(group);
        group.classList.add('selected');
    }

    function ungroupLayers() {
        selectedLayers.forEach(group => {
            if (group.classList.contains('layer-group')) {
                while (group.firstChild) {
                    container.appendChild(group.firstChild);
                }
                group.remove();
            }
        });
        deselectAllLayers();
    }

    function deleteSelectedLayer() {
        selectedLayers.forEach(layer => {
            layer.remove();
        });
        deselectAllLayers();
    }

    toggleSelectorBtn.addEventListener('click', toggleSelector);

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

    document.getElementById('toggleSelectorBtn').addEventListener('click', toggleSelector);
    document.getElementById('groupLayersBtn').addEventListener('click', groupLayers);
    document.getElementById('ungroupLayersBtn').addEventListener('click', ungroupLayers);
    document.getElementById('deleteSelectedLayerBtn').addEventListener('click', deleteSelectedLayer);
});