/****************************************************************/
//                                                              //
//  -------------------Gacha Design Studio--------------------  //
//  Created by: Archana Berry                                   //
//  Assets credits: Lunime, OGL (Open Game License), MIT CC     //
//  Version resource: v0.001_alpha                              //
//  File: studiopose.js                                         //
//  Type: layout[studio]                                        //
//  Desc: Studio poser layout's                                 //
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

// studiopose.js

/* 
    kenapa gak sekalian di gabungin di [frame/studiopose.js] ? kan fungsinya sama aja ?
    ribet amat sih -_-
    😒😒😒😒😒😒😒😒
*/
const styles = `
/* Main container layout - Horizontal flex layout */
#mainContainer {
    display: flex;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
}

/* Panel 3 (Framework) - Left side, hidden by default */
.panel3 {
    background: none;
    background-size: cover;
    width: 0px;
    min-height: 100%;
    overflow: auto;
    flex-shrink: 0;
    border-right: 1px solid #ccc;
    position: relative;
    display: none;
}

/* Horizontal splitter between panel3 and panel group */
#splitterH {
    width: 5px;
    height: 100%;
    background-color: #999;
    cursor: ew-resize;
    z-index: 20;
    flex-shrink: 0;
    display: none;
}

#splitterH:hover {
    background-color: #666;
}

/* Panel group - middle and right container */
.panel-group {
    display: flex;
    flex-direction: column;
    flex: 1;
    width: 100%;
    height: 100%;
    position: relative;
}

/* Gaya untuk garis splitter vertikal */
#splitter {
    position: absolute;
    width: 100%;
    height: 10px; /* Atur tinggi garis splitter */
    background-color: blue;
    cursor: ns-resize; /* Ubah kursor saat di atas garis splitter */
    z-index: 10;
}
body, html {
    margin: 0;
    padding: 0;
    height: 100%;
    overflow: hidden;
}


.panel1, .panel2 {
    margin: 0;
    padding: 0;
    background: none;
    background-size: cover;
    width: 100%;
    flex-direction: column;
    position: relative;
    display: flex;
}

.panel2 {
    align-items: initial;
    justify-content: initial;
    height: 100%;
}

.panel1 {
    overflow: visible;
    min-height: auto;
    flex: 1;
    box-sizing: border-box;
}

.panel2 {
    position: absolute;
    bottom: 0px;
    left: 0px;
    right: 0px;
    z-index: 10;
}

#imageUpload1, #imageUpload2, #imageUpload3 {
    margin-bottom: 10px;
}

#imageUpload1,
#imageUpload2,
#imageUpload3 {
    margin-bottom: 20px;
}

.input-container {
        width: 100%;
        height: calc(100% - 5px); /* Atur tinggi panel dengan CSS Grid */
        overflow: auto;
}

/* Menonaktifkan pemilihan teks pada semua elemen kecuali input */
body *:not(input) {
    user-select: none;
}

/* Gaya tambahan untuk input */
input {
    /* Pastikan untuk memungkinkan pemilihan teks di dalam input */
    user-select: text;
}

.layer {
    position: absolute;
    left: 0px;
    top: 0px;
    z-index: 0;
    touch-action: none;
}

/* Gaya untuk layer yang dipilih */
.layer.selected {
    outline: 1px solid red;
}

.layer-group {
    border: none !important;
    background: transparent !important;
    pointer-events: none;
}

.layer-group.selected {
    border: 1px solid red !important;
    pointer-events: auto;
}

.layer > :not(:first-child) {
    position: absolute;
    top: 0;
    left: 0;
}

#rotationControl {
    width: 200px;
}

#rotationIndicator {
    text-align: center;
    margin-top: 5px;
}

/* Gaya untuk Selector */
.selection-box {
    position: absolute;
    z-index: 5;
    border: 1px solid #007bff;
    background-color: rgba(0, 123, 255, 0.3);
}

        /* Input boxes */
        #xCoord {
            width: 200px;
            height: 50px;
            border-radius: 10px;
            border: 5px solid green;
            background-color: lightgreen;
            font-size: 22px;
        }

        #yCoord {
            width: 200px;
            height: 50px;
            border-radius: 10px;
            border: 5px solid blue;
            background-color: lightblue;
            font-size: 22px;
        }

        /* Common style for other input boxes */
        input[type="text"]:not(#xCoord):not(#yCoord) {
            /* width: 200px; */
            height: 50px;
            border-radius: 10px;
            border: 5px solid black;
            font-size: 22px;
        }


        /* Button styles */
        .button {
            border: 5px solid black;
            border-radius: 10px;
            background-color: purple;
            color: white;
            padding: 10px 10px;
            cursor: pointer;
        }

        .button:hover {
            background-color: darkviolet;
        }

        /* Additional styles */
        /* #sensitivitySlider, #opacitySlider1, #opacitySlider2, #opacitySlider3, #rotationControl {
            width: 100px;
        } */

        /* Framework Display Styles */
        #frameworkGrid {
            display: grid !important;
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 5px !important;
            padding: 10px !important;
        }

        .framework-card {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 5px;
            cursor: pointer;
            padding: 5px;
            border-radius: 8px;
            border: 2px solid transparent;
            transition: transform 0.2s ease, border-color 0.2s ease;
        }

        .framework-card:hover {
            border-color: #888;
        }

        .framework-card-selected {
            border: 2px solid #007bff !important;
            background-color: rgba(0, 123, 255, 0.1);
        }

        .framework-frame {
            width: 120px;
            height: 120px;
            border: 5px solid #333;
            border-radius: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #f5f5f5;
            overflow: hidden;
            position: relative;
            flex-shrink: 0;
        }

        .framework-frame img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
        }

        .framework-label {
            font-size: 12px;
            text-align: center;
            color: #333;
            word-break: break-word;
            max-width: 120px;
            line-height: 1.3;
        }

        #panel3 h2 {
            font-size: 20px !important;
            margin: 10px 5px !important;
            padding: 10px !important;
            color: #333;
        }
`;

const styleElement = document.createElement('style');
styleElement.textContent = styles;
document.head.appendChild(styleElement);
