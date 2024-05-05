// Fungsi untuk menampilkan lapisan kedua
function showLayer2() {
  var layer2 = document.getElementById("layer2");
  layer2.style.display = "block";
  layer2.classList.add("fade-in");
}

// Fungsi untuk menampilkan teks "Tap the screen" setelah 10 detik
function showMenu() {
  loading.classList.add("fade-out");
  loading.addEventListener("animationend", function() {
    loading.style.display = "none";
  });
}

function showTapScreen() {
  var tapScreen = document.getElementById("tapScreen");
  var loading = document.getElementById("loading");
  tapScreen.style.display = "block";
}

document.addEventListener("click", function() {
  var tapScreen = document.getElementById("tapScreen");
  if (tapScreen.style.display === "block") {
    showLayer2();
    var loading = document.getElementById("loading");
    loading.classList.add("fade-out");
    loading.addEventListener("animationend", function() {
      loading.style.display = "none";
    });
  }
});

// Tampilkan lapisan kedua setelah loading selesai
window.onload = function() {
  setTimeout(showTapScreen, 10000); // Menunggu 10 detik sebelum menampilkan "Tap the screen"
};

// Daftar lagu
var bgmList = [
  "menu0.wav",
  "menu1.wav",
  "menu2.wav",
  "menu3.wav"
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
