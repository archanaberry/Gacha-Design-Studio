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
    const fileInput = document.getElementById(panelId === 'panel1' ? 'imageUpload1' : panelId === 'panel2' ? 'imageUpload2' : 'imageUpload3');
    const file = fileInput.files[0];
    
    if (!file) {
        console.error('Tidak ada file yang dipilih');
        return;
    }
    
    if (!file.type.startsWith('image/')) {
        console.error('File harus berupa gambar');
        return;
    }
    
    const reader = new FileReader();

    reader.onload = function(e) {
        let targetElement;
        
        // Jika panel1, set background ke panel1-root (tidak terpengaruh zoom)
        if (panelId === 'panel1') {
            targetElement = document.getElementById('panel1-root') || document.getElementById('panel1');
        } else {
            targetElement = document.getElementById(panelId);
        }
        
        const imageUrl = e.target.result;
        
        targetElement.style.backgroundImage = `url('${imageUrl}')`;
        
        // Save configuration using bgconfig
        if (typeof updateBgConfig === 'function') {
            const currentOpacity = targetElement.style.opacity ? Math.round(parseFloat(targetElement.style.opacity) * 100) : 100;
            updateBgConfig(panelId, imageUrl, currentOpacity);
        }
    }
    
    reader.onerror = function() {
        console.error('Gagal membaca file');
    }

    reader.readAsDataURL(file);
}

// Load saved configurations on page load
document.addEventListener('DOMContentLoaded', function() {
    if (typeof applyAllBgConfigs === 'function') {
        applyAllBgConfigs();
    }
});