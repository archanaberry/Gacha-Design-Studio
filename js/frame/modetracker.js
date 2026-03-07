/**
 * Mode System Debugger
 * File: js/frame/modetracker.js
 * 
 * Utility untuk tracking dan debugging mode changes
 * Dipanggil dari console: modeTracker.getCurrentMode(), modeTracker.log()
 */

window.modeTracker = {
  modes: {
    loading: 'Loading splash & spinner',
    titlemenu: 'Title screen (tap screen visible)',
    mainmenu: 'Main menu (layer2 visible)',
    studiopose: 'Studio Pose',
    studiosandbox: 'Studio Sandbox'
  },

  getCurrentMode: function() {
    return window.getPageMode ? window.getPageMode() : 'unknown';
  },

  getCurrentModeDescription: function() {
    const mode = this.getCurrentMode();
    return this.modes[mode] || 'Unknown mode: ' + mode;
  },

  getURL: function() {
    return window.location.href;
  },

  log: function() {
    console.log('=== MODE TRACKER ===');
    console.log('Current Mode:', this.getCurrentMode());
    console.log('Description:', this.getCurrentModeDescription());
    console.log('Full URL:', this.getURL());
    console.log('===================');
  }
};

// Auto log on page load
console.log('%c[Mode Tracker] Ready!', 'color: green; font-weight: bold;');
console.log('Available methods:');
console.log('  - modeTracker.getCurrentMode()');
console.log('  - modeTracker.getCurrentModeDescription()');
console.log('  - modeTracker.getURL()');
console.log('  - modeTracker.log()');
