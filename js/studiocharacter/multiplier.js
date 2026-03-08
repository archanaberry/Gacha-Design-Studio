/****************************************************************/
//                                                              //
//  -------------------Gacha Design Studio--------------------  //
//  Created by: Archana Berry                                   //
//  File: multiplier.js                                         //
//  Type: module[design]                                        //
//  Desc: Handling visual multiplication (Sederet/Mirror)       //
//                                                              //
/****************************************************************/

class LayerMultiplier {
    constructor(layer) {
        this.layer = layer;
        this.clones = [];
        this.options = {
            enabled: false,
            mode: 'sederet',
            count: 0,
            unlimited: false,
            gap: 0,
            axis: 'x',
            rotation: 0, // Rotation for iteration (not object rotation)
            mirrorType: 1 // Mirror type: 1=q|p d|b, 2=q|p p|q, 3=q|p p|d, etc
        };
    }

    setOptions(newOptions) {
        if (!newOptions) return;
        this.options = Object.assign(this.options, newOptions);

        // Persist to layer options for serialisation/export
        if (this.layer) {
            this.layer.options = this.layer.options || {};
            this.layer.options.multiplier = Object.assign({}, this.options);
        }

        console.log('[Multiplier] Options updated:', this.options);
        this.update();
    }

    update() {
        this.clear();

        if (!this.options.enabled) {
            console.log('[Multiplier] Disabled');
            return;
        }

        if (!this.layer.element || !this.layer.element.parentNode) {
            console.log('[Multiplier] No element/parent');
            return;
        }

        const parent = this.layer.element.parentNode;
        let containerWidth = parent.clientWidth || document.getElementById('panel1')?.clientWidth || 800;
        let containerHeight = parent.clientHeight || document.getElementById('panel1')?.clientHeight || 600;

        const layerWidth = this.layer.width || this.layer.element.offsetWidth || 100;
        const layerHeight = this.layer.height || this.layer.element.offsetHeight || 100;

        const axisStr = String(this.options.axis || '').toLowerCase();
        const hasX = axisStr.includes('x');
        const hasY = axisStr.includes('y');

        if (!hasX && !hasY) {
            console.log('[Multiplier] No axis');
            return;
        }

        let count = this.options.count;

        if (this.options.unlimited) {
            const gap = this.options.gap || layerWidth;
            count = hasX && hasY ? Math.ceil(Math.max(containerWidth, containerHeight) / gap) :
                hasX ? Math.ceil(containerWidth / gap) :
                    Math.ceil(containerHeight / gap);
            count = Math.min(count, 100);
            console.log('[Multiplier] Unlimited count:', count);
        }

        if (count <= 0) {
            console.log('[Multiplier] Count is 0');
            return;
        }

        console.log(`[Multiplier] Creating ${count} clones - mode: ${this.options.mode}`);

        if (this.options.mode === 'sederet') {
            // Fixed: Create proper grid where each column = row
            // X axis = columns (horizontal), Y axis = rows (vertical)
            const rotationStep = this.options.rotation || 0;

            if (hasX && hasY) {
                // Both axes: create a grid
                // count determines how many copies in each direction
                for (let row = -count; row <= count; row++) {
                    for (let col = -count; col <= count; col++) {
                        if (row === 0 && col === 0) continue; // Skip original
                        const rotationAngle = rotationStep * (Math.abs(row) + Math.abs(col));
                        this.createClone({ row, col, rotation: rotationAngle }, hasX, hasY, containerWidth, containerHeight, layerWidth, layerHeight, parent);
                    }
                }
            } else if (hasX) {
                // X axis only: horizontal row
                for (let col = -count; col <= count; col++) {
                    if (col === 0) continue;
                    const rotationAngle = rotationStep * Math.abs(col);
                    this.createClone({ row: 0, col, rotation: rotationAngle }, hasX, hasY, containerWidth, containerHeight, layerWidth, layerHeight, parent);
                }
            } else if (hasY) {
                // Y axis only: vertical column
                for (let row = -count; row <= count; row++) {
                    if (row === 0) continue;
                    const rotationAngle = rotationStep * Math.abs(row);
                    this.createClone({ row, col: 0, rotation: rotationAngle }, hasX, hasY, containerWidth, containerHeight, layerWidth, layerHeight, parent);
                }
            }
        } else if (this.options.mode === 'mirror') {
            const mirrorType = this.options.mirrorType || 1;

            if (hasX && hasY) {
                // Mirror types for both axes:
                // Type 1: q|p / d|b (standard mirror)
                // Type 2: q|p / p|q (vertical flip only)
                // Type 3: q|p / p|d (horizontal flip only)
                // Type 4: q|p / b|d (diagonal flip)

                if (mirrorType === 1) {
                    // Standard 4-way mirror
                    this.createClone({ mirrorX: true, mirrorY: false }, hasX, hasY, containerWidth, containerHeight, layerWidth, layerHeight, parent);
                    this.createClone({ mirrorX: false, mirrorY: true }, hasX, hasY, containerWidth, containerHeight, layerWidth, layerHeight, parent);
                    this.createClone({ mirrorX: true, mirrorY: true }, hasX, hasY, containerWidth, containerHeight, layerWidth, layerHeight, parent);
                } else if (mirrorType === 2) {
                    // q|p / p|q (both horizontal flip)
                    this.createClone({ mirrorX: true, mirrorY: false }, hasX, hasY, containerWidth, containerHeight, layerWidth, layerHeight, parent);
                    this.createClone({ mirrorX: false, mirrorY: true, flipOnly: 'horizontal' }, hasX, hasY, containerWidth, containerHeight, layerWidth, layerHeight, parent);
                    this.createClone({ mirrorX: true, mirrorY: true, flipOnly: 'horizontal' }, hasX, hasY, containerWidth, containerHeight, layerWidth, layerHeight, parent);
                } else if (mirrorType === 3) {
                    // q|p / p|d (top horizontal flip, bottom no flip)
                    this.createClone({ mirrorX: true, mirrorY: false }, hasX, hasY, containerWidth, containerHeight, layerWidth, layerHeight, parent);
                    this.createClone({ mirrorX: false, mirrorY: true, flipOnly: 'horizontal' }, hasX, hasY, containerWidth, containerHeight, layerWidth, layerHeight, parent);
                    this.createClone({ mirrorX: true, mirrorY: true, flipOnly: 'none' }, hasX, hasY, containerWidth, containerHeight, layerWidth, layerHeight, parent);
                } else {
                    // Default: standard mirror
                    this.createClone({ mirrorX: true, mirrorY: false }, hasX, hasY, containerWidth, containerHeight, layerWidth, layerHeight, parent);
                    this.createClone({ mirrorX: false, mirrorY: true }, hasX, hasY, containerWidth, containerHeight, layerWidth, layerHeight, parent);
                    this.createClone({ mirrorX: true, mirrorY: true }, hasX, hasY, containerWidth, containerHeight, layerWidth, layerHeight, parent);
                }
            } else if (hasX) {
                // X mirror only
                this.createClone({ mirrorX: true, mirrorY: false }, hasX, hasY, containerWidth, containerHeight, layerWidth, layerHeight, parent);
            } else if (hasY) {
                // Y mirror only
                this.createClone({ mirrorX: false, mirrorY: true }, hasX, hasY, containerWidth, containerHeight, layerWidth, layerHeight, parent);
            }
        }

        console.log('[Multiplier] Created', this.clones.length, 'clones');
    }

    createClone(params, hasX, hasY, cW, cH, lW, lH, parent) {
        const clone = this.layer.element.cloneNode(true);
        clone.classList.add('layer-clone');
        clone.classList.remove('selected', 'dragging');
        clone.id = '';
        clone.style.pointerEvents = 'none';
        clone.style.opacity = this.layer.opacity;

        const selectionBox = clone.querySelector('.selection-box');
        if (selectionBox) selectionBox.remove();

        clone.dataset.isClone = 'true';

        if (this.options.mode === 'sederet') {
            // Grid-based positioning
            const row = params.row || 0;
            const col = params.col || 0;
            const rotation = params.rotation || 0;

            const layerW = this.layer.width || this.layer.element.offsetWidth || 100;
            const layerH = this.layer.height || this.layer.element.offsetHeight || 100;
            const gapX = this.options.gap !== 0 ? this.options.gap : layerW;
            const gapY = this.options.gap !== 0 ? this.options.gap : layerH;

            // Position based on row and column
            const offsetX = col * gapX;
            const offsetY = row * gapY;

            clone.style.left = `${this.layer.x + offsetX}px`;
            clone.style.top = `${this.layer.y + offsetY}px`;

            // Apply rotation if specified (iteration rotation, not layer rotation)
            if (rotation !== 0) {
                const currentTransform = clone.style.transform || '';
                // Add rotation to existing transform
                if (currentTransform.includes('rotate')) {
                    clone.style.transform = currentTransform.replace(/rotate\(([-\d.]+)deg\)/, (match, angle) => {
                        const currentAngle = parseFloat(angle) || 0;
                        return `rotate(${currentAngle + rotation}deg)`;
                    });
                } else {
                    clone.style.transform = `${currentTransform} rotate(${rotation}deg)`.trim();
                }
            }

            clone.dataset.cloneIndex = `${row},${col}`;
        } else if (this.options.mode === 'mirror') {
            const mirrorX = params.mirrorX || false;
            const mirrorY = params.mirrorY || false;
            const flipOnly = params.flipOnly; // 'horizontal', 'vertical', 'none', or undefined

            let newX = this.layer.x;
            let newY = this.layer.y;
            let flipH = false;
            let flipV = false;

            // Calculate mirrored position
            if (mirrorX) {
                newX = cW - (this.layer.x + lW);
                flipH = true;
            }
            if (mirrorY) {
                newY = cH - (this.layer.y + lH);
                flipV = true;
            }

            // Apply flipOnly override for special mirror types
            if (flipOnly === 'horizontal') {
                flipV = false;
                flipH = true;
            } else if (flipOnly === 'vertical') {
                flipH = false;
                flipV = true;
            } else if (flipOnly === 'none') {
                flipH = false;
                flipV = false;
            }

            clone.style.left = `${newX}px`;
            clone.style.top = `${newY}px`;

            // Apply flip transform
            const currentTransform = clone.style.transform || '';
            let scaleX = flipH ? -1 : 1;
            let scaleY = flipV ? -1 : 1;

            if (currentTransform.includes('scale')) {
                clone.style.transform = currentTransform.replace(/scale\(([-\d.]+)(?:,\s*([-\d.]+))?\)/, (match, sx, sy) => {
                    const currentSX = parseFloat(sx) || 1;
                    const currentSY = parseFloat(sy || sx) || 1;
                    return `scale(${currentSX * scaleX}, ${currentSY * scaleY})`;
                });
            } else {
                clone.style.transform = `${currentTransform} scale(${scaleX}, ${scaleY})`.trim();
            }

            clone.dataset.cloneIndex = `mirror_${mirrorX ? 'x' : ''}${mirrorY ? 'y' : ''}`;
        }

        parent.appendChild(clone);
        this.clones.push(clone);
    }

    clear() {
        this.clones.forEach(clone => {
            if (clone && clone.parentNode) clone.parentNode.removeChild(clone);
        });
        this.clones = [];
    }
}

if (typeof window !== 'undefined') {
    window.LayerMultiplier = LayerMultiplier;
}
