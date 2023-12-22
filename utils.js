import store from './store.js';

/**
 *
 * @param {} str
 * @returns
 */
const queryToObj = (str) => {
  const obj = Object.create(null);
  if (!str || str === '') return obj;

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
  return tmp.join('&');
};

/**
 * return host,queryobj of url
 * @param {String} url page url
 * @returns
 */
const getPartFromUrl = (url = store.url) => {
  if (url === '') return;
  const [host, query] = url.split('?');
  return { host, queryObj: queryToObj(query) };
};

export const rmQuery = (key, url = store.url) => {
  if (key === '') return;
  const { host, queryObj } = getPartFromUrl(url);
  Reflect.deleteProperty(queryObj, key);
  return `${host}?${objToQuery(queryObj)}`;
};

export const addQuery = (obj, url = store.url) => {
  const { host, queryObj } = getPartFromUrl(url);
  Object.assign(queryObj, obj);
  return `${host}?${objToQuery(queryObj)}`;
};

/**
 * 更新页面query 没有就新增
 * @param {object} newObj 要新增的键值对
 * @param {String} url 当前页面链接
 */
export const updateQuery = (newObj, url = store.url) => {
  const { queryObj: oldQuery } = getPartFromUrl(url);
  store.url = addQuery({ ...oldQuery, ...newObj }, url);
  return store.url;
};
/**
 * 更新页面query 没有就新增
 * @param {object} newObj 要新增的键值对
 * @param {String} url 当前页面链接
 */
export const updateQueryByStr = (queryString, url = store.url) => {
  const { queryObj: oldQuery } = getPartFromUrl(url);
  const newObj = queryToObj(queryString);
  store.url = addQuery({ ...oldQuery, ...newObj }, url);
  return store.url;
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

export const showTips = (show = true) => {
  document.querySelector('.warn-text').style.display = show ? 'inline' : 'none';
};
