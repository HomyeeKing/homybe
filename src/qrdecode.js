export function registerCanvasListener() {
  // 在 content script 中添加右键点击监听器
  document.querySelector('canvas');
  addEventListener('mousedown', function (event) {
    if (event.button == 2) {
      // 右键被点击
      chrome.runtime.sendMessage({ type: 'showQrCodeContext' }); // 向background script发送消息
    }
  });
}

export function showQrCodeContext() {
  // chrome.contextMenus.removeAll(() => {
  //   chrome.contextMenus.create({
  //     id: 'qrDecode',
  //     title: '在 canvas 上绘制线条',
  //     contexts: ['all'],
  //   });
  //   chrome.contextMenus.onClicked.addListener((info) => {
  //     console.log('info', info);
  //   });
  // });
}
