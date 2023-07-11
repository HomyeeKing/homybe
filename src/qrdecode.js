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

function observeNewCanvas() {
  // 检查节点中是否包含 canvas 元素
  function checkCanvas(node) {
    if (node.nodeName === 'CANVAS') {
      // 在这里对新增的 canvas 元素进行操作
      handleEle(node);
    } else if (node.childNodes) {
      // 遍历子节点，递归检查每个子节点
      node.childNodes.forEach(function (child) {
        checkCanvas(child);
      });
    }
  }
  // 创建一个 MutationObserver 实例
  const observer = new MutationObserver(function (mutations) {
    // 遍历所有变化的节点
    mutations.forEach(function (mutation) {
      // 遍历被添加的节点
      mutation.addedNodes.forEach(function (node) {
        // 递归检查节点中是否包含 canvas 元素
        checkCanvas(node);
      });
    });
  });

  // 开始观察 DOM 的变化
  observer.observe(document.body, { childList: true, subtree: true });
}

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

      mask.onclick = async (e) => {
        e.stopPropagation();
        let saveUrl;
        if (isCanvas) {
          saveUrl = await getQRCodeUrl(target);
        } else {
          saveUrl = target.src;
        }
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
  observeNewCanvas();
  document.querySelectorAll('canvas').forEach(handleEle);
  // TODO: img qrcode
  // document.querySelectorAll('img').forEach(handleEle);
}
