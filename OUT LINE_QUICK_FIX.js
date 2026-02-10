// INSTANT OUTLINE BUG FIXER - Copy & paste ini di console (F12) saat sudah Ctrl+Click!

console.clear();
console.log('%c=== OUTLINE BUG QUICK FIX ===', 'background: #ff6b6b; color: white; font-size: 16px; padding: 10px;');

// 1. Find the issue
const layer = layers[0];  // Change index if needed
const el = layer.element;

console.log('%cCHECK STATUS:', 'font-weight: bold; font-size: 14px;');
console.table({
    'Layer': layer.name,
    'Element Tag': el.tagName,
    'Has "layer" class': el.classList.contains('layer') ? '✅' : '❌',
    'Has "selected" class': el.classList.contains('selected') ? '✅' : '❌',
    'Full className': el.className,
    'In DOM': el.parentElement ? '✅' : '❌',
    'Parent: ': el.parentElement?.tagName || 'NONE',
    'CSS outline': window.getComputedStyle(el).outline
});

// 2. FIX - Force ensure both classes and style
console.log('%cAPPLYING FIX...', 'font-weight: bold; color: orange;');

// Ensure classes
if (!el.classList.contains('layer')) {
    console.warn('❌ Missing "layer" class - ADDING...');
    el.classList.add('layer');
}

if (!el.classList.contains('selected')) {
    console.warn('❌ Missing "selected" class - ADDING...');
    el.classList.add('selected');
}

// Force inline style backup
el.style.outline = '3px solid #2196F3';

// Trigger reflow to force render update
el.offsetHeight; // Trigger reflow
el.style.outline = el.style.outline; // Reapply

console.log('%c✅ FIX APPLIED!', 'background: #4CAF50; color: white; padding: 5px; font-weight: bold;');
console.log('Should see BLUE outline around layer NOW!');

// 3. Verify fix worked
setTimeout(() => {
    const hasOutline = window.getComputedStyle(el).outline !== 'none';
    const hasClasses = el.classList.contains('layer') && el.classList.contains('selected');
    
    console.log('%cVERIFICATION (after 500ms):', 'font-weight: bold;');
    console.table({
        'Both classes present': hasClasses ? '✅' : '❌',
        'Inline outline applied': el.style.outline !== '' ? '✅' : '❌',
        'CSS outline computed': hasOutline ? '✅' : '❌'
    });
    
    if (!hasOutline) {
        console.warn('⚠️ Even with force style, outline not visible!');
        console.log('Possible causes:');
        console.log('  1. Element is hidden by z-index');
        console.log('  2. Parent overflow hidden');
        console.log('  3. Element size is 0');
        console.log('Checking size...');
        const rect = el.getBoundingClientRect();
        console.log('Element size:', { width: rect.width, height: rect.height });
    }
}, 500);

// 4. Test with RED color to confirm element is visible
setTimeout(() => {
    console.log('%cTEST: Changing outline to RED...', 'color: red; font-weight: bold;');
    el.style.outline = '5px solid RED';
}, 1500);

console.log('\n%cℹ️ If RED outline shows but BLUE doesn\'t:', 'color: blue;');
console.log('→ .selected class was applied but CSS outline rule not matching');
console.log('→ Check if element has "layer" class: ', el.classList.contains('layer'));
console.log('→ CSS rule requirement: .layer.selected { outline: ... }');
