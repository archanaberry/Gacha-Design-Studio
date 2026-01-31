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
    if (!selected) return;
    
    const xCoordInput = document.getElementById('xCoord');
    const yCoordInput = document.getElementById('yCoord');
    
    // Convert ke display coord jika center origin aktif
    let displayX = selected.x || 0;
    let displayY = selected.y || 0;
    if (typeof getDisplayCoord === 'function') {
        const disp = getDisplayCoord(displayX, displayY);
        displayX = disp.x;
        displayY = disp.y;
    }
    
    if (xCoordInput) xCoordInput.value = displayX;
    if (yCoordInput) yCoordInput.value = displayY;
}


function moveLayer(direction) {
  if (!selected) return;
  let step = sensitivity || 1;
  switch (direction) {
    case 'up':
      selected.y -= step;
      break;
    case 'down':
      selected.y += step;
      break;
    case 'left':
      selected.x -= step;
      break;
    case 'right':
      selected.x += step;
      break;
  }
  updateCoordInput();
}

function startMove(direction) {
  moveLayer(direction);
  interval = setInterval(() => moveLayer(direction), 16); // ~60fps
}

function stopMove() {
  clearInterval(interval);
}

// Keyboard arrow keys
document.addEventListener('keydown', function(event) {
  if (!selected) return;
  if (event.target && (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA')) return;
  let handled = false;
  switch (event.key) {
    case 'ArrowUp':
      moveLayer('up');
      handled = true;
      break;
    case 'ArrowDown':
      moveLayer('down');
      handled = true;
      break;
    case 'ArrowLeft':
      moveLayer('left');
      handled = true;
      break;
    case 'ArrowRight':
      moveLayer('right');
      handled = true;
      break;
  }
  if (handled) event.preventDefault();
});

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