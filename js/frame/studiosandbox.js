// js/frame/studiosandbox.js
// Sandbox studio frame. More free-form creative controls.
(function () {
  function init(p1, p2) {
    if (!p1) return;
    var h = document.createElement('h2');
    h.textContent = 'Studio Sandbox (Free Creativity)';
    p1.appendChild(h);

    var area = document.createElement('div');
    area.style.minHeight = '200px';
    area.style.border = '1px dashed rgba(255,255,255,0.06)';
    area.style.padding = '12px';
    area.textContent = 'Canvas / sandbox area — drag-and-drop assets here (stub)';
    p1.appendChild(area);

    if (p2) {
      var tools = document.createElement('div');
      var title = document.createElement('h3'); title.textContent = 'Sandbox Tools';
      tools.appendChild(title);

      var addImg = document.createElement('input'); addImg.type = 'file'; addImg.accept = 'image/*';
      var btn = document.createElement('button'); btn.textContent = 'Tambah Gambar';
      btn.addEventListener('click', function () { addImg.click(); });
      addImg.addEventListener('change', function (e) {
        if (e.target.files && e.target.files[0]) {
          var url = URL.createObjectURL(e.target.files[0]);
          var img = document.createElement('img'); img.src = url; img.style.maxWidth = '120px'; img.style.margin = '6px';
          area.appendChild(img);
          setTimeout(function () { URL.revokeObjectURL(url); }, 60000);
        }
      });

      tools.appendChild(btn);
      p2.appendChild(tools);
    }
  }

  if (window && typeof window.registerStudioFrame === 'function') {
    window.registerStudioFrame('studiosandbox', init);
  } else {
    window.__pendingStudioSandbox = init;
  }
})();
