var SoundManager = (function() {
    var bgmVolume = 0.5; // default value
    var bgmAudio = null;

    function setBGMVolume(volume) {
        bgmVolume = volume;
        if (bgmAudio) {
            bgmAudio.volume = bgmVolume;
        }
        console.log('BGM Volume set to:', bgmVolume);
    }

    function playBGM(src) {
        if (bgmAudio) {
            bgmAudio.pause();
        }
        bgmAudio = new Audio(src);
        bgmAudio.volume = bgmVolume;
        bgmAudio.loop = true;
        bgmAudio.play();
    }

    return {
        setBGMVolume: setBGMVolume,
        playBGM: playBGM
    };
})();