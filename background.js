async function getCurrentTab() {
    let queryOptions = { active: true, currentWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}
let tab

chrome.tabs.onActivated.addListener(async ()=>{
    tab = await getCurrentTab()
    
})

chrome.tabs.onUpdated.addListener(async ()=>{
    tab = await getCurrentTab()
})

chrome.runtime.onMessage.addListener((msg,sender,sendRes)=>{
    if(msg === 'getUrl'){
        sendRes(tab.url)
    }
})