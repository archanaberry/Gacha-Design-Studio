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
var bgmAudio = new Audio("assets/audio/music/mainmenu/" + bgmList[currentBGMIndex][0] + ".mp3");

// Mengatur volume awal dari localStorage atau default ke 50%
bgmAudio.volume = localStorage.getItem("bgmVolume") || 0.5;

// Update BGM volume when settings change
document.addEventListener("volumeChange", function(event) {
    if (event.detail.bgmVolume !== undefined) {
        bgmAudio.volume = event.detail.bgmVolume;
        // Simpan volume ke localStorage
        localStorage.setItem("bgmVolume", event.detail.bgmVolume);

        // Jika volume lebih dari 0 dan BGM sedang dipause, lanjutkan playback
        if (event.detail.bgmVolume > 0 && bgmAudio.paused) {
            bgmAudio.play().catch(error => console.log("Playback error:", error));
        }
    }
});

function setupAudio() {
    bgmAudio.src = "assets/audio/music/mainmenu/" + bgmList[currentBGMIndex][0] + ".mp3";
    bgmAudio.loop = true;
    bgmAudio.volume = localStorage.getItem("bgmVolume") || 0.5;
}

function playNextBGM() {
    currentBGMIndex = (currentBGMIndex + 1) % bgmList.length;
    setupAudio();
    if (bgmAudio.volume > 0) {
        bgmAudio.play().catch(error => console.log("Playback error:", error));
    }
    updateBGMTitel();
}

function playPrevBGM() {
    currentBGMIndex = (currentBGMIndex - 1 + bgmList.length) % bgmList.length;
    setupAudio();
    if (bgmAudio.volume > 0) {
        bgmAudio.play().catch(error => console.log("Playback error:", error));
    }
    updateBGMTitel();
}

function fetchMusicBGM() {
    return bgmList[currentBGMIndex][1];
}

function updateBGMTitel() {
    var titleElement = document.getElementById('bgmTitle');
    if (titleElement) {
        titleElement.textContent = fetchMusicBGM();
    }
}

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

document.addEventListener("DOMContentLoaded", function() {
    if (!localStorage.getItem("bgmList")) {
        var shuffledList = shuffle([...bgmList]);
        localStorage.setItem("bgmList", JSON.stringify(shuffledList));
    }

    bgmList = JSON.parse(localStorage.getItem("bgmList"));
    currentBGMIndex = 0;
    setupAudio();

    document.body.addEventListener("click", function() {
        if (bgmAudio.volume > 0) {
            bgmAudio.play().catch(error => console.log("Playback error:", error));
        }
    });

    window.addEventListener("beforeunload", function() {
        localStorage.setItem("bgmList", JSON.stringify(bgmList));
    });

    bgmAudio.addEventListener("ended", playNextBGM);

    document.addEventListener("visibilitychange", function() {
        if (document.visibilityState === 'visible' && bgmAudio.paused && bgmAudio.volume > 0) {
            bgmAudio.play().catch(error => console.log("Playback error:", error));
        }
    });

    document.addEventListener("changeBGM", function(event) {
        if (event.detail.direction === 'next') {
            playNextBGM();
        } else if (event.detail.direction === 'prev') {
            playPrevBGM();
        }
    });

    updateBGMTitel();
});
