// js/frame/studiopose.js
// Character-centric studio frame. Registers itself with the overlay injector.
(function () {
	function init(p1, p2) {
		if (!p1) return;
		// Panel1: character-centric canvas / preview
		var h = document.createElement('h2');
		h.textContent = 'Studio Pose (Character-centric)';
		p1.appendChild(h);

		var canvasWrap = document.createElement('div');
		canvasWrap.style.minHeight = '220px';
		canvasWrap.style.display = 'flex';
		canvasWrap.style.alignItems = 'center';
		canvasWrap.style.justifyContent = 'center';
		canvasWrap.style.border = '1px dashed rgba(255,255,255,0.06)';
		canvasWrap.style.padding = '12px';

		var preview = document.createElement('div');
		preview.style.width = '320px';
		preview.style.height = '320px';
		preview.style.background = 'linear-gradient(180deg,#111,#222)';
		preview.style.borderRadius = '10px';
		preview.style.display = 'flex';
		preview.style.alignItems = 'center';
		preview.style.justifyContent = 'center';
		preview.textContent = 'Preview Area';
		preview.style.color = '#eee';
		canvasWrap.appendChild(preview);
		p1.appendChild(canvasWrap);

		// Panel2: controls
		if (p2) {
			var ctrlTitle = document.createElement('h3');
			ctrlTitle.textContent = 'Pose Controls';
			p2.appendChild(ctrlTitle);

			var btns = document.createElement('div');
			btns.style.marginTop = '10px';
			var btnA = document.createElement('button'); btnA.textContent = 'Reset Pose';
			var btnB = document.createElement('button'); btnB.textContent = 'Random Pose';
			btnA.style.marginRight = '8px'; btnB.style.marginRight = '8px';
			btns.appendChild(btnA); btns.appendChild(btnB);
			p2.appendChild(btns);

			btnA.addEventListener('click', function () { alert('Reset pose (stub)'); });
			btnB.addEventListener('click', function () { alert('Random pose (stub)'); });
		}
	}

	if (window && typeof window.registerStudioFrame === 'function') {
		window.registerStudioFrame('studiopose', init);
	} else {
		// if injector loads later, expose temporary register
		window.__pendingStudioPose = init;
	}

})();
