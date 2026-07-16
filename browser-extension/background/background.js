chrome.runtime.onInstalled.addListener(()=>{

console.log("OmniFlow Installed");

});

chrome.runtime.onMessage.addListener((message,sender,sendResponse)=>{

console.log(message);

});
chrome.runtime.onInstalled.addListener(()=>{

chrome.contextMenus.create({

id:"askOmni",

title:"Ask OmniFlow AI",

contexts:["selection"]

});

});