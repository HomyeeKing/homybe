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
    default:
      break;
  }
});
