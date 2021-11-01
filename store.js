const store = new Proxy(
  {
    url: location.href,
    pageUrl: location.href, // 当前页面url
  },
  {
    set(target, key, newVal) {
      if (key === "url") {
        target[key] = newVal;
        document.querySelector("#current-url").textContent = newVal;
        if (newVal !== target.pageUrl) {
          document.querySelector(".warn-text").style.display = 'inline'
        }
      }

      return Reflect.set(...arguments)
    },
  }
);

export default store;
