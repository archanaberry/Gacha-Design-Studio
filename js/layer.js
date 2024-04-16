
class Layer {
    #name = null;
    #x = 0;
    #y = 0;
    #_rotation = 0;
    #fillImage = null;
    #outlineImage = null;
    #onmousedown = null;

    constructor(name, fillImage, outlineImage) {
        this.#name = name;
        this.#fillImage = fillImage;
        this.#outlineImage = outlineImage;
        this.#initElement();
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

    set x(value) {
        this.#x = value;
        this.#updateElement();
    }

    set y(value) {
        this.#y = value;
        this.#updateElement();
    }

    #updateElement() {
        this.element.style.left = this.#x + 'px';
        this.element.style.top = this.#y + 'px';
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