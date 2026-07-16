export function save(key,value){

chrome.storage.local.set({

[key]:value

});

}

export function load(key){

return chrome.storage.local.get(key);

}