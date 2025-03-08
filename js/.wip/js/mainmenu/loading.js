/****************************************************************/
//                                                              //
//  -------------------Gacha Design Studio--------------------  //
//  Created by: Archana Berry                                   //
//  Assets credits: Lunime, OGL (Open Game License), MIT CC     //
//  Version resource: v0.001_alpha                              //
//  File: loading.js                                            //
//  Type: module[loading]                                       //
//  Desc: Loading function on open game                         //
//                                                              //
//  ----------------------------------------------------------  //
//                                                              //
//  ---- Do not use this as a gacha design game as        ----  //
//  ---- template, or modifying it to make a other        ----  //
//  ---- version, than this without Archana Berry's       ----  //
//  ---- permission's, except to help with repairs or     ----  //
//  ---- updates art assets and etc with contributing     ----  //
//                                                              //
//**************************************************************//
// Please patient for release Gacha Design Studio in Playstore UwU

// loading.js
document.addEventListener("DOMContentLoaded", function() {
  // Buat elemen splash loading dan tambahkan ke body
  const splashLoading1Html = `
    <div id="splash-loading1" class="splash-loading splash-loading1">
      <div class="splash-content">
        <img src="assets/ui/mainmenu/icon/icon12.svg" alt="SVG Image" class="center-img lunimev">
      </div>
    </div>
  `;

  const splashLoading2Html = `
    <div id="splash-loading2" class="splash-loading splash-loading2">
      <img src="archanaberry/archanaberry.png" alt="Main Image" class="splash-main-img">
      <div class="bottom-images">
        <img src="archanaberry/github.png" alt="Bottom Image" class="bottom-img" style="zoom: 10%">
        <img src="archanaberry/gacha.svg" alt="Bottom Image" class="bottom-img">
        <img src="archanaberry/Figma.png" alt="Bottom Image" class="bottom-img" style="zoom: 10%">
      </div>
    </div>
  `;

  const loadingHtml = `
    <div id="loading" class="loading">
      <div class="loading-content">
        <div class="loading-svg">
          <img src="assets/ui/mainmenu/icon/loading.svg" alt="Loading...">
        </div>
        <div class="loading-img">
          <img src="assets/ui/mainmenu/icon/icon12.svg" alt="Loading Image">
        </div>
        <div id="tapScreen" class="tap-screen" style="display: none;">
          <img src="assets/ui/mainmenu/icon/icon11.svg" alt="Tap the screen">
        </div>
      </div>
    </div>
  `;

  // Menambahkan splash loading ke body
  document.body.insertAdjacentHTML('beforeend', '<div id="splash"></div>');

  // Fungsi untuk mengubah layar splash
  function showSplashScreens() {
    const splash = document.getElementById("splash");
    splash.innerHTML = splashLoading1Html;
    splash.classList.add("fade-in");

    setTimeout(() => {
      splash.classList.remove("fade-in");
      splash.classList.add("fade-out");
      setTimeout(() => {
        splash.innerHTML = splashLoading2Html;
        splash.classList.remove("fade-out");
        splash.classList.add("fade-in");
        setTimeout(() => {
          splash.classList.remove("fade-in");
          splash.classList.add("fade-out");
          setTimeout(() => {
            splash.innerHTML = loadingHtml;
            splash.classList.remove("fade-out");
            splash.classList.add("fade-in");
            // Tampilkan loading dan kemudian tapScreen
            setTimeout(() => {
              initLoading();
            }, 3000); // Durasi loading screen
          }, 3000); // Durasi splash-loading2
        }, 3000); // Durasi splash-loading1
      }, 3000); // Transisi splash-loading1 ke splash-loading2
    }, 3000); // Durasi splash-loading1
  }

  showSplashScreens();

  // Buat style elemen untuk animasi
  const style = document.createElement('style');
  style.textContent = `
    body {
      margin: 0;
      padding: 0;
      font-family: Arial, sans-serif;
      overflow: hidden;
      background-color: black;
    }

    #splash, .splash-loading, .loading {
      position: fixed;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 998;
      opacity: 1;
      transition: opacity 3s;
    }

    .splash-loading.splash-loading1 {
      background: url('assets/ui/background/splash1.png') center center/cover no-repeat;
    }

    .splash-loading.splash-loading2 {
      background: url('assets/ui/background/splash2.png') center center/cover no-repeat;
    }

    .loading {
      background: url('assets/ui/background/mainmenu.png');
      background-size: cover;
      display: flex;
    }

    .splash-content {
      text-align: center;
    }

    .center-img {
      max-width: 80%;
      max-height: 80%;
    }

    .splash-main-img {
      max-width: auto;
      max-height: auto;
      scale: 23%;
    }

        .bottom-images {
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: auto; /* Ubah menjadi auto jika Anda tidak ingin memenuhi lebar */
            display: flex;
            flex-direction: row; /* Gunakan 'row' untuk fleksibel secara horizontal */
            align-items: center;
            margin-bottom: 20px; /* Margin tambahan jika diperlukan */
            justify-content: center; /* Memastikan elemen gambar terpusat secara horizontal */
        }

        .bottom-img {
            width: auto;
            height: auto;
            margin: 5px;
        }

    .fade-out1, .fade-out2, .fade-out3 {
      animation: fadeInOut 6s infinite;
    }

    @keyframes fadeInOut {
      0% {
        opacity: 1;
      }
      50% {
        opacity: 0;
      }
      100% {
        opacity: 1;
      }
    }

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

    .tap-screen {
      position: fixed;
      top: 85%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 999; /* Pastikan tapScreen berada di atas elemen lainnya */
      margin-top: 20px;
      text-align: center;
      display: none;
    }

    .loading-img {
      position: absolute;
      top: 90%;
      left: 49.5%;
      transform: translateX(-49.5%);
    }

    .layer2 {
      display: none;
      background-color: rgba(0, 0, 0, 0.5);
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1000; /* Layer 2 harus di atas loading */
      text-align: center;
    }

    .fade-in {
      animation: fadeIn 1s forwards;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    .fade-out {
      animation: fadeOut 1s forwards;
    }

    @keyframes fadeOut {
      from {
        opacity: 1;
      }
      to {
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);

  // Fungsi untuk menampilkan lapisan kedua
  function showLayer2() {
    var layer2 = document.getElementById("layer2");
    if (layer2) {
      layer2.style.display = "block";
      layer2.classList.add("fade-in");
    }
  }

  // Fungsi untuk menampilkan teks "Tap the screen" setelah 3 detik
  function showTapScreen() {
    var tapScreen = document.getElementById("tapScreen");
    if (tapScreen) {
      tapScreen.style.display = "block";
      console.log("Tap screen element should now be visible");
    } else {
      console.log("Tap screen element not found");
    }
  }

  // Fungsi untuk menghilangkan elemen loading saat teks "Tap the screen" diklik
  function initLoading() {
    setTimeout(() => {
      var loadingSvg = document.querySelector(".loading-svg img");
      if (loadingSvg) {
        loadingSvg.classList.add("fade-out");
        setTimeout(() => {
          loadingSvg.style.display = "none";
        }, 1000); // Menghilangkan gambar setelah animasi fade-out
      }
      
      setTimeout(() => {
        showTapScreen();
      }, 1000); // Tampilkan "Tap the screen" setelah loading-svg menghilang
    }, 3000); // Tampilkan loading screen selama 3 detik
    // Tampilkan "Tap the screen" dan hilangkan loading-svg img dengan fade-out setelah 3 detik
    document.addEventListener("click", function() {
      var tapScreen = document.getElementById("tapScreen");
      if (tapScreen && tapScreen.style.display === "block") {
        console.log("Tap screen clicked");
        showLayer2();
        var loading = document.getElementById("loading");
        if (loading) {
          loading.classList.add("fade-out");
          loading.addEventListener("animationend", function() {
            loading.style.display = "none";
//            document.body.removeChild(loading);
          });
        }
      }
    });
  }
});
