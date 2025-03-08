/****************************************************************/
//                                                              //
//  -------------------Gacha Design Studio--------------------  //
//  Created by: Archana Berry                                   //
//  Assets credits: Lunime, OGL (Open Game License), MIT CC     //
//  Version resource: v0.001_alpha                              //
//  File: background.js                                         //
//  Type: module[design]                                        //
//  Desc: Function for controling studio sprite shapes part     //
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

let interval;

function updateCoordInput() {
    document.getElementById('xCoord').value = selected.x;
    document.getElementById('yCoord').value = selected.y;
}

function moveLayer(direction) {
    if (!selected) return;

    switch (direction) {
        case 'up':
            selected.y -= sensitivity;
            break;
        case 'down':
            selected.y += sensitivity;
            break;
        case 'left':
            selected.x -= sensitivity;
            break;
        case 'right':
            selected.x += sensitivity;
            break;
    }
    updateCoordInput();
}

function startMove(direction) {
    moveLayer(direction);
    interval = setInterval(() => moveLayer(direction), 0.1);
}

function stopMove() {
    clearInterval(interval);
}

document.addEventListener('mouseup', stopMove);
document.addEventListener('touchend', stopMove);
document.addEventListener('touchcancel', stopMove);