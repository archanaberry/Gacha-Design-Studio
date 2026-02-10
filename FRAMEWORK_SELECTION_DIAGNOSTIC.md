# 🔍 FRAMEWORK SELECTION DIAGNOSTIC - TROUBLESHOOTING GUIDE

## ❌ MASALAH
- Ctrl+Click tidak berfungsi  
- Single click pada layer frame tidak ada response  
- Tidak muncul outline BIRU pada selected layer di canvas  
- Layar tidak bisa select/multi-select  

## 🧪 STEP-BY-STEP DIAGNOSTIC

### **Step 1: Check Browser Console (F12)**

```javascript
// Buka Console tab, jalankan command ini:

// 1. Check apakah frameworkDisplay ada
console.log('✅ frameworkDisplay exists:', !!window.frameworkDisplay);

// 2. Check apakah layers ada
console.log('✅ layers array:', typeof layers !== 'undefined' ? '✅ YES' : '❌ NO');
console.log('   Layers count:', layers?.length || 0);

// 3. Check apakah selector instance ada
console.log('✅ selectorInstance:', !!window.selectorInstance);
console.log('   selectedLayers array:', window.selectorInstance?.selectedLayers?.length || 0);

// 4. Check apakah layer elements ter-attach ke DOM
if (layers && layers.length > 0) {
    const layer1 = layers[0];
    console.log(`✅ Layer 1 ("${layer1.name}"):`, {
        hasElement: !!layer1.element,
        elementInDOM: layer1.element?.parentElement ? '✅ YES' : '❌ NO',
        classList: layer1.element?.className || 'NONE',
        tagName: layer1.element?.tagName || 'NONE'
    });
}

// 5. Check CSS untuk selected outline
console.log('✅ CSS untuk .selected class:');
const selectedStyle = window.getComputedStyle(document.querySelector('.layer.selected') || layers[0]?.element, ':before');
console.log('   Color:', getComputedStyle(document.querySelector('.layer') || document.body).color);
```

### **Step 2: Test Layer Selection Manual**

```javascript
// Di console, jalankan:

// 1. Select layer 1 manually
if (layers && layers[0]) {
    const layer = layers[0];
    layer.element.classList.add('selected');
    console.log('✅ Manual .selected class added to', layer.name);
    
    // Verify
    console.log('Has class now:', layer.element.classList.contains('selected'));
}

// 2. Check apakah outline muncul
console.log('Check canvas - layer should have BIRU OUTLINE sekarang');
```

### **Step 3: Test Framework Panel Click**

```javascript
// Di console, buka panel3 (Framework):

// 1. Find framework card
const card = document.querySelector('.framework-card');
console.log('✅ Framework card exists:', !!card);

// 2. Simulate click pada framework card
if (card) {
    const clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window,
        ctrlKey: true  // Simulate Ctrl+Click
    });
    card.dispatchEvent(clickEvent);
    console.log('✅ Simulated Ctrl+Click on framework card');
}

// 3. Check console logs
console.log('Check console untuk: "FrameworkPanel Click:" message');
```

### **Step 4: Check Event Handlers**

```javascript
// Verify apakah event listeners ter-attach

// 1. Check layer element listeners
if (layers && layers[0]) {
    const layer = layers[0];
    console.log('Layer element:', layer.element);
    console.log('  - Has pointerdown handler:', !!layer.element.__pointerDownHandler);
    console.log('  - Has parent:', !!layer.element.parentElement);
}

// 2. Check selector
console.log('Selector instance:', window.selectorInstance);
console.log('  - Container set:', !!window.selectorInstance?.container);
console.log('  - selectorActive:', window.selectorInstance?.selectorActive || false);

// 3. Check if functions exist
console.log('✅ Functions:');
console.log('  - addLayerClickHandler:', typeof addLayerClickHandler);
console.log('  - updateCoordInput:', typeof updateCoordInput);
console.log('  - selectLayer:', typeof selectLayer);
```

## 🔧 DIAGNOSTIC CHECKLIST

| Check | Status | Expected |
|-------|--------|----------|
| `frameworkDisplay` exists | ✅/❌ | ✅ |
| `layers` array populated | ✅/❌ | ✅ |
| `layer.element` in DOM | ✅/❌ | ✅ |
| `selectorInstance` exists | ✅/❌ | ✅ |
| `selector.selectedLayers` array | ✅/❌ | ✅ |
| Click handler registered | ✅/❌ | ✅ |
| `.selected` class adds outline | ✅/❌ | ✅ |
| Ctrl+Click triggers handler | ✅/❌ | ✅ |
| Panel3 framework panel visible | ✅/❌ | ✅ |

## 📊 EXPECTED CONSOLE OUTPUT

### Saat page load:
```
✅ Framework.initialize: Rendering 15 layers
✅ Layer "Rambut" attached to unified pointer system
✅ Layer "Kepala" attached to unified pointer system
...
```

### Saat Ctrl+Click layer frame:
```
🖱️ FrameworkPanel Click: {layer: "Kepala", isCtrl: true, ...}
✋ FrameworkPanel: INTERCEPTED Ctrl+Click/Selector Mode on "Kepala"
✅ Added "Kepala" to framework selection
✅ Toggle complete on "Kepala", total selected: 1
📊 Framework sync complete: 1 layers selected
```

### Saat normal click:
```
🖱️ FrameworkPanel Click: {layer: "Kepala", isCtrl: false, ...}
👆 FrameworkPanel: Single-select on "Kepala"
✅ selectLayer called for "Kepala"
```

## 🐛 COMMON ISSUES & FIXES

### ❌ **Framework panel tidak muncul**
- Fix: Klik tombol "📂 Buka Kerangka" untuk toggle panel3
- Check: `document.getElementById('panel3').style.display`

### ❌ **Click tidak ter-trigger handler**
- Possible causes:
  - Layer element tidak ter-attach ke DOM
  - Event listener tidak ter-registered
  - Selector active tapi pointer-events disabled
- Debug: Check console untuk "FrameworkPanel Click:" log

### ❌ **Outline tidak muncul**
- Check CSS di studiopose.html:
  ```css
  .layer.selected {
      outline: 2px solid #2196f3 !important;
  }
  ```
- Verify class ter-add: `layer.element.classList.contains('selected')`

### ❌ **selector.selectedLayers không update**
- Common: `window.selectorInstance` undefined saat click
- Fix: Wait untuk DOMContentLoaded sebelum interact
- Check: `console.log('Selector:', window.selectorInstance?.selectedLayers)`

## 🚀 NEXT STEPS

1. **Run diagnostic** - jalankan Step 1-4 di console
2. **Share output** - postkan console logs
3. **Check checklist** - yang mana yang ❌?
4. **Fix based on findings**:
   - Layer element tidak valid → cek layer.js attach()
   - Selector tidak ada → cek selector.js initialization
   - Event handler tidak trigger → cek framework.js click event
   - Outline tidak muncul → cek CSS di studiopose.html

---

## 🔗 RELATED FILES

- **studiopose.html** - CSS untuk .selected outline
- **framework.js** - Framework panel handler
- **studiopose.js** - Layer attachment & click handler
- **selector.js** - Multi-select selector
- **layer.js** - Layer element creation

