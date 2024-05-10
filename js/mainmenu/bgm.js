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

// Fungsi untuk mengacak urutan array
function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue, randomIndex;

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

// Fungsi untuk memutar lagu berikutnya
function playNextBGM() {
  currentBGMIndex = (currentBGMIndex + 1) % bgmList.length;
  bgmAudio.src = "assets/audio/music/mainmenu/" + bgmList[currentBGMIndex] + ".mp3";
  bgmAudio.play();
}

// Acak urutan lagu pertama
bgmList = shuffle(bgmList);

var currentBGMIndex = 0;
var bgmAudio = new Audio();

// Set atribut loop untuk mengulang audio secara terus menerus
bgmAudio.loop = true;

// Menambahkan event listener untuk memutar lagu berikutnya saat lagu selesai
bgmAudio.addEventListener("ended", playNextBGM);

// Menambahkan event listener "beforeunload" untuk mengacak urutan lagu sebelum halaman dimuat ulang
window.addEventListener("beforeunload", function () {
  bgmList = shuffle(bgmList);
});

// Menambahkan event listener "click" ke elemen body untuk memulai audio pada interaksi pertama
document.addEventListener("click", function firstInteraction() {
  // Panggil fungsi untuk memutar lagu berikutnya saat ada klik di halaman
  playNextBGM();

  // Hapus event listener "click" setelah interaksi pengguna pertama
  document.removeEventListener("click", firstInteraction);
});
