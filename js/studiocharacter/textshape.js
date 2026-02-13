
class TextShapeManager {
    constructor() {
        this.systemFonts = [
            'Arial', 'Helvetica', 'Times New Roman', 'Courier New', 'Verdana',
            'Georgia', 'Impact', 'Comic Sans MS', 'Trebuchet MS', 'Arial Black',
            'Tahoma', 'Geneva', 'Palatino', 'Bookman'
        ];
        this.assetFonts = [
            { name: 'Comfortaa', url: 'assets/font/Comfortaa-Regular.ttf' },
            { name: 'Comfortaa Bold', url: 'assets/font/Comfortaa-Bold.ttf' }
        ];
        this.customFonts = [];
        this.strokes = [];

        this.isEditMode = false;
        this.editingLayer = null;

        this.initUI();
        this.attachEventListeners();
        this.injectAssetFontStyles();
    }

    injectAssetFontStyles() {
        const styleId = 'text-studio-asset-fonts';
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            let css = '';
            this.assetFonts.forEach(font => {
                css += `
                    @font-face {
                        font-family: '${font.name}';
                        src: url('${font.url}') format('truetype');
                    }
                `;
            });
            style.textContent = css;
            document.head.appendChild(style);
        }
    }

    createControlRow(label, inputHtml) {
        return `
            <div style="margin-bottom: 8px;">
                <label style="display: block; margin-bottom: 3px; font-weight: bold; color: #333; font-size: 11px;">${label}</label>
                ${inputHtml}
            </div>
        `;
    }

    createNumberInput(id, value, min = -1000, max = 1000, step = 1) {
        return `
            <div style="display: flex; align-items: center; gap: 2px;">
                <button class="step-btn" data-target="${id}" data-step="-${step}" style="width: 24px; height: 24px; border: 1px solid #ddd; background: #f9f9f9; border-radius: 4px; cursor: pointer;">-</button>
                <input type="number" id="${id}" value="${value}" min="${min}" max="${max}" step="${step}" style="flex: 1; padding: 4px; border: 1px solid #ddd; border-radius: 4px; font-size: 12px; text-align: center;">
                <button class="step-btn" data-target="${id}" data-step="${step}" style="width: 24px; height: 24px; border: 1px solid #ddd; background: #f9f9f9; border-radius: 4px; cursor: pointer;">+</button>
            </div>
        `;
    }

    initUI() {
        const uiHTML = `
            <div id="textShapeContainer" style="margin-bottom: 5px; border: 2px solid #5E6CC9; padding: 80px; background-color: #f0f4ff; border-radius: 12px; font-family: 'Comfortaa', sans-serif; overflow: auto; max-height: 60vh; overflow-y: auto;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 12px;">
                    <h3 id="textShapeTitle" style="margin: 0; color: #5E6CC9; font-weight: bold; font-size: 16px;">✨ Text Studio</h3>
                    <div style="font-size: 10px; color: #888;">Advanced Styles</div>
                </div>
                
                <!-- Main Settings -->
                <div style="background: white; padding: 10px; border-radius: 8px; margin-bottom: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
                    <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #333; font-size: 12px;">Konten Teks</label>
                    <input type="text" id="textInput" placeholder="Ketik teks..." style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 6px; box-sizing: border-box; margin-bottom: 8px;">
                    
                    <div style="display: grid; grid-template-columns: 1fr 80px; gap: 8px; margin-bottom: 8px;">
                        <div>
                            <label style="display: block; margin-bottom: 3px; font-weight: bold; color: #333; font-size: 11px;">Font</label>
                            <select id="fontSelect" style="width: 100%; padding: 6px; border: 1px solid #ddd; border-radius: 6px; background: white; font-size: 12px;">
                                <optgroup label="Aset Font" id="assetFontsGroup"></optgroup>
                                <optgroup label="System Fonts" id="systemFontsGroup"></optgroup>
                                <optgroup label="Custom Fonts" id="customFontsGroup"></optgroup>
                            </select>
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 3px; font-weight: bold; color: #333; font-size: 11px;">Size</label>
                            ${this.createNumberInput('fontSizeInput', 40, 1, 500)}
                        </div>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                        <div>
                            <label style="display: block; margin-bottom: 3px; font-weight: bold; color: #333; font-size: 11px;">Warna Utama</label>
                            <div style="display: flex; gap: 2px;">
                                <input type="color" id="mainColorPicker" value="#000000" style="height: 28px; padding: 0; border: none; background: none; flex: 0 0 30px; cursor: pointer;">
                                <input type="text" id="mainColorText" value="#000000FF" style="flex: 1; padding: 4px; border: 1px solid #ddd; border-radius: 4px; font-family: monospace; font-size: 10px;">
                            </div>
                        </div>
                        <div style="display: flex; align-items: flex-end;">
                            <label for="fontUpload" style="cursor: pointer; display: flex; align-items: center; gap: 3px; font-size: 10px; color: #5E6CC9; background: #f0f4ff; padding: 6px; border-radius: 4px; width: 100%; justify-content: center; border: 1px dashed #5E6CC9;">
                                📥 Import Font
                                <input type="file" id="fontUpload" accept=".ttf,.otf" style="display: none;">
                            </label>
                        </div>
                    </div>
                </div>

                <!-- Advanced Styling Tab-like section -->
                <div style="background: white; padding: 10px; border-radius: 8px; margin-bottom: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
                    <div style="font-weight: bold; font-size: 11px; margin-bottom: 8px; color: #5E6CC9; border-bottom: 1px solid #eee; padding-bottom: 5px;">TRANSFORM & SPACING</div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 8px;">
                        ${this.createControlRow('Skew X', this.createNumberInput('skewXInput', 0, -90, 90))}
                        ${this.createControlRow('Skew Y', this.createNumberInput('skewYInput', 0, -90, 90))}
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                        ${this.createControlRow('Kerapatan (Letter Spacing)', this.createNumberInput('letterSpacingInput', 0, -50, 100))}
                        ${this.createControlRow('Margin / Padding SVG', this.createNumberInput('textPaddingInput', 20, 0, 200))}
                    </div>
                </div>

                <!-- Background section -->
                <div style="background: white; padding: 10px; border-radius: 8px; margin-bottom: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                        <div style="font-weight: bold; font-size: 11px; color: #5E6CC9;">BACKGROUND (SOROT)</div>
                        <input type="checkbox" id="bgEnableCheck" style="cursor: pointer;">
                    </div>
                    
                    <div id="bgSettingsPanel" style="display: none;">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 8px;">
                            <div>
                                <label style="display: block; margin-bottom: 3px; font-weight: bold; color: #333; font-size: 11px;">Warna BG</label>
                                <div style="display: flex; gap: 2px;">
                                    <input type="color" id="bgColorPicker" value="#FFFFFF" style="height: 28px; padding: 0; border: none; background: none; flex: 0 0 30px; cursor: pointer;">
                                    <input type="text" id="bgColorText" value="#FFFFFFFF" style="flex: 1; padding: 4px; border: 1px solid #ddd; border-radius: 4px; font-family: monospace; font-size: 10px;">
                                </div>
                            </div>
                            ${this.createControlRow('Padding BG', this.createNumberInput('bgPaddingInput', 5, 0, 100))}
                        </div>
                        
                        <label style="display: block; margin-bottom: 3px; font-weight: bold; color: #333; font-size: 11px;">Radius Sudut (TL, TR, BL, BR)</label>
                        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 4px;">
                            ${this.createNumberInput('radiusTL', 0, 0, 200)}
                            ${this.createNumberInput('radiusTR', 0, 0, 200)}
                            ${this.createNumberInput('radiusBL', 0, 0, 200)}
                            ${this.createNumberInput('radiusBR', 0, 0, 200)}
                        </div>
                    </div>
                </div>

                <!-- Strokes section -->
                <div style="margin-bottom: 15px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 8px;">
                        <label style="font-weight: bold; color: #333; font-size: 12px;">Daftar Coretan (Layers)</label>
                        <button id="addStrokeBtn" style="background: #4CAF50; color: white; border: none; padding: 4px 10px; border-radius: 12px; font-size: 11px; cursor: pointer; display: flex; align-items: center; gap: 4px;">
                            <span>+</span> Tambah
                        </button>
                    </div>
                    <div id="strokesContainer" style="display: flex; flex-direction: column; gap: 8px;"></div>
                    <div id="noStrokesMsg" style="text-align: center; color: #999; font-size: 11px; padding: 10px; border: 1px dashed #ddd; border-radius: 6px;">
                        Belum ada coretan tambahan
                    </div>
                </div>

                <div style="display: flex; gap: 10px;">
                    <button id="createLayerBtn" style="flex: 1; padding: 12px; background-color: #5E6CC9; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; box-shadow: 0 2px 5px rgba(94, 108, 201, 0.3); transition: transform 0.1s;">
                        Buat Text Layer
                    </button>
                    <button id="cancelEditBtn" style="padding: 12px; background-color: #FF6B6B; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; display: none;">
                        Batal
                    </button>
                </div>
            </div>
        `;

        const menusrcContainer = document.getElementById('menusrcContainer');
        const panel2 = document.getElementById('panel2');
        const existing = document.getElementById('textShapeContainer');
        if (existing) existing.remove();

        if (menusrcContainer) menusrcContainer.insertAdjacentHTML('beforebegin', uiHTML);
        else if (panel2) panel2.insertAdjacentHTML('afterbegin', uiHTML);

        this.populateFontSelect();
    }

    populateFontSelect() {
        const sysGroup = document.getElementById('systemFontsGroup');
        const assetGroup = document.getElementById('assetFontsGroup');
        const custGroup = document.getElementById('customFontsGroup');

        if (sysGroup) sysGroup.innerHTML = '';
        this.systemFonts.forEach(font => {
            const opt = document.createElement('option');
            opt.value = font; opt.textContent = font; opt.style.fontFamily = font;
            if (sysGroup) sysGroup.appendChild(opt);
        });

        if (assetGroup) assetGroup.innerHTML = '';
        this.assetFonts.forEach(font => {
            const opt = document.createElement('option');
            opt.value = font.name; opt.textContent = font.name; opt.style.fontFamily = font.name;
            if (assetGroup) assetGroup.appendChild(opt);
        });

        if (custGroup) {
            custGroup.innerHTML = '';
            this.customFonts.forEach(font => {
                const opt = document.createElement('option');
                opt.value = font.name; opt.textContent = font.name; opt.style.fontFamily = font.name;
                custGroup.appendChild(opt);
            });
        }
    }

    attachEventListeners() {
        document.getElementById('fontUpload').addEventListener('change', (e) => this.handleFontUpload(e));
        document.getElementById('addStrokeBtn').addEventListener('click', () => this.addStroke());
        document.getElementById('createLayerBtn').addEventListener('click', () => this.handleCreateOrUpdate());
        document.getElementById('cancelEditBtn').addEventListener('click', () => this.resetToCreateMode());

        // Background Panel toggle
        const bgCheck = document.getElementById('bgEnableCheck');
        const bgPanel = document.getElementById('bgSettingsPanel');
        bgCheck.addEventListener('change', () => {
            bgPanel.style.display = bgCheck.checked ? 'block' : 'none';
        });

        // Plus/Minus Button Logic
        document.getElementById('textShapeContainer').addEventListener('click', (e) => {
            const btn = e.target.closest('.step-btn');
            if (btn) {
                const targetId = btn.dataset.target;
                const step = parseFloat(btn.dataset.step);
                const input = document.getElementById(targetId);
                if (input) {
                    input.value = parseFloat(input.value || 0) + step;
                    input.dispatchEvent(new Event('change', { bubbles: true }));
                }
            }
        });

        // Color Syncing Helpers
        this.setupColorSync('mainColorPicker', 'mainColorText');
        this.setupColorSync('bgColorPicker', 'bgColorText');

        document.addEventListener('layerSelected', (e) => {
            if (e.detail && e.detail.layer) {
                setTimeout(() => this.tryLoadLayer(e.detail.layer), 50);
            }
        });
        if (window.selected) this.tryLoadLayer(window.selected);
    }

    setupColorSync(pickerId, textId) {
        const picker = document.getElementById(pickerId);
        const text = document.getElementById(textId);
        picker.addEventListener('input', (e) => {
            text.value = e.target.value.toUpperCase() + (text.value.length === 9 ? text.value.substring(7) : 'FF');
        });
        text.addEventListener('change', (e) => {
            let val = e.target.value;
            if (!val.startsWith('#')) val = '#' + val;
            if (val.length === 7) val += 'FF';
            if (/^#[0-9A-Fa-f]{8}$/.test(val)) {
                text.value = val.toUpperCase();
                picker.value = val.substring(0, 7);
            }
        });
    }

    async handleFontUpload(e) {
        const file = e.target.files[0];
        if (!file) return;
        const fontName = file.name.split('.')[0];
        const reader = new FileReader();
        reader.onload = (evt) => {
            const fontUrl = evt.target.result;
            const fontFace = new FontFace(fontName, `url(${fontUrl})`);
            fontFace.load().then(loadedFace => {
                document.fonts.add(loadedFace);
                this.customFonts.push({ name: fontName, url: fontUrl });
                this.populateFontSelect();
                document.getElementById('fontSelect').value = fontName;
            }).catch(err => alert('Gagal memuat font: ' + err.message));
        };
        reader.readAsDataURL(file);
    }

    addStroke(data = null) {
        const id = Date.now() + Math.random().toString(36).substr(2, 5);
        const strokeHTML = `
            <div id="stroke-${id}" class="stroke-item" style="background: white; padding: 10px; border-radius: 6px; border-left: 4px solid #FF9800; box-shadow: 0 1px 3px rgba(0,0,0,0.1); position: relative;">
                <div style="position: absolute; right: 5px; top: 5px; cursor: pointer; color: #aaa;" onclick="event.stopPropagation(); document.getElementById('stroke-${id}').remove(); window.textShapeManager.checkEmptyStrokes();">✕</div>
                <div style="font-size: 10px; font-weight: bold; color: #FF9800; margin-bottom: 5px;">Coretan (Belakang)</div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 5px;">
                    <div>
                        <label style="font-size: 10px; display: block;">Warna</label>
                        <div style="display: flex; align-items: center; gap: 2px;">
                            <input type="color" class="stroke-picker" value="${data ? data.color.substring(0, 7) : '#000000'}" style="width: 20px; height: 20px; border: none; cursor: pointer;">
                            <input type="text" class="stroke-color" value="${data ? data.color : '#000000FF'}" style="width: 100%; font-size: 10px; padding: 2px; border: 1px solid #ccc; font-family: monospace;">
                        </div>
                    </div>
                    <div>
                        <label style="font-size: 10px; display: block;">Tebal</label>
                        <div style="display: flex; align-items: center;">
                            <button onclick="val=this.nextElementSibling; val.value=parseInt(val.value)-1" style="width:20px;height:20px;font-size:10px;">-</button>
                            <input type="number" class="stroke-width" value="${data ? data.width : 4}" style="width: 100%; font-size: 10px; padding: 2px; text-align: center;">
                            <button onclick="val=this.previousElementSibling; val.value=parseInt(val.value)+1" style="width:20px;height:20px;font-size:10px;">+</button>
                        </div>
                    </div>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 5px;">
                    <div><label style="font-size: 10px; display: block;">Geser X</label><input type="number" class="stroke-offx" value="${data ? data.offsetX : 0}" style="width: 100%; font-size: 10px; padding: 2px; border: 1px solid #ccc;"></div>
                    <div><label style="font-size: 10px; display: block;">Geser Y</label><input type="number" class="stroke-offy" value="${data ? data.offsetY : 0}" style="width: 100%; font-size: 10px; padding: 2px; border: 1px solid #ccc;"></div>
                    <div><label style="font-size: 10px; display: block;">Rotasi</label><input type="number" class="stroke-rot" value="${data ? data.rotation : 0}" style="width: 100%; font-size: 10px; padding: 2px; border: 1px solid #ccc;"></div>
                </div>
            </div>
        `;
        document.getElementById('strokesContainer').insertAdjacentHTML('beforeend', strokeHTML);
        this.checkEmptyStrokes();

        const el = document.getElementById(`stroke-${id}`);
        const picker = el.querySelector('.stroke-picker');
        const textArea = el.querySelector('.stroke-color');
        picker.addEventListener('input', (e) => textArea.value = e.target.value.toUpperCase() + 'FF');
    }

    checkEmptyStrokes() {
        const container = document.getElementById('strokesContainer');
        const msg = document.getElementById('noStrokesMsg');
        if (container && msg) msg.style.display = container.children.length === 0 ? 'block' : 'none';
    }

    getStrokeData() {
        const strokes = [];
        document.querySelectorAll('.stroke-item').forEach(el => {
            strokes.push({
                color: el.querySelector('.stroke-color').value,
                width: parseInt(el.querySelector('.stroke-width').value) || 0,
                offsetX: parseInt(el.querySelector('.stroke-offx').value) || 0,
                offsetY: parseInt(el.querySelector('.stroke-offy').value) || 0,
                rotation: parseInt(el.querySelector('.stroke-rot').value) || 0
            });
        });
        return strokes;
    }

    handleCreateOrUpdate() {
        const text = document.getElementById('textInput').value;
        if (!text) return alert('Isi teks dulu');

        const fontSize = parseInt(document.getElementById('fontSizeInput').value) || 40;
        const font = document.getElementById('fontSelect').value;
        const mainColor = document.getElementById('mainColorText').value;
        const skewX = parseInt(document.getElementById('skewXInput').value) || 0;
        const skewY = parseInt(document.getElementById('skewYInput').value) || 0;
        const letterSpacing = parseInt(document.getElementById('letterSpacingInput').value) || 0;
        const textPadding = parseInt(document.getElementById('textPaddingInput').value) || 20;

        const bgEnabled = document.getElementById('bgEnableCheck').checked;
        const bgColor = document.getElementById('bgColorText').value;
        const bgPadding = parseInt(document.getElementById('bgPaddingInput').value) || 0;
        const radii = {
            tl: parseInt(document.getElementById('radiusTL').value) || 0,
            tr: parseInt(document.getElementById('radiusTR').value) || 0,
            bl: parseInt(document.getElementById('radiusBL').value) || 0,
            br: parseInt(document.getElementById('radiusBR').value) || 0
        };

        const strokes = this.getStrokeData();
        let cumulativeWidth = 0;
        const processedStrokes = strokes.map(s => {
            cumulativeWidth += (s.width || 0);
            return { ...s, renderWidth: cumulativeWidth };
        });

        const maxStrokeWidth = cumulativeWidth;
        const reverseStrokes = [...processedStrokes].reverse();
        const srcArray = [];
        const options = {};

        let srcIndex = 0;
        const svgParams = {
            text, font, fontSize,
            skewX, skewY, letterSpacing, textPadding,
            bgEnabled, bgColor, bgPadding, radii
        };

        reverseStrokes.forEach(stroke => {
            const svg = this.generateSVG({
                ...svgParams,
                color: stroke.color,
                strokeWidth: stroke.renderWidth,
                paddingRef: maxStrokeWidth
            });
            srcArray.push(svg);
            options[`posX${srcIndex}`] = stroke.offsetX;
            options[`posY${srcIndex}`] = stroke.offsetY;
            options[`rotation${srcIndex}`] = stroke.rotation;
            options[`scale${srcIndex}`] = 1;
            srcIndex++;
        });

        const textSVG = this.generateSVG({
            ...svgParams,
            color: mainColor,
            strokeWidth: 0,
            isFill: true,
            paddingRef: maxStrokeWidth
        });
        srcArray.push(textSVG);
        options[`rotation${srcIndex}`] = 0;
        options[`scale${srcIndex}`] = 1;

        const metadata = {
            version: '2.5',
            text, fontSize, fontFamily: font, mainColor,
            skewX, skewY, letterSpacing, textPadding,
            bgEnabled, bgColor, bgPadding, radii,
            strokes
        };

        const layerOpts = { ...options, width: null, height: null, textShapeData: metadata };

        if (this.isEditMode && this.editingLayer) {
            this.editingLayer.src = srcArray;
            this.editingLayer.textShapeData = metadata;
            if (this.editingLayer.updateOptions) this.editingLayer.updateOptions(layerOpts);
            else this.editingLayer.options = Object.assign(this.editingLayer.options || {}, layerOpts);

            // Fix sync: ensure we don't accidentally keep old transform values if they weren't in opts
            this.editingLayer.width = null;
            this.editingLayer.height = null;
            this.editingLayer.name = text;
            this.editingLayer.updateElement();
        } else {
            const newLayer = new Layer(text, srcArray, layerOpts);
            newLayer.textShapeData = metadata;
            if (typeof layers !== 'undefined') layers.push(newLayer);
            const container = document.getElementById('panel1') || document.querySelector('.container');
            if (container) {
                if (typeof attachLayerToPointerSystem === 'function') attachLayerToPointerSystem(newLayer);
                else {
                    newLayer.attach(container);
                    if (typeof addLayerClickHandler === 'function') addLayerClickHandler(newLayer);
                }
                if (typeof renderLayer === 'function') renderLayer(newLayer);
                if (typeof selectLayer === 'function') selectLayer(newLayer);
            }
        }
        this.resetToCreateMode();
    }

    generateSVG(params) {
        const {
            text, font, fontSize, color, strokeWidth = 0, paddingRef = 0,
            skewX = 0, skewY = 0, letterSpacing = 0, textPadding = 20,
            bgEnabled = false, bgColor = '#FFF', bgPadding = 0, radii = {}
        } = params;

        const c = document.createElement('canvas');
        const ctx = c.getContext('2d');
        // Letter spacing in canvas (modern browsers)
        if ('letterSpacing' in ctx) ctx.letterSpacing = `${letterSpacing}px`;
        ctx.font = `${fontSize}px "${font}"`;

        const metrics = ctx.measureText(text);
        // Effective width considering letter spacing (crude estimate if not natively supported)
        const textWidth = Math.ceil(metrics.width) + (text.length > 0 ? (text.length - 1) * letterSpacing : 0);
        const lineHeight = Math.ceil(fontSize * 1.25);

        const refPadding = Math.max(paddingRef, strokeWidth, textPadding);
        const padding = Math.max(refPadding, 10);

        const totalW = textWidth + (padding * 2);
        const totalH = lineHeight + (padding * 2);

        const centerX = totalW / 2;
        const centerY = (totalH / 2) + (fontSize * 0.35);

        let style = `font-family: '${font}'; font-size: ${fontSize}px; text-anchor: middle; dominant-baseline: middle; letter-spacing: ${letterSpacing}px;`;
        if (strokeWidth > 0) style += ` stroke: ${color}; stroke-width: ${strokeWidth}px; fill: none; stroke-linejoin: round; stroke-linecap: round;`;
        else style += ` fill: ${color};`;

        let fontStyle = '';
        const assetFont = this.assetFonts.find(f => f.name === font);
        const customFont = this.customFonts.find(f => f.name === font);
        if (customFont) fontStyle = `@font-face { font-family: '${font}'; src: url('${customFont.url}'); }`;
        else if (assetFont) fontStyle = `@font-face { font-family: '${font}'; src: url('${assetFont.url}'); }`;
        else fontStyle = `@font-face { font-family: '${font}'; src: local('${font}'); }`;

        // Background Logic
        let backgroundRect = '';
        if (bgEnabled) {
            const bw = textWidth + (bgPadding * 2);
            const bh = lineHeight + (bgPadding * 2);
            const bx = centerX - (bw / 2);
            const by = (totalH / 2) - (bh / 2);

            // Custom Path for individual Corners
            const r = { tl: radii.tl || 0, tr: radii.tr || 0, bl: radii.bl || 0, br: radii.br || 0 };
            const path = `M ${bx + r.tl},${by} h ${bw - r.tl - r.tr} a ${r.tr},${r.tr} 0 0 1 ${r.tr},${r.tr} v ${bh - r.tr - r.br} a ${r.br},${r.br} 0 0 1 ${-r.br},${r.br} h ${-bw + r.br + r.bl} a ${r.bl},${r.bl} 0 0 1 ${-r.bl},${-r.bl} v ${-bh + r.bl + r.tl} a ${r.tl},${r.tl} 0 0 1 ${r.tl},${-r.tl} z`;
            backgroundRect = `<path d="${path}" fill="${bgColor}" />`;
        }

        const transform = `transform="skewX(${skewX}) skewY(${skewY})"`;

        const svgContent = `
            <svg xmlns="http://www.w3.org/2000/svg" width="${totalW}" height="${totalH}" viewBox="0 0 ${totalW} ${totalH}">
                <style>${fontStyle}</style>
                ${backgroundRect}
                <text x="${centerX}" y="${centerY}" style="${style}" ${transform}>${text}</text>
            </svg>
        `;
        return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgContent)));
    }

    syncTextInputFromLayer(layer) { this.tryLoadLayer(layer); }

    tryLoadLayer(layer) {
        if (!layer || !this.isTextLayer(layer)) {
            if (this.isEditMode) this.resetToCreateMode();
            return;
        }

        let data = layer.textShapeData || (layer.options && layer.options.textShapeData);
        if (!data) return;

        console.log('Loading Advanced Text Layer Data');
        this.isEditMode = true; this.editingLayer = layer; this.updateUIMode();

        document.getElementById('textInput').value = data.text || '';
        document.getElementById('fontSizeInput').value = data.fontSize || 40;
        document.getElementById('fontSelect').value = data.fontFamily || 'Arial';
        document.getElementById('mainColorText').value = data.mainColor || '#000000FF';
        document.getElementById('mainColorPicker').value = (data.mainColor || '#000000').substring(0, 7);

        // Load new fields
        document.getElementById('skewXInput').value = data.skewX || 0;
        document.getElementById('skewYInput').value = data.skewY || 0;
        document.getElementById('letterSpacingInput').value = data.letterSpacing || 0;
        document.getElementById('textPaddingInput').value = data.textPadding !== undefined ? data.textPadding : 20;

        const bgCheck = document.getElementById('bgEnableCheck');
        bgCheck.checked = !!data.bgEnabled;
        bgCheck.dispatchEvent(new Event('change'));
        document.getElementById('bgColorText').value = data.bgColor || '#FFFFFFFF';
        document.getElementById('bgColorPicker').value = (data.bgColor || '#FFFFFF').substring(0, 7);
        document.getElementById('bgPaddingInput').value = data.bgPadding || 0;

        const r = data.radii || {};
        document.getElementById('radiusTL').value = r.tl || 0;
        document.getElementById('radiusTR').value = r.tr || 0;
        document.getElementById('radiusBL').value = r.bl || 0;
        document.getElementById('radiusBR').value = r.br || 0;

        const container = document.getElementById('strokesContainer');
        container.innerHTML = '';
        if (data.strokes) data.strokes.forEach(s => this.addStroke(s));
        this.checkEmptyStrokes();
    }

    isTextLayer(layer) { return !!(layer.textShapeData || (layer.options && layer.options.textShapeData)); }

    updateUIMode() {
        const title = document.getElementById('textShapeTitle');
        const btn = document.getElementById('createLayerBtn');
        const cancel = document.getElementById('cancelEditBtn');
        if (this.isEditMode) {
            title.textContent = '✏️ Edit Text Layer'; title.style.color = '#FF9800';
            btn.textContent = 'Simpan Perubahan'; btn.style.backgroundColor = '#FF9800';
            cancel.style.display = 'block';
        } else {
            title.textContent = '✨ Text Studio'; title.style.color = '#5E6CC9';
            btn.textContent = 'Buat Text Layer'; btn.style.backgroundColor = '#5E6CC9';
            cancel.style.display = 'none';
        }
    }

    resetToCreateMode() {
        this.isEditMode = false; this.editingLayer = null; this.updateUIMode();
        document.getElementById('textInput').value = '';
        document.getElementById('strokesContainer').innerHTML = '';
        // Reset all inputs to default
        ['fontSizeInput', 'skewXInput', 'skewYInput', 'letterSpacingInput', 'radiusTL', 'radiusTR', 'radiusBL', 'radiusBR'].forEach(id => {
            const el = document.getElementById(id); if (el) el.value = (id === 'fontSizeInput' ? 40 : 0);
        });
        document.getElementById('textPaddingInput').value = 20;
        document.getElementById('bgEnableCheck').checked = false;
        document.getElementById('bgEnableCheck').dispatchEvent(new Event('change'));
        this.checkEmptyStrokes();
    }
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => window.textShapeManager = new TextShapeManager());
else window.textShapeManager = new TextShapeManager();