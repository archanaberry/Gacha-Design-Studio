# TextShape Debug Guide

## What Was Just Done

Enhanced logging has been added throughout textshape.js to debug the UI mode switching issue. When you test the feature, open the browser's Developer Console (F12) to see detailed logs.

## Testing Steps

### 1. Create a Text Layer
1. Open Gacha Design Studio
2. In Panel2 (TextShape section), you should see:
   - **Green title**: "Pembuatan Sisipan Teks"
   - **Green button**: "Buat Teks"
3. Enter text in the input field
4. Select font, size, color, and outline options
5. Click "Buat Teks" button

**Check Console For:**
```
=== createTextLayer ===
Text: [your text]
Font size: 24
Font: [selected font]
Has outline: true/false
SVG created, length: XXXX
SVG preview: [first 200 chars]
```

### 2. Verify SVG Contains Metadata
In the console, the SVG should show it contains the `data-textshape-metadata` attribute.

### 3. Select the Text Layer
Click on the newly created text layer in Panel1

**Check Console For:**
```
selectLayer: Checking if layer is text layer: [layer name]
selectLayer: Is text layer, syncing input
```

Then immediately after:
```
=== syncTextInputFromLayer called ===
Layer name: [text content]
✓ Found SVG src, length: XXXX
✓ Decoded SVG string length: XXXX
Metadata attribute: FOUND
✓ Parsed metadata: {text: "...", fontSize: 24, ...}
✓ Switching to edit mode with metadata
Elements found: {all should be true}
Set text input to: [text]
Set font size to: 24
...
✓ updateUIMode(true) called
updateUIMode called with isEditMode: true
✓ UI switched to EDIT MODE (orange)
```

### 4. Verify UI Changed
The Panel2 should now show:
- **Orange title**: "Pengeditan Sisipan Teks"
- **Orange button**: "Ubah Teks"
- **Orange border** around the container
- All input fields should be populated with the text layer's properties

## If Something Fails

### Problem: UI Doesn't Change to Orange
1. Check if `isTextLayer()` returned true
2. If not, check if `data-textshape-metadata` attribute is in the SVG
3. If yes, check if the SVG is being properly decoded

### Problem: Metadata Not Found
Check the SVG preview in the console. The `data-textshape-metadata` attribute should be visible in the SVG XML string.

### Problem: Metadata Parsing Error
If you see "Failed to parse metadata JSON", the JSON string might be corrupted during encoding/decoding. Check:
- Is the JSON valid?
- Are there any special characters being escaped incorrectly?

## Code Flow Map

```
selectLayer() [studiopose.js]
    ↓
isTextLayer() [textshape.js]
    ↓ (if true)
syncTextInputFromLayer() [textshape.js]
    ├─ Decode base64 SVG URL
    ├─ Parse SVG as XML
    ├─ Get data-textshape-metadata attribute
    ├─ Parse JSON metadata
    ├─ Populate all input fields
    ├─ Set isEditMode = true
    └─ updateUIMode(true) [textshape.js]
        ├─ Change title to orange
        ├─ Change button text
        └─ Change border color
```

## Key Files Modified

- `/workspaces/Gacha-Design-Studio/js/studiocharacter/textshape.js` - Enhanced with detailed logging
- `/workspaces/Gacha-Design-Studio/js/studiocharacter/studiopose.js` - Already has selectLayer integration

## Metadata Storage Format

Text layers store metadata as a JSON attribute in the SVG root element:

```xml
<svg ... data-textshape-metadata='{"text":"Hello","fontSize":24,"fontFamily":"Arial","textColor":"#FFFFFF","hasOutline":true,"outlineWidth":2,"outlineColor":"#000000"}' ...>
```

This metadata is:
1. **Stored** in `createSVGText()` using `svg.setAttribute('data-textshape-metadata', JSON.stringify(metadata))`
2. **Encoded** to base64 with proper UTF-8 handling
3. **Decoded** in `syncTextInputFromLayer()` using TextDecoder
4. **Extracted** from the parsed SVG DOM using `getAttribute('data-textshape-metadata')`
5. **Parsed** back to a JavaScript object with `JSON.parse()`
