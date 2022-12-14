
chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.executeScript(
        tab.id, 
        { file: "selectionRectangle.js" }, 
        function() {
            if (chrome.runtime.lastError) {
                alert(chrome.i18n.getMessage("launch_error"));
            }
        }
    );
    chrome.tabs.insertCSS(
        tab.id, 
        { file: "selectionRectangle.css" }, 
        function() { 
            if (chrome.runtime.lastError) { } 
        }
    );
});
