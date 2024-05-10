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
var bgmAudio = new Audio("assets/audio/music/mainmenu/" + bgmList[currentBGMIndex] + ".wav");

// Fungsi untuk memutar lagu berikutnya
function playNextBGM() {
  currentBGMIndex = (currentBGMIndex + 1) % bgmList.length;
  bgmAudio.src = "assets/audio/music/mainmenu/" + bgmList[currentBGMIndex] + ".wav";
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

// Menambahkan pemicu gesture dengan klik di seluruh halaman web
document.body.addEventListener("click", function(event) {
  // Panggil fungsi untuk memutar lagu berikutnya saat ada klik di halaman
  playNextBGM();
});
