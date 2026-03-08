/**
 * Bone.js
 * Represents a single bone in the rigging system.
 * Handles position (%), rotation, and rendering.
 */
class Bone {
    constructor(id, name, x = 50, y = 50) {
        this.id = id || `bone_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
        this.name = name || 'New Bone';

        // Transform (Relative to Parent or Layer Root if no parent)
        this.x = x; // Percentage (0-100)
        this.y = y; // Percentage (0-100)
        this.rotation = 0; // Degrees
        this.length = 50; // Pixels (visual length)

        // Hierarchy
        this.parentId = null;
        this.children = [];

        // Components
        this.joint = new window.Joint('hinge');

        // State
        this.selected = false;
        this.linkMode = 'none'; // 'none', 'master', 'slave'
        this.clamp = true; // Constrain to layer bounds 0-100%
        this.rigLink = null; // { spine, boneId } for cross-layer connection

        // DOM Elements
        this.element = null;
        this.visual = null;
        this.line = null; // Line connecting to parent
    }

    setParent(parentId) {
        this.parentId = parentId;
    }

    addChild(boneId) {
        if (!this.children.includes(boneId)) {
            this.children.push(boneId);
        }
    }

    removeChild(boneId) {
        this.children = this.children.filter(id => id !== boneId);
    }

    /**
     * Updates the Bone's DOM element based on its properties.
     * @param {HTMLElement} container - The container layer element
     * @param {Map} boneMap - Map of all bones to look up parent position
     */
    /**
     * Updates the Bone's DOM element based on its properties.
     * @param {HTMLElement} container - The global overlay container
     * @param {Map} boneMap - Map of all bones
     * @param {Object} globalTransform - {x, y, rotation} calculated by Spine
     */
    render(container, boneMap, globalTransform) {
        if (!this.element) {
            this.#createElement();
            container.appendChild(this.element);
        }

        // If hidden or no transform, hide
        if (!globalTransform) {
            this.element.style.display = 'none';
            if (this.line) this.line.style.display = 'none';
            return;
        }

        this.element.style.display = 'block';

        // Apply Global Position (Pixel)
        this.element.style.left = `${globalTransform.x}px`;
        this.element.style.top = `${globalTransform.y}px`;
        this.element.style.transform = `translate(-50%, -50%) rotate(${globalTransform.rotation}deg) scale(${globalTransform.scale || 1})`;

        // Store current global pos for line rendering
        this._globalX = globalTransform.x;
        this._globalY = globalTransform.y;

        // 🔥 HIDE VISUAL if merged (Master connected to Slave via rigLink)
        if (this.linkMode === 'master' && this.rigLink) {
            this.visual.style.display = 'none';
        } else {
            this.visual.style.display = 'flex';
        }

        // Update Visual State
        this.#updateVisualState();

        // Update Connection Line to Parent
        if (this.parentId && boneMap.has(this.parentId)) {
            const parent = boneMap.get(this.parentId);
            // Render line only if parent has valid global coordinates calculated
            if (parent._globalX !== undefined && parent._globalY !== undefined) {
                this.#renderLineToParent(parent, container);
            }
        } else if (this.line) {
            // Clean up if no parent anymore
            this.line.remove();
            this.line = null;
        }

        // Ensure z-index is correct (Selected always top)
        if (this.selected) {
            // Move to end of container to be visually on top
            container.appendChild(this.element);
        }
    }

    #createElement() {
        this.element = document.createElement('div');
        this.element.className = 'bone-root';
        this.element.dataset.boneId = this.id;
        this.element.style.position = 'absolute';
        this.element.style.zIndex = '1000';
        this.element.style.cursor = 'pointer';
        this.element.style.pointerEvents = 'auto'; // Ensure clickable

        // Visual Construction (The circle thingy)
        // Structure: Outer Ring > Gap > Inner Circle > Green Highlight (on select)
        this.visual = document.createElement('div');
        this.visual.className = 'bone-visual';
        this.visual.style.width = '10px'; // 2.5px * 2 (approx scale up for visibility, user said 2.5px circle but that's tiny, assuming scale or unit difference, will start small but visible)
        this.visual.style.height = '10px';
        this.visual.style.borderRadius = '50%';
        this.visual.style.border = '2px solid red'; // Default Deselected
        this.visual.style.backgroundColor = 'transparent';
        this.visual.style.display = 'flex';
        this.visual.style.alignItems = 'center';
        this.visual.style.justifyContent = 'center';
        this.visual.style.boxSizing = 'border-box';

        // Inner Dot
        // Inner Dot
        const innerDot = document.createElement('div');
        innerDot.style.width = '50%';
        innerDot.style.height = '50%';
        innerDot.style.borderRadius = '50%';
        innerDot.style.backgroundColor = 'red';

        innerDot.style.position = 'absolute';
        innerDot.style.top = '50%';
        innerDot.style.left = '50%';
        innerDot.style.transform = 'translate(-50%, -50%)';

        this.visual.appendChild(innerDot);

        this.element.appendChild(this.visual);

        // Events
        this.element.addEventListener('pointerdown', (e) => {
            e.stopPropagation(); // Prevent layer drag
            // Event handled by SpineManager ideally, but we trigger a custom event
            const event = new CustomEvent('bone-select', { detail: { boneId: this.id, originalEvent: e }, bubbles: true });
            this.element.dispatchEvent(event);
        });
    }

    #updateVisualState() {
        if (!this.visual) return;

        const borderColor = this.selected ? '#00FF00' : 'red'; // Green / Red
        const innerColor = this.selected ? '#00FF00' : 'red';

        this.visual.style.borderColor = borderColor;
        this.visual.children[0].style.backgroundColor = innerColor;
        this.element.style.zIndex = this.selected ? '1001' : '1000';
    }

    #renderLineToParent(parent, container) {
        if (!this.line) {
            this.line = document.createElement('div');
            this.line.className = 'bone-connection';
            this.line.style.position = 'absolute';
            this.line.style.height = '2px';
            this.line.style.backgroundColor = 'rgba(255, 255, 0, 0.75)'; // Higher visibility
            this.line.style.transformOrigin = '0 50%';
            this.line.style.pointerEvents = 'none';
            this.line.style.zIndex = '900'; // Below bones (1000)
            container.appendChild(this.line); // Append to global overlay
        }

        this.line.style.display = 'block';

        const x1 = parent._globalX;
        const y1 = parent._globalY;
        const x2 = this._globalX;
        const y2 = this._globalY;

        const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
        const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;

        this.line.style.width = `${length}px`;
        this.line.style.left = `${x1}px`;
        this.line.style.top = `${y1}px`;
        this.line.style.transform = `translateY(-50%) rotate(${angle}deg)`;
    }

    remove() {
        if (this.element) this.element.remove();
        if (this.line) this.line.remove();
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            x: this.x,
            y: this.y,
            rotation: this.rotation,
            length: this.length,
            parentId: this.parentId,
            children: this.children,
            joint: this.joint.toJSON(),
            linkMode: this.linkMode,
            clamp: this.clamp,
            rigLink: this.rigLink ? {
                boneId: this.rigLink.boneId,
                fixedLength: this.rigLink.fixedLength,
                targetLayerId: this.rigLink.targetLayerId
            } : null
        };
    }

    static fromJSON(data) {
        const bone = new Bone(data.id, data.name, data.x, data.y);
        bone.rotation = data.rotation || 0;
        bone.length = data.length || 50;
        bone.parentId = data.parentId || null;
        bone.children = data.children || [];
        bone.linkMode = data.linkMode || 'none';
        bone.clamp = data.clamp !== undefined ? data.clamp : true;
        bone.rigLink = data.rigLink || null;
        if (data.joint) bone.joint = window.Joint.fromJSON(data.joint);
        return bone;
    }
}

window.Bone = Bone;
