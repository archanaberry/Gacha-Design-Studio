/****************************************************************/
//                                                              //
//  -------------------Gacha Design Studio--------------------  //
//  Created by: Archana Berry                                   //
//  Assets credits: Lunime, OGL (Open Game License), MIT CC     //
//  Version resource: v0.001_alpha                              //
//  File: titlescreen.js                                        //
//  Type: module[titlescreen]                                   //
//  Desc: Title screen with tap screen - proper handler         //
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

// titlescreen.js - Clean title screen handler

document.addEventListener("DOMContentLoaded", function() {
  // Add title screen specific styles
  const titleScreenStyles = document.createElement('style');
  titleScreenStyles.textContent = `
    /* Title Screen Container */
    #titlescreen {
      position: fixed;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 999;
      background: transparent;
      opacity: 1;
      margin: 0;
      padding: 0;
    }

    /* Title screen content wrapper */
    #titlescreen-content {
      width: 100%;
      height: 100%;
      position: relative;
    }

    /* Logo Lunime - centered di atas */
    .titlescreen-logo {
      position: absolute;
      top: 90%;
      left: 49.5%;
      transform: translateX(-49.5%);
    }

    /* Tap Screen visual - centered di bawah */
    .titlescreen-tap-visual {
      position: absolute;
      top: 85%;
      left: 50%;
      transform: translate(-50%, 50%);
      z-index: 1000;
      text-align: center;
    }

    .titlescreen-tap-visual img {
      max-width: 150px;
      max-height: 150px;
      animation: pulse-tap 1.5s ease-in-out infinite;
      display: block;
    }

    /* Fullscreen tap overlay - clickable area seluruh layar */
    #titlescreen-tapscreen {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      cursor: pointer;
      z-index: 1001;
    }

    @keyframes pulse-tap {
      0% {
        opacity: 0.7;
        transform: scale(1);
      }
      50% {
        opacity: 1;
        transform: scale(1.1);
      }
      100% {
        opacity: 0.7;
        transform: scale(1);
      }
    }

    /* Fade animations */
    .titlescreen-fade-in {
      animation: titleScreenFadeIn 1s ease-in-out forwards;
    }

    @keyframes titleScreenFadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    .titlescreen-fade-out {
      animation: titleScreenFadeOut 1s ease-in-out forwards;
    }

    @keyframes titleScreenFadeOut {
      from {
        opacity: 1;
      }
      to {
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(titleScreenStyles);

  // Fungsi untuk menampilkan title screen dengan tap screen (untuk return dari settings)
  // Parameter: shouldFadeIn (default: true) - apakah mau fade-in animation
  window.showTitleScreen = function(shouldFadeIn = true) {
    console.log('%c[TitleScreen] Showing title screen (fade: ' + shouldFadeIn + ')...', 'color: blue; font-weight: bold;');
    
    // Hide tap-screen dari loading.js agar tidak overlay
    let tapScreenOld = document.getElementById('tapScreen');
    if (tapScreenOld) {
      tapScreenOld.style.display = 'none';
      console.log('%c[TitleScreen] Hidden old tap-screen element', 'color: blue;');
    }
    
    let titlescreen = document.getElementById('titlescreen');
    
    // Jika sudah ada, bersihkan dulu
    if (titlescreen) {
      titlescreen.innerHTML = '';
    } else {
      // Create if not exist
      titlescreen = document.createElement('div');
      titlescreen.id = 'titlescreen';
      document.body.appendChild(titlescreen);
    }
    
    // Buat content wrapper
    const content = document.createElement('div');
    content.id = 'titlescreen-content';
    content.style.pointerEvents = 'auto';
    
    // Buat logo
    const logo = document.createElement('img');
    logo.src = 'assets/ui/mainmenu/icon/icon12.svg';
    logo.alt = 'Lunime Logo';
    logo.className = 'titlescreen-logo';
    content.appendChild(logo);
    
    // Buat tap visual (teks + icon)
    const tapVisual = document.createElement('div');
    tapVisual.className = 'titlescreen-tap-visual';
    const tapIcon = document.createElement('img');
    tapIcon.src = 'assets/ui/mainmenu/icon/icon11.svg';
    tapIcon.alt = 'Tap the screen';
    tapVisual.appendChild(tapIcon);
    content.appendChild(tapVisual);
    
    // Buat fullscreen tap overlay (invisible, clickable)
    const tapOverlay = document.createElement('div');
    tapOverlay.id = 'titlescreen-tapscreen';
    tapOverlay.style.pointerEvents = 'auto';
    tapOverlay.onclick = function() { window.tapScreenClicked(); };
    content.appendChild(tapOverlay);
    
    titlescreen.appendChild(content);
    
    // Show with or without fade-in
    titlescreen.classList.remove('titlescreen-fade-out');
    if (shouldFadeIn) {
      titlescreen.classList.add('titlescreen-fade-in');
    } else {
      titlescreen.classList.remove('titlescreen-fade-in');
    }
    titlescreen.style.display = 'block';
    titlescreen.style.opacity = '1';
    titlescreen.style.pointerEvents = 'auto';
    titlescreen.style.zIndex = '999'; // Pastikan di atas semua
    
    console.log('%c[TitleScreen] Title screen visible with fullscreen tap overlay', 'color: green;');
  };

  // Fungsi tap screen click handler
  window.tapScreenClicked = function() {
    console.log('%c[TitleScreen] Tap screen clicked!', 'color: green; font-weight: bold;');
    
    // Unlock BGM playback for user gesture
    window.__FDS_USER_AUDIO_UNLOCKED = true;
    if (window.applyAudioSettings) {
      try { window.applyAudioSettings(); } catch (err) { console.warn("applyAudioSettings error", err); }
    } else if (window.bgmAudio && window.bgmAudio.play) {
      try { window.bgmAudio.play(); } catch (err) { console.warn("bgmAudio.play error", err); }
    }
    
    // Show main menu LANGSUNG (mainmenu akan clear semua)
    let layer2 = document.getElementById('layer2');
    if (layer2) {
      layer2.style.display = 'block';
      layer2.style.pointerEvents = 'auto';
      layer2.classList.remove('fade-out');
      layer2.classList.add('fade-in');
      console.log('%c[TitleScreen] Layer2 (mainmenu) visible', 'color: green;');
      
      // Hide titlescreen dan loading background setelah mainmenu fully visible
      setTimeout(function() {
        let titlescreen = document.getElementById('titlescreen');
        if (titlescreen) {
          titlescreen.style.display = 'none';
          titlescreen.style.pointerEvents = 'none';
          console.log('%c[TitleScreen] Title screen hidden', 'color: green;');
        }
        
        let loading = document.getElementById('loading');
        if (loading) {
          loading.style.display = 'none';
          console.log('%c[TitleScreen] Loading element cleared', 'color: green;');
        }
      }, 1000); // Tunggu mainmenu fade-in selesai sebelum clear
    }
    
    // Set mode to mainmenu
    if (window.setPageMode) {
      window.setPageMode('mainmenu');
    }
  };

  // Fungsi untuk hide title screen
  window.hideTitleScreen = function() {
    let titlescreen = document.getElementById('titlescreen');
    if (titlescreen) {
      titlescreen.style.display = 'none';
      titlescreen.style.pointerEvents = 'none';
      console.log('%c[TitleScreen] Title screen hidden', 'color: orange;');
    }
  };
});
