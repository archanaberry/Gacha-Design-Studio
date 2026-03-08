/**
 * Joint.js
 * Defines the constraints and properties of a connection between bones.
 */
class Joint {
    constructor(type = 'fixed', limits = {}) {
        this.type = type; // 'fixed', 'hinge', 'ball', 'spring', etc.
        this.limits = {
            min: limits.min || -180,
            max: limits.max || 180,
            locked: limits.locked || false,
            ...limits
        };

        // Physics/Simulation properties (for future use)
        this.stiffness = 0.5;
        this.damping = 0.1;
    }

    /**
     * Updates the joint type
     * @param {string} type - 'fixed', 'hinge', 'pivot', 'ball', 'plane'
     */
    setType(type) {
        const allowedTypes = ['fixed', 'hinge', 'pivot', 'ball', 'plane', 'spring', 'flex', 'elastic', 'soft', 'fluid', 'custom'];
        if (allowedTypes.includes(type)) {
            this.type = type;
        } else {
            console.warn(`[Joint] Unknown joint type: ${type}, defaulting to fixed`);
            this.type = 'fixed';
        }
    }

    /**
     * Checks if a rotation is within limits
     * @param {number} angle - Input angle in degrees
     * @returns {number} - Clamped angle
     */
    constrain(angle) {
        if (this.type === 'fixed') return 0;
        if (this.limits.locked) return 0;

        // Normalize angle to -180 to 180
        let normAngle = ((angle + 180) % 360) - 180;

        return Math.max(this.limits.min, Math.min(this.limits.max, normAngle));
    }

    toJSON() {
        return {
            type: this.type,
            limits: this.limits,
            stiffness: this.stiffness,
            damping: this.damping
        };
    }

    static fromJSON(data) {
        const joint = new Joint(data.type, data.limits);
        joint.stiffness = data.stiffness || 0.5;
        joint.damping = data.damping || 0.1;
        return joint;
    }
}

// Global exposure
window.Joint = Joint;
