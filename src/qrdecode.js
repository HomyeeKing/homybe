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
  let parentNode,
    /** @type HTMLElement */
    target,
    mouseLeaved = true;
  const mask = document.createElement('div');
  const p = document.createElement('p');
  mask.appendChild(p);
  // const close = document.createElement('i');
  // mask.appendChild(close);
  // close.textContent = '×';
  // close.style.color = '#fff';
  // close.style.fontSize = '20px';

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
        mask.style.cursor = 'pointer';
        mask.style.display = 'flex';
        mask.style.flexDirection = 'column';
        mask.style.justifyContent = 'center';
        mask.style.alignItems = 'center';
        p.style.fontSize = '20px';
        p.style.color = '#fff';
        p.textContent = 'Copy URL To Clipboard';
        parentNode.appendChild(mask);
      }
      mask.onclick = async (e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(saveUrl).then(
          () => {
            p.textContent = 'Copied 🚀';
          },
          () => {
            p.textContent = 'Copy Failed!😨';
          }
        );
      };
    }
  });

  function handleMaskRemove(event) {
    event.stopPropagation();
    // 控制是否显示遮罩
    if (parentNode && mask) {
      parentNode.removeChild(mask);
    }
  }
  // close.addEventListener('click', handleMaskRemove);
  mask.addEventListener('mouseleave', handleMaskRemove);
}

export function registerCanvasListener() {
  handleEle();
}
