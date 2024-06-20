function setBackground(panelId) {
    const fileInput = document.getElementById(panelId === 'panel1' ? 'imageUpload1' : 'imageUpload2');
    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        const panel = document.getElementById(panelId);
        panel.style.backgroundImage = `url('${e.target.result}')`;
    }

    reader.readAsDataURL(file);
}

function setOpacity(panelId) {
    const opacitySlider = document.getElementById(panelId === 'panel1' ? 'opacitySlider1' : 'opacitySlider2');
    const opacityInput = document.getElementById(panelId === 'panel1' ? 'opacityInput1' : 'opacityInput2');
    const panel = document.getElementById(panelId);

    panel.style.opacity = opacitySlider.value / 100;
    opacityInput.value = opacitySlider.value + '%';
}