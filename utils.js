import store from "./store.js";

const queryToObj = (str) => {
  const obj = Object.create(null);
  if (!str || str === "") return obj;

  const params = new URLSearchParams(str);
  for (const [key, value] of params) {
    obj[key] = value;
  }
  return obj;
};

const objToQuery = (obj) => {
  const tmp = [];
  for (const key of Object.keys(obj)) {
    tmp.push(`${key}=${obj[key]}`);
  }
  return tmp.join("&");
};

export const rmQuery = (key, url = store.url) => {
  if (key === "") return;
  const [host, query] = url.split("?");
  const queryObj = queryToObj(query);
  Reflect.deleteProperty(queryObj, key);
  return `${host}?${objToQuery(queryObj)}`;
};

export const addQuery = (obj, url = store.url) => {
  const [host, query] = url.split("?");
  const queryObj = queryToObj(query);
  Object.assign(queryObj, obj);
  return `${host}?${objToQuery(queryObj)}`;
};

export const updateQuery = (oldKey, newObj, url = store.url) => {
  if (oldKey === "") return;
  store.url = addQuery(newObj, rmQuery(oldKey, url));
};

export const throttle = (fn, timeout = 300) => {
  let timer = undefined;
  return () => {
    if (timer) return;
    timer = setTimeout(() => {
      fn();
      clearTimeout(timer);
      timer = undefined;
    }, timeout);
  };
};
