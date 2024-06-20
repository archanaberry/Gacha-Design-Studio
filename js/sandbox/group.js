document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('panel1');
    let selectedLayers = [];

    function groupSelectedLayers() {
        if (selectedLayers.length > 1) {
            const group = document.createElement('div');
            group.classList.add('layer-group');
            selectedLayers.forEach(layerObj => {
                group.appendChild(layerObj.element);
            });
            container.appendChild(group);
        }
    }

    function ungroupSelectedLayer() {
        selectedLayers.forEach(layerObj => {
            if (layerObj.element.parentNode.classList.contains('layer-group')) {
                const group = layerObj.element.parentNode;
                container.appendChild(layerObj.element);
                if (group.children.length === 0) {
                    group.remove();
                }
            }
        });
    }

    // Event listener for group button
    document.getElementById('groupButton').addEventListener('click', function() {
        groupSelectedLayers();
    });

    // Event listener for ungroup button
    document.getElementById('ungroupButton').addEventListener('click', function() {
        ungroupSelectedLayer();
    });
});
