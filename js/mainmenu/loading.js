document.addEventListener("DOMContentLoaded", function() {
  // Buat style elemen untuk animasi
  const style = document.createElement('style');
  style.textContent = `
  .loading-svg {
      transform: scale(3); /* Memperbesar gambar sebesar 1.3 kali */
  }
  
    .loading-svg img {
      animation: rotate 0.5s linear infinite;
    }

    @keyframes rotate {
         0% {
            transform: rotate(0deg);
         }
         100% {
            transform: rotate(360deg);
         }
      }

    @keyframes fadeOut {
      from {
        opacity: 1;
      }
      to {
        opacity: 0;
      }
    }

    .fade-out {
      animation: fadeOut 1s forwards;
    }

    .tapScreen {
      position: absolute;
      top: 85%;
      left: 50%;
      transform: translateX(-50%);
    }
  `;
  document.head.appendChild(style);

  // Fungsi untuk menampilkan lapisan kedua
  function showLayer2() {
    var layer2 = document.getElementById("layer2");
    layer2.style.display = "block";
    layer2.classList.add("fade-in");
  }

  // Fungsi untuk menampilkan teks "Tap the screen" setelah 3 detik
  function showTapScreen() {
    var tapScreen = document.getElementById("tapScreen");
    tapScreen.style.display = "block";
    tapScreen.innerHTML = `
      <div class="tapScreen">
        <img src="assets/ui/mainmenu/icon/icon11.svg" alt="Tap the screen">
      </div>
    `;

    // Hilangkan elemen loading-svg img setelah "Tap the screen" muncul
    var loadingImg = document.querySelector(".loading-svg img");
    loadingImg.classList.add("fade-out");
    loadingImg.style.opacity = 0; // Mengubah opacity menjadi 0 untuk animasi fade out
    setTimeout(function() {
      loadingImg.style.display = "none";
    }, 1000); // Setelah 1 detik, elemen loading-img dihilangkan
  }

  // Fungsi untuk menghilangkan elemen loading saat teks "Tap the screen" diklik
  document.addEventListener("click", function() {
    var tapScreen = document.getElementById("tapScreen");
    if (tapScreen.style.display === "block") {
      showLayer2();
      var loading = document.getElementById("loading");
      loading.classList.add("fade-out");
      loading.addEventListener("animationend", function() {
        loading.style.display = "none";
        loading.remove();
      });
    }
  });

  // Tampilkan "Tap the screen" dan hilangkan loading-svg img dengan fade-out setelah 3 detik
  setTimeout(function() {
    showTapScreen();
  }, 3000);
});