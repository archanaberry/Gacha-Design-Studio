/****************************************************************/
//                                                              //
//  -------------------Gacha Design Studio--------------------  //
//  Created by: Archana Berry                                   //
//  Assets credits: Lunime, OGL (Open Game License), MIT CC     //
//  Version resource: v0.001_alpha                              //
//  File: GachaSpriteManager.js                                 //
//  Type: module[sprite]                                        //
//  Desc: Managing Shape for sprites character                  //
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
 * GachaSpriteManager
 * 
 * Kode ini secara dinamis memuat asset sprite (SVG) dari folder /assets/character.
 * Untuk kategori seperti "head", "body", "arm", "hand", "finger", dan "foot", 
 * aset–aset dari semua variasi (baik standard maupun tambahan) akan digabungkan ke dalam satu grup
 * dan diberi kode dengan format <kategori><urutan> (misal, arm1, arm2, dll).
 *
 * Kode ini mengharuskan adanya endpoint API pada URL: /list?dir={directory}
 * yang mengembalikan JSON: { "files": [ "file1.svg", "file2.svg", ... ] }
 */
class GachaSpriteManager {
  constructor(options = {}) {
    // Root folder aset; defaultnya di /assets/character
    this.assetRoot = options.assetRoot || '/assets/character';

    // Daftar kategori minimal (bisa ditambahkan lebih lanjut)
    this.categories = [
      "accessorie", "arm", "base", "body", "extra", "eye", "finger", "foot",
      "fouer", "hair", "hand", "head", "leg", "prop", "shirtlogo", "specialeffect",
      "tail", "three", "wing"
    ];

    // Kategori yang akan dikelompokkan (digabungkan dalam satu grup dengan kode <shape><index>)
    this.groupCategories = ["head", "body", "arm", "hand", "finger", "foot"];

    // Variasi standar yang menjadi kandidat
    this.standardVariations = ["accessories", "base", "light", "outline", "shade", "trim"];

    // Variasi tambahan khusus untuk kategori tertentu
    this.categoryExtras = {
      "hair": ["highlight", "gloss", "texture"],
      "head": ["chin", "jawline", "cheek"],
      "accessorie": ["gem", "metal", "pattern"],
      "arm": ["sleeve", "muscle", "tattoo"],
      "base": ["skintone", "gradient", "freckle"],
      "body": ["scar", "marking", "shadow"],
      "extra": ["glow", "sparkle", "rune"],
      "eye": ["eyeliner", "reflection", "shadow"],
      "finger": ["nail", "ring", "glove"],
      "foot": ["ankle", "strap", "sock"],
      "fouer": ["fluff", "ribbon", "band"],
      "hand": ["glove", "bracelet", "bandage"],
      "leg": ["stocking", "tattoo", "scar"],
      "prop": ["effect", "glow", "animation"],
      "shirtlogo": ["print", "embroider", "patch"],
      "specialeffect": ["aura", "particle", "light"],
      "tail": ["fluff", "stripe", "glow"],
      "three": ["shadow", "depth", "glow"],
      "wing": ["feather", "gradient", "rune"]
    };

    // Struktur data untuk menyimpan asset yang telah dimuat
    // Format: untuk kategori grup: { kategori: { <shape><index>: url } }
    // Untuk non-grup: { kategori: { variasi: [url1, url2, ...] } }
    this.assets = {};
  }

  /**
   * loadAssets
   * Memuat aset dari setiap kategori dan variasinya secara dinamis.
   */
  async loadAssets() {
    for (let category of this.categories) {
      // Jika kategori termasuk dalam groupCategories, kita buat struktur grup
      if (this.groupCategories.includes(category)) {
        // Buat array untuk menggabungkan aset dari semua variasi
        let groupList = [];
        // Buat kandidat variasi: gabungan dari standardVariations dan extras (jika ada)
        let candidateVariations = this.standardVariations.slice();
        if (this.categoryExtras[category]) {
          candidateVariations = candidateVariations.concat(this.categoryExtras[category]);
        }
        // Untuk tiap variasi, coba load file
        for (let variation of candidateVariations) {
          let dirPath = `${this.assetRoot}/${category}/${variation}`;
          try {
            let fileList = await this.fetchFileList(dirPath);
            if (fileList && fileList.length > 0) {
              // Gabungkan seluruh file dari folder ini ke groupList
              fileList.forEach(filename => {
                groupList.push(`${dirPath}/${filename}`);
              });
            }
          } catch (e) {
            // Jika folder tidak ada, lewati
            console.warn(`Folder tidak ditemukan atau kosong: ${dirPath}`);
          }
        }
        // Buat mapping dengan key <category><index> (index dimulai dari 1)
        this.assets[category] = {};
        groupList.forEach((url, idx) => {
          let key = `${category}${idx + 1}`;
          this.assets[category][key] = url;
        });
      } else {
        // Untuk kategori non-grup, simpan hasil per variasi seperti biasa
        this.assets[category] = {};
        let candidateVariations = this.standardVariations.slice();
        if (this.categoryExtras[category]) {
          candidateVariations = candidateVariations.concat(this.categoryExtras[category]);
        }
        for (let variation of candidateVariations) {
          let dirPath = `${this.assetRoot}/${category}/${variation}`;
          try {
            let fileList = await this.fetchFileList(dirPath);
            if (fileList && fileList.length > 0) {
              this.assets[category][variation] = fileList.map(filename => `${dirPath}/${filename}`);
            }
          } catch (e) {
            console.warn(`Folder tidak ditemukan atau kosong: ${dirPath}`);
          }
        }
      }
    }
    console.log("Asset telah dimuat:", this.assets);
  }

  /**
   * fetchFileList
   * Mengambil daftar file dari server menggunakan endpoint API.
   * @param {string} dirPath - Path folder yang akan diambil.
   * @returns {Promise<Array>} - Daftar nama file dalam folder.
   */
  async fetchFileList(dirPath) {
    let response = await fetch(`/list?dir=${encodeURIComponent(dirPath)}`);
    if (!response.ok) {
      throw new Error(`Gagal memuat folder: ${dirPath}`);
    }
    let data = await response.json();
    if (!data.files) {
      throw new Error(`Response tidak valid untuk folder: ${dirPath}`);
    }
    return data.files;
  }

  /**
   * renderAssets
   * Menampilkan asset dari kategori dan variasi tertentu ke dalam elemen HTML.
   * Untuk kategori grup, gunakan key seperti <category><index>.
   * @param {string} category - Kategori aset (misal: "arm").
   * @param {string} shapeKey - Untuk kategori grup, misalnya "arm1". Untuk non-grup, masih berupa variasi.
   * @param {string} containerId - ID elemen HTML tempat asset ditampilkan.
   */
  renderAssets(category, shapeKey, containerId) {
    let container = document.getElementById(containerId);
    if (!container) {
      console.error(`Container tidak ditemukan: ${containerId}`);
      return;
    }
    container.innerHTML = "";
    if (this.groupCategories.includes(category)) {
      // Untuk kategori grup, cari asset dengan key shapeKey
      if (this.assets[category] && this.assets[category][shapeKey]) {
        let img = document.createElement("img");
        img.src = this.assets[category][shapeKey];
        img.alt = `${shapeKey}`;
        img.classList.add("asset-sprite");
        container.appendChild(img);
      } else {
        console.warn(`Aset dengan key ${shapeKey} untuk kategori ${category} tidak ditemukan.`);
      }
    } else {
      // Untuk non-grup, gunakan metode sebelumnya (menggunakan variasi)
      if (this.assets[category] && this.assets[category][shapeKey]) {
        this.assets[category][shapeKey].forEach(url => {
          let img = document.createElement("img");
          img.src = url;
          img.alt = `${category} - ${shapeKey}`;
          img.classList.add("asset-sprite");
          container.appendChild(img);
        });
      } else {
        console.warn(`Aset untuk ${category}/${shapeKey} belum dimuat.`);
      }
    }
  }

  /**
   * composeCharacter
   * Fungsi contoh untuk menyusun karakter dari aset-aset yang telah dimuat.
   * Untuk kategori grup, selections diharapkan menggunakan key seperti "arm1", "head2", dst.
   * @param {Object} selections - Objek dengan kunci kategori dan nilai objek
   *                              { key: "<shape><index>" } untuk kategori grup,
   *                              dan { variation: "<variasi>", index: <index> } untuk kategori non-grup.
   *                              Contoh: { arm: { key: "arm2" }, head: { key: "head1" } }
   * @param {string} containerId - ID elemen HTML tempat karakter disusun.
   */
  composeCharacter(selections, containerId) {
    let container = document.getElementById(containerId);
    if (!container) {
      console.error(`Container tidak ditemukan: ${containerId}`);
      return;
    }
    container.innerHTML = "";
    let characterDiv = document.createElement("div");
    characterDiv.classList.add("character-sprite");

    for (let category in selections) {
      // Untuk kategori grup, selections[category] harus memiliki property "key"
      if (this.groupCategories.includes(category)) {
        let key = selections[category].key;
        if (this.assets[category] && this.assets[category][key]) {
          let img = document.createElement("img");
          img.src = this.assets[category][key];
          img.alt = `${key}`;
          img.classList.add("character-layer");
          characterDiv.appendChild(img);
        }
      } else {
        // Untuk kategori non-grup, gunakan properti "variation" dan "index"
        let { variation, index } = selections[category];
        if (this.assets[category] &&
            this.assets[category][variation] &&
            this.assets[category][variation].length > index) {
          let img = document.createElement("img");
          img.src = this.assets[category][variation][index];
          img.alt = `${category} - ${variation}`;
          img.classList.add("character-layer");
          characterDiv.appendChild(img);
        }
      }
    }
    container.appendChild(characterDiv);
  }
}

// Untuk penggunaan di browser tanpa module loader, expose kelas ini ke global
if (typeof window !== "undefined") {
  window.GachaSpriteManager = GachaSpriteManager;
}