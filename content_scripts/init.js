(async () => {
  const src = chrome.runtime.getURL('content_scripts/main.js');
  const contentMain = await import(src);
  contentMain.main();
})();
