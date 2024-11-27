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

const styles = `
/* Gaya untuk garis splitter */

#splitter {
    position: absolute;
    width: 100%;
    height: 10px; /* Atur tinggi garis splitter */
    background-color: blue;
    cursor: ns-resize; /* Ubah kursor saat di atas garis splitter */
}
body, html {
    margin: 0;
    padding: 0;
    height: 100%;
    overflow: hidden;
}

.panel1, .panel2 {
    margin: 0;
    background: none;
    background-size: cover;
    height: 100%;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    position: relative;
}

.panel2 {
    position: absolute;
    bottom: 0px;
    left: 0px;
    right: 0px;
}

#imageUpload1, #imageUpload2 {
    margin-bottom: 10px;
}

#imageUpload1,
#imageUpload2 {
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
}

.layer > :not(:first-child) {
    position: absolute;
    top: 0;
    left: 0;
}

.layer.selected {
    outline: 1px solid blue;
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
    z-index: 999;
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
            width: 200px;
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
        #sensitivitySlider, #opacitySlider1, #opacitySlider2, #rotationControl {
            width: 100px;
        }
`;

const styleElement = document.createElement('style');
styleElement.textContent = styles;
document.head.appendChild(styleElement);
