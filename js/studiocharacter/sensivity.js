/****************************************************************/
//                                                              //
//  -------------------Gacha Design Studio--------------------  //
//  Created by: Archana Berry                                   //
//  Assets credits: Lunime, OGL (Open Game License), MIT CC     //
//  Version resource: v0.001_alpha                              //
//  File: sensitivity.js                                        //
//  Type: module[design]                                        //
//  Desc: Handling value sensitivity for control                //
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

// sensitivity.js

let sensitivity = 0.1 // Nilai awal untuk sensitivitas

function handleSensitivity(value) {
    sensitivity = parseFloat(value);
    document.getElementById('sensitivityInput').value = sensitivity;
}

function handleZoom(value) {
    const zoomValue = parseFloat(value);
    const panel = document.getElementById('panel1');
    if (panel) {
        const scale = zoomValue / 100; // 100% = scale 1
        panel.dataset.scale = scale;
        panel.style.transform = `scale(${scale})`;
        document.getElementById('zoomInput').value = zoomValue + '%';
        
        // Record history
        if (typeof window.HistoryManager !== 'undefined') {
          window.HistoryManager.recordAction('zoom', {
            scale: scale,
            action: 'Zoom via slider'
          });
        }
    }
}

function handleZoomInput(value) {
    // Remove '%' if present
    let zoomValue = parseFloat(value.replace('%', ''));
    if (isNaN(zoomValue)) return;
    
    // Clamp to 0-10000
    zoomValue = Math.max(0, Math.min(10000, zoomValue));
    
    const panel = document.getElementById('panel1');
    if (panel) {
        const scale = zoomValue / 100; // 100% = scale 1
        panel.dataset.scale = scale;
        panel.style.transform = `scale(${scale})`;
        document.getElementById('zoomSlider').value = zoomValue;
        document.getElementById('zoomInput').value = zoomValue + '%';
        
        // Record history
        if (typeof window.HistoryManager !== 'undefined') {
          window.HistoryManager.recordAction('zoom', {
            scale: scale,
            action: 'Zoom via input'
          });
        }
    }
}
