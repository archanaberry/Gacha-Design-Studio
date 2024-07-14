let sensitivity = 0.1 // Nilai awal untuk sensitivitas

function handleSensitivity(value) {
    sensitivity = parseFloat(value);
    document.getElementById('sensitivityInput').value = sensitivity;
}
