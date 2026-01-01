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
        try {
            bgmAudio.preload = 'auto';
            bgmAudio.load();
        } catch (e) {}
}

function effectiveBGMVolume(settings) {
    var master = (settings && settings.masterVolume !== undefined) ? settings.masterVolume : (parseFloat(localStorage.getItem('masterVolume')) || 0.5);
    var bgm = (settings && settings.bgmVolume !== undefined) ? settings.bgmVolume : (parseFloat(localStorage.getItem('bgmVolume')) || 0.5);
    return Math.max(0, Math.min(1, master * bgm));
}

function applyAudioSettings(settings) {
    var master = (settings && settings.masterVolume !== undefined) ? settings.masterVolume : (parseFloat(localStorage.getItem('masterVolume')) || 0.5);
    var bgmSetting = (settings && settings.bgmVolume !== undefined) ? settings.bgmVolume : (parseFloat(localStorage.getItem('bgmVolume')) || 0.5);
    var effectiveVol = Math.max(0, Math.min(1, master * bgmSetting));

    if (!bgmAudio) loadCurrentBGM();
    if (!bgmAudio) {
        console.warn('bgm.js: bgmAudio not initialized');
        return;
    }

    bgmAudio.volume = effectiveVol;
    console.log('bgm.js: applyAudioSettings', {
        master, bgmSetting, effectiveVol,
        src: bgmAudio.src,
        paused: bgmAudio.paused,
        unlocked: window.__FDS_USER_AUDIO_UNLOCKED
    });

    if ((settings && settings.bgmEnabled === false) || effectiveVol === 0) {
        try { bgmAudio.pause(); } catch(e){}
        console.log('bgm.js: BGM paused due to settings or volume');
        return;
    }

    // Only play if user has unlocked audio (after tapScreen click)
    if (window.__FDS_USER_AUDIO_UNLOCKED) {
        bgmAudio.play().then(()=>{
            console.log('bgm.js: BGM playback started (applyAudioSettings)');
        }).catch(err => {
            console.warn('bgm.js: failed to start BGM playback (applyAudioSettings)', err);
        });
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

// Only unlock audio and start BGM when user clicks the tap screen element
document.addEventListener('click', function onTapScreenClick(e){
    var target = e.target;
    if (target && target.closest && target.closest('#tapScreen')) {
        window.__FDS_USER_AUDIO_UNLOCKED = true;
        console.log('bgm.js: tapScreen detected — unlocking audio');
        try {
            document.dispatchEvent(new CustomEvent('tapScreenTapped'));
        } catch (err) {}
        if (!bgmAudio) loadCurrentBGM();
        if (bgmAudio) {
            applyAudioSettings(window.AudioSettings || null);
            // Force play directly from event handler
            bgmAudio.pause();
            bgmAudio.currentTime = 0;
            try {
                bgmAudio.play().then(()=>{
                    console.log('bgm.js: BGM playback forced by tapScreen');
                }).catch(err => {
                    console.error('bgm.js: forced BGM playback failed', err);
                });
            } catch (err) {
                console.error('bgm.js: play() threw error', err);
            }
        } else {
            console.warn('bgm.js: tapScreen click, but bgmAudio not initialized');
        }
    }
});

document.addEventListener('changeBGM', function(e){
    if (e && e.detail && e.detail.direction === 'next') playNextBGM();
    if (e && e.detail && e.detail.direction === 'prev') playPrevBGM();
});

// Only unlock audio when user clicks the tap screen element (#tapScreen)
// (removed generic first-click unlock to prevent BGM autoplay on page load)

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

// React to audio settings changes
document.addEventListener('audioSettingsChanged', function(e){
    applyAudioSettings(e && e.detail ? e.detail : window.AudioSettings || null);
});
