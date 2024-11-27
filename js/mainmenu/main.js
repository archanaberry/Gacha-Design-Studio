/****************************************************************/
//                                                              //
//  -------------------Gacha Design Studio--------------------  //
//  Created by: Archana Berry                                   //
//  Assets credits: Lunime, OGL (Open Game License), MIT CC     //
//  Version resource: v0.001_alpha                              //
//  File: main.js                                               //
//  Type: layout[menu]                                          //
//  Desc: Mainmenu layout's                                     //
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

// main.js

const styles = `
button, button:active, button:focus, button:focus-visible {
    outline: none;
//    box-shadow: none;
//    border: none;
//    background: none;
}

button, button:active, button:focus, button:focus-visible {
    -webkit-tap-highlight-color: transparent; /* For removing blue highlight on tap for mobile devices */
}

body {
  user-select: none; /* Prevent text selection outside input box */
}

img {
  pointer-events: none;
}

/* Block drag for all elements */
img, svg {
  -webkit-user-drag: none;
  -moz-user-drag: none;
  -o-user-drag: none;
  -user-drag: none;
}

/* Remove default button border and background */
button {
  border: none;
  background: none;
  padding: 0;
  position: relative; /* To position text relatively */
  outline: none;
}

button:active, 
button:focus, 
button:focus-visible {
  outline: none;
  box-shadow: none;
}

/* Load local font */
@font-face {
  font-family: "Comfortaa"; /* Font name */
  src: url("../../assets/font/Comfortaa-Regular.ttf") format("truetype"); /* Font location */
}

/* Load local font */
@font-face {
  font-family: "Comfortaa-Bold"; /* Font name */
  src: url("../../assets/font/Comfortaa-Bold.ttf") format("truetype"); /* Font location */
}

[class*=menuic] {
  position: absolute;
  transform: translate(-50%, -50%);
  top: 50%;
  left: 50%;
  width: 35%;
}

.button {
  display: inline-flex;
}

.button > .bg {
  width: 14.625vmin;
}

/* Customize Import and Export Character buttons */
.imporoc,
.eksporoc {
  color: white; /* Change text color to white */
  font-family: "Comfortaa", sans-serif; /* Change font to local font */
  transition: all 0.3s;
}

/* Set text styles */
.button span {
  font-size: 18px; /* Increase font size */
  color: white; /* Change text color to white */
  font-family: "Comfortaa-Bold"; /* Change font to local font */
}

.version-ft {
  margin-left: 0;
  font-size: 18px; /* Increase font size */
  color: black; /* Change text color to white */
  font-family: "Comfortaa-Bold"; /* Change font to local font */
  text-shadow:
                -1px -1px 0 #FFFFFF,  
                1px -1px 0 #FFFFFF,
                -1px 1px 0 #FFFFFF,
                1px 1px 0 #FFFFFF;
  position: fixed;
  top: 0%;
  left: 0%;
}

.menu-ft {
  font-size: 18px; /* Increase font size */
  color: black; /* Change text color to white */
  font-family: "Comfortaa-Bold"; /* Change font to local font */
  text-shadow:
                -1px -1px 0 #FFFFFF,  
                1px -1px 0 #FFFFFF,
                -1px 1px 0 #FFFFFF,
                1px 1px 0 #FFFFFF;
}

.container-top,
.container-middle,
.container-bottom {
  padding: 1rem;
  position: absolute;
  left: 0px;
  right: 0px;
}

.container-top {
  text-align: right;
  top: 0px;
  z-index: 1;
}

.container-middle {
  transform: translateY(50%);
  bottom: 25%;
}

.container-middle .button {
  margin: 3%;
}

.container-bottom {
  bottom: 0px;
  display: flex;
  justify-content: space-between;
}

.imporoc {
  margin-right: 1rem;
}

.imporoc img,
.eksporoc img {
  width: 23.25vmin;
}

.imporoc span,
.eksporoc span {
  font-size: 3vmin;
  position: absolute; /* To position text absolutely */
  white-space: nowrap; /* Prevent text wrapping */
  bottom: 37%;
}

.eksporoc span {
  left: 9.5%;
}

.imporoc span {
  left: 38%;
}

.imporoc:active {
  transform: scale(0.95);
}

.eksporoc:active {
  transform: scale(0.95);
}

.eksporoc:active img {
  margin-right: 5px;
}

.imporoc:after {
  position: relative;
  width: 100%;
  height: 100%;
  top: 50%;
  left: 50%;
  transition: all 0.3s;
  z-index: -1;
  transform: translate(-50%, -50%) scale(0);
}

.eksporoc:after {
  position: relative;
  width: 100%;
  height: 100%;
  top: 50%;
  left: 50%;
  transition: all 0.3s;
  z-index: -1;
  transform: translate(-50%, -50%) scale(0);
}

.imporoc:hover:after,
.eksporoc:hover:after {
  transform: translate(-50%, -50%) scale(3);
}

.menu {
  position: relative;
}

.button {
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
}

.button:hover {
  transform: scale(1.1);
}

.button:active:after {
  width: 100%;
  height: 100%;
  top: 50%;
  left: 50%;
  transition: all 0.3s;
  z-index: -1;
  transform: translate(-50%, -50%) scale(2);
  content: "";
  position: absolute;
}

.archanaberrydev img {
  position: absolute;
  top: 32%;
  left: -4%;
  transform: rotate(45deg);
  width: 30vmin;
}

.gachadesignstudio {
  position: relative;
  height: 100vh;
}

.gachadesignstudio img {
  width: 80%;
  height: auto;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  top: 26.5%;
}

.main-menu-bg {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
}

@media screen and (orientation: landscape) {
  .gachadesignstudio img {
    width: 50%;
  }
}
`;

const styleElement = document.createElement('style');
styleElement.textContent = styles;
document.head.appendChild(styleElement);
