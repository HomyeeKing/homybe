import store from "./store.js";
import { addQuery, rmQuery, throttle } from "./utils.js";

const tbody = document.querySelector("#tbody");
const template = document.querySelector("#productrow");
const noData = document.querySelector("#nodata");
const currentUrlNode = document.querySelector("#current-url");

function createTr(v1, v2) {
  const clone = template.content.cloneNode(true);
  const tr = clone.querySelector("tr");
  const checkbox = clone.querySelector(".checkbox");

  const td = clone.querySelectorAll("td");
  td[1].textContent = v1;
  td[2].textContent = v2;

  function toggleCheckbox() {
    if (checkbox.checked) {
      store.url = addQuery({ [v1]: v2 });
    } else {
      store.url = rmQuery(v1);
    }
  }

  tr.addEventListener("click", throttle(toggleCheckbox), {
    capture: true,
  });
  tbody.appendChild(clone);
}

chrome.runtime.sendMessage(
  {
    type: "getUrl",
  },
  (url) => {
    // init url
    store.url = url;
    currentUrlNode.textContent = store.url;

    const index = url.indexOf("?");
    const query = index > -1 ? url.slice(index) : "";
    if (query === "") {
      const clone = noData.content.cloneNode(true);
      tbody.append(clone);
    } else {
      const qs = new URLSearchParams(query);
      for (const q of qs) {
        createTr(q[0], q[1]);
      }
    }
  }
);
