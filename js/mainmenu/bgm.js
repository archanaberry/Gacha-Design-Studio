// Daftar nama file lagu (tanpa ekstensi)
var bgmList = [
  "menu0",
  "menu1",
  "menu2",
  "menu3",
  "menu4",
  "menu5",
  "menu6"
];

// Acak urutan lagu
bgmList = shuffle(bgmList);

var currentBGMIndex = 0;
var bgmAudio = new Audio("assets/audio/music/mainmenu/" + bgmList[currentBGMIndex] + ".mp3");

// Fungsi untuk memutar lagu berikutnya
function playNextBGM() {
  currentBGMIndex = (currentBGMIndex + 1) % bgmList.length;
  bgmAudio.src = "assets/audio/music/mainmenu/" + bgmList[currentBGMIndex] + ".mp3";
  bgmAudio.play();
}

// Menambahkan event listener untuk memutar lagu berikutnya saat lagu selesai
bgmAudio.addEventListener("ended", playNextBGM);

// Mulai memutar lagu pertama
bgmAudio.loop = true;
bgmAudio.play();

// Menambahkan pemicu untuk mengganti lagu saat halaman direfresh atau ditutup
window.addEventListener("beforeunload", function(event) {
  bgmAudio.pause();
});

// Fungsi untuk mengacak urutan array
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;
  
  // Selama masih ada elemen untuk diacak
  while (0 !== currentIndex) {
    // Ambil elemen tersisa
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    
    // Tukar dengan elemen saat ini
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  
  return array;
}
