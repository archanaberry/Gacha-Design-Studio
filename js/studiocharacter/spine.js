/**
 * spine.js
 * Manages the Bone Rigging System for a single Layer.
 * Handles bone hierarchy, rendering, cross-layer Rig Link connections,
 * and DAR (Drag as Real) physics simulation with Pivot and Ball joints.
 */
class Spine {
    constructor(layer) {
        this.layer = layer;
        this.bones = new Map(); // boneId -> Bone
        this.rootBoneId = null;
        this.selectedBoneId = null;
        this.showBones = true;
        this.container = null; // Global overlay reference
        this._syncing = false; // Anti-recursion flag

        this.load();
        this.ensureContainer();
        this.initInteraction();
    }

    // ─── INTERACTION ──────────────────────────────────────────────
    initInteraction() {
        const overlay = document.getElementById('spine-global-overlay');
        if (overlay) {
            overlay.addEventListener('bone-select', (e) => {
                if (this.bones.has(e.detail.boneId)) {
                    if (!this.showBones || !window.showGlobalBones) return;
                    this.selectBone(e.detail.boneId);
                    if (e.detail.originalEvent && e.detail.originalEvent.isPrimary) {
                        this.startDrag(e.detail.boneId, e.detail.originalEvent);
                    }
                }
            });
        }
    }

    selectBone(boneId) {
        if (this.selectedBoneId && this.bones.has(this.selectedBoneId)) {
            this.bones.get(this.selectedBoneId).selected = false;
        }
        this.selectedBoneId = boneId;
        const bone = this.bones.get(boneId);
        if (bone) bone.selected = true;
        this.render();
    }

    // ─── DRAG ─────────────────────────────────────────────────────
    startDrag(boneId, startEvent) {
        if (!this.container) return;
        const bone = this.bones.get(boneId);
        if (!bone) return;

        // In DAR mode, dragging a connected bone moves the assembly.
        // In Non-DAR, connected master bones can't be dragged individually (disconnect first).
        if (!window.isDragAsReal && bone.rigLink) return;

        const startX = startEvent.clientX;
        const startY = startEvent.clientY;
        const startBoneX = bone.x;
        const startBoneY = bone.y;

        if (!this.layer.element) return;
        const rect = this.layer.element.getBoundingClientRect();
        const w = rect.width || 1;
        const h = rect.height || 1;

        let lastX = startX;
        let lastY = startY;

        const onMove = (e) => {
            e.preventDefault();
            const zoom = window.currentScale || 1;
            const dx = (e.clientX - startX) / zoom;
            const dy = (e.clientY - startY) / zoom;

            const stepDx = (e.clientX - lastX) / zoom;
            const stepDy = (e.clientY - lastY) / zoom;
            lastX = e.clientX;
            lastY = e.clientY;

            // Percentage change for bone coordinate
            const dxPercent = (dx * zoom / w) * 100;
            const dyPercent = (dy * zoom / h) * 100;

            const targetX = startBoneX + dxPercent;
            const targetY = startBoneY + dyPercent;

            if (window.isDragAsReal) {
                // 🔥 DAR Mode: Dragging a bone moves the whole layer/assembly
                const moveX = (targetX - bone.x) * (w / 100);
                const moveY = (targetY - bone.y) * (h / 100);

                this.layer.x += moveX;
                this.layer.y += moveY;

                // Propagate to connected systems
                this.onLayerMove(moveX, moveY, 0, [this.layer]);

                // If this is a Slave bone being dragged, pull Master layers specifically
                if (bone.linkMode === 'slave') {
                    this._applyDARSlaveDrag(bone, boneId, moveX, moveY);
                }
            } else {
                // Non-DAR: Bone stretches/moves locally
                if (bone.clamp !== false) {
                    bone.x = Math.max(0, Math.min(100, targetX));
                    bone.y = Math.max(0, Math.min(100, targetY));
                } else {
                    bone.x = targetX;
                    bone.y = targetY;
                }
            }

            if (boneId === this.rootBoneId) {
                this.syncLayerPivot();
            }

            this._renderAllSpines();

            window.dispatchEvent(new CustomEvent('spine-bone-selected', {
                detail: { spine: this, boneId, bone }
            }));
        };

        const onUp = () => {
            document.removeEventListener('pointermove', onMove);
            document.removeEventListener('pointerup', onUp);
            document.removeEventListener('pointercancel', onUp);
            this.save();
        };

        document.addEventListener('pointermove', onMove);
        document.addEventListener('pointerup', onUp);
        document.addEventListener('pointercancel', onUp);
    }

    _applyDARSlaveDrag(slaveBone, slaveBoneId, dx, dy) {
        if (!window.layers) return;
        window.layers.forEach(l => {
            const otherSpine = l.spine || (l.__layerInstance ? l.__layerInstance.spine : null);
            if (!otherSpine || otherSpine === this) return;

            otherSpine.bones.forEach(masterBone => {
                if (masterBone.linkMode === 'master' && masterBone.rigLink && masterBone.rigLink.spine === this && masterBone.rigLink.boneId === slaveBoneId) {
                    const jt = slaveBone.joint ? slaveBone.joint.type : 'fixed';
                    const fixedLen = masterBone.rigLink.fixedLength || 0;

                    if (jt === 'pivot' || jt === 'ball') {
                        this._orbitLayerAroundAnchor(l, this.layer, slaveBone, fixedLen, dx, dy, jt === 'ball');
                    } else {
                        l.x += dx;
                        l.y += dy;
                        otherSpine.onLayerMove(dx, dy, 0, [this.layer]);
                    }
                }
            });
        });
    }

    // ─── LAYER MOVE PROPAGATION ───────────────────────────────────
    onLayerMove(dx, dy, dr = 0, excludeLayers = []) {
        if (this._syncing) return;

        if (!window.isDragAsReal) {
            this._renderAllSpines();
            return;
        }

        this._syncing = true;

        // 1. MASTER -> SLAVE (Push)
        this.bones.forEach(bone => {
            if (bone.linkMode === 'master' && bone.rigLink && bone.rigLink.spine) {
                const targetSpine = bone.rigLink.spine;
                const targetLayer = targetSpine.layer;
                if (excludeLayers.some(ex => ex === targetLayer || ex === targetLayer.element)) return;

                const slaveBone = targetSpine.bones.get(bone.rigLink.boneId);
                const jt = slaveBone ? (slaveBone.joint?.type || 'fixed') : 'fixed';
                const fixedLen = bone.rigLink.fixedLength || 0;

                if (jt === 'pivot' || jt === 'ball') {
                    const drDelta = this._orbitLayerAroundAnchor(this.layer, targetLayer, slaveBone, fixedLen, dx, dy, jt === 'ball');

                    let nextDr = dr;
                    // Ball sync: master tool rotation propagates to slave
                    if (jt === 'ball' && bone.joint?.type === 'ball') {
                        if (dr !== 0) targetLayer.rotation += dr;
                        // Add the orbital swing to the next node
                        nextDr += drDelta;
                    }

                    targetSpine.onLayerMove(dx, dy, nextDr, [...excludeLayers, this.layer]);
                } else {
                    targetLayer.x += dx;
                    targetLayer.y += dy;
                    targetSpine.onLayerMove(dx, dy, dr, [...excludeLayers, this.layer]);
                }
            }
        });

        // 2. SLAVE -> MASTER (Pull)
        if (window.layers) {
            window.layers.forEach(l => {
                const otherSpine = l.spine || (l.__layerInstance ? l.__layerInstance.spine : null);
                if (!otherSpine || otherSpine === this) return;

                otherSpine.bones.forEach(masterBone => {
                    if (masterBone.linkMode === 'master' && masterBone.rigLink && masterBone.rigLink.spine === this) {
                        if (excludeLayers.some(ex => ex === l || ex === l.element)) return;

                        const slaveId = masterBone.rigLink.boneId;
                        const slaveBone = this.bones.get(slaveId);
                        const jt = slaveBone ? (slaveBone.joint?.type || 'fixed') : 'fixed';
                        const fixedLen = masterBone.rigLink.fixedLength || 0;

                        if (jt === 'pivot' || jt === 'ball') {
                            const drDelta = this._orbitLayerAroundAnchor(l, this.layer, slaveBone, fixedLen, dx, dy, jt === 'ball');

                            let nextDr = dr;
                            if (jt === 'ball' && slaveBone.joint?.type === 'ball' && masterBone.joint?.type === 'ball') {
                                if (dr !== 0) l.rotation += dr;
                                nextDr += drDelta;
                            }
                            otherSpine.onLayerMove(dx, dy, nextDr, [...excludeLayers, this.layer]);
                        } else {
                            l.x += dx;
                            l.y += dy;
                            otherSpine.onLayerMove(dx, dy, dr, [...excludeLayers, this.layer]);
                        }
                    }
                });
            });
        }

        this._renderAllSpines();
        this._syncing = false;
    }

    _orbitLayerAroundAnchor(movingLayer, anchorLayer, anchorBone, fixedLen, dx, dy, isBall) {
        if (!anchorBone.element || !movingLayer.element) return 0;

        const zoom = window.currentScale || 1;
        const aRect = anchorBone.element.getBoundingClientRect();
        const anchorX = aRect.left + aRect.width / 2;
        const anchorY = aRect.top + aRect.height / 2;

        const mRect = movingLayer.element.getBoundingClientRect();
        const curX = mRect.left + mRect.width / 2;
        const curY = mRect.top + mRect.height / 2;

        // Current distance and angle
        const distX = curX - anchorX;
        const distY = curY - anchorY;
        const currentAngle = Math.atan2(distY, distX);

        let angleDelta = 0;
        if (fixedLen > 0) {
            // SATISFY CONSTRAINT: Force distance to fixedLen
            const targetX = anchorX + fixedLen * Math.cos(currentAngle);
            const targetY = anchorY + fixedLen * Math.sin(currentAngle);

            // Apply correction to layer coordinates
            movingLayer.x += (targetX - curX) / zoom;
            movingLayer.y += (targetY - curY) / zoom;

            // ROTATION LOGIC: Calculate angular change induced by drag
            const prevDistX = (curX - dx * zoom) - anchorX;
            const prevDistY = (curY - dy * zoom) - anchorY;
            const prevAngle = Math.atan2(prevDistY, prevDistX);
            angleDelta = (currentAngle - prevAngle) * 180 / Math.PI;

            movingLayer.rotation += angleDelta;

            if (isBall && anchorLayer) {
                // Ball joint: Slave also reacts to rotational tension
                anchorLayer.rotation += angleDelta * 0.4;
            }
        }
        return angleDelta;
    }

    // ─── CONNECTION ───────────────────────────────────────────────
    connectToSlave(masterBoneId) {
        const masterBone = this.bones.get(masterBoneId);
        if (!masterBone) return false;

        masterBone.linkMode = 'master';
        if (!window.layers) return false;

        for (const l of window.layers) {
            const otherSpine = l.spine || (l.__layerInstance ? l.__layerInstance.spine : null);
            if (!otherSpine || otherSpine === this) continue;

            for (const [id, b] of otherSpine.bones) {
                if (b.linkMode === 'slave') {
                    // Calculate fixed length based on current visual positions
                    let fixedLen = 0;
                    if (masterBone.element && b.element) {
                        const r1 = masterBone.element.getBoundingClientRect();
                        const r2 = b.element.getBoundingClientRect();
                        const dx = (r1.left + r1.width / 2) - (r2.left + r2.width / 2);
                        const dy = (r1.top + r1.height / 2) - (r2.top + r2.height / 2);
                        fixedLen = Math.sqrt(dx * dx + dy * dy);
                    }

                    masterBone.rigLink = {
                        spine: otherSpine,
                        boneId: id,
                        fixedLength: fixedLen,
                        targetLayerId: l.id
                    };
                    this.render();
                    this.save();
                    otherSpine.render();
                    return true;
                }
            }
        }
        return false;
    }

    disconnectBone(boneId) {
        const bone = this.bones.get(boneId);
        if (!bone) return;

        if (bone.rigLink) {
            const trans = this.getGlobalBoneTransform(bone);
            const overlay = document.getElementById('spine-global-overlay');
            const layerEl = this.layer.element;
            if (trans && overlay && layerEl) {
                const oRect = overlay.getBoundingClientRect();
                const lRect = layerEl.getBoundingClientRect();
                const screenX = trans.x + oRect.left;
                const screenY = trans.y + oRect.top;
                bone.x = ((screenX - lRect.left) / (lRect.width || 1)) * 100;
                bone.y = ((screenY - lRect.top) / (lRect.height || 1)) * 100;
            }
        }

        bone.rigLink = null;
        this.render();
        this.save();
    }

    // ─── UTILS ────────────────────────────────────────────────────
    ensureContainer() {
        this.container = document.getElementById('spine-global-overlay');
        return !!this.container;
    }

    getGlobalBoneTransform(bone, _recursionSet = new Set()) {
        if (!this.layer.element || !window.showGlobalBones) return null;
        if (_recursionSet.has(bone)) return null;
        _recursionSet.add(bone);

        if (bone.linkMode === 'master' && bone.rigLink) {
            const ts = bone.rigLink.spine;
            const tb = ts ? ts.bones.get(bone.rigLink.boneId) : null;
            if (tb) {
                const trans = ts.getGlobalBoneTransform(tb, _recursionSet);
                if (trans) return { ...trans };
            } else {
                bone.rigLink = null;
            }
        }

        const container = document.getElementById('spine-global-overlay');
        if (!container) return null;
        const cRect = container.getBoundingClientRect();
        const lRect = this.layer.element.getBoundingClientRect();

        const lCenterX = lRect.left + lRect.width / 2;
        const lCenterY = lRect.top + lRect.height / 2;

        const lw = this.layer.width || (lRect.width / (this.layer.scale || 1));
        const lh = this.layer.height || (lRect.height / (this.layer.scale || 1));

        const s = this.layer.scale || 1;
        const rad = (this.layer.rotation || 0) * Math.PI / 180;

        const offX = ((bone.x - 50) / 100) * lw * Math.abs(s);
        const offY = ((bone.y - 50) / 100) * lh * Math.abs(s);

        const cosR = Math.cos(rad);
        const sinR = Math.sin(rad);

        return {
            x: lCenterX + (offX * cosR - offY * sinR) - cRect.left,
            y: lCenterY + (offX * sinR + offY * cosR) - cRect.top,
            rotation: (this.layer.rotation || 0) + (bone.rotation || 0),
            scale: Math.abs(s)
        };
    }

    syncLayerPivot() {
        if (!this.rootBoneId || !this.bones.has(this.rootBoneId)) return;
        const root = this.bones.get(this.rootBoneId);
        if (typeof this.layer.setPivot === 'function') {
            this.layer.setPivot(root.x, root.y, true);
        }
    }

    // ─── ADD/DELETE/RENDER ────────────────────────────────────────
    addBone(parentId = null) {
        let x = 50, y = 50;
        if (parentId && this.bones.has(parentId)) {
            const p = this.bones.get(parentId);
            x = p.x; y = p.y + 15;
        } else if (!this.rootBoneId) {
            x = 50; y = 50;
        }

        const bone = new window.Bone(null, null, x, y);
        if (parentId && this.bones.has(parentId)) {
            bone.setParent(parentId);
            this.bones.get(parentId).addChild(bone.id);
        } else if (!this.rootBoneId) {
            this.rootBoneId = bone.id;
            bone.name = "Root";
        }

        this.bones.set(bone.id, bone);
        this.selectBone(bone.id);
        this.save();
        this.render();
        return bone;
    }

    deleteBone(boneId) {
        const bone = this.bones.get(boneId);
        if (!bone) return;

        // If it was root, pick another as root if available
        if (boneId === this.rootBoneId) {
            const nextRoot = Array.from(this.bones.keys()).find(id => id !== boneId);
            this.rootBoneId = nextRoot || null;
        }

        // Reparent children to bone's parent
        if (bone.children) {
            bone.children.forEach(cid => {
                const child = this.bones.get(cid);
                if (child) {
                    child.parentId = bone.parentId;
                    if (bone.parentId) {
                        const p = this.bones.get(bone.parentId);
                        if (p) p.addChild(cid);
                    }
                }
            });
        }

        if (bone.parentId && this.bones.has(bone.parentId)) {
            this.bones.get(bone.parentId).removeChild(boneId);
        }

        if (bone.element) bone.element.remove();
        if (bone.line) bone.line.remove();
        this.bones.delete(boneId);
        this.selectedBoneId = null;
        this.save();
        this.render();
    }

    render() {
        if (!this.ensureContainer() || !window.showGlobalBones) {
            this.bones.forEach(b => {
                if (b.element) b.element.style.display = 'none';
                if (b.line) b.line.style.display = 'none';
            });
            return;
        }
        this.bones.forEach(b => b.render(this.container, this.bones, this.getGlobalBoneTransform(b)));
    }

    _renderAllSpines() {
        if (window.layers) {
            window.layers.forEach(l => {
                const s = l.spine || (l.__layerInstance ? l.__layerInstance.spine : null);
                if (s) s.render();
            });
        }
    }

    // ─── PERSISTENCE ──────────────────────────────────────────────
    save() {
        const data = {
            rootBoneId: this.rootBoneId,
            showBones: this.showBones,
            bones: Array.from(this.bones.values()).map(b => b.toJSON())
        };
        localStorage.setItem(`spine_${this.layer.id}`, JSON.stringify(data));
    }

    load() {
        try {
            const raw = localStorage.getItem(`spine_${this.layer.id}`);
            if (!raw) return;
            const data = JSON.parse(raw);
            this.rootBoneId = data.rootBoneId;
            this.showBones = data.showBones !== undefined ? data.showBones : true;
            if (data.bones) {
                data.bones.forEach(bData => {
                    const bone = window.Bone.fromJSON(bData);
                    this.bones.set(bone.id, bone);
                });

                // Post-load: Resolve Rig Links from IDs
                setTimeout(() => this._resolveRigLinks(), 100);
            }
        } catch (e) {
            console.warn('[Spine] Load failed:', e);
        }
    }

    _resolveRigLinks() {
        this.bones.forEach(bone => {
            if (bone.rigLink && bone.rigLink.targetLayerId) {
                const targetId = bone.rigLink.targetLayerId;
                const targetLayer = window.layers?.find(l => l.id === targetId);
                const targetSpine = targetLayer ? (targetLayer.spine || targetLayer.__layerInstance?.spine) : null;
                if (targetSpine) {
                    bone.rigLink.spine = targetSpine;
                }
            }
        });
    }
}

window.Spine = Spine;