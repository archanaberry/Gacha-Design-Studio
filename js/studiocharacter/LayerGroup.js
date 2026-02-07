class LayerGroup {
    constructor(children) {
        this.children = children;
        this.element = document.createElement('div');
        this.element.classList.add('layer-group');

        // Tambahkan setiap anak ke dalam grup
        children.forEach(child => {
            this.element.appendChild(child.element);
        });

        // Tambahkan root anchor untuk melindungi drag
        const rootAnchor = document.createElement('div');
        rootAnchor.classList.add('root-anchor');
        rootAnchor.style.position = 'absolute';
        rootAnchor.style.width = '100%';
        rootAnchor.style.height = '100%';
        rootAnchor.style.pointerEvents = 'none';
        this.element.appendChild(rootAnchor);

        // Tetapkan posisi awal grup
        this.x = 0;
        this.y = 0;
    }

    set x(value) {
        this._x = value;
        this.updatePosition();
    }

    get x() {
        return this._x;
    }

    set y(value) {
        this._y = value;
        this.updatePosition();
    }

    get y() {
        return this._y;
    }

    updatePosition() {
        this.element.style.transform = `translate(${this._x}px, ${this._y}px)`;
    }
}

export default LayerGroup;