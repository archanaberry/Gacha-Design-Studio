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
    const fileInput = document.getElementById(panelId === 'panel1' ? 'imageUpload1' : 'imageUpload2');
    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        const panel = document.getElementById(panelId);
        panel.style.backgroundImage = `url('${e.target.result}')`;
    }

    reader.readAsDataURL(file);
}

function setOpacity(panelId) {
    const opacitySlider = document.getElementById(panelId === 'panel1' ? 'opacitySlider1' : 'opacitySlider2');
    const opacityInput = document.getElementById(panelId === 'panel1' ? 'opacityInput1' : 'opacityInput2');
    const panel = document.getElementById(panelId);

    panel.style.opacity = opacitySlider.value / 100;
    opacityInput.value = opacitySlider.value + '%';
}