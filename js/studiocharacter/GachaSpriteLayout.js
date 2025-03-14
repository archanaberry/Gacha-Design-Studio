/****************************************************************/
//                                                              //
//  -------------------Gacha Design Studio--------------------  //
//  Created by: Archana Berry                                   //
//  Assets credits: Lunime, OGL (Open Game License), MIT CC     //
//  Version resource: v0.001_alpha                              //
//  File: GachaSpriteLayout.js                                  //
//  Type: module[layout]                                        //
//  Desc: Managing layout sprite character and in/ex character  //
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

/**
 * GachaSpriteLayout.js
 *
 * File ini mengelola layout karakter dalam proyek Gacha Design Studio.
 * 
 * Properti:
 *   - this.snippet: Menyimpan string konfigurasi gabungan
 *   - this.undocode: Menyimpan duplikat dari snippet
 *   - this.slot: Indeks untuk memilih properti (misalnya, karakter ke berapa yang diedit)
 *
 * Data Properti disusun sesuai urutan berikut:
 *
 * [Data Identitas & Profil]
 *   namex, birthday, age, profile, creator, favcolor, favfood, location, personality, occupation, avatar, club, title, icon
 *
 * [Ukuran, Pose, dan Transformasi]
 *   heightx, heighty, pose, rotation, flip, shadow, headlayer, objectshadow
 *
 * [Rambut]
 *   fronthair, rearhair, backhair, ponytail, ahoge
 *
 * [Mata & Wajah]
 *   eyes1x, eyes2x, eyebrows1x, eyebrows2x, pupil1x, pupil2x, mouth, glasses
 *
 * [Aksesori & Pakaian]
 *   accessory1x, accessory2x, accessory3x, hat, other1x, other2x, other3x, other4x, shirt, shirtex, sleeves1x, sleeves2x, pants1x, pants2x, socks1x, socks2x, shoes1x, shoes2x, belt1x, belt2x, gloves1x, gloves2x, wrist1x, wrist2x, cape, scarf1x, scarf2x, wings1x, wings2x, tail, shoulder1x, shoulder2x, weapon1x, weapon2x, weaponsize1x, weaponsize2x, shield
 *
 * [Tambahan Tampilan & Detail]
 *   eyecam, eyehigh, headshape, nose, blush, headsize, headsizey, headflip, blushpos, nosepos, hand1x, hand2x, propsize1x, propsize2x, proprot1x, proprot2x, shieldsize, shieldrot, knee1x, knee2x, logo, logopos, faceshadow, tint, displayoutline, special, specialsizex, specialsizey, specialtint, objectpose, petequip, blinkani, wingsani, capeani, tailani
 *
 * [Posisi dan Ukuran Detail Bagian Wajah]
 *   leyexpos, leyeypos, leyesize, leyesizey, leyerot, reyexpos, reyeypos, reyesize, reyesizey, reyerot, lpupilxpos, lpupilypos, lpupilsize, lpupilsizey, lpupilrot, rpupilxpos, rpupilypos, rpupilsize, rpupilsizey, rpupilrot, leyebrowxpos, leyebrowypos, leyebrowsize, leyebrowsizey, leyebrowrot, reyebrowxpos, reyebrowypos, reyebrowsize, reyebrowsizey, reyebrowrot, mouthxpos, mouthypos, mouthsize, mouthsizey, mouthrot, nosexpos, noseypos, nosesize, nosesizey, noserot
 *
 * [Posisi dan Ukuran Aksesori]
 *   hatxpos, hatypos, hatsize, hatsizey, hatrot, glassesxpos, glassesypos, glassessize, glassessizey, glassesrot, other1xpos, other1ypos, other1size, other1sizey, other1rot, other2xpos, other2ypos, other2size, other2sizey, other2rot, other3xpos, other3ypos, other3size, other3sizey, other3rot, other4xpos, other4ypos, other4size, other4sizey, other4rot, acc1xpos, acc1ypos, acc1size, acc1sizey, acc1rot, acc2xpos, acc2ypos, acc2size, acc2sizey, acc2rot, acc3xpos, acc3ypos, acc3size, acc3sizey, acc3rot
 *
 * [Aksesori Tambahan]
 *   capesize, capesizey, caperot, tailsize, tailsizey, tailrot, wingxpos, wingypos, wingsize, wingsizey, wingrot
 *
 * [Tampilan & Animasi Lain]
 *   facepreset, highlights, fronthairxpos, fronthairypos, fronthairxscale, fronthairyscale, ahogexpos, ahogeypos, ahogexscale, ahogeyscale, fronthairrot, backhairrot, ahogerot, mypetshadowx, mypetposx, mypetxposx, mypetyposx, mypetxscalex, mypetyscalex, mypetrotx, displayhead, displayface, displayhair, displaybody, displayshoulder, displayhand, displaybackshoulder, displaybackhand, displaythigh, displayfoot, displaybackthigh, displaybackfoot, namefontx, chatfontx, bubblex, emotex, chatstylex, bgx, bgxposx, bgyposx, bgxscalex, bgyscalex, bgtintx, fgx, fgtintx, backhairxpos, backhairypos, backhairxscale, backhairyscale, ponytailxpos, ponytailypos, ponytailxscale, ponytailyscale, ponytailrot, capexpos, capeypos, tailxpos, tailypos, specialxpos, specialypos, special2x, specialxpos2x, specialypos2x, specialsizex2x, specialsizey2x, specialtint2x, specialrot, specialrot2x, propxpos1x, propypos1x, propxpos2x, propypos2x, shieldxpos, shieldypos, fhairani, bhairani
 *
 * [Properti Warna] (Menggunakan .substr(2) saat membaca)
 *   skincolor1x, skincolor2x, rearhaircolor1x, rearhaircolor2x, rearhaircolor3x,
 *   fronthaircolor1x, fronthaircolor2x, fronthaircolor3x,
 *   backhaircolor1x, backhaircolor2x, backhaircolor3x,
 *   ponytailcolor1x, ponytailcolor2x, ponytailcolor3x,
 *   ahogecolor1x, ahogecolor2x, ahogecolor3x,
 *   hairacccolorx, hairtipscolorx,
 *   eye1color1x, eye1color2x, eye1color3x,
 *   eye2color1x, eye2color2x, eye2color3x,
 *   pupil1color1x, pupil1color2x,
 *   pupil2color1x, pupil2color2x,
 *   eyebrows1color1x, eyebrows1color2x,
 *   eyebrows2color1x, eyebrows2color2x,
 *   glassescolor1x, glassescolor2x, glassescolor3x,
 *   accessory1color1x, accessory1color2x, accessory1color3x,
 *   accessory2color1x, accessory2color2x, accessory2color3x,
 *   accessory3color1x, accessory3color2x, accessory3color3x,
 *   blushcolorx, logocolorx,
 *   nosecolor1x, nosecolor2x,
 *   mouthcolor1x, mouthcolor2x, mouthcolor3x,
 *   hatcolor1x, hatcolor2x, hatcolor3x,
 *   other1color1x, other1color2x, other1color3x,
 *   other2color1x, other2color2x, other2color3x,
 *   other3color1x, other3color2x, other3color3x,
 *   other4color1x, other4color2x, other4color3x,
 *   shirtcolor1x, shirtcolor2x, shirtcolor3x,
 *   shirtexcolor1x, shirtexcolor2x, shirtexcolor3x,
 *   shoulder1color1x, shoulder1color2x, shoulder1color3x,
 *   shoulder2color1x, shoulder2color2x, shoulder2color3x,
 *   sleeves1color1x, sleeves1color2x, sleeves1color3x,
 *   sleeves2color1x, sleeves2color2x, sleeves2color3x,
 *   pants1color1x, pants1color2x, pants1color3x,
 *   pants2color1x, pants2color2x, pants2color3x,
 *   belt1color1x, belt1color2x, belt1color3x,
 *   belt2color1x, belt2color2x, belt2color3x,
 *   gloves1color1x, gloves1color2x, gloves1color3x,
 *   gloves2color1x, gloves2color2x, gloves2color3x,
 *   shoes1color1x, shoes1color2x, shoes1color3x,
 *   shoes2color1x, shoes2color2x, shoes2color3x,
 *   socks1color1x, socks1color2x, socks1color3x,
 *   socks2color1x, socks2color2x, socks2color3x,
 *   capecolor1x, capecolor2x, capecolor3x,
 *   scarf1color1x, scarf1color2x, scarf1color3x,
 *   scarf2color1x, scarf2color2x, scarf2color3x,
 *   wings1color1x, wings1color2x, wings1color3x,
 *   wings2color1x, wings2color2x, wings2color3x,
 *   tailcolor1x, tailcolor2x, tailcolor3x,
 *   weapon1color1x, weapon1color2x, weapon1color3x,
 *   weapon2color1x, weapon2color2x, weapon2color3x,
 *   shieldcolor1x, shieldcolor2x, shieldcolor3x,
 *   wrist1color1x, wrist1color2x, wrist1color3x,
 *   wrist2color1x, wrist2color2x, wrist2color3x,
 *   knee1color1x, knee1color2x, knee1color3x,
 *   knee2color1x, knee2color2x, knee2color3x,
 *   faceshadowcolorx, tintcolorx, tintspecialcolorx
 *
 * Fungsi updateSnippet() akan menggabungkan semua properti di atas dengan separator "|".
 * Fungsi importFromSnippet(snippetStr) akan mengurai string tersebut kembali ke properti.
 */

class GachaSpriteLayout {
    constructor(slot = 1) {
      this.slot = slot;
      this.snippet = "";
      this.undocode = "";
      // Semua properti disimpan dalam satu objek props
      this.props = {
        // Identitas & Profil
        namex: "", birthday: "", age: 0, profile: "", creator: "",
        favcolor: "", favfood: "", location: "", personality: "",
        occupation: "", avatar: 0, club: 0, title: "", icon: "",
        // Ukuran, Pose, dan Transformasi
        heightx: 0, heighty: 0, pose: 0, rotation: 0, flip: false,
        shadow: false, headlayer: 0, objectshadow: false,
        // Rambut
        fronthair: 0, rearhair: 0, backhair: 0, ponytail: 0, ahoge: 0,
        // Mata & Wajah
        eyes1x: 0, eyes2x: 0, eyebrows1x: 0, eyebrows2x: 0, pupil1x: 0, pupil2x: 0,
        mouth: 0, glasses: 0,
        // Aksesori & Pakaian
        accessory1x: 0, accessory2x: 0, accessory3x: 0, hat: 0,
        other1x: 0, other2x: 0, other3x: 0, other4x: 0,
        shirt: 0, shirtex: 0, sleeves1x: 0, sleeves2x: 0, pants1x: 0,
        pants2x: 0, socks1x: 0, socks2x: 0, shoes1x: 0, shoes2x: 0,
        belt1x: 0, belt2x: 0, gloves1x: 0, gloves2x: 0, wrist1x: 0, wrist2x: 0,
        cape: 0, scarf1x: 0, scarf2x: 0, wings1x: 0, wings2x: 0, tail: 0,
        shoulder1x: 0, shoulder2x: 0, weapon1x: 0, weapon2x: 0,
        weaponsize1x: 0, weaponsize2x: 0, shield: 0,
        // Tambahan Tampilan & Detail
        eyecam: 0, eyehigh: 0, headshape: 0, nose: 0, blush: 0,
        headsize: 0, headsizey: 0, headflip: false, blushpos: 0, nosepos: 0,
        hand1x: 0, hand2x: 0, propsize1x: 0, propsize2x: 0,
        proprot1x: 0, proprot2x: 0, shieldsize: 0, shieldrot: 0,
        knee1x: 0, knee2x: 0, logo: 0, logopos: 0, faceshadow: 0,
        tint: 0, displayoutline: 0, special: 0, specialsizex: 0,
        specialsizey: 0, specialtint: 0, objectpose: 0, petequip: 0,
        blinkani: false, wingsani: false, capeani: false, tailani: false,
        // Posisi dan Ukuran Detail Bagian Wajah
        leyexpos: 0, leyeypos: 0, leyesize: 0, leyesizey: 0, leyerot: 0,
        reyexpos: 0, reyeypos: 0, reyesize: 0, reyesizey: 0, reyerot: 0,
        lpupilxpos: 0, lpupilypos: 0, lpupilsize: 0, lpupilsizey: 0, lpupilrot: 0,
        rpupilxpos: 0, rpupilypos: 0, rpupilsize: 0, rpupilsizey: 0, rpupilrot: 0,
        leyebrowxpos: 0, leyebrowypos: 0, leyebrowsize: 0, leyebrowsizey: 0, leyebrowrot: 0,
        reyebrowxpos: 0, reyebrowypos: 0, reyebrowsize: 0, reyebrowsizey: 0, reyebrowrot: 0,
        mouthxpos: 0, mouthypos: 0, mouthsize: 0, mouthsizey: 0, mouthrot: 0,
        nosexpos: 0, noseypos: 0, nosesize: 0, nosesizey: 0, noserot: 0,
        // Posisi dan Ukuran Aksesori
        hatxpos: 0, hatypos: 0, hatsize: 0, hatsizey: 0, hatrot: 0,
        glassesxpos: 0, glassesypos: 0, glassessize: 0, glassessizey: 0, glassesrot: 0,
        other1xpos: 0, other1ypos: 0, other1size: 0, other1sizey: 0, other1rot: 0,
        other2xpos: 0, other2ypos: 0, other2size: 0, other2sizey: 0, other2rot: 0,
        other3xpos: 0, other3ypos: 0, other3size: 0, other3sizey: 0, other3rot: 0,
        other4xpos: 0, other4ypos: 0, other4size: 0, other4sizey: 0, other4rot: 0,
        acc1xpos: 0, acc1ypos: 0, acc1size: 0, acc1sizey: 0, acc1rot: 0,
        acc2xpos: 0, acc2ypos: 0, acc2size: 0, acc2sizey: 0, acc2rot: 0,
        acc3xpos: 0, acc3ypos: 0, acc3size: 0, acc3sizey: 0, acc3rot: 0,
        // Aksesori Tambahan
        capesize: 0, capesizey: 0, caperot: 0,
        tailsize: 0, tailsizey: 0, tailrot: 0,
        wingxpos: 0, wingypos: 0, wingsize: 0, wingsizey: 0, wingrot: 0,
        // Tampilan & Animasi Lain
        facepreset: 0, highlights: 0, fronthairxpos: 0, fronthairypos: 0,
        fronthairxscale: 0, fronthairyscale: 0, ahogexpos: 0, ahogeypos: 0,
        ahogexscale: 0, ahogeyscale: 0, fronthairrot: 0, backhairrot: 0, ahogerot: 0,
        mypetshadowx: 0, mypetposx: 0, mypetxposx: 0, mypetyposx: 0,
        mypetxscalex: 0, mypetyscalex: 0, mypetrotx: 0,
        displayhead: 0, displayface: 0, displayhair: 0, displaybody: 0,
        displayshoulder: 0, displayhand: 0, displaybackshoulder: 0, displaybackhand: 0,
        displaythigh: 0, displayfoot: 0, displaybackthigh: 0, displaybackfoot: 0,
        namefontx: 0, chatfontx: 0, bubblex: 0, emotex: 0, chatstylex: 0,
        bgx: 0, bgxposx: 0, bgyposx: 0, bgxscalex: 0, bgyscalex: 0, bgtintx: 0,
        fgx: 0, fgtintx: 0, backhairxpos: 0, backhairypos: 0,
        backhairxscale: 0, backhairyscale: 0,
        ponytailxpos: 0, ponytailypos: 0, ponytailxscale: 0, ponytailyscale: 0, ponytailrot: 0,
        capexpos: 0, capeypos: 0, tailxpos: 0, tailypos: 0,
        specialxpos: 0, specialypos: 0, special2x: 0, specialxpos2x: 0, specialypos2x: 0,
        specialsizex2x: 0, specialsizey2x: 0, specialtint2x: 0, specialrot: 0, specialrot2x: 0,
        propxpos1x: 0, propypos1x: 0, propxpos2x: 0, propypos2x: 0,
        shieldxpos: 0, shieldypos: 0,
        fhairani: 0, bhairani: 0,
        // Warna (gunakan .substr(2) saat membaca nilai, default di sini sebagai string kosong)
        skincolor1x: "", skincolor2x: "",
        rearhaircolor1x: "", rearhaircolor2x: "", rearhaircolor3x: "",
        fronthaircolor1x: "", fronthaircolor2x: "", fronthaircolor3x: "",
        backhaircolor1x: "", backhaircolor2x: "", backhaircolor3x: "",
        ponytailcolor1x: "", ponytailcolor2x: "", ponytailcolor3x: "",
        ahogecolor1x: "", ahogecolor2x: "", ahogecolor3x: "",
        hairacccolorx: "", hairtipscolorx: "",
        eye1color1x: "", eye1color2x: "", eye1color3x: "",
        eye2color1x: "", eye2color2x: "", eye2color3x: "",
        pupil1color1x: "", pupil1color2x: "",
        pupil2color1x: "", pupil2color2x: "",
        eyebrows1color1x: "", eyebrows1color2x: "",
        eyebrows2color1x: "", eyebrows2color2x: "",
        glassescolor1x: "", glassescolor2x: "", glassescolor3x: "",
        accessory1color1x: "", accessory1color2x: "", accessory1color3x: "",
        accessory2color1x: "", accessory2color2x: "", accessory2color3x: "",
        accessory3color1x: "", accessory3color2x: "", accessory3color3x: "",
        blushcolorx: "", logocolorx: "",
        nosecolor1x: "", nosecolor2x: "",
        mouthcolor1x: "", mouthcolor2x: "", mouthcolor3x: "",
        hatcolor1x: "", hatcolor2x: "", hatcolor3x: "",
        other1color1x: "", other1color2x: "", other1color3x: "",
        other2color1x: "", other2color2x: "", other2color3x: "",
        other3color1x: "", other3color2x: "", other3color3x: "",
        other4color1x: "", other4color2x: "", other4color3x: "",
        shirtcolor1x: "", shirtcolor2x: "", shirtcolor3x: "",
        shirtexcolor1x: "", shirtexcolor2x: "", shirtexcolor3x: "",
        shoulder1color1x: "", shoulder1color2x: "", shoulder1color3x: "",
        shoulder2color1x: "", shoulder2color2x: "", shoulder2color3x: "",
        sleeves1color1x: "", sleeves1color2x: "", sleeves1color3x: "",
        sleeves2color1x: "", sleeves2color2x: "", sleeves2color3x: "",
        pants1color1x: "", pants1color2x: "", pants1color3x: "",
        pants2color1x: "", pants2color2x: "", pants2color3x: "",
        belt1color1x: "", belt1color2x: "", belt1color3x: "",
        belt2color1x: "", belt2color2x: "", belt2color3x: "",
        gloves1color1x: "", gloves1color2x: "", gloves1color3x: "",
        gloves2color1x: "", gloves2color2x: "", gloves2color3x: "",
        shoes1color1x: "", shoes1color2x: "", shoes1color3x: "",
        shoes2color1x: "", shoes2color2x: "", shoes2color3x: "",
        socks1color1x: "", socks1color2x: "", socks1color3x: "",
        socks2color1x: "", socks2color2x: "", socks2color3x: "",
        capecolor1x: "", capecolor2x: "", capecolor3x: "",
        scarf1color1x: "", scarf1color2x: "", scarf1color3x: "",
        scarf2color1x: "", scarf2color2x: "", scarf2color3x: "",
        wings1color1x: "", wings1color2x: "", wings1color3x: "",
        wings2color1x: "", wings2color2x: "", wings2color3x: "",
        tailcolor1x: "", tailcolor2x: "", tailcolor3x: "",
        weapon1color1x: "", weapon1color2x: "", weapon1color3x: "",
        weapon2color1x: "", weapon2color2x: "", weapon2color3x: "",
        shieldcolor1x: "", shieldcolor2x: "", shieldcolor3x: "",
        wrist1color1x: "", wrist1color2x: "", wrist1color3x: "",
        wrist2color1x: "", wrist2color2x: "", wrist2color3x: "",
        knee1color1x: "", knee1color2x: "", knee1color3x: "",
        knee2color1x: "", knee2color2x: "", knee2color3x: "",
        faceshadowcolorx: "", tintcolorx: "", tintspecialcolorx: ""
      };
  
      // Array properti untuk menentukan urutan penggabungan
      this.propertyOrder = [
        // Data Identitas & Profil:
        "namex", "birthday", "age", "profile", "creator", "favcolor", "favfood",
        "location", "personality", "occupation", "avatar", "club", "title", "icon",
        // Ukuran, Pose, dan Transformasi:
        "heightx", "heighty", "pose", "rotation", "flip", "shadow", "headlayer", "objectshadow",
        // Rambut:
        "fronthair", "rearhair", "backhair", "ponytail", "ahoge",
        // Mata & Wajah:
        "eyes1x", "eyes2x", "eyebrows1x", "eyebrows2x", "pupil1x", "pupil2x", "mouth", "glasses",
        // Aksesori & Pakaian:
        "accessory1x", "accessory2x", "accessory3x", "hat", "other1x", "other2x", "other3x", "other4x",
        "shirt", "shirtex", "sleeves1x", "sleeves2x", "pants1x", "pants2x", "socks1x", "socks2x",
        "shoes1x", "shoes2x", "belt1x", "belt2x", "gloves1x", "gloves2x", "wrist1x", "wrist2x",
        "cape", "scarf1x", "scarf2x", "wings1x", "wings2x", "tail", "shoulder1x", "shoulder2x",
        "weapon1x", "weapon2x", "weaponsize1x", "weaponsize2x", "shield",
        // Tambahan Tampilan & Detail:
        "eyecam", "eyehigh", "headshape", "nose", "blush", "headsize", "headsizey",
        "headflip", "blushpos", "nosepos", "hand1x", "hand2x", "propsize1x", "propsize2x",
        "proprot1x", "proprot2x", "shieldsize", "shieldrot", "knee1x", "knee2x",
        "logo", "logopos", "faceshadow", "tint", "displayoutline", "special",
        "specialsizex", "specialsizey", "specialtint", "objectpose", "petequip",
        "blinkani", "wingsani", "capeani", "tailani",
        // Posisi dan Ukuran Detail Bagian Wajah:
        "leyexpos", "leyeypos", "leyesize", "leyesizey", "leyerot",
        "reyexpos", "reyeypos", "reyesize", "reyesizey", "reyerot",
        "lpupilxpos", "lpupilypos", "lpupilsize", "lpupilsizey", "lpupilrot",
        "rpupilxpos", "rpupilypos", "rpupilsize", "rpupilsizey", "rpupilrot",
        "leyebrowxpos", "leyebrowypos", "leyebrowsize", "leyebrowsizey", "leyebrowrot",
        "reyebrowxpos", "reyebrowypos", "reyebrowsize", "reyebrowsizey", "reyebrowrot",
        "mouthxpos", "mouthypos", "mouthsize", "mouthsizey", "mouthrot",
        "nosexpos", "noseypos", "nosesize", "nosesizey", "noserot",
        // Posisi dan Ukuran Aksesori:
        "hatxpos", "hatypos", "hatsize", "hatsizey", "hatrot",
        "glassesxpos", "glassesypos", "glassessize", "glassessizey", "glassesrot",
        "other1xpos", "other1ypos", "other1size", "other1sizey", "other1rot",
        "other2xpos", "other2ypos", "other2size", "other2sizey", "other2rot",
        "other3xpos", "other3ypos", "other3size", "other3sizey", "other3rot",
        "other4xpos", "other4ypos", "other4size", "other4sizey", "other4rot",
        "acc1xpos", "acc1ypos", "acc1size", "acc1sizey", "acc1rot",
        "acc2xpos", "acc2ypos", "acc2size", "acc2sizey", "acc2rot",
        "acc3xpos", "acc3ypos", "acc3size", "acc3sizey", "acc3rot",
        // Aksesori Tambahan:
        "capesize", "capesizey", "caperot",
        "tailsize", "tailsizey", "tailrot",
        "wingxpos", "wingypos", "wingsize", "wingsizey", "wingrot",
        // Tampilan & Animasi Lain:
        "facepreset", "highlights", "fronthairxpos", "fronthairypos", "fronthairxscale",
        "fronthairyscale", "ahogexpos", "ahogeypos", "ahogexscale", "ahogeyscale",
        "fronthairrot", "backhairrot", "ahogerot", "mypetshadowx", "mypetposx",
        "mypetxposx", "mypetyposx", "mypetxscalex", "mypetyscalex", "mypetrotx",
        "displayhead", "displayface", "displayhair", "displaybody", "displayshoulder",
        "displayhand", "displaybackshoulder", "displaybackhand", "displaythigh",
        "displayfoot", "displaybackthigh", "displaybackfoot", "namefontx", "chatfontx",
        "bubblex", "emotex", "chatstylex", "bgx", "bgxposx", "bgyposx", "bgxscalex",
        "bgyscalex", "bgtintx", "fgx", "fgtintx", "backhairxpos", "backhairypos",
        "backhairxscale", "backhairyscale", "ponytailxpos", "ponytailypos",
        "ponytailxscale", "ponytailyscale", "ponytailrot", "capexpos", "capeypos",
        "tailxpos", "tailypos", "specialxpos", "specialypos", "special2x",
        "specialxpos2x", "specialypos2x", "specialsizex2x", "specialsizey2x",
        "specialtint2x", "specialrot", "specialrot2x", "propxpos1x", "propypos1x",
        "propxpos2x", "propypos2x", "shieldxpos", "shieldypos", "fhairani",
        "bhairani",
        // Properti Warna (gunakan .substr(2) saat membaca nilainya)
        "skincolor1x", "skincolor2x",
        "rearhaircolor1x", "rearhaircolor2x", "rearhaircolor3x",
        "fronthaircolor1x", "fronthaircolor2x", "fronthaircolor3x",
        "backhaircolor1x", "backhaircolor2x", "backhaircolor3x",
        "ponytailcolor1x", "ponytailcolor2x", "ponytailcolor3x",
        "ahogecolor1x", "ahogecolor2x", "ahogecolor3x",
        "hairacccolorx", "hairtipscolorx",
        "eye1color1x", "eye1color2x", "eye1color3x",
        "eye2color1x", "eye2color2x", "eye2color3x",
        "pupil1color1x", "pupil1color2x",
        "pupil2color1x", "pupil2color2x",
        "eyebrows1color1x", "eyebrows1color2x",
        "eyebrows2color1x", "eyebrows2color2x",
        "glassescolor1x", "glassescolor2x", "glassescolor3x",
        "accessory1color1x", "accessory1color2x", "accessory1color3x",
        "accessory2color1x", "accessory2color2x", "accessory2color3x",
        "accessory3color1x", "accessory3color2x", "accessory3color3x",
        "blushcolorx", "logocolorx",
        "nosecolor1x", "nosecolor2x",
        "mouthcolor1x", "mouthcolor2x", "mouthcolor3x",
        "hatcolor1x", "hatcolor2x", "hatcolor3x",
        "other1color1x", "other1color2x", "other1color3x",
        "other2color1x", "other2color2x", "other2color3x",
        "other3color1x", "other3color2x", "other3color3x",
        "other4color1x", "other4color2x", "other4color3x",
        "shirtcolor1x", "shirtcolor2x", "shirtcolor3x",
        "shirtexcolor1x", "shirtexcolor2x", "shirtexcolor3x",
        "shoulder1color1x", "shoulder1color2x", "shoulder1color3x",
        "shoulder2color1x", "shoulder2color2x", "shoulder2color3x",
        "sleeves1color1x", "sleeves1color2x", "sleeves1color3x",
        "sleeves2color1x", "sleeves2color2x", "sleeves2color3x",
        "pants1color1x", "pants1color2x", "pants1color3x",
        "pants2color1x", "pants2color2x", "pants2color3x",
        "belt1color1x", "belt1color2x", "belt1color3x",
        "belt2color1x", "belt2color2x", "belt2color3x",
        "gloves1color1x", "gloves1color2x", "gloves1color3x",
        "gloves2color1x", "gloves2color2x", "gloves2color3x",
        "shoes1color1x", "shoes1color2x", "shoes1color3x",
        "shoes2color1x", "shoes2color2x", "shoes2color3x",
        "socks1color1x", "socks1color2x", "socks1color3x",
        "socks2color1x", "socks2color2x", "socks2color3x",
        "capecolor1x", "capecolor2x", "capecolor3x",
        "scarf1color1x", "scarf1color2x", "scarf1color3x",
        "scarf2color1x", "scarf2color2x", "scarf2color3x",
        "wings1color1x", "wings1color2x", "wings1color3x",
        "wings2color1x", "wings2color2x", "wings2color3x",
        "tailcolor1x", "tailcolor2x", "tailcolor3x",
        "weapon1color1x", "weapon1color2x", "weapon1color3x",
        "weapon2color1x", "weapon2color2x", "weapon2color3x",
        "shieldcolor1x", "shieldcolor2x", "shieldcolor3x",
        "wrist1color1x", "wrist1color2x", "wrist1color3x",
        "wrist2color1x", "wrist2color2x", "wrist2color3x",
        "knee1color1x", "knee1color2x", "knee1color3x",
        "knee2color1x", "knee2color2x", "knee2color3x",
        "faceshadowcolorx", "tintcolorx", "tintspecialcolorx"
      ];
    }
  
    updateSnippet() {
      // Buat string konfigurasi dengan menggabungkan properti sesuai urutan
      let parts = [];
      for (let key of this.propertyOrder) {
        // Ambil nilai properti, jika undefined gunakan string kosong
        let value = (this.props[key] !== undefined) ? this.props[key] : "";
        parts.push(value);
      }
      this.snippet = parts.join("|");
      this.undocode = this.snippet; // Duplikat snippet ke undocode
    }
  
    importFromSnippet(snippetStr) {
      let parts = snippetStr.split("|");
      let index = 0;
      for (let key of this.propertyOrder) {
        if (index < parts.length) {
          // Jika nilai berupa angka, konversi ke Number; jika tidak, simpan sebagai string
          let num = Number(parts[index]);
          this.props[key] = isNaN(num) ? parts[index] : num;
          index++;
        }
      }
      this.updateSnippet();
    }

     /**
   * importFromJSON(jsonData)
   * Mengurai data dari JSON ke `this.props`
   */
  importFromJSON(jsonData) {
    try {
      let data = typeof jsonData === "string" ? JSON.parse(jsonData) : jsonData;
      for (let key of this.propertyOrder) {
        if (data.hasOwnProperty(key)) {
          this.props[key] = data[key];
        }
      }
      this.updateSnippet();
    } catch (error) {
      console.error("Gagal mengimpor JSON:", error);
    }
  }

  /**
   * exportToJSON()
   * Mengekspor karakter ke format JSON
   */
  exportToJSON() {
    return JSON.stringify(this.props);
  }

  /**
   * importFromOFL(oflString)
   * Mengurai string OFL (kode acak seperti Base64 tetapi bukan)
   */
  importFromOFL(oflString) {
    try {
      let decoded = this.decodeOFL(oflString);
      this.importFromSnippet(decoded);
    } catch (error) {
      console.error("Gagal mengimpor OFL:", error);
    }
  }

  /**
   * exportToOFL()
   * Mengekspor karakter ke format OFL (mirip Base64 tetapi lebih ringan)
   */
  exportToOFL() {
    return this.encodeOFL(this.snippet);
  }

  /**
   * encodeOFL(data)
   * Mengubah string ke format OFL (pola acak seperti Base64)
   */
  encodeOFL(data) {
    let base = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    let shuffled = "QWERTYUIOPLKJHGFDSAZXCVBNM9876543210qwertyuioplkjhgfdsazxcvbnm+/";
    let encoded = btoa(data);
    return encoded.replace(/[A-Za-z0-9+/]/g, c => shuffled[base.indexOf(c)]);
  }

  /**
   * decodeOFL(data)
   * Mengembalikan string OFL ke format normal
   */
  decodeOFL(data) {
    let base = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    let shuffled = "QWERTYUIOPLKJHGFDSAZXCVBNM9876543210qwertyuioplkjhgfdsazxcvbnm+/";
    let decoded = data.replace(/./g, c => base[shuffled.indexOf(c)]);
    return atob(decoded);
  }
}
  
  // Expose ke global jika tidak menggunakan modul bundler
  if (typeof window !== "undefined") {
    window.GachaSpriteLayout = GachaSpriteLayout;
}