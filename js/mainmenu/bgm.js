/****************************************************************/
//                                                              //
//  -------------------Gacha Design Studio--------------------  //
//  Created by: Archana Berry                                   //
//  Assets credits: Lunime, OGL (Open Game License), MIT CC     //
//  Version resource: v0.001_alpha                              //
//  File: bgm.js                                                //
//  Type: module[music]                                         //
//  Desc: Background Mainmenu Music with Listing                //
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

// bgm.js

var bgmList = [
    ["menu0", "Gacha Life - Home Screen BGM"],
    ["menu1", "Pocket Chibi - Lunime"],
    ["menu2", "Gacha Club2"],
    ["menu3", "Gacha Resort"],
    ["menu4", "Gacha Star"],
    ["menu5", "Gacha Club"],
    ["menu6", "Gacha Life2"],
    ["menu7", "「Kimi no Toriko (Summertime)」 - Music Box"],
    ["menu8", "Kimi no Toriko - Japannese EDM"]
];

var currentBGMIndex = 0;
var bgmAudio = new Audio();
bgmAudio.loop = true;

// Fungsi untuk mengatur audio dan menampilkan judul lagu
function setupAudio() {
    bgmAudio.src = "assets/audio/music/mainmenu/" + bgmList[currentBGMIndex][0] + ".mp3";
    bgmAudio.volume = parseFloat(localStorage.getItem("bgmVolume")) || 0.5;
    updateBGMTitel();
}

// Fungsi untuk memperbarui judul lagu
function updateBGMTitel() {
    var titleElement = document.getElementById('bgmTitle');
    if (titleElement) {
        titleElement.textContent = bgmList[currentBGMIndex][1];
    }
}

// Fungsi untuk memutar lagu berikutnya
function playNextBGM() {
    currentBGMIndex = (currentBGMIndex + 1) % bgmList.length;
    setupAudio();
    if (bgmAudio.volume > 0) {
        bgmAudio.play().catch(error => console.log("Playback error:", error));
    }
}

// Fungsi untuk mengacak daftar lagu
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Event listener untuk DOMContentLoaded
document.addEventListener("DOMContentLoaded", function() {
    // Mengacak daftar lagu setiap kali halaman dimuat
    bgmList = shuffle(bgmList);
    currentBGMIndex = 0;
    setupAudio();

    // Memulai pemutaran jika volume > 0
    if (bgmAudio.volume > 0) {
        bgmAudio.play().catch(error => console.log("Playback error:", error));
    }

    // Memutar lagu berikutnya ketika lagu selesai
    bgmAudio.addEventListener("ended", playNextBGM);

    // Menampilkan judul lagu pertama
    updateBGMTitel();

    // Memastikan lagu terus diputar jika kembali ke tab
    document.addEventListener("visibilitychange", function() {
        if (document.visibilityState === 'visible' && bgmAudio.paused && bgmAudio.volume > 0) {
            bgmAudio.play().catch(error => console.log("Playback error:", error));
        }
    });
});
