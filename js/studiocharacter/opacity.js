/****************************************************************/
//                                                              //
//  -------------------Gacha Design Studio--------------------  //
//  Created by: Archana Berry                                   //
//  Assets credits: Lunime, OGL (Open Game License), MIT CC     //
//  Version resource: v0.001_alpha                              //
//  File: opacity.js                                            //
//  Type: module[design]                                        //
//  Desc: Adjustable opacity on panels container studio         //
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

// opacity.js

function setBackground(panelId) {
    const fileInput = document.getElementById(panelId === 'panel1' ? 'imageUpload1' : panelId === 'panel2' ? 'imageUpload2' : 'imageUpload3');
    const file = fileInput.files[0];
    
    // Validasi file ada
    if (!file) {
        console.error('Tidak ada file yang dipilih');
        return;
    }
    
    // Validasi tipe file
    if (!file.type.startsWith('image/')) {
        console.error('File harus berupa gambar');
        return;
    }
    
    const reader = new FileReader();

    reader.onload = function(e) {
        const panel = document.getElementById(panelId);
        panel.style.backgroundImage = `url('${e.target.result}')`;
    }
    
    reader.onerror = function() {
        console.error('Gagal membaca file');
    }

    reader.readAsDataURL(file);
}

function setOpacity(panelId) {
    const sliderId = panelId === 'panel1' ? 'opacitySlider1' : panelId === 'panel2' ? 'opacitySlider2' : 'opacitySlider3';
    const inputId = panelId === 'panel1' ? 'opacityInput1' : panelId === 'panel2' ? 'opacityInput2' : 'opacityInput3';
    
    const opacitySlider = document.getElementById(sliderId);
    const opacityInput = document.getElementById(inputId);
    
    let targetElement;
    
    // Jika panel1, set opacity ke panel1-root (background)
    if (panelId === 'panel1') {
        targetElement = document.getElementById('panel1-root') || document.getElementById('panel1');
    } else {
        targetElement = document.getElementById(panelId);
    }

    if (opacitySlider && opacityInput && targetElement) {
        targetElement.style.opacity = opacitySlider.value / 100;
        opacityInput.value = opacitySlider.value + '%';
        
        // Save configuration using bgconfig
        if (typeof updateBgConfig === 'function') {
            updateBgConfig(panelId, undefined, opacitySlider.value);
        }
    }
}