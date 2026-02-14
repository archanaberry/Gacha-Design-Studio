/* frame/loading.js
   Resource checker and UI fallback (toast + frame) for MainMenu
*/
(function(){
  window.FrameLoading = {
    async checkResources(resources, timeout = 5000) {
      const checks = resources.map(url => this._checkUrl(url, timeout).then(ok => ({url, ok})).catch(() => ({url, ok:false})) );
      const results = await Promise.all(checks);
      const missing = results.filter(r => !r.ok).map(r => r.url);
      if (missing.length > 0) {
        this.showErrorToast(missing);
        this.showFrameOverlay();
        return false;
      }
      return true;
    },

    _checkUrl(url, timeout) {
      return new Promise((resolve, reject) => {
        let done = false;
        const timer = setTimeout(() => {
          if (!done) { done = true; reject(new Error('timeout')); }
        }, timeout);

        fetch(url, {method: 'GET'}).then(resp => {
          if (done) return;
          clearTimeout(timer);
          done = true;
          resolve(resp && resp.ok);
        }).catch(err => {
          if (done) return;
          clearTimeout(timer);
          done = true;
          reject(err);
        });
      });
    },

    showErrorToast(missing) {
      if (document.getElementById('fds-error-toast')) return;
      const toast = document.createElement('div');
      toast.id = 'fds-error-toast';
      toast.style.position = 'fixed';
      toast.style.left = '12px';
      toast.style.right = '12px';
      toast.style.bottom = '12px';
      toast.style.background = 'linear-gradient(90deg,#8b0000,#ff4d4d)';
      toast.style.color = '#fff';
      toast.style.padding = '12px 16px';
      toast.style.borderRadius = '8px';
      toast.style.boxShadow = '0 6px 20px rgba(0,0,0,0.4)';
      toast.style.zIndex = 99999;
      toast.style.fontFamily = 'sans-serif';
      toast.style.whiteSpace = 'pre-wrap';
      toast.style.textAlign = 'center';
      toast.innerText = 'ERROR\nKesalahan sumber daya silahkan install ulang';

      const retry = document.createElement('button');
      retry.innerText = 'Coba lagi';
      retry.style.marginTop = '8px';
      retry.style.display = 'block';
      retry.style.marginLeft = 'auto';
      retry.style.marginRight = 'auto';
      retry.style.padding = '6px 10px';
      retry.style.border = 'none';
      retry.style.borderRadius = '6px';
      retry.style.cursor = 'pointer';
      retry.onclick = () => {
        toast.remove();
        this.retryCheck();
      };

      toast.appendChild(retry);
      document.body.appendChild(toast);
    },

    showFrameOverlay() {
      if (document.getElementById('fds-frame-overlay')) return;
      const overlay = document.createElement('div');
      overlay.id = 'fds-frame-overlay';
      overlay.style.position = 'fixed';
      overlay.style.top = 0;
      overlay.style.left = 0;
      overlay.style.right = 0;
      overlay.style.bottom = 0;
      overlay.style.background = 'rgba(0,0,0,0.6)';
      overlay.style.zIndex = 99998;

      const container = document.createElement('div');
      container.id = 'fds-frame-container';
      container.style.width = '720px';
      container.style.maxWidth = '96%';
      container.style.margin = '6vh auto';
      container.style.background = '#111';
      container.style.borderRadius = '8px';
      container.style.padding = '18px';
      container.style.color = '#fff';
      container.style.textAlign = 'center';

      const title = document.createElement('div');
      title.innerText = 'Redirect...';
      title.style.fontSize = '18px';
      title.style.marginBottom = '12px';

      container.appendChild(title);

      const info = document.createElement('div');
      info.innerText = 'Beberapa sumber tidak ditemukan. Menyuguhkan tampilan fallback.';
      info.style.marginBottom = '12px';
      container.appendChild(info);

      overlay.appendChild(container);
      document.body.appendChild(overlay);

      // Try to load frame/mainmenu.js to render fallback UI
      const script = document.createElement('script');
      script.src = 'js/frame/mainmenu.js';
      script.onload = () => {
        if (window.FrameMainMenu && typeof window.FrameMainMenu.init === 'function') {
          // replace container content with fallback UI
          container.innerHTML = '';
          window.FrameMainMenu.init(container);
        }
      };
      script.onerror = () => {
        const err = document.createElement('div');
        err.innerText = 'Fallback gagal dimuat. Silahkan periksa instalasi.';
        container.appendChild(err);
      };
      document.head.appendChild(script);
    },

    async retryCheck() {
      // find previous resource list from window if set
      const resources = window.__FDS_LAST_RESOURCES || [];
      if (resources.length === 0) {
        location.reload();
        return;
      }
      // remove existing overlay if any
      const ov = document.getElementById('fds-frame-overlay'); if (ov) ov.remove();
      const ok = await this.checkResources(resources);
      if (ok) location.reload();
    }
  };
})();
