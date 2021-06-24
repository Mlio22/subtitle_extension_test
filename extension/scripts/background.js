// extension click (top right menu)
chrome.browserAction.onClicked.addListener(function (activeTab) {
  var newURL = "http://stackoverflow.com/";
  chrome.tabs.create({ url: newURL });
});

// detect every request and redirect it if detected to youtube API
chrome.webRequest.onBeforeRequest.addListener(
  (info) => {
    console.log(info);
    let id = info.url.replace("https://www.youtube.com/api/timedtext?v=", "");
    id = id.substr(0, id.indexOf("&"));

    return {
      redirectUrl: `http://localhost:80/subtitles/${id}`,
    };
  },
  {
    urls: ["https://www.youtube.com/api/timedtext*"],
  },
  ["blocking"]
);
