// Daftar lagu
var bgmList = [
  "menu0.wav",
  "menu1.wav",
  "menu2.wav",
  "menu3.wav",
  "menu4.wav",
  "menu5.wav",
  "menu6.wav"
];

// Acak urutan lagu
bgmList = shuffle(bgmList);

var currentBGMIndex = 0;
var bgmAudio = new Audio("assets/audio/music/mainmenu/" + bgmList[currentBGMIndex]);

// Fungsi untuk memutar lagu berikutnya
function playNextBGM() {
  currentBGMIndex = (currentBGMIndex + 1) % bgmList.length;
  bgmAudio.src = "assets/audio/music/mainmenu/" + bgmList[currentBGMIndex];
  bgmAudio.play();
}

// Saat lagu selesai, putar lagu berikutnya
bgmAudio.addEventListener("ended", playNextBGM);

// Mulai memutar lagu pertama
bgmAudio.play();

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