/**
 * studiocharacter/splitter.js
 * 
 * Handles splitter dragging functionality for resizing panels.
 * NOW USES PANEL EDGES AS SPLITTERS (No separate DIVs)
 * - Vertical Split: Panel 2 Top Edge
 * - Horizontal Split: Panel 3 Right Edge
 */

// Pilih elemen container 
const panelGroup = document.getElementById('panelGroup');
const container = panelGroup || document.querySelector('.container');

if (container) {
    container.style.width = '100%';
    container.style.backgroundColor = 'white';
    container.style.overflow = 'auto';
}

// Get references 
const panel1El = window.panel1Instance || document.getElementById('panel1');
const panel2El = window.panel2Instance || document.getElementById('panel2');
const panel3El = document.getElementById('panel3'); 

// Store in window 
if (!window.panel1Instance) {
    window.panel1Instance = panel1El;
    window.panel2Instance = panel2El;
}

const EDGE_THRESHOLD = 20; // Hit area in px

// ==========================================
//  VERTICAL SPLITTING (Panel 2 Top Edge)
// ==========================================
if (panel2El) {
    let isDraggingV = false;
    let splitterTouchIdV = null;

    function resizePanelV(pointerY) {
        const windowHeight = window.innerHeight;
        let newHeightPx = windowHeight - pointerY;
        let newHeightPct = (newHeightPx / windowHeight) * 100;
        newHeightPct = Math.min(Math.max(newHeightPct, 5), 95);
        panel2El.style.height = newHeightPct + '%';
    }

    // Hover Effect
    panel2El.addEventListener('mousemove', function(e) {
        if (isDraggingV) return;
        const rect = panel2El.getBoundingClientRect();
        const dist = e.clientY - rect.top;
        if (dist >= -10 && dist <= EDGE_THRESHOLD) { 
            panel2El.style.cursor = 'ns-resize';
        } else {
            panel2El.style.cursor = 'default';
        }
    });

    // Mouse Events
    function onMouseDownV(e) {
        const rect = panel2El.getBoundingClientRect();
        const dist = e.clientY - rect.top;
        if (dist < -10 || dist > EDGE_THRESHOLD) return;
        
        isDraggingV = true;
        document.addEventListener('mousemove', onMouseMoveV);
        document.addEventListener('mouseup', onMouseUpV);
        
        const overlay = document.getElementById('dragOverlay');
        if (overlay) overlay.style.display = 'block';
        
        document.body.style.userSelect = 'none';
        document.body.style.cursor = 'ns-resize';
        e.preventDefault();
    }

    function onMouseMoveV(e) {
        if (!isDraggingV) return;
        resizePanelV(e.clientY);
    }

    function onMouseUpV(e) {
        if (!isDraggingV) return;
        isDraggingV = false;
        document.removeEventListener('mousemove', onMouseMoveV);
        document.removeEventListener('mouseup', onMouseUpV);
        
        const overlay = document.getElementById('dragOverlay');
        if (overlay) overlay.style.display = 'none';
        
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
        panel2El.style.cursor = 'default';
    }

    panel2El.addEventListener('mousedown', onMouseDownV);

    // Touch Events
    function onTouchStartV(e) {
        let startId = null;
        if (e.changedTouches && e.changedTouches.length > 0) startId = e.changedTouches[0].identifier;
        if (startId !== null && window.touchDragActive && window.touchDragId !== null && window.touchDragId !== startId) return;

        const touch = e.touches[0];
        const rect = panel2El.getBoundingClientRect();
        const dist = touch.clientY - rect.top;
        
        if (dist < -20 || dist > EDGE_THRESHOLD + 10) return; 

        isDraggingV = true;
        if (e.changedTouches && e.changedTouches.length > 0) splitterTouchIdV = e.changedTouches[0].identifier;
        
        document.addEventListener('touchmove', onTouchMoveV, { passive: false });
        document.addEventListener('touchend', onTouchEndV);
        document.addEventListener('touchcancel', onTouchEndV);
        
        const overlay = document.getElementById('dragOverlay');
        if (overlay) overlay.style.display = 'block';
        document.body.style.userSelect = 'none';
        e.preventDefault(); 
    }

    function onTouchMoveV(e) {
        if (!isDraggingV) return;
        let touch = null;
        if (splitterTouchIdV !== null && e.touches) {
            for (let i = 0; i < e.touches.length; i++) {
                if (e.touches[i].identifier === splitterTouchIdV) { touch = e.touches[i]; break; }
            }
        }
        if (!touch && e.touches && e.touches.length > 0) touch = e.touches[0];
        if (touch) {
            resizePanelV(touch.clientY);
            e.preventDefault();
        }
    }

    function onTouchEndV(e) {
        if (e && e.changedTouches && e.changedTouches.length > 0 && splitterTouchIdV !== null) {
            let matched = false;
            for (let i = 0; i < e.changedTouches.length; i++) {
                if (e.changedTouches[i].identifier === splitterTouchIdV) { matched = true; break; }
            }
            if (!matched) return;
        }
        isDraggingV = false;
        splitterTouchIdV = null;
        document.removeEventListener('touchmove', onTouchMoveV);
        document.removeEventListener('touchend', onTouchEndV);
        document.removeEventListener('touchcancel', onTouchEndV);
        
        const overlay = document.getElementById('dragOverlay');
        if (overlay) overlay.style.display = 'none';
        document.body.style.userSelect = '';
    }

    panel2El.addEventListener('touchstart', onTouchStartV, { passive: false });

    if (!panel2El.style.height || panel2El.style.height === 'auto') {
        resizePanelV(window.innerHeight * 0.7); 
    }
}

// ==========================================
//  HORIZONTAL SPLITTING (Panel 3 Right Edge)
// ==========================================
if (panel3El) {
    let isDraggingH = false;
    let splitterTouchIdH = null;
    const mainContainer = document.getElementById('mainContainer');

    function resizePanelH(pointerX) {
        if (!mainContainer) return;
        const containerRect = mainContainer.getBoundingClientRect();
        let newWidth = pointerX - containerRect.left;
        const minWidth = 0;
        const maxWidth = containerRect.width * 0.9;
        const width = Math.max(minWidth, Math.min(newWidth, maxWidth));
        
        if (width < 20) {
             panel3El.style.width = '0px';
             panel3El.style.display = 'none';
             // Hide Corner logic handled by sync loop in main script
        } else {
             panel3El.style.width = width + 'px';
             panel3El.style.display = 'block';
        }
    }

    // Hover Effect (Right Edge)
    panel3El.addEventListener('mousemove', function(e) {
        if (isDraggingH) return;
        const rect = panel3El.getBoundingClientRect();
        // Distance from right edge. pointer is usually inside, so rect.right - clientX > 0
        const dist = rect.right - e.clientX; 
        
        if (dist >= -10 && dist <= EDGE_THRESHOLD) { 
            panel3El.style.cursor = 'ew-resize';
        } else {
            panel3El.style.cursor = 'default';
        }
    });

    // Mouse Events
    function onMouseDownH(e) {
        const rect = panel3El.getBoundingClientRect();
        const dist = rect.right - e.clientX;
        if (dist < -10 || dist > EDGE_THRESHOLD) return;

        isDraggingH = true;
        document.addEventListener('mousemove', onMouseMoveH);
        document.addEventListener('mouseup', onMouseUpH);
        
        const overlay = document.getElementById('dragOverlay');
        if (overlay) overlay.style.display = 'block';
        
        document.body.style.userSelect = 'none';
        document.body.style.cursor = 'ew-resize';
        e.preventDefault();
    }

    function onMouseMoveH(e) {
        if (!isDraggingH) return;
        resizePanelH(e.clientX);
    }

    function onMouseUpH(e) {
        if (!isDraggingH) return;
        isDraggingH = false;
        document.removeEventListener('mousemove', onMouseMoveH);
        document.removeEventListener('mouseup', onMouseUpH);
        
        const overlay = document.getElementById('dragOverlay');
        if (overlay) overlay.style.display = 'none';
        
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
        panel3El.style.cursor = 'default';
    }

    panel3El.addEventListener('mousedown', onMouseDownH);

    // Touch Events
    function onTouchStartH(e) {
        let startId = null;
        if (e.changedTouches && e.changedTouches.length > 0) startId = e.changedTouches[0].identifier;
        if (startId !== null && window.touchDragActive && window.touchDragId !== null && window.touchDragId !== startId) return;

        const touch = e.touches[0];
        const rect = panel3El.getBoundingClientRect();
        const dist = rect.right - touch.clientX;
        
        if (dist < -20 || dist > EDGE_THRESHOLD + 10) return;

        isDraggingH = true;
        if (e.changedTouches && e.changedTouches.length > 0) splitterTouchIdH = e.changedTouches[0].identifier;
        
        document.addEventListener('touchmove', onTouchMoveH, { passive: false });
        document.addEventListener('touchend', onTouchEndH);
        document.addEventListener('touchcancel', onTouchEndH);
        
        const overlay = document.getElementById('dragOverlay');
        if (overlay) overlay.style.display = 'block';
        document.body.style.userSelect = 'none';
        e.preventDefault();
    }

    function onTouchMoveH(e) {
        if (!isDraggingH) return;
        let touch = null;
        if (splitterTouchIdH !== null && e.touches) {
            for (let i = 0; i < e.touches.length; i++) {
                if (e.touches[i].identifier === splitterTouchIdH) { touch = e.touches[i]; break; }
            }
        }
        if (!touch && e.touches && e.touches.length > 0) touch = e.touches[0];
        if (touch) {
            resizePanelH(touch.clientX);
            e.preventDefault();
        }
    }

    function onTouchEndH(e) {
         if (e && e.changedTouches && e.changedTouches.length > 0 && splitterTouchIdH !== null) {
            let matched = false;
            for (let i = 0; i < e.changedTouches.length; i++) {
                if (e.changedTouches[i].identifier === splitterTouchIdH) { matched = true; break; }
            }
            if (!matched) return;
        }
        isDraggingH = false;
        splitterTouchIdH = null;
        document.removeEventListener('touchmove', onTouchMoveH);
        document.removeEventListener('touchend', onTouchEndH);
        document.removeEventListener('touchcancel', onTouchEndH);
        
        const overlay = document.getElementById('dragOverlay');
        if (overlay) overlay.style.display = 'none';
        document.body.style.userSelect = '';
    }

    panel3El.addEventListener('touchstart', onTouchStartH, { passive: false });
}
