function deleteSelectedLayers() {
    selectedLayers.forEach(layerObj => {
        const parent = layerObj.element.parentNode;
        layerObj.element.remove();
        if (parent.classList.contains('layer-group') && parent.children.length === 0) {
            parent.remove();
        }
    });
    selectedLayers = [];
}

document.getElementById('deleteButton').addEventListener('click', function() {
    deleteSelectedLayers();
});
