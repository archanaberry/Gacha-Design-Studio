// js/frame/studiosandbox.js
// Injects the studiosandbox HTML via JS (CSP-safe)
(function () {
  function init(p1, p2) {
    if (!p1 || !p2) return;

    p1.innerHTML = `
      <div class="sandbox-preview" style="min-height:220px; border:1px dashed rgba(255,255,255,0.06); padding:12px; display:flex;align-items:center;justify-content:center;">
        <div id="sandboxCanvas">Sandbox Preview Area</div>
      </div>
    `;

    p2.innerHTML = `
      <div class="sandbox-controls">
        <label for="sandboxFile">Tambahkan gambar:</label>
        <input type="file" id="sandboxFile" accept="image/*">
        <button id="clearSandbox">Bersihkan</button>
        <button id="addRandom">Tambah Random</button>
      </div>
    `;

    var file = p2.querySelector('#sandboxFile');
    var canvas = p1.querySelector('#sandboxCanvas');
    if (file) file.addEventListener('change', function (e) {
      if (e.target.files && e.target.files[0]) {
        var img = document.createElement('img');
        img.src = URL.createObjectURL(e.target.files[0]);
        img.style.maxWidth = '140px';
        img.style.margin = '6px';
        canvas.appendChild(img);
        setTimeout(function () { try { URL.revokeObjectURL(img.src); } catch (e) {} }, 60000);
      }
    });

    var clearBtn = p2.querySelector('#clearSandbox'); if (clearBtn) clearBtn.addEventListener('click', function () { if (canvas) canvas.innerHTML = 'Sandbox Preview Area'; });
    var randBtn = p2.querySelector('#addRandom'); if (randBtn) randBtn.addEventListener('click', function () { var d = document.createElement('div'); d.textContent = 'Random Item'; d.style.padding='6px'; d.style.border='1px solid #666'; canvas.appendChild(d); });
  }

  if (window && typeof window.registerStudioFrame === 'function') {
    window.registerStudioFrame('studiosandbox', init);
  } else {
    window.__pendingStudioSandbox = init;
  }

})();
