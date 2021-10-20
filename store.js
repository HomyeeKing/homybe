const store = new Proxy({
    url:location.href
}, {
    set(target,key,newVal){
        if(key === 'url'){
            target[key] = newVal
            document.querySelector('#current-url').textContent = newVal
            return true
        }
    }
})

export default store