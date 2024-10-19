chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status == 'complete') {
    chrome.storage.sync.get(null, function (data) {
      var url = new URL(tab.url);
      var tabData = data[url.host];

      if (tabData != undefined && new RegExp(tabData['pathPattern']).test(url.pathname)) {
        chrome.tabs.executeScript(tabId, { code: tabData['jsText'] });
      }
    });
  }
});
