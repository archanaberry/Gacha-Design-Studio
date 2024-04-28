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

// Fungsi untuk memulai audio BGM secara acak


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
//  playBGM(); // Tambahkan BGM untuk main menu
  setTimeout(showTapScreen, 10000); // Menunggu 10 detik sebelum menampilkan "Tap the screen"
};