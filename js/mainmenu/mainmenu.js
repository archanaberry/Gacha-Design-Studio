/* Main menu musik diputar secara acak */window.onload = function() {
    var audio = document.getElementById('audio');
    var musicFolder = 'assets/audio/music/';

    function playRandomMusic() {
        fetch(musicFolder)
            .then(response => response.text())
            .then(data => {
                // Mendapatkan daftar file dalam folder
                var parser = new DOMParser();
                var htmlDoc = parser.parseFromString(data, 'text/html');
                var links = htmlDoc.querySelectorAll('a');
                var musicFiles = [];
                links.forEach(link => {
                    var href = link.getAttribute('href');
                    if (href.endsWith('.wav')) {
                        musicFiles.push(href);
                    }
                });

                // Memilih secara acak lagu dari daftar
                var randomIndex = Math.floor(Math.random() * musicFiles.length);
                var randomMusic = musicFolder + musicFiles[randomIndex];

                // Memutar lagu
                audio.src = randomMusic;
                audio.play();
            })
            .catch(error => console.error('Error fetching music files:', error));
    }

    playRandomMusic();

    audio.onended = function() {
        playRandomMusic();
    };
};

  // Menyesuaikan ukuran tombol agar tetap sama meskipun berbeda perangkat/resolusi
  window.onload = function() {
    var buttons = document.getElementsByClassName('button');
    var maxWidth = 0;
    
    for (var i = 0; i < buttons.length; i++) {
      maxWidth = Math.max(maxWidth, buttons[i].offsetWidth);
    }
    
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].style.width = maxWidth + 'px';
    }
  };
  
/* Fungsikan ekspor karakter */
function showCode() {
            alert("Kode karakter online mu: c3fe85b536260157e43175650ab3d6cc7739d08208cfe38ae17f7fe13b8d8fc4");
        }

/* Peringatan buka studio pose */
function bukaStudio() {
            alert("Archana Berry mengingatkan bahwa!!!\n\nStudio ini sedang tahap perbaruan jika dibuka mungkin fitur nya belum disempurnakan...");
            window.open("studiopose.html", "_blank");
}
