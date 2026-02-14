/* frame/mainmenu.js
   Simple fallback UI to show when resources missing
*/
(function(){
  window.FrameMainMenu = {
    init(container) {
      container.style.padding = '20px';
      container.style.textAlign = 'center';
      container.style.color = '#fff';
      container.innerHTML = `
        <h2 style="margin-top:0">Main Menu (Fallback)</h2>
        <p>Beberapa sumber daya tidak tersedia. Silahkan install ulang atau periksa file.</p>
        <div style="margin-top:12px">
          <button id="fds-retry" style="padding:8px 12px;border-radius:6px;border:none;cursor:pointer">Coba lagi</button>
        </div>
      `;
      const btn = container.querySelector('#fds-retry');
      if (btn) btn.addEventListener('click', () => {
        if (window.FrameLoading) window.FrameLoading.retryCheck();
      });
    }
  };
})();
