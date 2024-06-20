function addSVG(event) {
    const files = event.target.files;
    const maxLayers = 10;
    const svgLayers = ['base', 'trim', 'shape1', 'shape2', 'shape3', 'shape4', 'shape5', 'shade', 'light', 'outline'];

    if (files.length > maxLayers) {
        alert(`Maksimal ${maxLayers} file yang dapat diunggah.`);
        return;
    }

    const newLayer = new Layer(`Shape${layers.length}`, ...Array(maxLayers).fill(null));

    for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.onload = function(e) {
            newLayer[`#images`][svgLayers[i]] = e.target.result;
            updateLayerElement(newLayer, svgLayers[i], e.target.result);
        };
        reader.readAsDataURL(files[i]);
    }

    layers.push(newLayer);
    newLayer.attach(document.querySelector('.container'), onlayerdragstart);
}

function addImage(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const newLayer = new Layer(`Shape${layers.length}`, e.target.result, null, null, null, null, null, null, null, null, null);
        layers.push(newLayer);
        newLayer.attach(document.querySelector('.container'), onlayerdragstart);
    };
    reader.readAsDataURL(file);
}

function updateLayerElement(layer, key, src) {
    const imgElement = document.createElement('img');
    imgElement.src = src;
    imgElement.alt = key;
    imgElement.classList.add(key);
    imgElement.draggable = false;
    layer.element.appendChild(imgElement);
}
