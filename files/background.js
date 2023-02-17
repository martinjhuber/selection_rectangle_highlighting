
async function getCurrentTabId () {
    let tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    return tabs[0].id;
  }

async function setBadge (text, color) {
    let tabId = await getCurrentTabId();
    if (text !== null)
        chrome.action.setBadgeText({tabId: tabId, text: text});
    if (color !== null)
        chrome.action.setBadgeBackgroundColor({tabId: tabId,  color: [color.r, color.g, color.b, 255] });
}

chrome.action.onClicked.addListener(async (tab) => {
    chrome.scripting.executeScript({
        target: {tabId: tab.id},
        files: ["selectionRectangle.js"],
    }).then(
        () => {},
        (err) => {
            chrome.action.setTitle({tabId: tab.id, title: chrome.i18n.getMessage("launch_error")});
            setBadge("error", {r: 255, g: 160, b: 160});
        },
    );
    chrome.scripting.insertCSS({
        target: {tabId: tab.id},
        files: ["selectionRectangle.css"],
    }).then(
        () => {},
        (err) => {},
    );
});

chrome.runtime.onMessage.addListener(
    (request) => {
        if (!request.srh_action || !request.srh_action.type) {
            return false;
        }

        if (request.srh_action.type === "set_badge") {
            setBadge(request.srh_action.text, request.srh_action.color);
        }
    }
  );

