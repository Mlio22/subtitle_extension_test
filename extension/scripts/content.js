// inject code
let injectScript = document.createElement("script");
injectScript.src = chrome.runtime.getURL("scripts/inject.js");

document.documentElement.appendChild(injectScript);

// todo: add subtitle details section in user's youtube page
