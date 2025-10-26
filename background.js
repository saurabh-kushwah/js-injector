async function executeScript(tabID, jsText) {
  var jsText = `
    async function setTimeoutFunc() {

      if (document.readyState === 'loading') {
        console.log("document still loading, waiting for full content load");
        await new Promise(resolve => document.addEventListener('DOMContentLoaded', resolve));
      }

      console.log("starting injection script...");

      for (let i = 1; i <= 10; i++) {
        try {
          ${jsText}
          break;
        } catch (error) {
          // wait for 100 millisecond before retrying
          console.log("fail to inject javascript: ", error);
          await new Promise((resolve, _) => setTimeout(resolve, 100 * i));
        }
      }
    }

    setTimeout(async () => {
      await setTimeoutFunc();
    }, 100);
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
