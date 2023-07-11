async function getCurrentTab() {
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}
let tab;

chrome.tabs.onActivated.addListener(async () => {
  tab = await getCurrentTab();
});

chrome.tabs.onUpdated.addListener(async () => {
  tab = await getCurrentTab();
});

chrome.runtime.onMessage.addListener(async (msg, sender, sendRes) => {
  console.log('msg', msg.canvas.tagName);
  switch (msg.type) {
    case 'getUrl':
      sendRes(tab.url);
      break;
    case 'log':
      console.log(msg.content);
      break;
    case 'pageReload':
      chrome.tabs.update(tab.tabId, { url: msg.url });
      break;
    case 'parseCanvasGetQrcode':
      const url = await getQRCodeUrl(msg.canvas);
      console.log('url', url);
      sendRes(url);
    default:
      break;
  }
});
