// windowhandler.js
// WindowHandler - Sistem Manajemen Window Overlay (single-file, CSS inline + JS)
// Versi: 1.0.1 (perbaikan z-index, overlay behavior, pointer stability, focus & cleanup)

(function globalWindowHandler() {
  /* ---------------------------
     Inject inline CSS (window-only)
     --------------------------- */
  const css = `
  @font-face {
    font-family: "Comfortaa";
    src: url("../../assets/font/Comfortaa-Regular.ttf") format("truetype");
  }
  @font-face {
    font-family: "Comfortaa-Bold";
    src: url("../../assets/font/Comfortaa-Bold.ttf") format("truetype");
  }

  .wh-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.4);
    display: none;
    pointer-events: none;
  }

  .wh-window {
    position: absolute;
    top: 25%;
    left: 25%;
    width: 50%;
    min-width: 320px;
    min-height: 260px;
    background: #fff;
    border-radius: 14px;
    box-shadow: 0 0 15px rgba(0,0,0,0.6);
    display: none;
    flex-direction: column;
    overflow: hidden;
    font-family: "Comfortaa", sans-serif;
    touch-action: none; /* better for pointer handling */
  }

  .wh-header {
    height: 64px;
    background: #5E6CC9;
    display: flex;
    align-items: center;
    padding: 0 16px;
    cursor: grab;
    user-select: none;
  }

  .wh-header:active { cursor: grabbing; }

  .wh-title-wrap {
    position: relative;
    font-family: "Comfortaa-Bold";
    font-size: 22px;
    top: 3px;
  }

  .wh-title-outline {
    position: absolute;
    inset: 0;
    color: transparent;
    -webkit-text-stroke: 6px black;
    pointer-events: none;
  }

  .wh-title-main {
    position: relative;
    color: white;
  }

  .wh-close-btn {
    margin-left: auto;
    font-size: 28px;
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
  }

  .wh-content {
    padding: 1px;
    flex: 1;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }

  .wh-footer {
    height: 48px;
    padding: 0 16px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  .wh-footer .footer-btn {
    padding: 6px 14px;
    border-radius: 8px;
    border: none;
    background: #5E6CC9;
    color: white;
    cursor: pointer;
  }

  .wh-resizer {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 18px;
  height: 18px;
  cursor: se-resize;
  touch-action: none;
}

  .wh-hidden { display:none !important; }
  `;
  const styleTag = document.createElement('style');
  styleTag.type = 'text/css';
  styleTag.appendChild(document.createTextNode(css));
  document.head.appendChild(styleTag);

  /* ---------------------------
     WindowHandler class
     --------------------------- */
  class WindowHandler {
    constructor() {
      this.windows = new Map(); // windowId -> { element, overlay, config, handlers }
      this.zIndexCounter = 1000;
      this.tokenCache = new Set();
      this.defaultConfig = {
        title: 'Gacha Design Studio -',
        content: 'Default content',
        footer: '<button class="footer-btn wh-ok-btn">OK</button>',
        lockUnderlay: false,      // overlay intercepts clicks (blocks background)
        overlayOpacity: 0.4,
        closeOnOverlay: false,   // IMPORTANT: default false — overlay click won't close unless enabled
        stayFocus: false,
        width: '50%',
        height: 'auto',
        minWidth: '320px',
        minHeight: '260px',
        position: { top: '25%', left: '25%' }
      };

      // close outside feature (global)
      this._closeOutsideEnabled = false;
      this._outsideHandler = this._handleOutsideClick.bind(this);
    }

    // token generator
    generateToken(base = 'x', len = 4) {
      const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let token;
      let attempts = 0;
      do {
        let t = base + '-';
        for (let i = 0; i < len + attempts; i++) {
          t += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        token = t;
        attempts++;
        if (attempts > 8) len++;
      } while (this.tokenCache.has(token));
      this.tokenCache.add(token);
      return token;
    }

    // create overlay element using provided config.zIndex (no extra _nextZ call)
    _createOverlay(windowId, config) {
      const ov = document.createElement('div');
      ov.className = 'wh-overlay';
      ov.dataset.whFor = windowId;
      ov.style.background = `rgba(0,0,0,${config.overlayOpacity})`;
      // overlay z should be exactly one below the window's z
      ov.style.zIndex = (config.zIndex - 1).toString();
      ov.style.display = 'none';
      // apply lockUnderlay config: if locked, overlay catches clicks; if not, clicks pass through
      ov.style.pointerEvents = config.lockUnderlay ? 'auto' : 'none';

      ov.addEventListener('pointerdown', (e) => {
        // only if clicked directly on overlay (not bubbled from children)
        if (e.target !== ov) return;
        // only close if global close-outside enabled OR this window explicitly allows overlay-close
        if (this._closeOutsideEnabled || config.closeOnOverlay) {
          // close that specific window
          this.closeWindow(windowId);
        } else {
          // if not closable, just stop propagation so underlying page doesn't get click
          e.stopPropagation();
        }
      });

      return ov;
    }

    // create window element
    _createWindowElement(windowId, config) {
      const win = document.createElement('div');
      win.className = 'wh-window';
      win.id = windowId;
      win.style.top = config.position.top;
      win.style.left = config.position.left;
      win.style.width = config.width;
      win.style.minWidth = config.minWidth;
      win.style.minHeight = config.minHeight;
      win.style.zIndex = config.zIndex;
      win.style.display = 'none';

      win.innerHTML = `
        <div class="wh-header">
          <div class="wh-title-wrap">
            <div class="wh-title-outline">${config.title}</div>
            <div class="wh-title-main">${config.title}</div>
          </div>
          <button class="wh-close-btn" aria-label="Close">×</button>
        </div>
        <div class="wh-content">${config.content}</div>
        <div class="wh-footer">${config.footer}</div>
        <div class="wh-resizer" aria-hidden="true"></div>
      `;

      return win;
    }

    // increment zIndex once and return value
    _nextZ() {
      this.zIndexCounter += 2;
      return this.zIndexCounter;
    }

    openWindow(config = {}) {
      const token = this.generateToken('win', 4);
      const windowId = `window-${token}`;
      const overlayId = `overlay-${token}`;

      // merge - do NOT call _nextZ inside _createOverlay
      const merged = Object.assign({}, this.defaultConfig, config);
      merged.windowId = windowId;
      merged.overlayId = overlayId;
      merged.zIndex = this._nextZ(); // allocate z index once for this window

      // ensure numeric units for minWidth/minHeight are preserved as px if provided as numbers
      if (typeof merged.minWidth === 'number') merged.minWidth = `${merged.minWidth}px`;
      if (typeof merged.minHeight === 'number') merged.minHeight = `${merged.minHeight}px`;

      const overlay = this._createOverlay(windowId, merged);
      const winEl = this._createWindowElement(windowId, merged);

      // append overlay first then window (z-index controls final stacking)
      document.body.appendChild(overlay);
      document.body.appendChild(winEl);

      // save references
      this.windows.set(windowId, {
        element: winEl,
        overlay: overlay,
        config: merged,
        handlers: {} // place to store attached handlers for cleanup
      });

      // display using next animation frame
      requestAnimationFrame(() => {
        overlay.style.display = 'block';
        winEl.style.display = 'flex';
      });

      // attach handlers
      this._attachHandlers(windowId);

      return windowId;
    }

    openWindowAlert(content = 'Alert!', title = 'Alert') {
      return this.openWindow({
        title: title,
        content: content,
        footer: '<button class="footer-btn wh-ok-btn">OK</button>',
        width: '420px',
        height: 'auto'
      });
    }

    openWindowMore(n = 4) {
      const ids = [];
      for (let i = 0; i < n; i++) {
        ids.push(this.openWindow({
          title: `Gacha Window ${this.windows.size + 1}`,
          content: `<div><strong>Window #${this.windows.size + 1}</strong><p>Test content ${i+1}</p></div>`,
          position: { top: `${20 + i * 3}%`, left: `${20 + i * 3}%` },
          width: '380px'
        }));
      }
      return ids;
    }

    /* ---------------------------
       Event wiring: per-window handlers stored so they can be removed cleanly
       --------------------------- */
    _attachHandlers(windowId) {
      const winObj = this.windows.get(windowId);
      if (!winObj) return;
      const { element: winEl, overlay, config } = winObj;

      const header = winEl.querySelector('.wh-header');
      const closeBtn = winEl.querySelector('.wh-close-btn');
      const resizer = winEl.querySelector('.wh-resizer');
      const footer = winEl.querySelector('.wh-footer');
      const content = winEl.querySelector('.wh-content');

      // store
      winObj.handlers.header = header;
      winObj.handlers.closeBtn = closeBtn;
      winObj.handlers.resizer = resizer;
      winObj.handlers.overlay = overlay;

      // clicking anywhere in the window brings it to top (focus)
      const onWindowPointerDown = (e) => {
        // bring to top always, unless clicking overlay
        this._bringToTop(windowId);
      };
      winEl.addEventListener('pointerdown', onWindowPointerDown);
      winObj.handlers._onWindowPointerDown = onWindowPointerDown;

      // close button
      const onCloseClick = (e) => {
        e.stopPropagation();
        this.closeWindow(windowId);
      };
      if (closeBtn) closeBtn.addEventListener('click', onCloseClick);
      winObj.handlers._onCloseClick = onCloseClick;

      // footer default OK binding (if present)
      const okBtn = footer.querySelector('.wh-ok-btn');
      if (okBtn) {
        const onOk = (e) => { e.stopPropagation(); this.closeWindow(windowId); };
        okBtn.addEventListener('click', onOk);
        winObj.handlers._onOk = onOk;
      } else {
        const fb = footer.querySelectorAll('.footer-btn');
        fb.forEach(btn => {
          const onFb = (e) => { e.stopPropagation(); this.closeWindow(windowId); };
          btn.addEventListener('click', onFb);
          // store per-button so we can remove on close
          if (!winObj.handlers._footerBtns) winObj.handlers._footerBtns = [];
          winObj.handlers._footerBtns.push({ el: btn, fn: onFb });
        });
      }

      /* ---- DRAG HANDLERS (pointer capturing per-window) ---- */
      let dragState = null;
      const onHeaderPointerDown = (e) => {
        // don't start drag when clicking an inner control/button
        if (e.target.closest('button') || e.button === 2) return;
        dragState = {
          startX: e.clientX,
          startY: e.clientY,
          startLeft: winEl.getBoundingClientRect().left,
          startTop: winEl.getBoundingClientRect().top,
          pointerId: e.pointerId
        };
        // capture pointer to header if supported
        try { header.setPointerCapture && header.setPointerCapture(e.pointerId); } catch (err) {}
        this._bringToTop(windowId);
        e.preventDefault();
      };
      const onHeaderPointerMove = (e) => {
        if (!dragState) return;
        // guard: only respond to the same pointer
        // (some browsers may not give pointerId for move events; we still proceed)
        const dx = e.clientX - dragState.startX;
        const dy = e.clientY - dragState.startY;
        winEl.style.left = `${Math.round(dragState.startLeft + dx)}px`;
        winEl.style.top  = `${Math.round(dragState.startTop + dy)}px`;
      };
      const onHeaderPointerUp = (e) => {
        if (!dragState) return;
        try { header.releasePointerCapture && header.releasePointerCapture(dragState.pointerId); } catch (err) {}
        dragState = null;
      };

      header.addEventListener('pointerdown', onHeaderPointerDown);
      document.addEventListener('pointermove', onHeaderPointerMove);
      document.addEventListener('pointerup', onHeaderPointerUp);
      winObj.handlers._onHeaderPointerDown = onHeaderPointerDown;
      winObj.handlers._onHeaderPointerMove = onHeaderPointerMove;
      winObj.handlers._onHeaderPointerUp = onHeaderPointerUp;

      /* ---- RESIZE HANDLERS (pointer) ---- */
      let resizeState = null;
      const onResizerPointerDown = (e) => {
        // ignore right-click
        if (e.button === 2) return;
        resizeState = {
          startX: e.clientX,
          startY: e.clientY,
          startW: parseInt(getComputedStyle(winEl).width, 10),
          startH: parseInt(getComputedStyle(winEl).height, 10),
          pointerId: e.pointerId
        };
        try { resizer.setPointerCapture && resizer.setPointerCapture(e.pointerId); } catch (err) {}
        this._bringToTop(windowId);
        e.preventDefault();
      };
      const onResizerPointerMove = (e) => {
        if (!resizeState) return;
        const dx = e.clientX - resizeState.startX;
        const dy = e.clientY - resizeState.startY;
        const newW = Math.max(parseInt(config.minWidth, 10) || 160, Math.round(resizeState.startW + dx));
        const newH = Math.max(parseInt(config.minHeight, 10) || 120, Math.round(resizeState.startH + dy));
        winEl.style.width = `${newW}px`;
        winEl.style.height = `${newH}px`;
      };
      const onResizerPointerUp = (e) => {
        if (!resizeState) return;
        try { resizer.releasePointerCapture && resizer.releasePointerCapture(resizeState.pointerId); } catch (err) {}
        resizeState = null;
      };

      resizer.addEventListener('pointerdown', onResizerPointerDown);
      document.addEventListener('pointermove', onResizerPointerMove);
      document.addEventListener('pointerup', onResizerPointerUp);
      winObj.handlers._onResizerPointerDown = onResizerPointerDown;
      winObj.handlers._onResizerPointerMove = onResizerPointerMove;
      winObj.handlers._onResizerPointerUp = onResizerPointerUp;

      // store overlay click / pointerdown binding has been set in _createOverlay
      // done
    }

    // bring window/overlay to top
    _bringToTop(windowId) {
      const winObj = this.windows.get(windowId);
      if (!winObj) return;
      const z = this._nextZ();
      // set overlay to z-1 and window to z
      try {
        winObj.overlay.style.zIndex = (z - 1).toString();
        winObj.element.style.zIndex = z.toString();
      } catch (err) {
        // ignore style set errors
      }
    }

    // close specific window and cleanup handlers
    closeWindow(windowId) {
      const winObj = this.windows.get(windowId);
      if (!winObj) return false;

      // remove event listeners we added
      try {
        const h = winObj.handlers;
        if (h) {
          if (h._onWindowPointerDown) winObj.element.removeEventListener('pointerdown', h._onWindowPointerDown);
          if (h._onCloseClick) h.closeBtn && h.closeBtn.removeEventListener('click', h._onCloseClick);
          if (h._onOk && winObj.element.querySelector('.wh-footer .wh-ok-btn')) {
            winObj.element.querySelector('.wh-footer .wh-ok-btn').removeEventListener('click', h._onOk);
          }
          if (h._footerBtns) {
            h._footerBtns.forEach(item => item.el.removeEventListener('click', item.fn));
          }
          if (h._onHeaderPointerDown) winObj.handlers.header.removeEventListener('pointerdown', h._onHeaderPointerDown);
          if (h._onHeaderPointerMove) document.removeEventListener('pointermove', h._onHeaderPointerMove);
          if (h._onHeaderPointerUp) document.removeEventListener('pointerup', h._onHeaderPointerUp);

          if (h._onResizerPointerDown) winObj.handlers.resizer.removeEventListener('pointerdown', h._onResizerPointerDown);
          if (h._onResizerPointerMove) document.removeEventListener('pointermove', h._onResizerPointerMove);
          if (h._onResizerPointerUp) document.removeEventListener('pointerup', h._onResizerPointerUp);
        }
      } catch (err) {
        // swallow cleanup errors
        console.warn('cleanup handlers error', err);
      }

      // remove DOM nodes
      try { winObj.element.remove(); } catch (e) {}
      try { winObj.overlay.remove(); } catch (e) {}

      // delete entry
      this.windows.delete(windowId);
      return true;
    }

    closeAllWindows() {
      for (const id of Array.from(this.windows.keys())) {
        this.closeWindow(id);
      }
    }

    // enable/disable global close-on-outside behavior
    closeWindowOutside(enable = true) {
      if (enable && !this._closeOutsideEnabled) {
        document.addEventListener('pointerdown', this._outsideHandler);
        this._closeOutsideEnabled = true;
      } else if (!enable && this._closeOutsideEnabled) {
        document.removeEventListener('pointerdown', this._outsideHandler);
        this._closeOutsideEnabled = false;
      }
    }

    // global outside click handler - only runs when closeWindowOutside(true)
    _handleOutsideClick(e) {
      // if click inside any window -> ignore
      if (e.target.closest('.wh-window')) return;

      // if click overlay -> attempt to close that associated window
      const ov = e.target.closest('.wh-overlay');
      if (ov && ov.dataset && ov.dataset.whFor) {
        const id = ov.dataset.whFor;
        if (this.windows.has(id)) {
          this.closeWindow(id);
          return;
        }
      }

      // else click outside all windows -> close topmost window
      if (this.windows.size === 0) return;
      let topId = null;
      let topZ = -Infinity;
      for (const [id, item] of this.windows.entries()) {
        const z = parseInt(item.element.style.zIndex || getComputedStyle(item.element).zIndex || 0, 10);
        if (z > topZ) { topZ = z; topId = id; }
      }
      if (topId) this.closeWindow(topId);
    }

    // API: title/content/footer updates
    windowTitle(windowId, text) {
      const winObj = this.windows.get(windowId);
      if (!winObj) return false;
      const main = winObj.element.querySelector('.wh-title-main');
      const outline = winObj.element.querySelector('.wh-title-outline');
      if (main) main.textContent = text;
      if (outline) outline.textContent = text;
      winObj.config.title = text;
      return true;
    }

    continueWindowTittle(windowId, suffix) {
      const winObj = this.windows.get(windowId);
      if (!winObj) return false;
      const main = winObj.element.querySelector('.wh-title-main');
      const outline = winObj.element.querySelector('.wh-title-outline');
      if (main) main.textContent = (main.textContent || '') + suffix;
      if (outline) outline.textContent = (outline.textContent || '') + suffix;
      return true;
    }

    footerWindow(windowId, html) {
      const winObj = this.windows.get(windowId);
      if (!winObj) return false;
      const footer = winObj.element.querySelector('.wh-footer');
      if (footer) {
        footer.innerHTML = html;
        // bind default close for wh-ok-btn
        const ok = footer.querySelector('.wh-ok-btn');
        if (ok) ok.addEventListener('click', () => this.closeWindow(windowId));
      }
      return true;
    }

    contentWindow(windowId, html) {
      const winObj = this.windows.get(windowId);
      if (!winObj) return false;
      const content = winObj.element.querySelector('.wh-content');
      if (content) content.innerHTML = html;
      return true;
    }

    lockWindow(windowId, lock = true) {
      const winObj = this.windows.get(windowId);
      if (!winObj) return false;
      winObj.overlay.style.pointerEvents = lock ? 'auto' : 'none';
      winObj.config.lockUnderlay = !!lock;
      return true;
    }

    downWindowContrast(windowId, opacity = 0.4) {
      const winObj = this.windows.get(windowId);
      if (!winObj) return false;
      winObj.overlay.style.background = `rgba(0,0,0,${opacity})`;
      winObj.config.overlayOpacity = opacity;
      return true;
    }

    stayWindowFocus(windowId, stay = true) {
      const winObj = this.windows.get(windowId);
      if (!winObj) return false;
      if (stay) {
        winObj.element.style.zIndex = (this.zIndexCounter += 10000).toString();
      } else {
        winObj.element.style.zIndex = winObj.config.zIndex;
      }
      winObj.config.stayFocus = !!stay;
      return true;
    }

    reimplWindowHeader(windowId, fn) {
      const winObj = this.windows.get(windowId);
      if (!winObj || typeof fn !== 'function') return false;
      const header = winObj.element.querySelector('.wh-header');
      if (!header) return false;
      header.innerHTML = '';
      try {
        // allow user to implement header; ensure pointerdown still brings to top; user should implement close
        fn(header, { id: windowId, config: winObj.config });
        return true;
      } catch (err) {
        console.error('reimplWindowHeader error:', err);
        return false;
      }
    }

    getWindowIds() { return Array.from(this.windows.keys()); }
    getWindowCount() { return this.windows.size; }
  }

  /* ---------------------------
     Expose instance & shortcuts
     --------------------------- */
  const instance = new WindowHandler();
  window.WindowHandler = WindowHandler;
  window.windowManager = instance;

  // shortcuts
  window.openWindow = (cfg) => instance.openWindow(cfg);
  window.openWindowAlert = (content, title) => instance.openWindowAlert(content, title);
  window.openWindowMore = (n) => instance.openWindowMore(n);
  window.continueWindowTittle = (id, s) => instance.continueWindowTittle(id, s);
  window.windowTitle = (id, s) => instance.windowTitle(id, s);
  window.footerWindow = (id, html) => instance.footerWindow(id, html);
  window.contentWindow = (id, html) => instance.contentWindow(id, html);
  window.lockWindow = (id, lock) => instance.lockWindow(id, lock);
  window.downWindowContrast = (id, op) => instance.downWindowContrast(id, op);
  window.stayWindowFocus = (id, stay) => instance.stayWindowFocus(id, stay);
  window.reimplWindowHeader = (id, fn) => instance.reimplWindowHeader(id, fn);
  window.closeWindow = (id) => instance.closeWindow(id);
  window.closeAllWindows = () => instance.closeAllWindows();
  // close-on-outside: enable/disable
  window.closeWindowOutside = (enable = true) => instance.closeWindowOutside(enable);

  // done
})();
