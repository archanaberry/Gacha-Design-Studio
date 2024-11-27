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