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

// Helper function untuk manage mode URL
window.setPageMode = function(mode) {
  const newUrl = new URL(window.location);
  if (mode) {
    newUrl.searchParams.set('mode', mode);
  } else {
    newUrl.searchParams.delete('mode');
  }
  history.pushState({ mode: mode }, '', newUrl.toString());
  console.log('%c[MODE CHANGE]%c ' + mode + ' → ' + newUrl.toString(), 'color: cyan; font-weight: bold;', 'color: default;');
};

// Helper function untuk get current mode
window.getPageMode = function() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('mode');
};

document.addEventListener("DOMContentLoaded", function() {
  console.log('%c[Loading.js] DOMContentLoaded triggered!', 'color: green; font-weight: bold;');
  
  // Set mode ke loading saat page load
  window.setPageMode('loading');
  console.log('%c[Loading.js] Initial mode set to: loading', 'color: yellow;');

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

  // daftar resource penting untuk mainmenu (favicon, gambar utama, ikon, audio, script)
  const resources = [
    'assets/ui/mainmenu/iconapp.png',
    'assets/ui/mainmenu/mainmenu.png',
    'assets/ui/mainmenu/gachadesignstudio.png',
    'assets/ui/mainmenu/developers.svg',
    'assets/ui/mainmenu/icon/loading.svg',
    'assets/ui/mainmenu/icon/icon12.svg',
    'assets/audio/mainmenu/menu0.mp3',
    'js/mainmenu/mainmenu.js',
    'js/mainmenu/bgm.js',
    'js/mainmenu/clickbutton.js',
    'js/mainmenu/volume.js',
    'js/frame/mainmenu.js'
  ];

  // simpan daftar untuk retry
  window.__FDS_LAST_RESOURCES = resources;

  if (window.FrameLoading && typeof window.FrameLoading.checkResources === 'function') {
    // Periksa resource terlebih dahulu, jika semua ada lanjutkan normal, jika tidak FrameLoading menampilkan fallback
    window.FrameLoading.checkResources(resources).then(ok => {
      if (ok) showSplashScreens();
      // jika tidak ok, FrameLoading sudah menampilkan toast dan fallback
    }).catch(err => {
      // Jika checker error, lanjutkan saja agar UX tidak terhenti
      console.warn('FrameLoading check error:', err);
      showSplashScreens();
    });
  } else {
    showSplashScreens();
  }

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
      background: url('assets/ui/mainmenu/splash1.png') center center/cover no-repeat;
    }

    .splash-loading.splash-loading2 {
      background: url('assets/ui/mainmenu/splash2.png') center center/cover no-repeat;
    }

    .loading {
      background: url('assets/ui/mainmenu/tittle_mainmenu.png');
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
      console.log('%c[Loading.js] Showing layer2 (mainmenu)', 'color: purple; font-weight: bold;');
      layer2.style.display = "block";
      layer2.classList.add("fade-in");
      // Set mode ke mainmenu saat layer2 ditampilkan
      window.setPageMode('mainmenu');
    }
  }

  // Fungsi untuk menampilkan tap screen menggunakan titlescreen.js
  function showTapScreen() {
    console.log('%c[Loading.js] Calling showTitleScreen from titlescreen.js...', 'color: blue; font-weight: bold;');
    
    // Hide loading KONTEN saja (spinner dan logo), tidak hide background nya
    var loadingSvg = document.querySelector(".loading-svg");
    var loadingImg = document.querySelector(".loading-img");
    
    if (loadingSvg) {
      loadingSvg.style.display = "none";
    }
    if (loadingImg) {
      loadingImg.style.display = "none";
    }
    
    // Set mode to titlemenu
    window.setPageMode('titlemenu');
    
    // Show titlescreen (from titlescreen.js) - only tap screen + logo, no spinner
    if (typeof window.showTitleScreen === 'function') {
      window.showTitleScreen(false); // Pass false to appear directly without fade
    } else {
      console.warn('[Loading.js] titlescreen.js not loaded yet!');
    }
  }

  // Fungsi untuk menghilangkan elemen loading saat teks "Tap the screen" diklik
  function initLoading() {
    console.log('%c[Loading.js] Initializing loading sequence...', 'color: green;');
    setTimeout(() => {
      var loadingSvg = document.querySelector(".loading-svg img");
      if (loadingSvg) {
        console.log('%c[Loading.js] Fading out loading spinner...', 'color: green;');
        loadingSvg.classList.add("fade-out");
        setTimeout(() => {
          loadingSvg.style.display = "none";
        }, 1000); // Menghilangkan gambar setelah animasi fade-out
      }
      
      setTimeout(() => {
        showTapScreen();
      }, 1000); // Tampilkan tap screen setelah loading-svg menghilang
    }, 3000); // Tampilkan loading screen selama 3 detik
    
    // Handle tap screen click - unlock BGM and show mainmenu
    document.addEventListener("click", function unlockBGMOnTapScreen(e) {
      // Check if titlescreen-tapscreen is visible (from titlescreen.js)
      var titlescreenTapscreen = document.getElementById("titlescreen-tapscreen");
      if (titlescreenTapscreen && titlescreenTapscreen.offsetParent !== null) {
        // titlescreen tap screen is visible
        console.log('%c[Loading.js] Titlescreen tap clicked! Unlocking audio...', 'color: red; font-weight: bold;');
        // Unlock BGM playback for user gesture
        window.__FDS_USER_AUDIO_UNLOCKED = true;
        if (window.applyAudioSettings) {
          try { window.applyAudioSettings(); } catch (err) { console.warn("applyAudioSettings error", err); }
        } else if (window.bgmAudio && window.bgmAudio.play) {
          try { window.bgmAudio.play(); } catch (err) { console.warn("bgmAudio.play error", err); }
        }
        // Remove this event listener after first tap
        document.removeEventListener("click", unlockBGMOnTapScreen);
      }
    });
  }

  // Handle browser back button and history navigation
  window.addEventListener('popstate', function() {
    var mode = window.getPageMode();
    console.log('Popstate triggered, new mode:', mode);
    // Page mode akan otomatis berubah via getPageMode()
  });

  // Check if page load dengan mode parameter yang valid
  var currentMode = window.getPageMode();
  if (currentMode && (currentMode === 'titlemenu' || currentMode === 'mainmenu')) {
    console.log('Page reloaded with mode:', currentMode);
    // Jika reload dengan mode tertentu, restore state sesuai mode
  }});