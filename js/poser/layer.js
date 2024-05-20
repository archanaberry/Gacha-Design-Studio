class Layer {
    #name = null;
    #x = 0;
    #y = 0;
    #rotation = 0;
    #scale = 1;
    #flipX = false;
    #flipY = false;
    #images = {};
    #ondragstart = null;
    #color = '#ffffff';
    #group = null;
    #element = null;

    constructor(name, baseImage, trimImage, shape1Image, shape2Image, shape3Image, shape4Image, shape5Image, shadeImage, lightImage, outlineImage, initial = {}) {
        this.#name = name;
        this.#images = {
            base: baseImage,
            trim: trimImage,
            shape1: shape1Image,
            shape2: shape2Image,
            shape3: shape3Image,
            shape4: shape4Image,
            shape5: shape5Image,
            shade: shadeImage,
            light: lightImage,
            outline: outlineImage
        };
        this.#initElement();

        if ('x' in initial) this.#x = initial.x;
        if ('y' in initial) this.#y = initial.y;
        if ('rotation' in initial) this.#rotation = initial.rotation;
        if ('scale' in initial) this.#scale = initial.scale;
        if ('flipX' in initial) this.#flipX = initial.flipX;
        if ('flipY' in initial) this.#flipY = initial.flipY;
        if ('color' in initial) this.#color = initial.color;
        if ('group' in initial) this.#group = initial.group;
        this.#updateElement();
    }

    #initElement() {
        this.element = document.createElement('div');
        this.element.classList.add('layer');

        for (const [key, src] of Object.entries(this.#images)) {
            // Skip jika tidak ada gambarnya (entah ini bener atau gk)
            if(!src) continue;
            const imgElement = document.createElement('img');
            imgElement.src = src;
            imgElement.alt=key;
            imgElement.classList.add(key);
            this.element.appendChild(imgElement);
            imgElement.draggable = false;
        }

        this.element.addEventListener('click', () => this.select());
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

    /*
    #updateElement() {
        this.element.style.left = this.#x + 'px';
        this.element.style.top = this.#y + 'px';
        const transforms = [
            `rotate(${this.#rotation}deg)`,
            `scale(${this.#scale})`,
        ];
        if(this.#flipX) transforms.push('scaleX(-1)');
        if(this.#flipY) transforms.push('scaleY(-1)');
        this.element.style.transform = transforms.join(' ');
    }
    */

    /**
     * @param {boolean} selected
     */
    set selected(selected) {
        if(selected) {
            this.element.classList.add('selected');
        } else {
            this.element.classList.remove('selected');
        }
    }

    /**
     * @param {HTMLElement} dstRoot
     */
    attach(dstRoot, ondragstart) {
        dstRoot.appendChild(this.element);
        this.#ondragstart = (e) => {
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
