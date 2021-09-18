async function getCurrentTab() {
    let queryOptions = { active: true, currentWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}
let tab

chrome.tabs.onActivated.addListener(async ()=>{
    tab = await getCurrentTab()
    console.log(tab);
    
})

chrome.runtime.onMessage.addListener((msg,sender,sendRes)=>{
    if(msg === 'getUrl'){
        console.log(tab.url);
        sendRes(tab.url)
    }
})