document.addEventListener("DOMContentLoaded", function() {
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
  shuffle(bgmList);

  var currentBGMIndex = 0;
  var bgmAudio = new Audio("assets/audio/music/mainmenu/" + bgmList[currentBGMIndex] + ".mp3");

  // Fungsi untuk memutar lagu berikutnya
  function playNextBGM() {
    currentBGMIndex = (currentBGMIndex + 1) % bgmList.length;
    bgmAudio.src = "assets/audio/music/mainmenu/" + bgmList[currentBGMIndex] + ".mp3";
    bgmAudio.play();
  }

  // Event listener untuk memainkan lagu saat halaman diklik pertama kali
  var firstClick = true;
  document.body.addEventListener("click", function(event) {
    if (firstClick) {
      bgmAudio.play();
      firstClick = false;
    } else if (bgmAudio.paused) {
      bgmAudio.play();
    }
  });

  // Event listener untuk memainkan ulang lagu saat halaman di-refresh
  window.addEventListener("beforeunload", function(event) {
    shuffle(bgmList);
    currentBGMIndex = 0;
    bgmAudio.src = "assets/audio/music/mainmenu/" + bgmList[currentBGMIndex] + ".mp3";
    bgmAudio.play();
  });

  // Event listener untuk memainkan lagu berikutnya saat lagu selesai
  bgmAudio.addEventListener("ended", playNextBGM);

  // Event listener untuk memantau audio lain yang sedang diputar
  document.addEventListener("visibilitychange", function() {
    if (document.visibilityState === 'visible' && bgmAudio.paused && !firstClick) {
      bgmAudio.play();
    }
  });

  // Mulai memutar lagu pertama
  bgmAudio.loop = true;
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
});
