chrome.browserAction.onClicked.addListener(function(activeTab){
    var newURL = "http://stackoverflow.com/";
    chrome.tabs.create({ url: newURL });
  });

chrome.webRequest.onBeforeRequest.addListener(
  (info) => {
    console.log("redirected: " + info.url);
    return {redirectUrl : chrome.extension.getURL("subtitle.json")};
  },
  {
    urls: [
      "https://www.youtube.com/api/timedtext*"
    ]
  },
  ['blocking']
);