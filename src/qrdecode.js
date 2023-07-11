/**
 * @param {HTMLImageElement | HTMLCanvasElement} ele
 */
async function getQRCodeUrl(ele, isCanvas) {
  const jsQrUrl = chrome.runtime.getURL('content_scripts/jsqr.js');
  await import(jsQrUrl);
  let imageData;
  if (isCanvas) {
    const ctx = ele.getContext('2d');
    imageData = ctx.getImageData(0, 0, ele.width, ele.height);
  } else {
    // TODO: better parse qrcode image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ele.crossOrigin = '';
    ctx.drawImage(ele, 0, 0, ele.width, ele.height);
    imageData = ctx.getImageData(0, 0, ele.width, ele.height);
  }
  const code = jsQR(imageData.data, imageData.width, imageData.height);
  if (code) {
    return code.data;
  } else {
    return null;
  }
}

/**
 *
 * @param {HTMLImageElement | HTMLCanvasElement} ele
 */
function handleEle() {
  /** @type HTMLDivElement */
  let parentNode, target;
  const mask = document.createElement('div');

  document.addEventListener('mouseover', async (event) => {
    event.stopPropagation();
    target = event.target;
    const isCanvas = target.tagName.toLowerCase() === 'canvas';
    const isImg = target.tagName.toLowerCase() === 'img';
    if (isCanvas || isImg) {
      parentNode = target.parentNode;
      parentNode.style.position = 'relative';
      let saveUrl = await getQRCodeUrl(target, isCanvas);

      if (saveUrl) {
        mask.id = 'easy-href-qrcode-mask';
        mask.style.position = 'absolute';
        mask.style.inset = 0;
        mask.style.background = 'rgba(0,0,0,.7)';
        mask.style.color = '#fff';
        mask.style.cursor = 'pointer';
        mask.style.fontSize = '20px';
        mask.textContent = '点击复制 URL';
        mask.style.display = 'flex';
        mask.style.justifyContent = 'center';
        mask.style.alignItems = 'center';
        parentNode.appendChild(mask);
      }

      mask.onclick = async (e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(saveUrl).then(
          () => {
            mask.textContent = '复制成功';
          },
          () => {
            mask.textContent = '复制失败';
          }
        );
      };
    }
  });

  mask.addEventListener('mouseleave', (event) => {
    event.stopPropagation();
    if (parentNode && mask) {
      parentNode.removeChild(mask);
    }
  });
}

export function registerCanvasListener() {
  handleEle();
}
