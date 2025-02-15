document.addEventListener('DOMContentLoaded', function () {
  var jsTextArea = document.getElementById('jscode');
  var injectButton = document.getElementById('inject');
  var pathPatternInput = document.getElementById('path-pattern');

  document.getElementById('clear-storage').addEventListener('onclick', function () {
    chrome.storage.sync.clear();
  });

  chrome.tabs.query({ active: true, lastFocusedWindow: true }, function (curTab) {
    var tab = new URL(curTab[0].url);

    chrome.storage.sync.get(tab.host, function (data) {
      if (data[tab.host] != undefined) {
        jsTextArea.value = data[tab.host]['jsText'];
        pathPatternInput.value = data[tab.host]['pathPattern'];
      } else {
        jsTextArea.value = '';
        pathPatternInput.value = tab.pathname;
      }
    });

    injectButton.addEventListener('click', function () {
      var jsText = jsTextArea.value;
      if (!jsText) {
        chrome.storage.sync.remove(tab.host, () => { });
        window.close();
        return;
      }

      chrome.tabs.executeScript({
        code: jsText,
      });

      var tabData = {
        [tab.host]: {
          jsText: jsText,
          pathPattern: pathPatternInput.value,
        },
      };

      chrome.storage.sync.set(tabData, () => { });
      window.close();
    });
  });
});
