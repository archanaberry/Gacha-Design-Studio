document.addEventListener("DOMContentLoaded", function() {
    // Mendapatkan semua elemen gambar
    var draggables = document.querySelectorAll('img');

    // Mendapatkan elemen input untuk menampilkan dan mengubah koordinat
    var xCoordInput = document.getElementById('xCoord');
    var yCoordInput = document.getElementById('yCoord');
    var heightInput = document.getElementById('height');
    var widthInput = document.getElementById('width');
    var zoomInput = document.getElementById('zoom');

    // Mendefinisikan koordinat awal ketika halaman dimuat
    var initialX = 0;
    var initialY = 0;

    // Mendapatkan elemen div untuk menampilkan border biru
    var selectedElement = null;

    // Menambahkan event listener untuk mengatur perpindahan menggunakan keyboard
    document.addEventListener('keydown', function(e) {
        // Mengatur sensitivitas perpindahan
        var sensitivity = 0.01;

        // Mendapatkan elemen yang dipilih (dengan border biru)
        var selectedElement = document.querySelector('[style*="border: 2px solid blue;"]');

        // Menangani perpindahan menggunakan keyboard
        if (selectedElement) {
            switch(e.key) {
                case 'ArrowUp':
                    selectedElement.style.top = parseFloat(selectedElement.style.top) - sensitivity + 'px';
                    break;
                case 'ArrowDown':
                    selectedElement.style.top = parseFloat(selectedElement.style.top) + sensitivity + 'px';
                    break;
                case 'ArrowLeft':
                    selectedElement.style.left = parseFloat(selectedElement.style.left) - sensitivity + 'px';
                    break;
                case 'ArrowRight':
                    selectedElement.style.left = parseFloat(selectedElement.style.left) + sensitivity + 'px';
                    break;
            }

            // Memperbarui nilai input dengan koordinat saat ini
            updateCoordinates(selectedElement);
            widthInput.removeAttribute('readonly');
            heightInput.removeAttribute('readonly');

        }
    });

    // Iterasi melalui setiap elemen gambar untuk menambahkan event listener
    draggables.forEach(function(draggable) {
        // Menambahkan event listener untuk menangani drag menggunakan mouse
        draggable.addEventListener('mousedown', function(e) {
            // Mendapatkan koordinat awal mouse
            initialX = e.clientX;
            initialY = e.clientY;

            // Menandai elemen yang dipilih dengan border biru
            selectedElement = this.parentElement;
            selectedElement.style.border = "2px solid blue";

            // Memperbarui nilai input dengan koordinat saat ini
            updateCoordinates(selectedElement);

            // Menambahkan event listener untuk mengikuti pergerakan mouse
            document.addEventListener('mousemove', drag);
        });

        // Menambahkan event listener untuk menangani drop setelah drag
        draggable.addEventListener('mouseup', function() {
            // Menghapus event listener mousemove setelah selesai drag
            document.removeEventListener('mousemove', drag);
            // Menghapus border biru dari elemen yang dipilih
            if (selectedElement) {
                selectedElement.style.border = "none";
            }
        });
    });

    // Menangani pergerakan elemen gambar
    function drag(e) {
        // Menghitung perubahan koordinat
        var dx = e.clientX - initialX;
        var dy = e.clientY - initialY;

        // Memperbarui koordinat elemen gambar
        selectedElement.style.left = parseFloat(selectedElement.style.left) + dx + 'px';
        selectedElement.style.top = parseFloat(selectedElement.style.top) + dy + 'px';

        // Memperbarui koordinat awal mouse
        initialX = e.clientX;
        initialY = e.clientY;

        // Memperbarui nilai input dengan koordinat saat ini
        updateCoordinates(selectedElement);
    }

    // Event listener untuk memantau perubahan nilai input
    xCoordInput.addEventListener('input', function() {
        if (selectedElement) {
            selectedElement.style.left = xCoordInput.value;
        }
    });

    yCoordInput.addEventListener('input', function() {
        if (selectedElement) {
            selectedElement.style.top = yCoordInput.value;
        }
    });

    widthInput.addEventListener('input', function() {
        if (selectedElement) {
            selectedElement.querySelector('img').style.width = widthInput.value + 'px';
        }
    });
    
    // Event listener untuk memantau perubahan nilai input "Tinggi"
    heightInput.addEventListener('input', function() {
        if (selectedElement) {
            selectedElement.querySelector('img').style.height = heightInput.value + 'px';
        }
    });

    // Fungsi untuk lebar x tinggi
    function handleSizeChange(property) {
        if (selectedElement) {
            var value = document.getElementById(property).value;
            selectedElement.style[property] = value + 'px';
        }
    }    

    zoomInput.addEventListener('input', function() {
        if (selectedElement) {
            selectedElement.style.transform = 'scale(' + zoomInput.value + ')';
        }
    });

    // Fungsi untuk memperbarui nilai input dengan koordinat dan properti saat ini
    function updateCoordinates(element) {
        xCoordInput.value = element.style.left;
        yCoordInput.value = element.style.top;

        // Mengambil nilai tinggi dan lebar dari gambar
        var boundingBox = element.getBoundingClientRect();
        heightInput.value = boundingBox.height + 'px';
        widthInput.value = boundingBox.width + 'px';

        // Mengambil nilai zoom dari properti transform
        var transformValue = element.style.transform;
        if (transformValue && transformValue.includes('scale')) {
            var scaleValue = transformValue.match(/scale\((.*?)\)/);
            if (scaleValue && scaleValue.length > 1) {
                zoomInput.value = parseFloat(scaleValue[1]).toFixed(2);
            } else {
                zoomInput.value = '1.00';
            }
        } else {
            zoomInput.value = '1.00';
        }
    }
});

// Readonly delete
function handleInput(input) {
    input.removeAttribute('readonly');
}

var selectedElement = null;
var initialRotation = 0;

// Fungsi untuk menangani flip
function handleFlip(checkbox, className) {
    if (selectedElement) {
        var img = selectedElement.querySelector('img');
        if (checkbox.checked) {
            img.classList.add(className);
        } else {
            img.classList.remove(className);
        }
    }
}

var selectedElement = null;
var initialRotation = 0;

// Fungsi untuk menangani flip
function handleFlip(checkbox, className) {
    if (selectedElement) {
        var img = selectedElement.querySelector('img');
        if (checkbox.checked) {
            img.classList.add(className);
        } else {
            img.classList.remove(className);
        }
    }
}

// Fungsi untuk menangani rotasi
function handleRotation(value) {
    if (selectedElement) {
        var img = selectedElement.querySelector('img');
        img.style.transform = 'rotate(' + value + 'deg)';
        document.getElementById('rotationIndicator').innerText = value;
    }
}

// Panggil fungsi ini saat objek dipilih
function selectElement(element) {
    if (selectedElement) {
        selectedElement.classList.remove('selected');
    }
    selectedElement = element;
    selectedElement.classList.add('selected');
    document.getElementById('flipHorizontal').disabled = false;
    document.getElementById('flipVertical').disabled = false;
    document.getElementById('rotationControl').disabled = false;
    var rotationValue = parseInt(selectedElement.dataset.rotation || 0);
    initialRotation = rotationValue;
    document.getElementById('rotationControl').value = rotationValue;
    document.getElementById('rotationIndicator').innerText = rotationValue;
}

// Panggil fungsi ini saat objek tidak dipilih lagi
function deselectElement() {
    if (selectedElement) {
        selectedElement.classList.remove('selected');
        selectedElement = null;
        document.getElementById('flipHorizontal').disabled = true;
        document.getElementById('flipVertical').disabled = true;
        document.getElementById('rotationControl').disabled = true;
    }
}

// Event listener untuk mengatur objek yang dipilih saat diklik
document.querySelectorAll('.layer').forEach(function(layer) {
    layer.addEventListener('click', function() {
        if (this === selectedElement) {
            deselectElement();
        } else {
            selectElement(this);
        }
    });
});
