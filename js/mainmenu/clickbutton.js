/****************************************************************/
//                                                              //
//  -------------------Gacha Design Studio--------------------  //
//  Created by: Archana Berry                                   //
//  Assets credits: Lunime, OGL (Open Game License), MIT CC     //
//  Version resource: v0.001_alpha                              //
//  File: clickbutton.js                                        //
//  Type: module[audio]                                         //
//  Desc: Clicking sound while click or touching web or button  //
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

// clickbutton.js
// Variabel direktori untuk suara klik
// Perubahan: path asli berada di `assets/audio/button/`
var buttonSFXDirectory = "assets/audio/button/";

// Fungsi untuk memutar audio
function playSound(file, type = 'ui') {
    // type: 'ui' or 'sfx'
    var audio = new Audio(file);
    var settings = window.AudioSettings || {
        masterVolume: parseFloat(localStorage.getItem('masterVolume')) || 0.5,
        uiVolume: parseFloat(localStorage.getItem('uiVolume')) || 0.5,
        sfxVolume: parseFloat(localStorage.getItem('sfxVolume')) || 0.5
    };
    var volFactor = settings.masterVolume || 0.5;
    var channel = (type === 'sfx') ? (settings.sfxVolume || 0.5) : (settings.uiVolume || 0.5);
    audio.volume = Math.max(0, Math.min(1, volFactor * channel));
    // play is triggered by user interaction for clicks so browsers allow it
    audio.play().catch(() => {});
}

// Update UI volume when settings change
document.addEventListener("DOMContentLoaded", function() {
    document.addEventListener("volumeChange", function(event) {
        if (event.detail.uiVolume !== undefined) {
            document.querySelectorAll('audio').forEach(audio => {
                audio.volume = event.detail.uiVolume;
            });
        }
    });
});

// Daftar suara klik
var buttonSFXList = [
    ["click0", "clicking"], // Untuk klik tanpa tombol
    ["click1", "click button"], // Untuk klik pada tombol umum
    ["click2", "click disagree button"], // Untuk tombol tolak
    ["click3", "click agree button"], // Untuk tombol setuju
    ["click4", "click confirm button"], // Untuk tombol konfirmasi
    ["click5", "click close button"] // Untuk tombol tutup
];

// Fungsi untuk mendapatkan jalur lengkap file audio
function getSoundFile(sfxName) {
    return buttonSFXDirectory + sfxName + ".mp3";
}

// Fungsi untuk menambahkan event listener pada tombol
function addButtonClickListeners() {
    // Menambahkan event listener pada tombol dengan kelas tertentu
    document.querySelectorAll('.closebutton').forEach(button => {
        button.addEventListener('click', () => playSound(getSoundFile('click5'), 'ui'));
    });
    document.querySelectorAll('.confirmbutton').forEach(button => {
        button.addEventListener('click', () => playSound(getSoundFile('click4'), 'ui'));
    });
    document.querySelectorAll('.disagreebutton').forEach(button => {
        button.addEventListener('click', () => playSound(getSoundFile('click2'), 'ui'));
    });
    document.querySelectorAll('.agreebutton').forEach(button => {
        button.addEventListener('click', () => playSound(getSoundFile('click3'), 'ui'));
    });

    // Menambahkan event listener pada tombol-tombol umum
    document.querySelectorAll('button').forEach(button => {
        if (!button.classList.contains('closebutton') && 
            !button.classList.contains('confirmbutton') && 
            !button.classList.contains('disagreebutton') && 
            !button.classList.contains('agreebutton')) {
            button.addEventListener('click', () => playSound(getSoundFile('click1'), 'ui'));
        }
    });
}

// Menambahkan event listener pada klik di luar tombol
// play click sound also on general screen clicks (non-button) to give user gesture
document.addEventListener('click', (event) => {
    if (!event.target.closest('button')) {
        playSound(getSoundFile('click0'), 'ui');
    }
    // Also trigger global audio unlock for autoplay policies
    if (!window.__FDS_USER_AUDIO_UNLOCKED) {
        window.__FDS_USER_AUDIO_UNLOCKED = true;
        document.dispatchEvent(new Event('userInteraction'));
    }
});

// Menjalankan fungsi untuk menambahkan event listener setelah DOM sepenuhnya dimuat
document.addEventListener('DOMContentLoaded', addButtonClickListeners);