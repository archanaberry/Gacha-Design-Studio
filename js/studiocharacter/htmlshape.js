// js/studiocharacter/htmlshape.js

(function() {
    // Tambahkan style UI
    const style = document.createElement('style');
    style.innerHTML = `
        .hs-modal-container {
            display: flex;
            flex-direction: column;
            gap: 12px;
            font-family: inherit;
        }

        .hs-form-row {
            display: flex;
            gap: 8px;
        }

        .hs-btn {
            background-color: #5E6CC9;
            color: #fff;
            border: none;
            border-radius: 8px;
            padding: 8px 12px;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            font-family: inherit;
            font-size: 14px;
            transition: opacity 0.2s;
        }
        .hs-btn:hover { opacity: 0.85; }
        .hs-btn-cancel { background-color: #d9534f; }
        
        /* Collapse Menu */
        .hs-collapse-wrapper {
            background: #fdfdfd;
            border: 1px solid #ccc;
            border-radius: 8px;
            overflow: hidden;
            margin-top: 4px;
        }
        .hs-collapse-header {
            padding: 10px 14px;
            background: #eee;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-weight: bold;
            font-size: 14px;
        }
        .hs-collapse-header:hover { background: #e4e4e4; }
        .hs-collapse-content {
            display: none;
            padding: 10px;
            font-size: 13px;
            border-top: 1px solid #ccc;
            background: #fafafa;
        }
        .hs-collapse-wrapper.active .hs-collapse-content {
            display: block;
        }

        /* Ikon panah collapse */
        .hs-arrow-icon {
            width: 16px;
            height: 16px;
            fill: currentColor;
            transition: transform 0.3s;
        }
        .hs-collapse-wrapper.active .hs-arrow-icon {
            transform: rotate(180deg);
        }

        /* Editor Koding */
        .hs-editor-box {
            display: flex;
            border: 1px solid #aaa;
            border-radius: 6px;
            overflow: hidden;
            background: #1e1e1e;
            height: 300px;
            position: relative;
        }
        .hs-line-nums {
            background: #252526;
            color: #858585;
            padding: 10px 5px 10px 8px;
            text-align: right;
            border-right: 1px solid #333;
            min-width: 40px;
            font-family: monospace;
            font-size: 14px;
            line-height: 21px;
            user-select: none;
            overflow: hidden;
            white-space: pre; 
        }
        .hs-code-wrapper {
            position: relative;
            flex: 1;
            background: #1e1e1e;
        }
        /* Highlight Display */
        .hs-code-highlight {
            position: absolute;
            top: 0; left: 0;
            width: 100%;
            height: 100%;
            padding: 10px;
            font-family: monospace;
            font-size: 14px;
            line-height: 21px;
            white-space: pre; /* Gunakan pre untuk code editor standar agar presisi */
            color: #d4d4d4;
            pointer-events: none;
            z-index: 1;
            overflow: hidden;
        }
        /* Textarea Input */
        .hs-code-textarea {
            position: absolute;
            top: 0; left: 0;
            width: 100%;
            height: 100%;
            padding: 10px;
            font-family: monospace;
            font-size: 14px;
            line-height: 21px;
            white-space: pre;
            background: transparent;
            color: transparent; 
            caret-color: #fff;  
            border: none;
            resize: none;
            outline: none;
            z-index: 2;
            overflow: auto;
        }

        .hs-list-group {
            list-style: none;
            margin: 0; padding: 0;
        }
        .hs-list-group li {
            padding: 4px 0;
            border-bottom: 1px dashed #ccc;
            word-break: break-all;
        }
        .hs-list-group li:last-child { border-bottom: none; }
        
        /* Import Modal styles */
        .hs-import-modal {
            display: flex;
            flex-direction: column;
            gap: 15px;
            padding: 10px;
        }
        .hs-import-input {
            width: 100%;
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 6px;
            font-size: 14px;
        }
        .hs-drop-zone {
            width: 100%;
            height: 50px;
            border: 2px dashed #888;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #666;
            font-weight: bold;
            background: #f9f9f9;
            transition: all 0.3s;
        }
        .hs-drop-zone.dragover {
            background: #e3f2fd;
            border-color: #5E6CC9;
            color: #5E6CC9;
        }
        .hs-file-btn {
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 8px;
            padding: 10px;
            cursor: pointer;
            font-weight: bold;
            transition: opacity 0.2s;
            text-align: center;
        }
        .hs-file-btn:hover { opacity: 0.85; }
    `;
    document.head.appendChild(style);
})();

// Data untuk menampung link / scripts
const hsData = {
    libraries: [],
    files: []
};

function hsToggleCollapse(id) {
    const wrap = document.getElementById(id);
    if (wrap.classList.contains('active')) {
        wrap.classList.remove('active');
    } else {
        wrap.classList.add('active');
    }
}

function hsPromptImport(type) {
    const title = type === 'library' ? 'Import Library JS' : 'Import File JS';
    
    const dialogHTML = `
        <div class="hs-import-modal">
            <p style="margin:0; font-size:14px; color:#444;">Pilih sebagai url, atau drag, atau file di komputer?</p>
            
            <div>
                <label style="font-size: 13px; font-weight:bold; margin-bottom:4px; display:block;">URL/Direktori:</label>
                <div style="display:flex; gap:8px;">
                    <input type="text" id="hs-import-url" class="hs-import-input" placeholder="https://... atau path/ke/file.js">
                    <button class="hs-btn" onclick="hsSubmitImportUrl('${type}')">OK</button>
                </div>
            </div>

            <div style="text-align:center; color:#888; font-size:12px;">— ATAU —</div>

            <div id="hs-drop-zone" class="hs-drop-zone">
                Jatuhkan disini
            </div>

            <div style="text-align:center; color:#888; font-size:12px;">— ATAU —</div>

            <input type="file" id="hs-file-input" accept=".js,application/javascript" style="display:none" onchange="hsHandleFileSelect(event, '${type}')">
            <button class="hs-file-btn" onclick="document.getElementById('hs-file-input').click()">
                Import file dari komputer
            </button>
        </div>
    `;

    const winId = openWindow({
        title: 'Mau import pakai apa?',
        content: dialogHTML,
        footer: '',
        width: '400px',
        height: 'auto',
        minWidth: '300px'
    });

    window.__importModalId = winId;

    // Menangani Drop zone events
    setTimeout(() => {
        const dropZone = document.getElementById('hs-drop-zone');
        if (dropZone) {
            dropZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                dropZone.classList.add('dragover');
            });
            dropZone.addEventListener('dragleave', (e) => {
                e.preventDefault();
                dropZone.classList.remove('dragover');
            });
            dropZone.addEventListener('drop', (e) => {
                e.preventDefault();
                dropZone.classList.remove('dragover');
                if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                    hsProcessFile(e.dataTransfer.files[0], type);
                }
            });
        }
    }, 100);
}

function hsSubmitImportUrl(type) {
    const url = document.getElementById('hs-import-url').value.trim();
    if (url) {
        if (type === 'library') hsData.libraries.push(url);
        else hsData.files.push(url);
        hsRenderLists();
        window.closeWindow(window.__importModalId);
    }
}

function hsHandleFileSelect(event, type) {
    if (event.target.files && event.target.files.length > 0) {
        hsProcessFile(event.target.files[0], type);
    }
}

function hsProcessFile(file, type) {
    if (!file.name.endsWith('.js') && file.type !== 'application/javascript' && file.type !== 'text/javascript') {
        alert("Harap masukkan file berekstensi .js");
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        // Menggunakan blob URL untuk menjalankan local file sebagai src di dalam HTML markup
        const blob = new Blob([e.target.result], { type: 'application/javascript' });
        const blobUrl = URL.createObjectURL(blob);
        
        // Simpan referensi file name dengan array objek atau string
        // Kita gunakan string komentar untuk menandakan nama aslinya di UI
        const entry = blobUrl + "#" + file.name;
        
        if (type === 'library') hsData.libraries.push(entry);
        else hsData.files.push(entry);
        
        hsRenderLists();
        window.closeWindow(window.__importModalId);
    };
    reader.readAsText(file);
}

function hsFormatEntry(entry) {
    // Jika entry mengandung blob dan hash nama file, tampilkan nama filenya saja
    if (entry.startsWith('blob:') && entry.indexOf('#') !== -1) {
        const parts = entry.split('#');
        return `[Local File] ${parts[1]}`;
    }
    return entry;
}

function hsRenderLists() {
    const libUl = document.getElementById('hs-lib-list');
    const fileUl = document.getElementById('hs-file-list');
    if (libUl) {
        libUl.innerHTML = hsData.libraries.length > 0 
            ? hsData.libraries.map(x => `<li>${hsFormatEntry(x)}</li>`).join('') 
            : '<li><i>Kosong</i></li>';
    }
    if (fileUl) {
        fileUl.innerHTML = hsData.files.length > 0 
            ? hsData.files.map(x => `<li>${hsFormatEntry(x)}</li>`).join('') 
            : '<li><i>Kosong</i></li>';
    }
}

function hsSyncEditor() {
    const textarea = document.getElementById('hs-textarea');
    const highlight = document.getElementById('hs-highlight');
    const lineNums = document.getElementById('hs-line-nums');
    
    let code = textarea.value;

    // Syntax Highlight jika ColorCode.javascript tersedia dari js/colorcode/javascript.js
    if (window.ColorCode && typeof window.ColorCode.javascript === 'function') {
        highlight.innerHTML = window.ColorCode.javascript(code);
    } else {
        highlight.textContent = code;
    }

    // Hitung jumlah baris berdasarkan newline
    const lines = code.split('\n');
    let numbers = '';
    
    // Memberikan urutan angka baris dan symbol wrap sesuai permintaan jika terbungkus
    // Karena menggunakan "white-space: pre", text tidak akan terbungkus untuk menjaga kerapian kode
    for (let i = 0; i < lines.length; i++) {
        numbers += (i + 1) + '|<br>';
    }
    // Tambahkan baris kosong ekstra di akhir agar selaras dengan scroll offset bawah textarea
    numbers += '<br>';
    
    lineNums.innerHTML = numbers || '1|<br>';
    
    // Sync Scroll
    highlight.scrollTop = textarea.scrollTop;
    highlight.scrollLeft = textarea.scrollLeft;
    lineNums.scrollTop = textarea.scrollTop;
}

function hsGetEditLayer() {
    if (typeof window.selected !== 'undefined' && window.selected && (window.selected.isHtmlShape || (window.selected.options && window.selected.options.isHtmlShape))) {
        return window.selected;
    }
    return null;
}

window.hsToggleAutoBound = function() {
    const isAuto = document.getElementById('hs-layer-auto-bound');
    if (!isAuto) return;
    const wInput = document.getElementById('hs-layer-width');
    const hInput = document.getElementById('hs-layer-height');
    
    if (isAuto.checked) {
        wInput.disabled = true;
        hInput.disabled = true;
        wInput.style.backgroundColor = '#ddd';
        hInput.style.backgroundColor = '#ddd';
        wInput.style.cursor = 'not-allowed';
        hInput.style.cursor = 'not-allowed';
    } else {
        wInput.disabled = false;
        hInput.disabled = false;
        wInput.style.backgroundColor = '';
        hInput.style.backgroundColor = '';
        wInput.style.cursor = 'text';
        hInput.style.cursor = 'text';
    }
};

// Menjalankan UI API WindowHandler menggunakan contoh dari cara panggil reset studio
function openHtmlShapeStudio() {
    const editLayer = hsGetEditLayer();
    const isEdit = !!editLayer;
    
    // Inisialisasi list data import berdasarkan state (Edit atau Baru)
    if (isEdit && editLayer.htmlShapeData) {
        hsData.libraries = [...(editLayer.htmlShapeData.libraries || [])];
        hsData.files = [...(editLayer.htmlShapeData.files || [])];
    } else {
        hsData.libraries = [];
        hsData.files = [];
    }

    const titleText = isEdit ? '✏️ Edit Markah Web' : 'Tambah sisipan markah web';
    const applyBtnTheme = isEdit ? '#FF9800' : '#5E6CC9';
    const applyBtnIcon = isEdit ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>' : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>';
    const applyBtnText = isEdit ? 'Simpan Perubahan' : 'Pasang ke panel studio (panel1)';

    const layerNameDef = isEdit && editLayer.htmlShapeData ? editLayer.htmlShapeData.layerName : 'Html Web Shape';
    const widthDef = isEdit && editLayer.htmlShapeData ? editLayer.htmlShapeData.width : '200';
    const heightDef = isEdit && editLayer.htmlShapeData ? editLayer.htmlShapeData.height : '200';
    const codeDef = isEdit && editLayer.htmlShapeData ? editLayer.htmlShapeData.code : '';
    const hasBorderDef = isEdit && editLayer.htmlShapeData && editLayer.htmlShapeData.hasBorder !== undefined ? editLayer.htmlShapeData.hasBorder : true;
    const autoBoundDef = isEdit && editLayer.htmlShapeData && editLayer.htmlShapeData.isAutoBound !== undefined ? editLayer.htmlShapeData.isAutoBound : false;
    const liveExecDef = isEdit && editLayer.htmlShapeData && editLayer.htmlShapeData.isLiveExec !== undefined ? editLayer.htmlShapeData.isLiveExec : false;
    const lockPosDef = isEdit && editLayer.htmlShapeData && editLayer.htmlShapeData.isLockPos !== undefined ? editLayer.htmlShapeData.isLockPos : false;

    const dialogHTML = `
        <div class="hs-modal-container">
            <div class="hs-form-row">
                <button class="hs-btn" onclick="hsPromptImport('library')">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    Import library js
                </button>
                <button class="hs-btn" onclick="hsPromptImport('file')">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    Import file js
                </button>
            </div>

            <div id="hs-wrap-file" class="hs-collapse-wrapper">
                <div class="hs-collapse-header" onclick="hsToggleCollapse('hs-wrap-file')">
                    <span>Imported file</span>
                    <svg class="hs-arrow-icon" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/></svg>
                </div>
                <div class="hs-collapse-content">
                    <ul class="hs-list-group" id="hs-file-list"><li><i>Kosong</i></li></ul>
                </div>
            </div>

            <div id="hs-wrap-lib" class="hs-collapse-wrapper">
                <div class="hs-collapse-header" onclick="hsToggleCollapse('hs-wrap-lib')">
                    <span>Imported library</span>
                    <svg class="hs-arrow-icon" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/></svg>
                </div>
                <div class="hs-collapse-content">
                    <ul class="hs-list-group" id="hs-lib-list"><li><i>Kosong</i></li></ul>
                </div>
            </div>

            <div style="display: flex; gap: 8px; margin-bottom: 8px; align-items: flex-end;">
                <div style="flex: 1;">
                    <label style="font-size: 13px; font-weight:bold; margin-bottom:4px; display:block;">Nama sisipan situs:</label>
                    <input type="text" id="hs-layer-name" class="hs-import-input" placeholder="Html Web Shape" value="${layerNameDef.replace(/"/g, '&quot;')}">
                </div>
                <div style="width: 70px;">
                    <label style="font-size: 13px; font-weight:bold; margin-bottom:4px; display:block;">Pjg/W:</label>
                    <input type="number" id="hs-layer-width" class="hs-import-input" value="${widthDef}">
                </div>
                <div style="width: 70px;">
                    <label style="font-size: 13px; font-weight:bold; margin-bottom:4px; display:block;">Lbr/H:</label>
                    <input type="number" id="hs-layer-height" class="hs-import-input" value="${heightDef}">
                </div>
            </div>
            
            <div style="margin-bottom: 8px; display:flex; flex-direction:column; gap:4px;">
                <label style="font-size: 13px; font-weight:bold; display:flex; align-items:center; gap:6px; cursor:pointer;">
                    <input type="checkbox" id="hs-layer-auto-bound" style="width:auto; margin:0;" ${autoBoundDef ? 'checked' : ''} onchange="window.hsToggleAutoBound()">
                    Ukuran Otomatis (Auto Bound)
                </label>
                <label style="font-size: 13px; font-weight:bold; display:flex; align-items:center; gap:6px; cursor:pointer;">
                    <input type="checkbox" id="hs-layer-border" style="width:auto; margin:0;" ${hasBorderDef ? 'checked' : ''}>
                    Tampilkan Garis Pembatas (Dash Bound)
                </label>
                <label style="font-size: 13px; font-weight:bold; display:flex; align-items:center; gap:6px; cursor:pointer;">
                    <input type="checkbox" id="hs-layer-live-exec" style="width:auto; margin:0;" ${liveExecDef ? 'checked' : ''}>
                    Eksekusi Langsung (Bisa Diklik/Live Execute)
                </label>
                <label style="font-size: 13px; font-weight:bold; display:flex; align-items:center; gap:6px; cursor:pointer;">
                    <input type="checkbox" id="hs-layer-lock-pos" style="width:auto; margin:0;" ${lockPosDef ? 'checked' : ''}>
                    Kunci Posisi (Cegah Digeser)
                </label>
            </div>

            <div class="hs-editor-box">
                <div id="hs-line-nums" class="hs-line-nums">1|<br></div>
                <div class="hs-code-wrapper">
                    <div id="hs-highlight" class="hs-code-highlight" aria-hidden="true"></div>
                    <textarea id="hs-textarea" class="hs-code-textarea" oninput="hsSyncEditor()" onscroll="hsSyncEditor()" spellcheck="false" wrap="off"></textarea>
                </div>
            </div>
        </div>
    `;

    const footerHTML = `
        <button class="hs-btn" style="background-color: ${applyBtnTheme};" onclick="hsApplyHtmlShape()">
            ${applyBtnIcon}
            ${applyBtnText}
        </button>
        <button class="hs-btn hs-btn-cancel" onclick="window.closeWindow(window.__htmlShapeId);">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            Batalkan
        </button>
    `;

    const winId = openWindow({
        title: titleText,
        content: dialogHTML,
        footer: footerHTML,
        width: '580px',
        height: '650px',
        minWidth: '400px',
        minHeight: '450px'
    });

    window.__htmlShapeId = winId;
    hsRenderLists();
    setTimeout(window.hsToggleAutoBound, 50);
    
    // Set code pada textarea jika sedang edit
    const textarea = document.getElementById('hs-textarea');
    if (textarea && isEdit && codeDef) {
        textarea.value = codeDef;
        hsSyncEditor();
    }

    if (!window.ColorCode || !window.ColorCode.javascript) {
        console.warn('Fungsi highlight color code belum tersedia. Harap import js/colorcode/javascript.js');
    }
}

function hsApplyHtmlShape() {
    const editLayer = hsGetEditLayer();
    const isEdit = !!editLayer;

    const layerName = document.getElementById('hs-layer-name').value.trim() || 'Html Web Shape';
    const code = document.getElementById('hs-textarea').value;
    const width = parseInt(document.getElementById('hs-layer-width').value) || 200;
    const height = parseInt(document.getElementById('hs-layer-height').value) || 200;
    const hasBorder = document.getElementById('hs-layer-border').checked;
    const isAutoBound = document.getElementById('hs-layer-auto-bound').checked;
    const isLiveExec = document.getElementById('hs-layer-live-exec').checked;
    const isLockPos = document.getElementById('hs-layer-lock-pos').checked;
    
    // Cari panel1
    const panel1Container = document.getElementById('panel1-layercontainer') || document.getElementById('panel1') || document.querySelector('.container');
    if (!panel1Container) {
        alert("Panel1 tidak ditemukan. Tidak dapat menyisipkan shape.");
        return;
    }

    const metadata = {
        layerName, code, width, height, hasBorder, isAutoBound, isLiveExec, isLockPos,
        libraries: [...hsData.libraries],
        files: [...hsData.files]
    };

    const cleanUrl = (src) => src.split('#')[0];
    let headContents = `<style>body{margin:0; overflow:hidden;} *,*::before,*::after{box-sizing:border-box;}</style>\n`;
    hsData.libraries.forEach(lib => {
        headContents += `<script src="${cleanUrl(lib)}"></script>\n`;
    });
    hsData.files.forEach(f => {
        headContents += `<script src="${cleanUrl(f)}"></script>\n`;
    });
    
    // Create iframe-ready HTML document
    const fullHTML = `<!DOCTYPE html><html><head>${headContents}</head><body>${code}</body></html>`;

    // Helper re-adjust lebar panjang otomatis sesaat setelah render selesai
    const applyAutoBoundHelper = (targetLayer, iframeElement, dashStr) => {
        if (!isAutoBound) return;
        const doCalculation = () => {
            if (!targetLayer || !targetLayer.element || !iframeElement) return;
            
            try {
                const doc = iframeElement.contentDocument || iframeElement.contentWindow.document;
                if (!doc || !doc.body) return;
                
                // Lepas batas container sementara untuk membaca real size renderan asli
                const oldDisplay = doc.body.style.display;
                const oldWidth = iframeElement.style.width;
                const oldHeight = iframeElement.style.height;
                
                iframeElement.style.width = '4000px'; 
                iframeElement.style.height = '4000px'; 
                doc.body.style.display = 'inline-block';
                
                let maxW = doc.body.offsetWidth;
                let maxH = doc.body.offsetHeight;
                
                if (doc.body.children.length > 0) {
                    Array.from(doc.body.children).forEach(child => {
                        if (child.tagName.toLowerCase() === 'script') return;
                        const bw = child.offsetWidth || child.scrollWidth || 0;
                        const bh = child.offsetHeight || child.scrollHeight || 0;
                        if (bw > maxW) maxW = bw;
                        if (bh > maxH) maxH = bh;
                    });
                }

                const canvases = doc.querySelectorAll('canvas');
                canvases.forEach(c => {
                    const cw = c.offsetWidth || c.width;
                    const ch = c.offsetHeight || c.height;
                    if(cw > maxW) maxW = cw;
                    if(ch > maxH) maxH = ch;
                });

                if (maxW === 0) maxW = 200;
                if (maxH === 0) maxH = 200;

                // Kembalikan formasi
                doc.body.style.display = oldDisplay;
                iframeElement.style.width = oldWidth;
                iframeElement.style.height = oldHeight;

                // Perbarui Data internal layer & opsi panel
                if (targetLayer.htmlShapeData) {
                    targetLayer.htmlShapeData.width = maxW;
                    targetLayer.htmlShapeData.height = maxH;
                }
                if (targetLayer.options) {
                    targetLayer.options.width = maxW;
                    targetLayer.options.height = maxH;
                }
                
                // Set properties trigger update UI Layer Studio
                if ('width' in targetLayer) targetLayer.width = maxW;
                if ('height' in targetLayer) targetLayer.height = maxH;

                // Tempel kembali Dummy SVG nya agar pas hitbox drag-nya
                const imgEl = targetLayer.element.querySelector('img.src-item[data-index="0"]') || targetLayer.element.querySelector('img.src-item');
                const fixedSVG = 'data:image/svg+xml;base64,' + btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="${maxW}" height="${maxH}"><rect fill="transparent" width="${maxW}" height="${maxH}" ${dashStr} /></svg>`);
                if (imgEl) {
                    imgEl.src = fixedSVG;
                    imgEl.style.width = maxW + 'px';
                    imgEl.style.height = maxH + 'px';
                }
                targetLayer.element.style.width = maxW + 'px';
                targetLayer.element.style.height = maxH + 'px';
                
                // Refresh Layer UI side-panel
                if (typeof targetLayer.updateElement === 'function') targetLayer.updateElement();
                if (typeof updateLayerInputs === 'function') updateLayerInputs();
                
                console.log(`Auto bound iframe calc finish: ${maxW}x${maxH}`);
            } catch(e) {
                 console.warn("Auto bind calculation skipped due to iframe sandbox:", e);
            }
        };

        iframeElement.addEventListener('load', () => setTimeout(doCalculation, 200));
        setTimeout(doCalculation, 1500); // fallback
    };

    // Membuat dummy SVG transparan sebagai base "image src" agar sistem Layer standar (Panel 2) mengenalinya sebagai objek shape yg sah 
    const dashStroke = hasBorder ? `stroke="#ccc" stroke-width="1" stroke-dasharray="4"` : `stroke="none"`;
    const dummySVG = 'data:image/svg+xml;base64,' + btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect fill="transparent" width="${width}" height="${height}" ${dashStroke} /></svg>`);
    
    const layerOpts = {
        width: width,
        height: height,
        posX: 50,
        posY: 50,
        rotation: 0,
        scale: 1,
        opacity: 1,
        isHtmlShape: true
    };

    if (isEdit && editLayer.element) {
        // Mode edit update
        if (editLayer.updateOptions) {
            editLayer.updateOptions({ width, height });
        } else if (editLayer.options) {
            editLayer.options.width = width;
            editLayer.options.height = height;
        }

        editLayer.htmlShapeData = metadata;
        
        // Coba perbarui dummy bounding box (SVG) width dan height nya
        const imgEl = editLayer.element.querySelector('img.src-item[data-index="0"]') || editLayer.element.querySelector('img.src-item');
        if (imgEl) {
            imgEl.src = dummySVG;
            imgEl.style.width = width + 'px';
            imgEl.style.height = height + 'px';
        }
        
        editLayer.element.style.width = width + 'px';
        editLayer.element.style.height = height + 'px';

        // Ganti konten HTML web lamanya agar refresh isinya
        let wrapper = editLayer.element.querySelector('.hs-custom-content-wrapper');
        if (wrapper) wrapper.remove();
        
        wrapper = document.createElement('div');
        wrapper.className = 'hs-custom-content-wrapper';
        wrapper.style.position = 'absolute';
        wrapper.style.top = '0';
        wrapper.style.left = '0';
        wrapper.style.width = '100%';
        wrapper.style.height = '100%';
        wrapper.style.pointerEvents = isLiveExec ? 'auto' : 'none'; 
        wrapper.style.overflow = 'visible'; // Visible agar drag handle tidak terpotong

        // Memblokir aksi geser Layer di level root elemen
        editLayer.element.style.pointerEvents = isLockPos ? 'none' : 'auto';

        const iframe = document.createElement('iframe');
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';
        iframe.style.overflow = 'hidden';
        iframe.sandbox = "allow-scripts allow-same-origin allow-popups"; 
        iframe.srcdoc = fullHTML;
        wrapper.appendChild(iframe);

        // Jika live execute aktif tapi posisi tidak dikunci, buatkan tuas geser agar bisa ditarik
        if (isLiveExec && !isLockPos) {
            const dragHandle = document.createElement('div');
            dragHandle.className = 'hs-drag-handle';
            dragHandle.style.position = 'absolute';
            dragHandle.style.top = '-25px';
            dragHandle.style.left = '0';
            dragHandle.style.width = '120px';
            dragHandle.style.height = '25px';
            dragHandle.style.backgroundColor = 'rgba(94, 108, 201, 0.9)';
            dragHandle.style.color = '#fff';
            dragHandle.style.fontSize = '12px';
            dragHandle.style.fontFamily = 'inherit';
            dragHandle.style.display = 'flex';
            dragHandle.style.alignItems = 'center';
            dragHandle.style.justifyContent = 'center';
            dragHandle.style.borderRadius = '6px 6px 0 0';
            dragHandle.style.cursor = 'move';
            dragHandle.style.pointerEvents = 'auto'; // Agar menangkap klik drag
            dragHandle.style.boxShadow = '0 -2px 5px rgba(0,0,0,0.2)';
            dragHandle.innerHTML = '✋ Geser Web';
            wrapper.appendChild(dragHandle);
        }

        editLayer.element.appendChild(wrapper);

        // Trigger manual update pada properties panel 2 / list layer
        if (typeof editLayer.updateElement === 'function') editLayer.updateElement();
        if (typeof updateLayerInputs === 'function') updateLayerInputs(); 
        
        // Memakai elemen label bawaan untuk mengganti nama Layer DOM jika ada API yang pas, 
        // tapi merubah internal layerName dan sidebar harus manual
        if (Layer && editLayer instanceof Layer) {
            // Sebenarnya obj layerName tidak ada properti setter di class .name, namun ada span label rendering-nya
            const nameLabel = editLayer.element.querySelector('.layer-name');
            if (nameLabel) nameLabel.textContent = layerName;
        }

        // Terapkan Kunci Posisi secara mendalam
        const layerGuard = editLayer.element.querySelector('.layer-guard');
        if (layerGuard) layerGuard.style.pointerEvents = isLockPos ? 'none' : 'auto';
        if (imgEl) imgEl.style.pointerEvents = isLockPos ? 'none' : 'auto';
        
        // Panggil script checker otomatis 0.6 detik kemudian
        applyAutoBoundHelper(editLayer, iframe, dashStroke);

        window.closeWindow(window.__htmlShapeId);
        console.log('HTML Shape berhasil diperbarui');
        return;
    }

    // Instantiate standar Layer (Mode Create Baru)
    let newLayer;
    if (typeof Layer !== 'undefined') {
        newLayer = new Layer(layerName, [dummySVG], layerOpts);
        newLayer.isHtmlShape = true; // Tandai sbg bentuk kustom
        newLayer.htmlShapeData = metadata; // Simpan metadata state
        
        const customContentWrapper = document.createElement('div');
        customContentWrapper.className = 'hs-custom-content-wrapper';
        customContentWrapper.style.position = 'absolute';
        customContentWrapper.style.top = '0';
        customContentWrapper.style.left = '0';
        customContentWrapper.style.width = '100%';
        customContentWrapper.style.height = '100%';
        customContentWrapper.style.pointerEvents = isLiveExec ? 'auto' : 'none'; 
        customContentWrapper.style.overflow = 'visible'; 

        const iframe = document.createElement('iframe');
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';
        iframe.style.overflow = 'hidden';
        iframe.sandbox = "allow-scripts allow-same-origin allow-popups"; 
        iframe.srcdoc = fullHTML;
        customContentWrapper.appendChild(iframe);

        if (isLiveExec && !isLockPos) {
            const dragHandle = document.createElement('div');
            dragHandle.className = 'hs-drag-handle';
            dragHandle.style.position = 'absolute';
            dragHandle.style.top = '-25px';
            dragHandle.style.left = '0';
            dragHandle.style.width = '120px';
            dragHandle.style.height = '25px';
            dragHandle.style.backgroundColor = 'rgba(94, 108, 201, 0.9)';
            dragHandle.style.color = '#fff';
            dragHandle.style.fontSize = '12px';
            dragHandle.style.fontFamily = 'inherit';
            dragHandle.style.display = 'flex';
            dragHandle.style.alignItems = 'center';
            dragHandle.style.justifyContent = 'center';
            dragHandle.style.borderRadius = '6px 6px 0 0';
            dragHandle.style.cursor = 'move';
            dragHandle.style.pointerEvents = 'auto'; // Agar menangkap klik drag
            dragHandle.style.boxShadow = '0 -2px 5px rgba(0,0,0,0.2)';
            dragHandle.innerHTML = '✋ Geser Web';
            customContentWrapper.appendChild(dragHandle);
        }

        if (newLayer.element) {
            newLayer.element.style.pointerEvents = isLockPos ? 'none' : 'auto';
            newLayer.element.appendChild(customContentWrapper);
        }

        // Masukkan ke array panel studio Global
        if (typeof layers !== 'undefined') {
            layers.push(newLayer);
        }

        // Attach & Update pointer
        if (typeof attachLayerToPointerSystem === 'function') {
            attachLayerToPointerSystem(newLayer);
        } else {
            newLayer.attach(panel1Container);
            if (typeof addLayerClickHandler === 'function') {
                addLayerClickHandler(newLayer);
            }
        }

        if (typeof renderLayer === 'function') renderLayer(newLayer);
        if (typeof selectLayer === 'function') selectLayer(newLayer);
        
        // Terapkan Kunci Posisi
        const layerGuard = newLayer.element.querySelector('.layer-guard');
        if (layerGuard) layerGuard.style.pointerEvents = isLockPos ? 'none' : 'auto';
        const newImgEl = newLayer.element.querySelector('img.src-item[data-index="0"]') || newLayer.element.querySelector('img.src-item');
        if (newImgEl) newImgEl.style.pointerEvents = isLockPos ? 'none' : 'auto';
        
        // Panggil script checker otomatis 0.6 detik kemudian
        applyAutoBoundHelper(newLayer, iframe, dashStroke);
        
    } else {
        // Fallback jika tidak berada dalam environment Studio / obj Layer tidak ada
        const wrapper = document.createElement('div');
        wrapper.classList.add('layer', 'htmlshape-layer');
        wrapper.style.position = 'absolute';
        wrapper.style.left = '50%';
        wrapper.style.top = '50%';
        wrapper.style.transform = 'translate(-50%, -50%)';
        wrapper.style.zIndex = '50';
        wrapper.dataset.type = 'htmlshape';
        wrapper.style.pointerEvents = isLockPos ? 'none' : 'auto';
        wrapper.style.overflow = 'visible';
        
        const iframe = document.createElement('iframe');
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';
        iframe.style.pointerEvents = isLiveExec ? 'auto' : 'none';
        iframe.style.overflow = 'hidden';
        iframe.sandbox = "allow-scripts allow-same-origin allow-popups"; 
        iframe.srcdoc = fullHTML;
        wrapper.appendChild(iframe);

        panel1Container.appendChild(wrapper);
    }

    // Otomatis tutup jendela
    window.closeWindow(window.__htmlShapeId);
    console.log('HTML Shape dimasukkan ke panel studio 1 sebagai Layer resmi');
}

window.openHtmlShapeStudio = openHtmlShapeStudio;

// Event listener untuk memantau pemilihan Layer dan mengganti UI tombol Tambahkan/Edit Markah Web
document.addEventListener('layerSelected', (e) => {
    const layer = e.detail && e.detail.layer;
    const shapeBtn = document.getElementById('addHtmlShapeBtn');
    if (!shapeBtn) return;

    if (layer && (layer.isHtmlShape || (layer.options && layer.options.isHtmlShape))) {
        shapeBtn.innerHTML = '✏️ Edit Markah Web';
        shapeBtn.style.backgroundColor = '#FF9800'; // Oren tanda mode Edit
    } else {
        shapeBtn.innerHTML = 'Tambahkan Markah Web';
        shapeBtn.style.backgroundColor = '#5E6CC9'; // Kembali warna ungu
    }
});

/**
 * Dipanggil secara eksternal oleh fitur Export/Import (e.g. js/studiocharacter/export.js)
 * untuk merekonstruksi iFrame DOM web shape jika status layernya dimuat ulang dari save .gsj/.gss
 */
window.hsRehydrateHtmlShape = function(layer, shapeData) {
    if (!layer || !shapeData) return;
    layer.isHtmlShape = true;
    layer.htmlShapeData = shapeData;

    const { code, width, height, hasBorder, isAutoBound, isLiveExec, isLockPos, libraries, files } = shapeData;

    const cleanUrl = (src) => src.split('#')[0];
    let headContents = `<style>body{margin:0; overflow:hidden;} *,*::before,*::after{box-sizing:border-box;}</style>\n`;
    (libraries || []).forEach(lib => {
        headContents += `<script src="${cleanUrl(lib)}"></script>\n`;
    });
    (files || []).forEach(f => {
        headContents += `<script src="${cleanUrl(f)}"></script>\n`;
    });
    
    const fullHTML = `<!DOCTYPE html><html><head>${headContents}</head><body>${code}</body></html>`;

    let wrapper = layer.element.querySelector('.hs-custom-content-wrapper');
    if (wrapper) wrapper.remove(); 

    const customContentWrapper = document.createElement('div');
    customContentWrapper.className = 'hs-custom-content-wrapper';
    customContentWrapper.style.position = 'absolute';
    customContentWrapper.style.top = '0';
    customContentWrapper.style.left = '0';
    customContentWrapper.style.width = '100%';
    customContentWrapper.style.height = '100%';
    customContentWrapper.style.pointerEvents = isLiveExec ? 'auto' : 'none'; 
    customContentWrapper.style.overflow = 'visible'; 

    const iframe = document.createElement('iframe');
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.style.overflow = 'hidden';
    iframe.sandbox = "allow-scripts allow-same-origin allow-popups"; 
    iframe.srcdoc = fullHTML;
    customContentWrapper.appendChild(iframe);

    if (isLiveExec && !isLockPos) {
        const dragHandle = document.createElement('div');
        dragHandle.className = 'hs-drag-handle';
        dragHandle.style.position = 'absolute';
        dragHandle.style.top = '-25px';
        dragHandle.style.left = '0';
        dragHandle.style.width = '120px';
        dragHandle.style.height = '25px';
        dragHandle.style.backgroundColor = 'rgba(94, 108, 201, 0.9)';
        dragHandle.style.color = '#fff';
        dragHandle.style.fontSize = '12px';
        dragHandle.style.fontFamily = 'inherit';
        dragHandle.style.display = 'flex';
        dragHandle.style.alignItems = 'center';
        dragHandle.style.justifyContent = 'center';
        dragHandle.style.borderRadius = '6px 6px 0 0';
        dragHandle.style.cursor = 'move';
        dragHandle.style.pointerEvents = 'auto'; 
        dragHandle.style.boxShadow = '0 -2px 5px rgba(0,0,0,0.2)';
        dragHandle.innerHTML = '✋ Geser Web';
        customContentWrapper.appendChild(dragHandle);
    }

    if (layer.element) {
        layer.element.style.pointerEvents = isLockPos ? 'none' : 'auto';
        layer.element.appendChild(customContentWrapper);
    }

    const layerGuard = layer.element.querySelector('.layer-guard');
    if (layerGuard) layerGuard.style.pointerEvents = isLockPos ? 'none' : 'auto';
    const imgEl = layer.element.querySelector('img.src-item[data-index="0"]') || layer.element.querySelector('img.src-item');
    if (imgEl) imgEl.style.pointerEvents = isLockPos ? 'none' : 'auto';
    
    const dashStroke = hasBorder ? `stroke="#ccc" stroke-width="1" stroke-dasharray="4"` : `stroke="none"`;
    const dummySVG = 'data:image/svg+xml;base64,' + btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect fill="transparent" width="${width}" height="${height}" ${dashStroke} /></svg>`);
    
    if (imgEl) {
        imgEl.src = dummySVG;
        imgEl.style.width = width + 'px';
        imgEl.style.height = height + 'px';
    }
};
