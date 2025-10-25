
function addOptionNode(pathName, pathPattern) {

  let node = document.createElement('option');

  node.id = pathPattern;
  node.value = pathPattern;
  node.innerText = pathPattern;

  node.style.color = '#333';
  node.style.backgroundColor = '#fff';

  if (RegExp(pathPattern).test(pathName)) {
    node.style.fontWeight = 'bold';
    node.style.backgroundColor = '#0f0';
  }

  node.style.border = '1px solid #ccc';
  node.style.display = 'block';

  node.style.width = '100%';
  node.style.padding = '5px';
  node.style.marginBottom = '2px';

  return node;
}

document.addEventListener('DOMContentLoaded', function () {
  var jsTextArea = document.getElementById('jscode');
  var injectButton = document.getElementById('inject');
  var pathPatternInput = document.getElementById('path-pattern');
  var existingPatterns = document.getElementById('existing-patterns-select');

  var deleteButton = document.getElementById('delete-pattern');

  document.getElementById('clear-storage').addEventListener('onclick', function () {
    chrome.storage.sync.clear();
  });

  chrome.tabs.query({ active: true, lastFocusedWindow: true }, function (curTab) {

    var tab = new URL(curTab[0].url);

    jsTextArea.value = '';
    pathPatternInput.value = tab.pathname;

    chrome.storage.sync.get(tab.host, async function (tabData) {
      tabData = tabData[tab.host] || {};

      for (let pathPattern in tabData) {
        let node = addOptionNode(tab.pathname, pathPattern);
        existingPatterns.appendChild(node);
      }

      existingPatterns.addEventListener('change', function () {

        if (this.value === 'default-intl-option') {
          jsTextArea.value = '';
          pathPatternInput.value = tab.pathname;
          return;
        }

        pathPatternInput.value = this.value;
        jsTextArea.value = tabData[this.value].jsText || '';

      });

    });

    injectButton.addEventListener('click', async function () {

      var jsText = jsTextArea.value;
      if (!jsText) {
        window.close();
        return;
      }

      if (RegExp(pathPatternInput.value).test(tab.pathname)) {
        await chrome.tabs.executeScript({
          code: jsText,
        });
      }

      await chrome.storage.sync.get(tab.host, async function (data) {
        data[tab.host] ??= {};
        data[tab.host][pathPatternInput.value] ??= {};
        data[tab.host][pathPatternInput.value]['jsText'] = jsText;

        await chrome.storage.sync.set(data, () => { });
      });

      window.close();
    });

    deleteButton.addEventListener('click', async function (event) {
      await chrome.storage.sync.get(tab.host, async function (tabData) {
        delete tabData[tab.host][pathPatternInput.value];
        await chrome.storage.sync.set(tabData, () => { });

        document
          ?.getElementById(pathPatternInput.value)
          ?.remove();

        jsTextArea.value = '';
        pathPatternInput.value = tab.pathname;

      });
    });

  });
});
