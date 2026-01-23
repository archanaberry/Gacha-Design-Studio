/****************************************************************/
//                                                              //
//  -------------------Gacha Design Studio--------------------  //
//  Created by: Archana Berry                                   //
//  Assets credits: Lunime, OGL (Open Game License), MIT CC     //
//  Version resource: v0.001_alpha                              //
//  File: bgconfig.js                                           //
//  Type: module[config]                                        //
//  Desc: Background configuration for panels with localStorage //
//                                                              //
//  ----------------------------------------------------------  //
//                                                              //
//  ---- Do not use this as a gacha design game as        ----  //
//  ---- template, or modifying it to make a other        ----  //
//  ---- version, than this without Archana Berry's       ----  //
//  ---- permission's, except to help with repairs or     ----  //
//  ---- updates art assets and etc with contributing     ----  //
//                                                              //
//**************************************************************//
// Please patient for release Gacha Design Studio in Playstore UwU

// bgconfig.js
// Configuration for background images and opacity for all panels

/**
 * Default background configuration for all panels
 * @type {Object}
 */
const defaultBgConfig = {
    panel1: {
        imageUrl: "assets/background/studio0.png",
        opacity: 100
    },
    panel2: {
        imageUrl: null,
        opacity: 100
    },
    panel3: {
        imageUrl: null,
        opacity: 100
    }
};

/**
 * Load background configuration from localStorage
 * @param {string} panelId - Panel ID (panel1, panel2, or panel3)
 * @returns {Object} Background configuration
 */
function loadBgConfig(panelId) {
    const key = `bgConfig_${panelId}`;
    const saved = localStorage.getItem(key);
    
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch (e) {
            console.error(`Failed to parse bgConfig for ${panelId}:`, e);
            return defaultBgConfig[panelId];
        }
    }
    
    return defaultBgConfig[panelId];
}

/**
 * Save background configuration to localStorage
 * @param {string} panelId - Panel ID (panel1, panel2, or panel3)
 * @param {Object} config - Configuration object with imageUrl and opacity
 */
function saveBgConfig(panelId, config) {
    const key = `bgConfig_${panelId}`;
    try {
        localStorage.setItem(key, JSON.stringify(config));
    } catch (e) {
        console.error(`Failed to save bgConfig for ${panelId}:`, e);
    }
}

/**
 * Apply saved background configuration to a panel
 * @param {string} panelId - Panel ID
 */
function applyBgConfig(panelId) {
    const panel = document.getElementById(panelId);
    if (!panel) {
        console.warn(`Panel ${panelId} not found`);
        return;
    }
    
    const config = loadBgConfig(panelId);
    
    if (config.imageUrl) {
        panel.style.backgroundImage = `url('${config.imageUrl}')`;
    }
    
    if (config.opacity !== undefined && config.opacity !== null) {
        panel.style.opacity = config.opacity / 100;
    }
}

/**
 * Update background configuration for a panel
 * @param {string} panelId - Panel ID
 * @param {string} imageUrl - Image URL (optional)
 * @param {number} opacity - Opacity value 0-100 (optional)
 */
function updateBgConfig(panelId, imageUrl, opacity) {
    const config = loadBgConfig(panelId);
    
    if (imageUrl !== undefined) {
        config.imageUrl = imageUrl;
    }
    
    if (opacity !== undefined) {
        config.opacity = opacity;
    }
    
    saveBgConfig(panelId, config);
    applyBgConfig(panelId);
}

/**
 * Reset background configuration for a panel to default
 * @param {string} panelId - Panel ID
 */
function resetBgConfig(panelId) {
    const config = {
        imageUrl: null,
        opacity: 100
    };
    
    saveBgConfig(panelId, config);
    applyBgConfig(panelId);
}

/**
 * Apply all saved configurations on page load
 */
function applyAllBgConfigs() {
    ['panel1', 'panel2', 'panel3'].forEach(panelId => {
        applyBgConfig(panelId);
    });
}

/**
 * Clear all background configurations
 */
function clearAllBgConfigs() {
    ['panel1', 'panel2', 'panel3'].forEach(panelId => {
        localStorage.removeItem(`bgConfig_${panelId}`);
    });
}

// Apply saved configurations when page loads
document.addEventListener('DOMContentLoaded', function() {
    applyAllBgConfigs();
});

// Also apply on window load as backup
window.addEventListener('load', function() {
    applyAllBgConfigs();
});
