function executeScript(tabID, jsText) {
  var jsText = `
    async function setTimeoutFunc() {
      for (let i = 0; i < 25; i++) {
        try {
          ${jsText}
        } catch (error) {
          // wait for 100 millisecond before retrying
          await new Promise((resolve, _) => setTimeout(resolve, 100));
        }
      }
    }

    setTimeout(setTimeoutFunc, 100);
  `.trim();

  chrome.tabs.executeScript(tabID, { code: jsText });
}

chrome.tabs.onUpdated.addListener(function (tabID, changeInfo, tab) {
  if (changeInfo.status == 'complete') {
    var tabURL = new URL(tab.url);

    chrome.storage.sync.get(tabURL.host, function (data) {
      var tabData = data[tabURL.host];

      if (tabData != undefined && new RegExp(tabData['pathPattern']).test(tabURL.pathname)) {
        executeScript(tabID, tabData['jsText'])
      }
    });
  }
});
