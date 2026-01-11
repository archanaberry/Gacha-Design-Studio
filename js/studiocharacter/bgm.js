/**
 * bgm.js - Background Music Manager untuk Studio Character
 * 
 * Fitur:
 * - Fade out 1.5 detik ketika masuk studio
 * - Volume berkurang sesuai setting
 * - Fade in kembali 1.5 detik setelah siap
 * - Playlist khusus studio (berbeda dari mainmenu)
 * - Sinkronisasi dengan window.AudioSettings
 */

// Studio-specific BGM list (berbeda dengan mainmenu)
var studioBGMList = [
    ["studio_work1", "Studio Focus - Ambient"],
    ["studio_work2", "Creative Flow - Lo-fi"],
    ["studio_work3", "Studio Vibes - Chill"],
    ["studio_work4", "Design Mode - Instrumental"],
    ["studio_work5", "Artist's Corner - Jazz"],
    ["studio_relax1", "Studio Relax - Calm"],
    ["studio_relax2", "Design Dreams - Dreamy"],
    ["studio_relax3", "Studio Zen - Meditative"],
    ["menu1", "Pocket Chibi - Lunime"],
    ["menu3", "Gacha Resort"],
];

var currentStudioBGMIndex = 0;
var studioBGMAudio = null;
var studioAudioFading = false;
var studioTargetVolume = 0.3; // Volume target setelah fade out
var studioOriginalVolume = 0.5; // Volume original sebelum studio

/**
 * Update judul BGM studio
 */
function updateStudioBGMTitle() {
    var titleElement = document.getElementById('studioBgmTitle');
    if (titleElement) {
        titleElement.textContent = studioBGMList[currentStudioBGMIndex][1];
    }
}

/**
 * Load BGM studio saat ini
 */
function loadCurrentStudioBGM() {
    if (!studioBGMAudio) {
        studioBGMAudio = new Audio();
        studioBGMAudio.loop = false;
        studioBGMAudio.addEventListener('ended', playNextStudioBGM);
    }
    studioBGMAudio.src = "assets/audio/studiocharacter/" + studioBGMList[currentStudioBGMIndex][0] + ".mp3";
    try {
        studioBGMAudio.preload = 'auto';
        studioBGMAudio.load();
    } catch (e) {
        console.warn('studiocharacter/bgm.js: Failed to load BGM', e);
    }
}

/**
 * Hitung volume efektif untuk studio BGM
 * @param {Object} settings - Audio settings object
 * @returns {number} Volume antara 0-1
 */
function effectiveStudioBGMVolume(settings) {
    var master = (settings && settings.masterVolume !== undefined) 
        ? settings.masterVolume 
        : (parseFloat(localStorage.getItem('masterVolume')) || 0.5);
    var bgm = (settings && settings.bgmVolume !== undefined) 
        ? settings.bgmVolume 
        : (parseFloat(localStorage.getItem('bgmVolume')) || 0.5);
    return Math.max(0, Math.min(1, master * bgm));
}

/**
 * Fade out musik utama ketika masuk studio (1.5 detik)
 * @param {number} duration - Durasi fade dalam ms (default 1500)
 * @param {number} targetVol - Volume target setelah fade
 */
function fadeOutStudioBGM(duration = 1500, targetVol = 0.3) {
    if (!studioBGMAudio) {
        loadCurrentStudioBGM();
    }

    studioAudioFading = true;
    studioTargetVolume = targetVol;
    
    var currentVolume = studioBGMAudio.volume || 0.5;
    studioOriginalVolume = currentVolume;
    
    var startTime = Date.now();
    var startVolume = currentVolume;
    
    console.log('studiocharacter/bgm.js: Starting fade out', {
        startVolume,
        targetVolume: targetVol,
        duration,
        src: studioBGMAudio.src
    });

    function animateFade() {
        if (!studioAudioFading) return;
        
        var elapsed = Date.now() - startTime;
        var progress = Math.min(1, elapsed / duration);
        var newVolume = startVolume + (targetVol - startVolume) * progress;
        
        if (studioBGMAudio) {
            studioBGMAudio.volume = Math.max(0, Math.min(1, newVolume));
        }

        if (progress < 1) {
            requestAnimationFrame(animateFade);
        } else {
            studioAudioFading = false;
            console.log('studiocharacter/bgm.js: Fade out complete', {
                finalVolume: studioBGMAudio.volume
            });
        }
    }

    requestAnimationFrame(animateFade);
}

/**
 * Fade in musik kembali normal setelah siap bekerja (1.5 detik)
 * @param {number} duration - Durasi fade dalam ms (default 1500)
 */
function fadeInStudioBGM(duration = 1500) {
    if (!studioBGMAudio) {
        loadCurrentStudioBGM();
    }

    studioAudioFading = true;
    
    var startVolume = studioBGMAudio.volume || studioTargetVolume;
    var targetVolume = effectiveStudioBGMVolume(window.AudioSettings || null);
    
    var startTime = Date.now();
    
    console.log('studiocharacter/bgm.js: Starting fade in', {
        startVolume,
        targetVolume,
        duration,
        src: studioBGMAudio.src
    });

    function animateFade() {
        if (!studioAudioFading) return;
        
        var elapsed = Date.now() - startTime;
        var progress = Math.min(1, elapsed / duration);
        var newVolume = startVolume + (targetVolume - startVolume) * progress;
        
        if (studioBGMAudio) {
            studioBGMAudio.volume = Math.max(0, Math.min(1, newVolume));
        }

        if (progress < 1) {
            requestAnimationFrame(animateFade);
        } else {
            studioAudioFading = false;
            console.log('studiocharacter/bgm.js: Fade in complete', {
                finalVolume: studioBGMAudio.volume
            });
        }
    }

    requestAnimationFrame(animateFade);
}

/**
 * Apply audio settings untuk studio BGM
 * @param {Object} settings - Audio settings object
 */
function applyStudioAudioSettings(settings) {
    var master = (settings && settings.masterVolume !== undefined) 
        ? settings.masterVolume 
        : (parseFloat(localStorage.getItem('masterVolume')) || 0.5);
    var bgmSetting = (settings && settings.bgmVolume !== undefined) 
        ? settings.bgmVolume 
        : (parseFloat(localStorage.getItem('bgmVolume')) || 0.5);
    var effectiveVol = Math.max(0, Math.min(1, master * bgmSetting));

    if (!studioBGMAudio) {
        loadCurrentStudioBGM();
    }
    
    if (!studioBGMAudio) {
        console.warn('studiocharacter/bgm.js: studioBGMAudio not initialized');
        return;
    }

    if (!studioAudioFading) {
        studioBGMAudio.volume = effectiveVol;
    }
    
    console.log('studiocharacter/bgm.js: applyStudioAudioSettings', {
        master,
        bgmSetting,
        effectiveVol,
        src: studioBGMAudio.src,
        paused: studioBGMAudio.paused,
        fading: studioAudioFading,
        unlocked: window.__FDS_USER_AUDIO_UNLOCKED
    });

    if ((settings && settings.bgmEnabled === false) || effectiveVol === 0) {
        try { studioBGMAudio.pause(); } catch(e){}
        console.log('studiocharacter/bgm.js: Studio BGM paused due to settings or volume');
        return;
    }

    // Only play if user has unlocked audio
    if (window.__FDS_USER_AUDIO_UNLOCKED) {
        studioBGMAudio.play().then(() => {
            console.log('studiocharacter/bgm.js: Studio BGM playback started');
        }).catch(err => {
            console.warn('studiocharacter/bgm.js: Failed to start studio BGM playback', err);
        });
    }
    
    updateStudioBGMTitle();
}

/**
 * Play next studio BGM
 */
function playNextStudioBGM() {
    currentStudioBGMIndex = (currentStudioBGMIndex + 1) % studioBGMList.length;
    loadCurrentStudioBGM();
    applyStudioAudioSettings(window.AudioSettings || null);
}

/**
 * Play previous studio BGM
 */
function playPrevStudioBGM() {
    currentStudioBGMIndex = (currentStudioBGMIndex - 1 + studioBGMList.length) % studioBGMList.length;
    loadCurrentStudioBGM();
    applyStudioAudioSettings(window.AudioSettings || null);
}

/**
 * Stop studio BGM dengan fade out
 */
function stopStudioBGMWithFade(duration = 1000) {
    if (!studioBGMAudio) return;
    
    var startVolume = studioBGMAudio.volume;
    var startTime = Date.now();

    function animateFade() {
        var elapsed = Date.now() - startTime;
        var progress = Math.min(1, elapsed / duration);
        studioBGMAudio.volume = startVolume * (1 - progress);

        if (progress < 1) {
            requestAnimationFrame(animateFade);
        } else {
            try {
                studioBGMAudio.pause();
                studioBGMAudio.currentTime = 0;
            } catch (e) {}
        }
    }

    requestAnimationFrame(animateFade);
}

// Event listeners

// Ketika studio siap (loading selesai)
document.addEventListener('studioReady', function(e) {
    console.log('studiocharacter/bgm.js: Studio ready detected');
    if (!studioBGMAudio) {
        loadCurrentStudioBGM();
    }
    applyStudioAudioSettings(window.AudioSettings || null);
    // Fade in setelah 1.5 detik ketika studio ready
    setTimeout(() => {
        fadeInStudioBGM(1500);
    }, 100);
});

// Ketika masuk studio (sebelum ready)
document.addEventListener('studioEnter', function(e) {
    console.log('studiocharacter/bgm.js: Entering studio - fading out to reduced volume');
    if (!studioBGMAudio) {
        loadCurrentStudioBGM();
    }
    // Fade out ke volume berkurang dalam 1.5 detik
    fadeOutStudioBGM(1500, 0.3);
});

// Ketika keluar studio
document.addEventListener('studioExit', function(e) {
    console.log('studiocharacter/bgm.js: Exiting studio - stopping BGM');
    stopStudioBGMWithFade(1000);
});

// Ubah BGM studio
document.addEventListener('changeStudioBGM', function(e) {
    if (e && e.detail) {
        if (e.detail.direction === 'next') {
            playNextStudioBGM();
        } else if (e.detail.direction === 'prev') {
            playPrevStudioBGM();
        }
    }
});

// React to audio settings changes
document.addEventListener('audioSettingsChanged', function(e) {
    applyStudioAudioSettings(e && e.detail ? e.detail : window.AudioSettings || null);
});

// Initialize DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('studiocharacter/bgm.js: Initializing studio BGM system');
    
    // Shuffle list (optional)
    // Uncomment jika ingin random order
    /*
    for (let i = studioBGMList.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [studioBGMList[i], studioBGMList[j]] = [studioBGMList[j], studioBGMList[i]];
    }
    */
    
    currentStudioBGMIndex = 0;
    loadCurrentStudioBGM();
    updateStudioBGMTitle();
    
    if (window.AudioSettings) {
        applyStudioAudioSettings(window.AudioSettings);
    }
});

console.log('✓ studiocharacter/bgm.js loaded - studio BGM system ready');
