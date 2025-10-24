async function executeScript(tabID, jsText) {
  var jsText = `
    async function setTimeoutFunc() {
      for (let i = 0; i < 5; i++) {
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

  await chrome.tabs.executeScript(tabID, { code: jsText });
}

chrome.tabs.onUpdated.addListener(function (tabID, changeInfo, tab) {
  if (changeInfo.status == 'complete') {
    let tabURL = new URL(tab.url);

    chrome.storage.sync.get(tabURL.host, async function (data) {

      let tabData = data[tabURL.host];
      let pathName = tabURL.pathname;

      for (let pathPattern in tabData) {
        if (RegExp(pathPattern).test(pathName)) {
          await executeScript(tabID, tabData[pathPattern]['jsText'])
        }
      }
    });
  }
});
