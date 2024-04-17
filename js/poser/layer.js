
class Layer {
    #name = null;
    #x = 0;
    #y = 0;
    #rotation = 0;
    #scale = 1;
    #flipX = false;
    #flipY = false;
    #fillImage = null;
    #outlineImage = null;
    #onmousedown = null;

    constructor(name, fillImage, outlineImage, initial) {
        this.#name = name;
        this.#fillImage = fillImage;
        this.#outlineImage = outlineImage;
        this.#initElement();
        if(!initial) return;
        if('x' in initial) this.#x = initial.x;
        if('y' in initial) this.#y = initial.y;
        if('rotation' in initial) this.#rotation = initial.rotation;
        if('scale' in initial) this.#scale = initial.scale;
        if('flipX' in initial) this.#flipX = initial.flipX;
        if('flipY' in initial) this.#flipY = initial.flipY;
        this.#updateElement();
    }

    #initElement() {
        this.element = document.createElement('div');
        this.element.classList.add('layer');

        const fillImgElement = document.createElement('img');
        const outlineImgElement = document.createElement('img');

        fillImgElement.src = this.#fillImage;
        outlineImgElement.src = this.#outlineImage;

        this.element.appendChild(fillImgElement);
        this.element.append(outlineImgElement);

        // Disable fungsi drag bawaan browser
        for(const el of [this.element, fillImgElement, outlineImgElement]) {
            el.draggable = false;
        }
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
        this.#onmousedown = (e) => {
            ondragstart(e, this);
        };

        this.element.addEventListener('mousedown', this.#onmousedown);
    }

    detach() {
        this.element.parentElement.removeChild(this.element);
        this.element.removeEventListener('mousedown', this.#onmousedown);
    }
}
