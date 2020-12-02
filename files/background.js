
chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.executeScript(
        tab.id, 
        { file: "selectionRectangle.js" }, 
        function() {
            if (chrome.runtime.lastError) {
                window.close();
                alert("Sorry, please try again on a different page. This extension cannot be used on chrome:// URLs or on the Chrome Web Store. It also does not work on file:// URLs if you don't grant access via the Extensions management page in Chrome.");
            }
        }
    );
    chrome.tabs.insertCSS(
        tab.id, 
        { file: "selectionRectangle.css" }, 
        function() { }
    );

});
