/**
 * Multi-Touch Handler untuk mendukung 10+ jari simultan
 * Digunakan untuk drag layer di layar sentuh dengan efisiensi maksimal
 * 
 * Fitur:
 * - Support unlimited touches (10+ jari)
 * - Efficient delta calculation dari centroid semua touch points
 * - Automatic cleanup dan memory management
 * - Support untuk mouse dan touch events
 */

class MultiTouchHandler {
    constructor(options = {}) {
        this.activeLayerTouches = new Map(); // Map<layerId, Set<touchId>>
        this.touchPositions = new Map(); // Map<touchId, {x, y, clientX, clientY}>
        this.layerDragState = new Map(); // Map<layerId, {startCentroid, currentCentroid}>
        
        this.options = {
            maxTouches: 10, // Can handle more, but 10+ is practical for mobile
            useCentroid: true, // Gunakan centroid semua touches
            preventDefaults: true,
            ...options
        };

        this.isAnyLayerDragging = false;
    }

    /**
     * Register layer untuk multi-touch tracking
     * @param {HTMLElement} element - Layer element
     * @param {String} layerId - Unique layer identifier
     * @param {Function} onDragStart - Callback saat drag dimulai
     * @param {Function} onDrag - Callback saat drag (mendapat delta x, y)
     * @param {Function} onDragEnd - Callback saat drag selesai
     */
    registerLayer(element, layerId, onDragStart, onDrag, onDragEnd) {
        if (!element || !layerId) return;

        // Initialize layer tracking
        if (!this.activeLayerTouches.has(layerId)) {
            this.activeLayerTouches.set(layerId, new Set());
            this.layerDragState.set(layerId, null);
        }

        // Store callbacks
        if (!this._callbacks) this._callbacks = new Map();
        this._callbacks.set(layerId, {
            onDragStart,
            onDrag,
            onDragEnd
        });

        // Attach event listeners
        element.addEventListener('touchstart', (e) => this.onTouchStart(e, layerId));
        element.addEventListener('touchmove', (e) => this.onTouchMove(e, layerId));
        element.addEventListener('touchend', (e) => this.onTouchEnd(e, layerId));
        element.addEventListener('touchcancel', (e) => this.onTouchCancel(e, layerId));
        
        // Mouse support
        element.addEventListener('mousedown', (e) => this.onMouseDown(e, layerId));
    }

    /**
     * Hitung centroid dari semua touch points
     * @param {Set<String>} touchIds - Set of touch identifiers
     * @returns {Object} {x, y, clientX, clientY}
     */
    calculateCentroid(touchIds) {
        if (touchIds.size === 0) return null;

        let sumX = 0, sumY = 0, sumClientX = 0, sumClientY = 0;
        
        for (const touchId of touchIds) {
            const pos = this.touchPositions.get(touchId);
            if (pos) {
                sumX += pos.x;
                sumY += pos.y;
                sumClientX += pos.clientX;
                sumClientY += pos.clientY;
            }
        }

        const count = touchIds.size;
        return {
            x: sumX / count,
            y: sumY / count,
            clientX: sumClientX / count,
            clientY: sumClientY / count
        };
    }

    /**
     * Handle touch start
     */
    onTouchStart(e, layerId) {
        if (this.options.preventDefaults) {
            e.preventDefault();
        }

        const touchIds = this.activeLayerTouches.get(layerId);
        if (!touchIds) return;

        // Add all touches dari event
        for (let i = 0; i < e.touches.length; i++) {
            const touch = e.touches[i];
            const touchId = `touch_${touch.identifier}`;
            
            this.touchPositions.set(touchId, {
                x: touch.clientX,
                y: touch.clientY,
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            
            touchIds.add(touchId);
        }

        // Calculate start centroid
        const centroid = this.calculateCentroid(touchIds);
        if (!centroid) return;

        this.layerDragState.set(layerId, {
            startCentroid: { ...centroid },
            currentCentroid: { ...centroid }
        });

        this.isAnyLayerDragging = true;

        // Call onDragStart callback
        const callbacks = this._callbacks?.get(layerId);
        if (callbacks?.onDragStart) {
            callbacks.onDragStart(e, layerId, touchIds.size);
        }
    }

    /**
     * Handle touch move
     */
    onTouchMove(e, layerId) {
        if (this.options.preventDefaults) {
            e.preventDefault();
        }

        const touchIds = this.activeLayerTouches.get(layerId);
        if (!touchIds || touchIds.size === 0) return;

        const dragState = this.layerDragState.get(layerId);
        if (!dragState) return;

        // Update touch positions
        for (let i = 0; i < e.touches.length; i++) {
            const touch = e.touches[i];
            const touchId = `touch_${touch.identifier}`;
            
            if (touchIds.has(touchId)) {
                this.touchPositions.set(touchId, {
                    x: touch.clientX,
                    y: touch.clientY,
                    clientX: touch.clientX,
                    clientY: touch.clientY
                });
            }
        }

        // Calculate current centroid
        const currentCentroid = this.calculateCentroid(touchIds);
        if (!currentCentroid) return;

        dragState.currentCentroid = currentCentroid;

        // Calculate delta dari start centroid
        const dx = currentCentroid.clientX - dragState.startCentroid.clientX;
        const dy = currentCentroid.clientY - dragState.startCentroid.clientY;

        // Call onDrag callback dengan delta
        const callbacks = this._callbacks?.get(layerId);
        if (callbacks?.onDrag) {
            callbacks.onDrag(e, layerId, dx, dy, touchIds.size);
        }
    }

    /**
     * Handle touch end
     */
    onTouchEnd(e, layerId) {
        if (this.options.preventDefaults) {
            e.preventDefault();
        }

        const touchIds = this.activeLayerTouches.get(layerId);
        if (!touchIds) return;

        // Remove ended touches
        for (let i = 0; i < e.changedTouches.length; i++) {
            const touch = e.changedTouches[i];
            const touchId = `touch_${touch.identifier}`;
            
            touchIds.delete(touchId);
            this.touchPositions.delete(touchId);
        }

        // If no more touches, call onDragEnd
        if (touchIds.size === 0) {
            const callbacks = this._callbacks?.get(layerId);
            if (callbacks?.onDragEnd) {
                callbacks.onDragEnd(e, layerId);
            }

            this.layerDragState.set(layerId, null);
            this.isAnyLayerDragging = this._hasActiveDrags();
        }
    }

    /**
     * Handle touch cancel
     */
    onTouchCancel(e, layerId) {
        const touchIds = this.activeLayerTouches.get(layerId);
        if (!touchIds) return;

        // Remove all touches
        for (let i = 0; i < e.changedTouches.length; i++) {
            const touch = e.changedTouches[i];
            const touchId = `touch_${touch.identifier}`;
            
            touchIds.delete(touchId);
            this.touchPositions.delete(touchId);
        }

        if (touchIds.size === 0) {
            const callbacks = this._callbacks?.get(layerId);
            if (callbacks?.onDragEnd) {
                callbacks.onDragEnd(e, layerId);
            }

            this.layerDragState.set(layerId, null);
            this.isAnyLayerDragging = this._hasActiveDrags();
        }
    }

    /**
     * Handle mouse down (untuk compatibility)
     */
    onMouseDown(e, layerId) {
        // Jika ada active touches, ignore mouse
        const touchIds = this.activeLayerTouches.get(layerId);
        if (touchIds && touchIds.size > 0) return;

        const touchId = 'mouse_primary';
        
        this.touchPositions.set(touchId, {
            x: e.clientX,
            y: e.clientY,
            clientX: e.clientX,
            clientY: e.clientY
        });
        
        touchIds.add(touchId);

        const centroid = this.calculateCentroid(touchIds);
        if (!centroid) return;

        this.layerDragState.set(layerId, {
            startCentroid: { ...centroid },
            currentCentroid: { ...centroid }
        });

        this.isAnyLayerDragging = true;

        const callbacks = this._callbacks?.get(layerId);
        if (callbacks?.onDragStart) {
            callbacks.onDragStart(e, layerId, 1);
        }

        // Attach document listeners untuk mouse move
        const onMouseMove = (e) => {
            this.touchPositions.set(touchId, {
                x: e.clientX,
                y: e.clientY,
                clientX: e.clientX,
                clientY: e.clientY
            });

            const currentCentroid = this.calculateCentroid(touchIds);
            if (!currentCentroid) return;

            const dragState = this.layerDragState.get(layerId);
            if (dragState) {
                dragState.currentCentroid = currentCentroid;
                const dx = currentCentroid.clientX - dragState.startCentroid.clientX;
                const dy = currentCentroid.clientY - dragState.startCentroid.clientY;

                if (callbacks?.onDrag) {
                    callbacks.onDrag(e, layerId, dx, dy, 1);
                }
            }
        };

        const onMouseUp = (e) => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);

            touchIds.delete(touchId);
            this.touchPositions.delete(touchId);

            if (callbacks?.onDragEnd) {
                callbacks.onDragEnd(e, layerId);
            }

            this.layerDragState.set(layerId, null);
            this.isAnyLayerDragging = this._hasActiveDrags();
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    }

    /**
     * Check if there are active drags
     */
    _hasActiveDrags() {
        for (const touchIds of this.activeLayerTouches.values()) {
            if (touchIds.size > 0) return true;
        }
        return false;
    }

    /**
     * Get active touch count untuk specific layer
     */
    getActiveTouchCount(layerId) {
        const touchIds = this.activeLayerTouches.get(layerId);
        return touchIds ? touchIds.size : 0;
    }

    /**
     * Get all active touches count
     */
    getTotalActiveTouches() {
        let total = 0;
        for (const touchIds of this.activeLayerTouches.values()) {
            total += touchIds.size;
        }
        return total;
    }

    /**
     * Cleanup dan cleanup resources
     */
    destroy() {
        this.activeLayerTouches.clear();
        this.touchPositions.clear();
        this.layerDragState.clear();
        this._callbacks?.clear();
        this.isAnyLayerDragging = false;
    }
}

// Export untuk digunakan di module lain
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MultiTouchHandler;
}
