/****************************************************************/
//                                                              //
//  -------------------Gacha Design Studio--------------------  //
//  Created by: Archana Berry                                   //
//  Assets credits: Lunime, OGL (Open Game License), MIT CC     //
//  Version resource: v0.001_alpha                              //
//  File: export.js                                             //
//  Type: module[design]                                        //
//  Desc: Function export character to svg or etc format's      //
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

// export.js

function exportAsSVG() {
    if (!selectedLayers.length) return;

    const container = document.querySelector('.container');
    container.style.backgroundColor = "transparent";

    // Wrap selected layers into a group
    const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    selectedLayers.forEach(layer => {
        const clonedLayer = layer.cloneNode(true);
        group.appendChild(clonedLayer);
    });

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.appendChild(group);
    const svgString = new XMLSerializer().serializeToString(svg);

    container.style.backgroundColor = "";

    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = window.URL.createObjectURL(blob);

    const fileName = document.getElementById('svgFileName').value || 'character';
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

function exportAsHTML() {
    if (!selectedLayers.length) return;

    const group = document.createElement('div');
    group.style.backgroundColor = "transparent";
    selectedLayers.forEach(layer => {
        const clonedLayer = layer.cloneNode(true);
        group.appendChild(clonedLayer);
    });

    const html = `<div style="background-color: transparent;">${group.innerHTML}</div>`;

    const blob = new Blob([html], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);

    const fileName = document.getElementById('htmlFileName').value || 'character';
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}
