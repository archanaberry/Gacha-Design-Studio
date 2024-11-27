//  -------------------Gacha Design Studio--------------------  //
//  Created by: Archana Berry                                   //
//  Assets credits: Lunime, OGL (Open Game License), MIT CC     //
//  Version resource: v0.001_alpha                              //
//  File: upload.js                                             //
//  Type: module[design]                                        //
//  Desc: Handling multi selection layer                        //
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

//upload.js

function addImage(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const newLayer = new Layer(`Shape${layers.length}`, e.target.result);
        layers.push(newLayer);
        newLayer.attach(document.querySelector('.container'), onlayerdragstart);
    };
    reader.readAsDataURL(file);
}

function updateLayerElement(layer, key, src) {
    const imgElement = document.createElement('img');
    imgElement.src = src;
    imgElement.alt = key;
    imgElement.classList.add(key);
    imgElement.draggable = false;
    layer.element.appendChild(imgElement);
}
