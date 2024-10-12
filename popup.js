import store from './store.js';
import { rmQuery, updateQuery, showTips, updateQueryByStr } from './utils.js';
import { reloadPage } from './chrUtils.js';

const tbody = document.querySelector('#tbody');
const template = document.querySelector('#productrow');
const noData = document.querySelector('#nodata');
const currentUrlNode = document.querySelector('#current-url');
// ald
const configName = document.querySelector('#first-config-name');
const subConfigName = document.querySelector('#subconfig-name');
const resId = document.querySelector('#resId-input');
const openPegasusPanel = document.querySelector('#open-pegasus-panel-btn');

const warnText = document.querySelector('.warn-text');

//#region   quick query
const tagSection = document.querySelector('#tag-section');
tagSection.onclick = (e) => {
  const query = e.target.textContent;
  updateQueryByStr(query);
};
//#endregion

/**
 * 创建行
 * @param {String} v1 key的值
 * @param {String} v2 value的值
 */
function createTr(v1 = '', v2 = '') {
  let oldKey = v1;

  const clone = template.content.cloneNode(true);
  const tr = clone.querySelector('tr');
  //   const checkbox = clone.querySelector(".checkbox");

  const addBtn = clone.querySelector('#add-btn');
  const removeBtn = clone.querySelector('#remove-btn');
  const keyInput = clone.querySelector('#key-input');
  const valueInput = clone.querySelector('#value-input');
  keyInput.value = v1;
  valueInput.value = v2;

  //   function toggleCheckbox() {
  //     console.log("click");
  //     if (checkbox.checked && v1 !== "") {
  //       store.url = addQuery({ [v1]: v2 });
  //     } else {
  //       store.url = rmQuery(v1);
  //     }
  //   }
  //   创建行
  addBtn.addEventListener('click', () => {
    createTr();
  });

  //   移除行
  removeBtn.addEventListener('click', () => {
    console.log('click');

    removeTr(tr);
    store.url = rmQuery(oldKey);
  });

  keyInput.onchange = () => {
    updateQuery({ [keyInput.value]: valueInput.value });
    oldKey = keyInput.value;
  };

  valueInput.onchange = () => {
    updateQuery({ [keyInput.value]: valueInput.value });
  };

  //   checkbox.addEventListener("change", throttle(toggleCheckbox));
  tbody.appendChild(clone);
}

function removeTr(node) {
  tbody.removeChild(node);
}

function genQRCode(url) {
  new QRCode(document.querySelector('#qr-code-image'), {
    text: url,
    width: 180, //default 128
    height: 180,
    colorDark: '#000000',
    colorLight: '#ffffff',
    correctLevel: QRCode.CorrectLevel.H,
  });
}

chrome.runtime.sendMessage(
  {
    type: 'getUrl',
  },
  (url) => {
    // init url
    store.pageUrl = url;
    genQRCode(url);
    store.url = url;
    currentUrlNode.textContent = store.url;

    const index = url.indexOf('?');
    const query = index > -1 ? url.slice(index) : '';
    if (query === '') {
      //   const clone = noData.content.cloneNode(true);
      //   tbody.append(clone);
      createTr('url参数为空');
    } else {
      const qs = new URLSearchParams(query);
      for (const q of qs) {
        createTr(q[0], q[1]);
      }
    }
  }
);
warnText.onclick = () => {
  reloadPage(store.url);
  showTips(false);
};

// open first ald
openPegasusPanel.onclick = () => {
  // 21046331
  //
  if (resId.value !== '') {
    const newUrl = updateQuery({
      activeResourceId: resId.value,
      activeResourcePitId: resId.value,
      aladdin: true,
      tagInfo: subConfigName.value
        ? `${configName.value}[hash=${resId.value}]/${subConfigName.value}`
        : configName.value,
    });
    reloadPage(newUrl);
  }
};
