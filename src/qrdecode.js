async function getQRCodeUrl(canvas) {
  const jsQrUrl = chrome.runtime.getURL('content_scripts/jsqr.js');
  await import(jsQrUrl);
  const ctx = canvas.getContext('2d');
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const code = jsQR(imageData.data, imageData.width, imageData.height);
  if (code) {
    return code.data;
  } else {
    return null;
  }
}

export function registerCanvasListener() {
  document.querySelectorAll('canvas').forEach(handleEle);
  document.querySelectorAll('img').forEach(handleEle);

  /**
   *
   * @param {HTMLImageElement | HTMLCanvasElement} ele
   */
  function handleEle(ele) {
    /** @type HTMLDivElement */
    let parentNode, target;
    const mask = document.createElement('div');

    ele.addEventListener('mouseover', (event) => {
      event.stopPropagation();
      target = event.target;
      const isCanvas = target.tagName.toLowerCase() === 'canvas';
      const isImg = target.tagName.toLowerCase() === 'img';
      if (isCanvas || isImg) {
        parentNode = target.parentNode;
        parentNode.style.position = 'relative';
        console.log('parentNode', parentNode);
        mask.id = 'easy-href-qrcode-mask';
        mask.style.position = 'absolute';
        mask.style.inset = 0;
        mask.style.background = 'rgba(0,0,0,.7)';
        mask.style.color = '#fff';
        mask.style.cursor = 'pointer';
        mask.style.fontSize = '20px';
        mask.textContent = '点击复制 URL';
        parentNode.appendChild(mask);

        mask.onclick = async (e) => {
          e.stopPropagation();
          let saveUrl;
          if (isCanvas) {
            saveUrl = await getQRCodeUrl(target);
          } else {
            saveUrl = target.src;
          }
          console.log('saveUrl', saveUrl);
          navigator.clipboard.writeText(saveUrl).then(
            () => {
              alert('复制成功！');
            },
            () => {
              alert('复制失败');
            }
          );
        };
        console.log('hover');
      }
    });

    mask.addEventListener('mouseleave', (event) => {
      event.stopPropagation();
      if (parentNode && mask) {
        parentNode.removeChild(mask);
      }
    });
  }
}

export function showQrCodeContext() {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: 'qrDecode',
      title: '在 canvas 上绘制线条',
      contexts: ['all'],
    });
    chrome.contextMenus.onClicked.addListener((info) => {
      console.log('info', info);
    });
  });
}
