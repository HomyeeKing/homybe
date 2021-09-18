const tbody = document.querySelector("#tbody")
const template = document.querySelector('#productrow');
const noData = document.querySelector('#nodata')

function createTr(v1,v2){
    const clone = template.content.cloneNode(true);
    var td = clone.querySelectorAll("td");
    td[0].textContent = v1;
    td[1].textContent = v2;
    tbody.appendChild(clone);
}



chrome.runtime.sendMessage('getUrl',url=>{
    const index = url.indexOf('?')
    const query = index>-1? url.slice(index):''
    if(query === ''){
        const clone = noData.content.cloneNode(true)
        tbody.append(clone)
    }else{
        const qs = new URLSearchParams(query)
        for(const q of qs){
            createTr(q[0],q[1])            
         }
    }
});