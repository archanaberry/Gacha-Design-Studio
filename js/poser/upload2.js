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
