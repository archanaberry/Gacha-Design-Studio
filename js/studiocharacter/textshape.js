// textshape.js - Text Shape Creation Module for Gacha Design Studio
// Allows users to create text layers with outline/shadow effects

class TextShapeManager {
    constructor() {
        this.fonts = this.getAvailableFonts();
        this.isEditMode = false;
        this.editingLayer = null;
        this.initUI();
        this.attachEventListeners();
    }

    getAvailableFonts() {
        // System fonts
        const systemFonts = [
            'Arial', 'Helvetica', 'Times New Roman', 'Courier New', 'Verdana',
            'Georgia', 'Palatino', 'Garamond', 'Bookman', 'Comic Sans MS',
            'Trebuchet MS', 'Arial Black', 'Impact', 'Lucida Sans', 'Tahoma'
        ];

        // Asset fonts
        const assetFonts = [
            'Comfortaa', 'Comfortaa-Bold', 'Comfortaa-Light', 'Comfortaa-Medium', 'Comfortaa-Regular', 'Comfortaa-SemiBold'
        ];

        return {
            system: systemFonts,
            assets: assetFonts
        };
    }

    initUI() {
        const uiHTML = `
            <div id="textShapeContainer" style="margin-bottom: 20px; border: 2px solid #4CAF50; padding: 15px; background-color: #f9f9f9; border-radius: 8px;">
                <h3 id="textShapeTitle" style="margin-bottom: 10px; color: #4CAF50; font-weight: bold;">Pembuatan Sisipan Teks</h3>
                
                <div style="margin-bottom: 10px;">
                    <label for="textInput" style="display: block; margin-bottom: 5px; font-weight: bold;">Teks:</label>
                    <input type="text" id="textInput" placeholder="Masukkan teks..." style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                </div>
                
                <div style="margin-bottom: 10px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: bold;">
                        <input type="checkbox" id="outlineCheckbox" style="margin-right: 5px;"> Coretan Luar
                    </label>
                </div>
                
                <div style="margin-bottom: 10px;">
                    <label for="fontSizeInput" style="display: block; margin-bottom: 5px; font-weight: bold;">Besaran Teks (px):</label>
                    <input type="number" id="fontSizeInput" min="1" max="500" value="24" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                </div>
                
                <div id="outlineSettings" style="margin-bottom: 10px; display: none;">
                    <label for="outlineWidthInput" style="display: block; margin-bottom: 5px; font-weight: bold;">Ketebalan Coretan Luar (px):</label>
                    <input type="number" id="outlineWidthInput" min="0" max="50" value="2" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                </div>
                
                <div style="margin-bottom: 10px;">
                    <label for="fontSelect" style="display: block; margin-bottom: 5px; font-weight: bold; cursor: pointer;" onclick="toggleFontDropdown()" id="fontSelect">
                        Pilih Gaya Tulisan ▼
                    </label>
                    <div id="fontDropdown" style="display: none; border: 1px solid #ccc; border-radius: 4px; max-height: 200px; overflow-y: auto; background-color: white;">
                        <div style="padding: 8px; background-color: #eee; font-size: 12px; color: #666; font-weight: bold;">- Bawaan Sistem -</div>
                        <div style="padding: 8px; cursor: pointer; border-bottom: 1px solid #f0f0f0;" onclick="selectFont('Arial')">Arial</div>
                        <div style="padding: 8px; cursor: pointer; border-bottom: 1px solid #f0f0f0;" onclick="selectFont('Helvetica')">Helvetica</div>
                        <div style="padding: 8px; background-color: #eee; font-size: 12px; color: #666; font-weight: bold;">- Bawaan Aset -</div>
                        <div style="padding: 8px; cursor: pointer; border-bottom: 1px solid #f0f0f0;" onclick="selectFont('Comfortaa')">Comfortaa</div>
                        <div style="padding: 8px; cursor: pointer;" onclick="selectFont('Comfortaa-Regular')">Comfortaa-Regular</div>
                    </div>
                </div>
                
                <div style="margin-bottom: 10px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: bold;">Warna Teks Asli:</label>
                    <input type="color" id="textColorPicker" value="#ffffff" style="width: 100%; height: 40px; border: 1px solid #ccc; border-radius: 4px; cursor: pointer;">
                </div>
                
                <div id="outlineColorContainer" style="margin-bottom: 10px; display: none;">
                    <label style="display: block; margin-bottom: 5px; font-weight: bold;">Warna Coretan:</label>
                    <input type="color" id="outlineColorPicker" value="#000000" style="width: 100%; height: 40px; border: 1px solid #ccc; border-radius: 4px; cursor: pointer;">
                </div>
                
                <button id="createTextButton" style="width: 100%; padding: 10px; background-color: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">Buat Teks</button>
            </div>
        `;

        // Insert into panel2, before menusrcContainer
        const menusrcContainer = document.getElementById('menusrcContainer');
        if (menusrcContainer) {
            menusrcContainer.insertAdjacentHTML('beforebegin', uiHTML);
        } else {
            // Fallback: insert at the beginning of panel2
            const panel2 = document.getElementById('panel2');
            if (panel2) {
                panel2.insertAdjacentHTML('afterbegin', uiHTML);
            }
        }
    }

    attachEventListeners() {
        // Outline checkbox toggle
        const outlineCheckbox = document.getElementById('outlineCheckbox');
        const outlineSettings = document.getElementById('outlineSettings');
        const outlineColorContainer = document.getElementById('outlineColorContainer');

        if (!outlineCheckbox || !outlineSettings || !outlineColorContainer) {
            console.warn('TextShapeManager: Some DOM elements not found');
            return;
        }

        outlineCheckbox.addEventListener('change', (e) => {
            if (e.target.checked) {
                outlineSettings.style.display = 'block';
                outlineColorContainer.style.display = 'block';
            } else {
                outlineSettings.style.display = 'none';
                outlineColorContainer.style.display = 'none';
            }
        });

        // Create text button
        const createButton = document.getElementById('createTextButton');
        if (createButton) {
            createButton.addEventListener('click', () => this.createTextLayer());
        }

        // Listen for layer selection to sync text input
        document.addEventListener('layerSelected', (e) => {
            const layer = e.detail?.layer;
            if (layer && this.isTextLayer(layer)) {
                this.syncTextInputFromLayer(layer);
            } else {
                this.resetToCreateMode();
            }
        });

        // Listen for layer deselection
        document.addEventListener('layerDeselected', () => {
            this.resetToCreateMode();
        });
    }

    createTextLayer() {
        if (this.isEditMode && this.editingLayer) {
            this.editTextLayer();
            return;
        }

        const textInput = document.getElementById('textInput');
        const fontSizeInput = document.getElementById('fontSizeInput');
        const outlineCheckbox = document.getElementById('outlineCheckbox');
        const outlineWidthInput = document.getElementById('outlineWidthInput');
        const textColorPicker = document.getElementById('textColorPicker');
        const outlineColorPicker = document.getElementById('outlineColorPicker');

        if (!textInput || !fontSizeInput || !outlineCheckbox || !outlineWidthInput || !textColorPicker || !outlineColorPicker) {
            console.error('TextShapeManager: Required DOM elements not found');
            return;
        }

        const text = textInput.value.trim();
        if (!text) {
            alert('Masukkan teks terlebih dahulu!');
            return;
        }

        const fontSize = parseInt(fontSizeInput.value) || 24;
        const hasOutline = outlineCheckbox.checked;
        const outlineWidth = parseInt(outlineWidthInput.value) || 2;
        const textColor = textColorPicker.value;
        const outlineColor = outlineColorPicker.value;

        // Get selected font
        const fontSelect = document.getElementById('fontSelect');
        const selectedFont = fontSelect ? fontSelect.getAttribute('data-selected-font') || 'Arial' : 'Arial';

        // Create SVG text element
        const svgText = this.createSVGText(text, fontSize, selectedFont, textColor, hasOutline, outlineWidth, outlineColor);
        
        console.log('=== createTextLayer ===');
        console.log('Text:', text);
        console.log('Font size:', fontSize);
        console.log('Font:', selectedFont);
        console.log('Has outline:', hasOutline);
        console.log('SVG created, length:', svgText.length);
        console.log('SVG preview:', svgText.substring(0, 200));

        // Create layer name - sync only if not grouped
        let layerName = text;
        // For now, assume it's not grouped, so sync with layerName
        // In future, check if it's part of a group

        // Create new Layer
        const textLayer = new Layer(layerName, [svgText], {
            posX: 100,
            posY: 100,
            rotation: 0,
            scale: 1,
            skewX: 0,
            skewY: 0,
            flipX: false,
            flipY: false,
            width: null,
            height: null,
            opacity: 1,
            color: null
        }, []);

        // Add to layers array
        if (typeof layers !== 'undefined') {
            layers.push(textLayer);
        }

        // Attach to panel1
        const container = document.getElementById('panel1') || document.querySelector('.container');
        if (container) {
            textLayer.attach(container, window.onlayerdragstart || null);
            // Add click handler if available
            if (typeof addLayerClickHandler === 'function') {
                addLayerClickHandler(textLayer);
            }
            // Render
            if (typeof renderLayer === 'function') {
                renderLayer(textLayer);
            }
        }

        // Select the new layer
        if (typeof selectLayer === 'function') {
            selectLayer(textLayer);
        }

        // Clear input
        textInput.value = '';
    }

    editTextLayer() {
        const textInput = document.getElementById('textInput');
        const fontSizeInput = document.getElementById('fontSizeInput');
        const outlineCheckbox = document.getElementById('outlineCheckbox');
        const outlineWidthInput = document.getElementById('outlineWidthInput');
        const textColorPicker = document.getElementById('textColorPicker');
        const outlineColorPicker = document.getElementById('outlineColorPicker');

        const text = textInput.value.trim();
        if (!text) {
            alert('Masukkan teks terlebih dahulu!');
            return;
        }

        const fontSize = parseInt(fontSizeInput.value) || 24;
        const hasOutline = outlineCheckbox.checked;
        const outlineWidth = parseInt(outlineWidthInput.value) || 2;
        const textColor = textColorPicker.value;
        const outlineColor = outlineColorPicker.value;

        // Get selected font
        const fontSelect = document.getElementById('fontSelect');
        const selectedFont = fontSelect ? fontSelect.getAttribute('data-selected-font') || 'Arial' : 'Arial';

        // Create new SVG
        const newSvgText = this.createSVGText(text, fontSize, selectedFont, textColor, hasOutline, outlineWidth, outlineColor);

        // Update layer - directly update the src array (this will trigger the setter)
        this.editingLayer.src = [newSvgText];
        
        // Reset width/height to null so layer will auto-detect from new SVG
        // This allows the SVG to dynamically resize based on new text/font size
        this.editingLayer.width = null;
        this.editingLayer.height = null;
        
        // Update layer name
        this.editingLayer.name = text;

        // Re-render
        if (typeof renderLayer === 'function') {
            renderLayer(this.editingLayer);
        }

        // Update layer name input
        if (typeof layerNameInput !== 'undefined') {
            layerNameInput.value = text;
        }

        // Don't clear inputs in edit mode
    }

    resetToCreateMode() {
        this.isEditMode = false;
        this.editingLayer = null;
        this.updateUIMode(false);
        
        // Clear inputs
        document.getElementById('textInput').value = '';
        document.getElementById('fontSizeInput').value = '24';
        document.getElementById('outlineCheckbox').checked = false;
        document.getElementById('outlineWidthInput').value = '2';
        document.getElementById('textColorPicker').value = '#ffffff';
        document.getElementById('outlineColorPicker').value = '#000000';
        
        // Reset font
        const fontSelect = document.getElementById('fontSelect');
        fontSelect.setAttribute('data-selected-font', 'Arial');
        fontSelect.textContent = 'Pilih Gaya Tulisan ▼';
        
        // Hide outline settings
        this.updateOutlineUI(false);
    }

    updateOutlineUI(hasOutline) {
        const outlineSettings = document.getElementById('outlineSettings');
        const outlineColorContainer = document.getElementById('outlineColorContainer');
        if (hasOutline) {
            outlineSettings.style.display = 'block';
            outlineColorContainer.style.display = 'block';
        } else {
            outlineSettings.style.display = 'none';
            outlineColorContainer.style.display = 'none';
        }
    }

    createSVGText(text, fontSize, fontFamily, textColor, hasOutline, outlineWidth, outlineColor) {
        // Estimate text width (rough calculation)
        const textWidth = text.length * fontSize * 0.6;
        const textHeight = fontSize * 1.2;
        const padding = Math.max(outlineWidth * 2, 10);

        // Create SVG with text
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', textWidth + padding * 2);
        svg.setAttribute('height', textHeight + padding * 2);
        svg.setAttribute('viewBox', `0 0 ${textWidth + padding * 2} ${textHeight + padding * 2}`);

        // Store metadata as SVG attributes for reliable serialization
        const metadata = {
            text: text,
            fontSize: fontSize,
            fontFamily: fontFamily,
            textColor: textColor,
            hasOutline: hasOutline,
            outlineWidth: outlineWidth,
            outlineColor: outlineColor
        };
        
        // Store metadata in data attributes
        svg.setAttribute('data-textshape-metadata', JSON.stringify(metadata));

        // Create defs for text styling
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        const style = document.createElementNS('http://www.w3.org/2000/svg', 'style');
        style.textContent = `
            .text-main {
                font-family: ${fontFamily}, sans-serif;
                font-size: ${fontSize}px;
                fill: ${textColor};
                ${hasOutline ? `-webkit-text-stroke: ${outlineWidth}px ${outlineColor};` : ''}
            }
        `;
        defs.appendChild(style);
        svg.appendChild(defs);

        // Create text element
        const textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        textElement.setAttribute('x', (textWidth + padding * 2) / 2);
        textElement.setAttribute('y', (textHeight + padding * 2) / 2 + fontSize * 0.35); // Adjust baseline
        textElement.setAttribute('text-anchor', 'middle');
        textElement.setAttribute('class', 'text-main');
        textElement.textContent = text;

        svg.appendChild(textElement);

        // Convert to data URL with proper encoding
        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(svg);
        
        // Use TextEncoder for proper UTF-8 encoding
        const encoder = new TextEncoder();
        const bytes = encoder.encode(svgString);
        const encoded = btoa(String.fromCharCode.apply(null, bytes));
        return 'data:image/svg+xml;base64,' + encoded;
    }

    isTextLayer(layer) {
        // Check if layer src contains SVG data URL with text element
        if (!layer || !layer.src || !Array.isArray(layer.src)) {
            return false;
        }
        
        for (const src of layer.src) {
            if (typeof src === 'string' && src.startsWith('data:image/svg+xml')) {
                try {
                    // Proper base64 decoding
                    const base64String = src.split(',')[1];
                    const decoded = atob(base64String);
                    const bytes = Uint8Array.from(decoded, c => c.charCodeAt(0));
                    const svgString = new TextDecoder().decode(bytes);
                    
                    const parser = new DOMParser();
                    const svgDoc = parser.parseFromString(svgString, 'image/svg+xml');
                    
                    // Check for parsing errors
                    if (svgDoc.documentElement.tagName === 'parsererror') {
                        console.warn('isTextLayer: SVG parsing error for layer:', layer.name);
                        continue;
                    }
                    
                    // Check for metadata attribute or text element
                    const hasMetadata = svgDoc.documentElement.getAttribute('data-textshape-metadata');
                    const textElement = svgDoc.querySelector('text');
                    
                    if (hasMetadata || textElement) {
                        console.log('isTextLayer: Found text element in layer:', layer.name);
                        return true;
                    }
                } catch (e) {
                    console.warn('isTextLayer: Error parsing SVG for layer:', layer.name, e);
                    continue;
                }
            }
        }
        console.log('isTextLayer: No text found in layer:', layer.name);
        return false;
    }

    updateOutlineUI(hasOutline) {
        const outlineSettings = document.getElementById('outlineSettings');
        const outlineColorContainer = document.getElementById('outlineColorContainer');
        if (hasOutline) {
            outlineSettings.style.display = 'block';
            outlineColorContainer.style.display = 'block';
        } else {
            outlineSettings.style.display = 'none';
            outlineColorContainer.style.display = 'none';
        }
    }

    syncTextInputFromLayer(layer) {
        console.log('=== syncTextInputFromLayer called ===');
        console.log('Layer name:', layer.name);
        console.log('Layer object:', layer);
        
        // Only sync if not grouped (no parentLayer)
        if (layer.parentLayer) {
            console.log('✗ syncTextInputFromLayer: Layer is grouped, skipping');
            return;
        }

        // Extract metadata from SVG
        const svgSrc = layer.src.find(src => src && src.startsWith('data:image/svg+xml'));
        if (!svgSrc) {
            console.warn('✗ syncTextInputFromLayer: No SVG src found. Layer.src:', layer.src);
            return;
        }

        console.log('✓ Found SVG src, length:', svgSrc.length);

        try {
            // Proper base64 decoding
            const parts = svgSrc.split(',');
            if (parts.length < 2) {
                console.error('✗ Invalid data URL format');
                return;
            }
            
            const base64String = parts[1];
            console.log('Base64 string length:', base64String.length);
            
            const decoded = atob(base64String);
            const bytes = Uint8Array.from(decoded, c => c.charCodeAt(0));
            const svgString = new TextDecoder().decode(bytes);
            
            console.log('✓ Decoded SVG string length:', svgString.length);
            console.log('SVG preview:', svgString.substring(0, 300));
            
            const parser = new DOMParser();
            const svgDoc = parser.parseFromString(svgString, 'image/svg+xml');
            
            // Check for parsing errors
            if (svgDoc.documentElement.tagName === 'parsererror') {
                console.error('✗ SVG parsing error');
                return;
            }
            
            // Get metadata from attribute
            const metadataStr = svgDoc.documentElement.getAttribute('data-textshape-metadata');
            console.log('Metadata attribute:', metadataStr ? 'FOUND' : 'NOT FOUND');
            
            let metadata = null;
            
            if (metadataStr) {
                try {
                    metadata = JSON.parse(metadataStr);
                    console.log('✓ Parsed metadata:', metadata);
                } catch (e) {
                    console.warn('✗ Failed to parse metadata JSON:', e);
                    console.warn('Metadata string was:', metadataStr);
                }
            }
            
            if (metadata) {
                console.log('✓ Switching to edit mode with metadata');
                // Fill all inputs
                const textInputEl = document.getElementById('textInput');
                const fontSizeEl = document.getElementById('fontSizeInput');
                const outlineCheckboxEl = document.getElementById('outlineCheckbox');
                const outlineWidthEl = document.getElementById('outlineWidthInput');
                const textColorEl = document.getElementById('textColorPicker');
                const outlineColorEl = document.getElementById('outlineColorPicker');
                
                console.log('Elements found:', {
                    textInputEl: !!textInputEl,
                    fontSizeEl: !!fontSizeEl,
                    outlineCheckboxEl: !!outlineCheckboxEl,
                    outlineWidthEl: !!outlineWidthEl,
                    textColorEl: !!textColorEl,
                    outlineColorEl: !!outlineColorEl
                });
                
                if (textInputEl) {
                    textInputEl.value = metadata.text;
                    console.log('Set text input to:', metadata.text);
                }
                if (fontSizeEl) {
                    fontSizeEl.value = metadata.fontSize;
                    console.log('Set font size to:', metadata.fontSize);
                }
                if (textColorEl) {
                    textColorEl.value = metadata.textColor;
                    console.log('Set text color to:', metadata.textColor);
                }
                if (outlineCheckboxEl) {
                    outlineCheckboxEl.checked = metadata.hasOutline;
                    console.log('Set outline checkbox to:', metadata.hasOutline);
                }
                if (outlineWidthEl) {
                    outlineWidthEl.value = metadata.outlineWidth;
                    console.log('Set outline width to:', metadata.outlineWidth);
                }
                if (outlineColorEl) {
                    outlineColorEl.value = metadata.outlineColor;
                    console.log('Set outline color to:', metadata.outlineColor);
                }
                
                // Set font
                const fontSelect = document.getElementById('fontSelect');
                if (fontSelect) {
                    fontSelect.setAttribute('data-selected-font', metadata.fontFamily);
                    fontSelect.textContent = `Pilih Gaya Tulisan: ${metadata.fontFamily}`;
                    console.log('Set font to:', metadata.fontFamily);
                }
                
                // Update UI visibility
                this.updateOutlineUI(metadata.hasOutline);
                console.log('Updated outline UI visibility');
                
                // Set edit mode
                this.isEditMode = true;
                this.editingLayer = layer;
                console.log('Set isEditMode=true, editingLayer set');
                
                this.updateUIMode(true);
                console.log('✓ updateUIMode(true) called');
            } else {
                console.log('⚠ No metadata found');
                // Fallback: extract text only
                const textElement = svgDoc.querySelector('text');
                if (textElement) {
                    const textInputEl = document.getElementById('textInput');
                    if (textInputEl) {
                        textInputEl.value = textElement.textContent;
                        console.log('Set text from element (fallback):', textElement.textContent);
                    }
                }
            }
        } catch (e) {
            console.error('✗ syncTextInputFromLayer: Failed to process SVG:', e);
            console.error('Stack:', e.stack);
        }
    }

    updateUIMode(isEditMode) {
        console.log('updateUIMode called with isEditMode:', isEditMode);
        
        const title = document.getElementById('textShapeTitle');
        const button = document.getElementById('createTextButton');
        const container = document.getElementById('textShapeContainer');
        
        if (!title || !button || !container) {
            console.error('updateUIMode: Required DOM elements not found');
            return;
        }
        
        if (isEditMode) {
            title.textContent = 'Pengeditan Sisipan Teks';
            title.style.color = '#FF9800'; // Orange
            button.textContent = 'Ubah Teks';
            button.style.backgroundColor = '#FF9800'; // Orange
            container.style.borderColor = '#FF9800'; // Orange border
            console.log('✓ UI switched to EDIT MODE (orange)');
        } else {
            title.textContent = 'Pembuatan Sisipan Teks';
            title.style.color = '#4CAF50'; // Green
            button.textContent = 'Buat Teks';
            button.style.backgroundColor = '#4CAF50'; // Green
            container.style.borderColor = '#4CAF50'; // Green border
            console.log('✓ UI switched to CREATE MODE (green)');
        }
    }
}

// Global functions for UI
function toggleFontDropdown() {
    const dropdown = document.getElementById('fontDropdown');
    if (!dropdown) {
        console.warn('fontDropdown element not found');
        return;
    }
    if (dropdown.style.display === 'none') {
        dropdown.style.display = 'block';
    } else {
        dropdown.style.display = 'none';
    }
}

function selectFont(fontName) {
    const fontSelect = document.getElementById('fontSelect');
    if (fontSelect) {
        fontSelect.setAttribute('data-selected-font', fontName);
        fontSelect.textContent = `Pilih Gaya Tulisan: ${fontName}`;
    }
    toggleFontDropdown();
}

// Initialize immediately if DOM is ready, otherwise wait
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.textShapeManager = new TextShapeManager();
        
        // Check if there's already a selected layer
        if (typeof selected !== 'undefined' && selected && window.textShapeManager.isTextLayer(selected)) {
            window.textShapeManager.syncTextInputFromLayer(selected);
        }
    });
} else {
    window.textShapeManager = new TextShapeManager();
    
    // Check if there's already a selected layer
    if (typeof window.selected !== 'undefined' && window.selected && window.textShapeManager.isTextLayer(window.selected)) {
        window.textShapeManager.syncTextInputFromLayer(window.selected);
    }
}