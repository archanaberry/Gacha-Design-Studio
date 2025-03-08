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
var buttonSFXDirectory = "assets/audio/sfx/button/";

// Fungsi untuk memutar audio
function playSound(file) {
    var UIAudio = new Audio(file);
    UIAudio.volume = localStorage.getItem("uiVolume") || 0.5;
    UIAudio.play();
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
        button.addEventListener('click', () => playSound(getSoundFile('click5')));
    });
    document.querySelectorAll('.confirmbutton').forEach(button => {
        button.addEventListener('click', () => playSound(getSoundFile('click4')));
    });
    document.querySelectorAll('.disagreebutton').forEach(button => {
        button.addEventListener('click', () => playSound(getSoundFile('click2')));
    });
    document.querySelectorAll('.agreebutton').forEach(button => {
        button.addEventListener('click', () => playSound(getSoundFile('click3')));
    });

    // Menambahkan event listener pada tombol-tombol umum
    document.querySelectorAll('button').forEach(button => {
        if (!button.classList.contains('closebutton') && 
            !button.classList.contains('confirmbutton') && 
            !button.classList.contains('disagreebutton') && 
            !button.classList.contains('agreebutton')) {
            button.addEventListener('click', () => playSound(getSoundFile('click1')));
        }
    });
}

// Menambahkan event listener pada klik di luar tombol
document.addEventListener('click', (event) => {
    if (!event.target.closest('button')) {
        playSound(getSoundFile('click0'));
    }
});

// Menjalankan fungsi untuk menambahkan event listener setelah DOM sepenuhnya dimuat
document.addEventListener('DOMContentLoaded', addButtonClickListeners);