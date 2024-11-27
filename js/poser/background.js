/****************************************************************/
//                                                              //
//  -------------------Gacha Design Studio--------------------  //
//  Created by: Archana Berry                                   //
//  Assets credits: Lunime, OGL (Open Game License), MIT CC     //
//  Version resource: v0.001_alpha                              //
//  File: background.js                                         //
//  Type: module[design]                                        //
//  Desc: Load and Save background studio's config              //
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

// background.js

function setBackground(panelId) {
    const fileInput = document.getElementById(panelId === 'panel1' ? 'imageUpload1' : 'imageUpload2');
    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        const panel = document.getElementById(panelId);
        panel.style.backgroundImage = `url('${e.target.result}')`;
        saveConfig(panelId, e.target.result);
    }

    reader.readAsDataURL(file);
}

function saveConfig(panelId, imageUrl) {
    const config = {
        panelId: panelId,
        imageUrl: imageUrl
    };

    // Simpan konfigurasi ke file JSON
    const jsonConfig = JSON.stringify(config);
    localStorage.setItem('backgroundConfig', jsonConfig);

    // Salin file gambar ke folder cache
    const filename = imageUrl.split('/').pop();
    const cacheFolder = '../.cache/';
    fetch(imageUrl)
        .then(response => response.blob())
        .then(blob => {
            const formData = new FormData();
            formData.append('file', blob, filename);
            fetch(cacheFolder + filename, {
                method: 'POST',
                body: formData
            });
        });

}

// Memeriksa jika ada konfigurasi latar belakang yang tersimpan
document.addEventListener('DOMContentLoaded', function() {
    const jsonConfig = localStorage.getItem('backgroundConfig');
    if (jsonConfig) {
        const config = JSON.parse(jsonConfig);
        const panel = document.getElementById(config.panelId);
        panel.style.backgroundImage = `url('${config.imageUrl}')`;
    }
});