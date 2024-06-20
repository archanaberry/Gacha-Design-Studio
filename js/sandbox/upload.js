function addSVG(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const layer = new Layer(file.name, e.target.result, null, {x: 0, y: 0});
            layers.push(layer);
            layer.attach(document.querySelector('.container'), onlayerdragstart);
        };
        reader.readAsDataURL(file);
    }
}

function addImage(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const layer = new Layer(file.name, e.target.result, null, {x: 0, y: 0});
            layers.push(layer);
            layer.attach(document.querySelector('.container'), onlayerdragstart);
        };
        reader.readAsDataURL(file);
    }
}

function handleDrop(e) {
    e.preventDefault();
    const files = e.dataTransfer.files;
    for (const file of files) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const layer = new Layer(file.name, event.target.result, null, null, null, null, null, null, null, null, null);
            layers.push(layer);
            layer.attach(document.querySelector('.container'), onlayerdragstart);
        };
        reader.readAsDataURL(file);
    }
}

function handleDragOver(e) {
    e.preventDefault();
}

document.addEventListener('DOMContentLoaded', function() {
    const container = document.querySelector('.container');
    container.addEventListener('dragover', handleDragOver);
    container.addEventListener('drop', handleDrop);
});
