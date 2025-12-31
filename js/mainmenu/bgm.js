/**
 * bgm.js - Background music manager
 */

var bgmList = [
    ["menu0", "Gacha Life - Home Screen BGM"],
    ["menu1", "Pocket Chibi - Lunime"],
    ["menu2", "Gacha Club2"],
    ["menu3", "Gacha Resort"],
    ["menu4", "Gacha Star"],
    ["menu5", "Gacha Club"],
    ["menu6", "Gacha Life2"],
    ["menu7", "Kimi no Toriko (Summertime) - Music Box"],
    ["menu8", "Kimi no Toriko - Japanese EDM"]
];

var currentBGMIndex = 0;
var bgmAudio = null;

function updateBGMTitel() {
    var titleElement = document.getElementById('bgmTitle');
    if (titleElement) {
        titleElement.textContent = bgmList[currentBGMIndex][1];
    }
}

function loadCurrentBGM() {
    if (!bgmAudio) {
        bgmAudio = new Audio();
        bgmAudio.loop = false;
        bgmAudio.addEventListener('ended', playNextBGM);
    }
    bgmAudio.src = "assets/audio/mainmenu/" + bgmList[currentBGMIndex][0] + ".mp3";
}

function effectiveBGMVolume(settings) {
    var master = (settings && settings.masterVolume !== undefined) ? settings.masterVolume : (parseFloat(localStorage.getItem('masterVolume')) || 0.5);
    var bgm = (settings && settings.bgmVolume !== undefined) ? settings.bgmVolume : (parseFloat(localStorage.getItem('bgmVolume')) || 0.5);
    return Math.max(0, Math.min(1, master * bgm));
}

function applyAudioSettings(settings) {
    var vol = effectiveBGMVolume(settings);
    if (!bgmAudio) loadCurrentBGM();
    if (bgmAudio) {
        bgmAudio.volume = vol;
        if (settings && settings.bgmEnabled === false) {
            try { bgmAudio.pause(); } catch(e){}
        } else {
            if (vol > 0 && window.__FDS_USER_AUDIO_UNLOCKED) {
                bgmAudio.play().catch(() => {});
            } else {
                try { bgmAudio.pause(); } catch(e){}
            }
        }
    }
    updateBGMTitel();
}

function playNextBGM() {
    currentBGMIndex = (currentBGMIndex + 1) % bgmList.length;
    loadCurrentBGM();
    applyAudioSettings(window.AudioSettings || null);
}

function playPrevBGM() {
    currentBGMIndex = (currentBGMIndex - 1 + bgmList.length) % bgmList.length;
    loadCurrentBGM();
    applyAudioSettings(window.AudioSettings || null);
}

document.addEventListener('audioSettingsChanged', function(e){
    applyAudioSettings(e.detail || null);
});

document.addEventListener('changeBGM', function(e){
    if (e && e.detail && e.detail.direction === 'next') playNextBGM();
    if (e && e.detail && e.detail.direction === 'prev') playPrevBGM();
});

document.addEventListener('click', function onFirstClick(){
    if (!window.__FDS_USER_AUDIO_UNLOCKED) {
        window.__FDS_USER_AUDIO_UNLOCKED = true;
        applyAudioSettings(window.AudioSettings || null);
    }
});

document.addEventListener('DOMContentLoaded', function(){
    // shuffle list
    for (let i = bgmList.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [bgmList[i], bgmList[j]] = [bgmList[j], bgmList[i]];
    }
    currentBGMIndex = 0;
    loadCurrentBGM();
    updateBGMTitel();
    if (window.AudioSettings) applyAudioSettings(window.AudioSettings);
});
