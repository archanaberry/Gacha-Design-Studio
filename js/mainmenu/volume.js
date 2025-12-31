/****************************************************************/
//                                                              //
//  -------------------Gacha Design Studio--------------------  //
//  Created by: Archana Berry                                   //
//  Assets credits: Lunime, OGL (Open Game License), MIT CC     //
//  Version resource: v0.001_alpha                              //
//  File: volume.js                                             //
//  Type: module[volume]                                        //
//  Desc: Storage for saving volume settings                    //
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

// volume.js

var SoundManager = (function() {
    var bgmAudio = null;

    function _ensureSettings() {
        window.AudioSettings = window.AudioSettings || {
            masterVolume: parseFloat(localStorage.getItem('masterVolume')) || 0.5,
            bgmVolume: parseFloat(localStorage.getItem('bgmVolume')) || 0.5,
            sfxVolume: parseFloat(localStorage.getItem('sfxVolume')) || 0.5,
            uiVolume: parseFloat(localStorage.getItem('uiVolume')) || 0.5,
            bgmEnabled: (localStorage.getItem('bgmEnabled') === 'true')
        };
    }

    function setMasterVolume(v) {
        _ensureSettings();
        window.AudioSettings.masterVolume = v;
        localStorage.setItem('masterVolume', v);
        document.dispatchEvent(new CustomEvent('audioSettingsChanged', { detail: Object.assign({}, window.AudioSettings) }));
    }

    function playBGM(src) {
        _ensureSettings();
        if (bgmAudio) { try { bgmAudio.pause(); } catch(e){} }
        bgmAudio = new Audio(src);
        var vol = (window.AudioSettings.masterVolume || 0.5) * (window.AudioSettings.bgmVolume || 0.5);
        bgmAudio.volume = vol;
        bgmAudio.loop = true;
        bgmAudio.play().catch(() => {});
    }

    return {
        setMasterVolume: setMasterVolume,
        playBGM: playBGM
    };
})();