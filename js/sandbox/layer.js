class Layer {
    #name = null;
    #x = 0;
    #y = 0;
    #rotation = 0;
    #scale = 1;
    #flipX = false;
    #flipY = false;
    #shape = null;
    #color = 'f7efec';
    #ondragstart = null;
    isSelectable = true; // Properti untuk menentukan apakah layer bisa dipilih

    constructor(name, shape, initial) {
        this.#name = name;
        this.#shape = shape;
        this.#initElement();
        if (!initial) return;
        if ('x' in initial) this.#x = initial.x;
        if ('y' in initial) this.#y = initial.y;
        if ('rotation' in initial) this.#rotation = initial.rotation;
        if ('scale' in initial) this.#scale = initial.scale;
        if ('flipX' in initial) this.#flipX = initial.flipX;
        if ('flipY' in initial) this.#flipY = initial.flipY;
        this.#updateElement();
    }

    #initElement() {
        this.element = document.createElement('div');
        this.element.classList.add('layer');

        const fillImgElement = document.createElement('img');
        fillImgElement.src = this.#shape;
        this.element.appendChild(fillImgElement);

        // Disable fungsi drag bawaan browser
        for (const el of [this.element, fillImgElement]) {
            el.draggable = false;
        }

        this.element.addEventListener('click', () => {
            if (this.isSelectable) this.select();
        });
    }

    select() {
        this.isSelected = true;
        this.element.classList.add('selected');
        console.log('Lapisan dipilih: ' + this.#name);
    }

    deselect() {
        this.isSelected = false;
        this.element.classList.remove('selected');
        console.log('Lapisan tidak dipilih: ' + this.#name);
    }

    #updateElement() {
        this.element.style.transform = `translate(${this.#x}px, ${this.#y}px) scale(${this.#scale}) rotate(${this.#rotation}deg)`;
        if (this.#flipX) this.element.style.transform += ' scaleX(-1)';
        if (this.#flipY) this.element.style.transform += ' scaleY(-1)';
        for (const img of this.element.querySelectorAll('img')) {
            img.style.filter = `drop-shadow(0 0 0 ${this.#color})`;
        }
    }

    setColor(color) {
        this.#color = color;
        this.#updateElement();
    }

    get name() {
        return this.#name;
    }

    get x() {
        return this.#x;
    }

    get y() {
        return this.#y;
    }

    get rotation() {
        return this.#rotation;
    }

    get scale() {
        return this.#scale;
    }

    get isFlipX() {
        return this.#flipX;
    }

    get isFlipY() {
        return this.#flipY;
    }

    set name(name) {
        this.#name = name;
    }

    set x(value) {
        this.#x = value;
        this.#updateElement();
    }

    set y(value) {
        this.#y = value;
        this.#updateElement();
    }

    set rotation(value) {
        this.#rotation = value;
        this.#updateElement();
    }

    set scale(value) {
        this.#scale = value;
        this.#updateElement();
    }

    set flipX(value) {
        this.#flipX = value;
        this.#updateElement();
    }

    set flipY(value) {
        this.#flipY = value;
        this.#updateElement();
    }

    set selected(selected) {
        if (selected) {
            this.element.classList.add('selected');
        } else {
            this.element.classList.remove('selected');
        }
    }

    attach(dstRoot, ondragstart) {
        dstRoot.appendChild(this.element);
        this.#ondragstart = (e) => {
            if (!this.isSelectable) return; // Tambahkan kondisi ini
            ondragstart(e, this);
        };

        this.element.addEventListener('mousedown', this.#ondragstart);
        this.element.addEventListener('touchstart', this.#ondragstart);
    }

    detach() {
        this.element.parentElement.removeChild(this.element);
        this.element.removeEventListener('mousedown', this.#ondragstart);
        this.element.removeEventListener('touchstart', this.#ondragstart);
    }
}