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

/**
 * Handle ESC key untuk membuka settings di studio
 */
document.addEventListener('keydown', function(event) {
  // ESC key = 27 atau event.key === 'Escape'
  if (event.key === 'Escape' || event.keyCode === 27) {
    console.log('studiocharacter/key.js: ESC key pressed - opening settings');
    if (typeof window.openSettingsWindow === 'function') {
      event.preventDefault();
      window.openSettingsWindow();
    }
  }
});

/**
 * Handle Android back button (backbutton event dari Cordova atau device plugin)
 * Juga handle dengan window popstate untuk browser back button
 */
document.addEventListener('backbutton', function(event) {
  console.log('studiocharacter/key.js: Android back button pressed - opening settings');
  if (typeof window.openSettingsWindow === 'function') {
    event.preventDefault();
    window.openSettingsWindow();
  }
});

// Fallback untuk browser back button (jika tidak ada Cordova)
window.addEventListener('popstate', function(event) {
  console.log('studiocharacter/key.js: Browser back button detected');
  // Prevent default back navigation
  event.preventDefault();
  if (typeof window.openSettingsWindow === 'function') {
    window.openSettingsWindow();
  }
});