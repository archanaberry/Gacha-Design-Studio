/****************************************************************/
//                                                              //
//  -------------------Gacha Design Studio--------------------  //
//  Created by: Archana Berry                                   //
//  Assets credits: Lunime, OGL (Open Game License), MIT CC     //
//  Version resource: v0.001_alpha                              //
//  File: historywindow.js                                      //
//  Type: module[ui]                                            //
//  Desc: History Editor Window UI                              //
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

// historywindow.js - History Editor Window (depends on windowhandler.js)

(function() {
  // Add CSS for history window only (reuse fonts from windowhandler)
  const styleTag = document.createElement('style');
  styleTag.textContent = `
  .history-container{display:flex;width:100%;height:100%;min-height:400px}
  .history-sidebar{width:120px;border-right:2px solid #ddd;overflow-y:auto;display:flex;flex-direction:column;gap:10px;padding:10px;background:#f5f5f5}
  .history-item{display:flex;flex-direction:column;align-items:center;gap:5px;cursor:pointer;padding:5px;border:2px solid transparent;border-radius:5px;transition:all 0.2s}
  .history-item:hover{background:#e8e8e8;border-color:#5E6CC9}
  .history-item.active{background:#5E6CC9;border-color:#4a5ba7}
  .history-thumbnail{width:100px;height:100px;border:1px solid #999;border-radius:3px;background:white;object-fit:contain;display:flex;align-items:center;justify-content:center;font-size:10px;color:#999}
  .history-timestamp{font-size:9px;color:#666;text-align:center}
  .history-content{flex:1;display:flex;flex-direction:column;overflow-y:auto;padding:15px}
  .history-detail-title{font-family:"Comfortaa-Bold",sans-serif;font-size:16px;margin-bottom:15px;border-bottom:1px solid #ddd;padding-bottom:10px}
  .history-detail-section{margin-bottom:15px}
  .history-detail-label{font-family:"Comfortaa-Bold",sans-serif;font-size:12px;color:#666;text-transform:uppercase;margin-bottom:5px}
  .history-detail-value{font-family:"Comfortaa",sans-serif;font-size:13px;color:#333;padding:8px;background:#f9f9f9;border-left:3px solid #5E6CC9;border-radius:3px;word-break:break-word}
  .history-preview-image{width:100%;max-width:200px;height:auto;border:1px solid #ddd;border-radius:5px;margin-top:10px}
  .history-divider{height:1px;background:#ddd;margin:10px 0}
  .history-footer-buttons{display:flex;gap:10px;justify-content:flex-end;padding-top:10px;border-top:1px solid #ddd}
  .history-btn{padding:8px 16px;border:none;border-radius:5px;background:#5E6CC9;color:white;cursor:pointer;font-family:"Comfortaa",sans-serif;font-size:12px;transition:background 0.2s}
  .history-btn:hover{background:#4a5ba7}
  .history-btn:disabled{background:#ccc;cursor:not-allowed}
  .history-empty{display:flex;align-items:center;justify-content:center;height:100%;color:#999;font-family:"Comfortaa",sans-serif;text-align:center}
  `;
  document.head.appendChild(styleTag);

  // Open History Editor Window
  window.openHistoryWindow = function() {
    if (typeof window.openWindow !== 'function' || typeof window.HistoryManager === 'undefined') {
      console.error('Dependencies not loaded');
      return;
    }

    const data = window.HistoryManager.getHistory();
    const noData = '<div class="history-empty">No history yet</div>';
    
    let sidebar = data.length === 0 ? noData : data.map((item, i) => {
      const time = new Date(item.timestamp).toLocaleTimeString();
      const thumb = item.thumbnail || 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Crect width=%22100%22 height=%22100%22 fill=%22%23f0f0f0%22/%3E%3Ctext x=%2750%27 y=%2750%27 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23999%22 font-size=%2212%22%3ENo snapshot%3C/text%3E%3C/svg%3E';
      return `<div class="history-item" data-idx="${i}" onclick="selectHistoryItem(${i})"><img class="history-thumbnail" src="${thumb}" alt="Snapshot"><span class="history-timestamp">${time}</span></div>`;
    }).join('');

    const content = `<div class="history-container"><div class="history-sidebar" id="historySidebar">${sidebar}</div><div class="history-content" id="historyContent"><div class="history-empty">Select history item to view details</div></div></div>`;
    const footer = `<button class="history-btn" onclick="closeWindow(window.currentHistoryWindowId)">Close</button><button class="history-btn" onclick="clearHistoryButton()">Clear History</button>`;

    window.currentHistoryWindowId = window.openWindow({
      title: 'History Edit',
      content: content,
      footer: footer,
      width: '70%',
      height: '80%',
      position: { left: '15%', top: '10%' },
      lockUnderlay: false,
      overlayOpacity: 0.3
    });

    if (data.length > 0) setTimeout(() => selectHistoryItem(0), 100);
  };

  // Select history item and show details
  window.selectHistoryItem = function(idx) {
    const data = window.HistoryManager.getHistory();
    if (idx < 0 || idx >= data.length) return;
    
    const item = data[idx];
    const content = document.getElementById('historyContent');
    document.querySelectorAll('.history-item').forEach((el, i) => {
      el.classList.toggle('active', i === idx);
    });

    let detail = `<div class="history-detail-title">${item.description}</div>
    <div class="history-detail-section"><div class="history-detail-label">Action Type</div><div class="history-detail-value">${item.actionType}</div></div>
    <div class="history-detail-section"><div class="history-detail-label">Timestamp</div><div class="history-detail-value">${new Date(item.timestamp).toLocaleString()}</div></div>
    <div class="history-divider"></div>`;
    
    if (item.thumbnail) detail += `<div class="history-detail-section"><div class="history-detail-label">Preview</div><img class="history-preview-image" src="${item.thumbnail}" alt="Snapshot"><div class="history-divider"></div></div>`;
    if (item.id) detail += `<div class="history-detail-section"><div class="history-detail-label">Snapshot ID</div><div class="history-detail-value">${item.id}</div></div>`;
    
    detail += `<div class="history-footer-buttons"><button class="history-btn" onclick="restoreHistorySnapshot(${idx})">Restore This State</button></div>`;
    
    if (content) content.innerHTML = detail;
  };

  // Restore snapshot from history
  window.restoreHistorySnapshot = function(idx) {
    const data = window.HistoryManager.getHistory();
    if (idx < 0 || idx >= data.length) return console.error('Invalid history index');
    console.log('Restoring snapshot:', idx, data[idx].description);
    // TODO: Implement restore logic
    alert('Restore to: ' + data[idx].description);
  };

  // Clear history
  window.clearHistoryButton = function() {
    if (confirm('Clear all history? This cannot be undone.')) {
      window.HistoryManager.clearHistory();
      window.closeWindow(window.currentHistoryWindowId);
      window.openHistoryWindow();
    }
  };

  console.log('HistoryWindow module loaded');

})();
