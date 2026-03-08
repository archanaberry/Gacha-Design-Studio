/**
 * menurigging.js
 * UI Controller for the Rigging System.
 * Injects panel into the interface and communicates with the active Spine instance.
 */
class RiggingMenu {
    constructor() {
        this.activeSpine = null;
        this.container = null;
        window.isDragAsReal = false; // Initial state

        this.initUI();
        this.bindGlobalEvents();
    }

    initUI() {
        console.log('[RiggingMenu] Initializing UI...');

        this.panelHTML = `
            <div id="riggingMenu" style="display:none; margin-bottom: 5px; border: 2px solid #5E6CC9; padding: 10px; background-color: #f0f4ff; border-radius: 12px; font-family: 'Comfortaa', sans-serif;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 12px; background: white; padding: 6px; border-radius: 8px;">
                    <div style="display: flex; flex-direction: column; gap: 4px;">
                        <label style="font-size: 11px; font-weight: bold; cursor: pointer; display: flex; align-items: center; gap: 5px;">
                            <input type="checkbox" id="showBoneToggle" checked style="width: 15px; height: 15px; cursor: pointer;"> Visual Tulang
                        </label>
                        <label style="font-size: 11px; font-weight: bold; cursor: pointer; display: flex; align-items: center; gap: 5px; color: #E91E63;">
                            <input type="checkbox" id="darToggle" style="width: 15px; height: 15px; cursor: pointer;"> Drag as Real (DAR)
                        </label>
                    </div>
                    <div id="riggingStatus" style="font-size: 10px; color: #888;">No Active Bone</div>
                </div>

                <div style="display: flex; gap: 5px; margin-bottom: 10px;">
                    <button id="addBoneBtn" style="flex:1; padding: 6px; background: #4CAF50; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: bold;">+ Add Bone</button>
                    <button id="deleteBoneBtn" style="flex:1; padding: 6px; background: #F44336; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: bold;">Delete Bone</button>
                </div>

                <!-- Bone Properties -->
                <div id="boneProperties" style="display:none; background: white; padding: 10px; border-radius: 8px;">
                     <div style="margin-bottom: 8px;">
                        <label style="font-size: 11px; font-weight: bold;">Name</label>
                        <input type="text" id="boneNameInput" style="width: 100%; border: 1px solid #ddd; padding: 4px; border-radius: 4px;">
                     </div>

                     <!-- Rig Link Connection (For all bones) -->
                     <div id="boneLinkSection" style="margin-bottom: 8px; border: 1px dashed #5E6CC9; padding: 6px; border-radius: 6px; display: none;">
                        <label style="font-size: 11px; font-weight: bold; color: #5E6CC9;">🔗 Rig Link (Global)</label>
                        <select id="boneLinkMode" style="width: 100%; padding: 4px; border: 1px solid #ddd; border-radius: 4px; font-size: 11px;">
                            <option value="none">Independent</option>
                            <option value="master">Master (Transmitter)</option>
                            <option value="slave">Slave (Receiver)</option>
                        </select>
                        <button id="connectBoneBtn" style="width: 100%; margin-top: 5px; padding: 4px; background: #4CAF50; color: white; border: 1px solid #388E3C; border-radius: 4px; font-size: 10px; font-weight: bold; cursor: pointer;">🔗 Sambungkan ke Slave</button>
                        <button id="unlinkBoneBtn" style="width: 100%; margin-top: 5px; padding: 4px; background: #FFEB3B; color: #333; border: 1px solid #ccc; border-radius: 4px; font-size: 10px; font-weight: bold; cursor: pointer;">⛓ Putuskan Tautan</button>
                     </div>
                     
                     <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 8px;">
                        <div>
                            <label style="font-size: 11px; font-weight: bold;">Pos X (%)</label>
                            ${this.createNumberInput('boneX', 0, -500, 500)}
                        </div>
                        <div>
                            <label style="font-size: 11px; font-weight: bold;">Pos Y (%)</label>
                            ${this.createNumberInput('boneY', 0, -500, 500)}
                        </div>
                     </div>

                     <div style="margin-bottom: 8px;">
                        <label style="font-size: 11px; font-weight: bold; cursor: pointer; display: flex; align-items: center; gap: 5px;">
                            <input type="checkbox" id="clampBoneToggle" checked style="width: 14px; height: 14px; cursor: pointer;"> Masukan Lingkup (Clamp)
                        </label>
                     </div>

                     <div style="margin-bottom: 8px;">
                        <label style="font-size: 11px; font-weight: bold;">Joint Type</label>
                        <select id="jointTypeSelect" style="width: 100%; padding: 4px; border: 1px solid #ddd; border-radius: 4px;">
                            <option value="fixed">Fixed (Tetap)</option>
                            <option value="hinge">Hinge (Engsel)</option>
                            <option value="pivot">Pivot (Putar)</option>
                            <option value="ball">Ball (Bola/Rotasi Bebas)</option>
                            <option value="spring">Spring (Pegas)</option>
                            <option value="flex">Flex (Lentur)</option>
                            <option value="elastic">Elastic (Karet/Elastis)</option>
                            <option value="soft">Soft (Lunak/Bendera)</option>
                            <option value="fluid">Fluid (Cair/Slime)</option>
                            <option value="plane">Plane (Geser)</option>
                        </select>
                     </div>
                     
                     <div style="margin-bottom: 8px;">
                        <label style="font-size: 11px; font-weight: bold;">Rotation (°)</label>
                        ${this.createNumberInput('boneRotation', 0, -360, 360)}
                     </div>
                </div>
            </div>
        `;

        const panel2 = document.getElementById('panel2');
        if (panel2) {
            console.log('[RiggingMenu] panel2 found, injecting HTML');
            const temp = document.createElement('div');
            temp.innerHTML = this.panelHTML.trim();
            const menuEl = temp.firstElementChild;
            panel2.appendChild(menuEl);

            this.container = document.getElementById('riggingMenu');
            if (this.container) {
                console.log('[RiggingMenu] UI injected successfully');
                this.bindUIEvents();
            } else {
                console.error('[RiggingMenu] Failed to find injected riggingMenu element');
            }
        } else {
            console.warn('[RiggingMenu] panel2 not found. Is the script running in the correct context?');
        }
    }

    createNumberInput(id, value, min, max) {
        return `
            <div style="display: flex; align-items: center; gap: 2px;">
                <button class="step-btn" data-target="${id}" data-step="-1" style="width: 20px; border:1px solid #ddd; background:#eee; cursor:pointer;">-</button>
                <input type="number" id="${id}" value="${value}" min="${min}" max="${max}" style="flex: 1; text-align: center; border: 1px solid #ddd; padding: 2px;">
                <button class="step-btn" data-target="${id}" data-step="1" style="width: 20px; border:1px solid #ddd; background:#eee; cursor:pointer;">+</button>
            </div>
        `;
    }

    bindGlobalEvents() {
        console.log('[RiggingMenu] Binding global events...');
        document.addEventListener('layerSelected', (e) => {
            const layer = e.detail?.layer;
            console.log('[RiggingMenu] layerSelected event received:', layer?.name || 'none');
            if (layer) {
                this.attachToLayer(layer);
            } else {
                this.hide();
            }
        });

        // Listen for bone selection updates (from Spine class)
        window.addEventListener('spine-bone-selected', (e) => {
            if (this.activeSpine === e.detail.spine) {
                this.updateUIProps(e.detail.bone);
            }
        });
    }

    bindUIEvents() {
        document.getElementById('addBoneBtn').onclick = () => {
            if (this.activeSpine) {
                this.activeSpine.addBone(this.activeSpine.selectedBoneId);
            }
        };

        document.getElementById('deleteBoneBtn').onclick = () => {
            if (this.activeSpine && this.activeSpine.selectedBoneId) {
                this.activeSpine.deleteBone(this.activeSpine.selectedBoneId);
            }
        };

        document.getElementById('unlinkBoneBtn').onclick = () => {
            if (this.activeSpine && this.activeSpine.selectedBoneId) {
                this.activeSpine.disconnectBone(this.activeSpine.selectedBoneId);
                const bone = this.activeSpine.bones.get(this.activeSpine.selectedBoneId);
                if (bone) {
                    bone.linkMode = 'none';
                    this.updateUIProps(bone);
                    this.activeSpine.save();
                }
            }
        };

        document.getElementById('connectBoneBtn').onclick = () => {
            if (this.activeSpine && this.activeSpine.selectedBoneId) {
                const success = this.activeSpine.connectToSlave(this.activeSpine.selectedBoneId);
                if (success) {
                    const bone = this.activeSpine.bones.get(this.activeSpine.selectedBoneId);
                    this.updateUIProps(bone);
                    alert('🔗 Berhasil tersambung ke Slave!');
                } else {
                    alert('⚠️ Tidak ada bone Slave di layer lain. Pastikan bone lain di-set ke mode "Slave".');
                }
            }
        };

        // Input bindings
        const inputs = ['boneNameInput', 'boneX', 'boneY', 'boneRotation', 'jointTypeSelect', 'boneLinkMode', 'clampBoneToggle'];
        inputs.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('change', () => this.pushChangesToBone());
                el.addEventListener('input', () => this.pushChangesToBone()); // Realtime
            }
        });

        const darToggle = document.getElementById('darToggle');
        if (darToggle) {
            darToggle.onchange = (e) => {
                window.isDragAsReal = e.target.checked;
            };
        }

        const showToggle = document.getElementById('showBoneToggle');
        if (showToggle) {
            showToggle.onchange = (e) => {
                if (this.activeSpine) {
                    this.activeSpine.showBones = e.target.checked;
                    this.activeSpine.render();
                    this.activeSpine.save(); // Persist visibility state
                }
            };
        }

        // Step buttons
        this.container.querySelectorAll('.step-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = document.getElementById(btn.dataset.target);
                if (target) {
                    target.value = parseInt(target.value) + parseInt(btn.dataset.step);
                    target.dispatchEvent(new Event('change'));
                }
            });
        });
    }

    attachToLayer(layer) {
        // If layer doesn't have a spine, create one (lazy load) or just check visual
        // We probably only want this for certain layer types or always? User said "modular like textshape"
        // Let's instantiate Spine if it doesn't exist

        if (!layer.spine) {
            layer.spine = new window.Spine(layer);
        }

        this.activeSpine = layer.spine;

        // Sync show toggle
        const showToggle = document.getElementById('showBoneToggle');
        if (showToggle) showToggle.checked = (this.activeSpine.showBones !== false);

        this.show();
        this.activeSpine.render();
    }

    updateUIProps(bone) {
        const propsDiv = document.getElementById('boneProperties');
        const statusDiv = document.getElementById('riggingStatus');

        if (!bone) {
            propsDiv.style.display = 'none';
            statusDiv.textContent = 'No Bone Selected';
            return;
        }

        propsDiv.style.display = 'block';
        statusDiv.textContent = `Selected: ${bone.name}`;

        // Show Rig Link Menu for all bones
        const connDiv = document.getElementById('boneLinkSection');
        if (connDiv) connDiv.style.display = 'block';

        document.getElementById('boneNameInput').value = bone.name;
        document.getElementById('boneX').value = bone.x;
        document.getElementById('boneY').value = bone.y;
        document.getElementById('boneRotation').value = bone.rotation;
        document.getElementById('jointTypeSelect').value = bone.joint.type;
        if (document.getElementById('boneLinkMode')) document.getElementById('boneLinkMode').value = bone.linkMode || 'none';
        if (document.getElementById('clampBoneToggle')) document.getElementById('clampBoneToggle').checked = bone.clamp !== false;
    }

    pushChangesToBone() {
        if (!this.activeSpine || !this.activeSpine.selectedBoneId) return;

        const bone = this.activeSpine.bones.get(this.activeSpine.selectedBoneId);
        if (!bone) return;

        bone.name = document.getElementById('boneNameInput').value;
        bone.x = parseFloat(document.getElementById('boneX').value);
        bone.y = parseFloat(document.getElementById('boneY').value);
        bone.rotation = parseFloat(document.getElementById('boneRotation').value);

        const type = document.getElementById('jointTypeSelect').value;
        if (bone.joint.type !== type) bone.joint.setType(type);

        if (document.getElementById('boneLinkMode')) {
            bone.linkMode = document.getElementById('boneLinkMode').value;
        }

        if (document.getElementById('clampBoneToggle')) {
            bone.clamp = document.getElementById('clampBoneToggle').checked;
        }

        this.activeSpine.render();
        this.activeSpine.save();
    }

    show() {
        if (this.container) this.container.style.display = 'block';
    }

    hide() {
        if (this.container) this.container.style.display = 'none';
        this.activeSpine = null;
    }
}

// Auto-init
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.riggingMenu = new RiggingMenu());
} else {
    window.riggingMenu = new RiggingMenu();
}
