// chrome API utils

/**
 * 
 * @param {String} url 
 */
export function reloadPage(url) {
  chrome.runtime.sendMessage({
    type: "pageReload",
    url,
  });
}