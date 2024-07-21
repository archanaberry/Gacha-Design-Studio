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
    ["menu7", "「Kimi no Toriko (Summertime)」 - Music Box"]
];

  var currentBGMIndex = 0;
  var bgmAudio = new Audio("assets/audio/music/mainmenu/" + bgmList[currentBGMIndex][0] + ".mp3");
  bgmAudio.volume = localStorage.getItem("bgmVolume") || 0.5;

    // Update BGM volume when settings change
    document.addEventListener("volumeChange", function(event) {
        if (event.detail.bgmVolume !== undefined) {
            bgmAudio.volume = event.detail.bgmVolume;
        }
    });

function setupAudio() {
    bgmAudio.src = "assets/audio/music/mainmenu/" + bgmList[currentBGMIndex][0] + ".mp3";
    bgmAudio.loop = true;
    bgmAudio.volume = localStorage.getItem("bgmVolume") || 0.5;
}

function playNextBGM() {
    currentBGMIndex = (currentBGMIndex + 1 % bgmList.length) % bgmList.length;
    setupAudio();
    bgmAudio.play().catch(error => console.log("Playback error:", error));
    updateBGMTitel();
}

function playPrevBGM() {
    currentBGMIndex = (currentBGMIndex - 1 + bgmList.length) % bgmList.length;
    setupAudio();
    bgmAudio.play().catch(error => console.log("Playback error:", error));
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
        // Shuffle and save the list in localStorage if not already done
        var shuffledList = shuffle([...bgmList]);
        localStorage.setItem("bgmList", JSON.stringify(shuffledList));
    }

    bgmList = JSON.parse(localStorage.getItem("bgmList"));
    currentBGMIndex = 0; // Start from the beginning of the shuffled list
    setupAudio();

    document.body.addEventListener("click", function() {
        bgmAudio.play().catch(error => console.log("Playback error:", error));
    });

    window.addEventListener("beforeunload", function() {
        // Save the shuffled list to localStorage
        localStorage.setItem("bgmList", JSON.stringify(bgmList));
    });

    bgmAudio.addEventListener("ended", playNextBGM);

    document.addEventListener("visibilitychange", function() {
        if (document.visibilityState === 'visible' && bgmAudio.paused) {
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

    updateBGMTitel(); // Initial title update
});
