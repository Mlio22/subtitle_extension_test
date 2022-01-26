// extension click (top right menu)
// chrome.browserAction.onClicked.addListener(function (activeTab) {
//   var newURL = "http://google.com/";
//   chrome.tabs.create({ url: newURL });
// });

let buffer = {};

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
  console.log(request);

  if (request.send) {
    const { videoId, initialResponse } = request.send;
    buffer[videoId] = JSON.stringify(initialResponse);
  }

  if (request.ask) {
    if (buffer[request.ask.videoId]) {
      sendResponse(buffer[request.ask.videoId]);
    } else {
      sendResponse(null);
    }
  }
});

chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    console.log("a");
  },
  {
    urls: ["https://www.youtube.com/extensionApi/subtitle*"],
  },
  ["blocking"]
);

// redirect https://www.youtube.com/extensionApi/subtitle to http://localhost:8000/extensionApi/subtitle
// used to load subtitles (for laravel server)
chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    let { url } = details;
    console.log("a");

    url = url.replace("https://www.youtube.com/", "http://localhost:8000/");
    return {
      redirectUrl: url,
    };
  },
  {
    urls: ["https://www.youtube.com/extensionApi/subtitle*"],
  },
  ["blocking"]
);

// used to load subtitles (for express server)
chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    let { url } = details;

    url = url.replace("https://www.youtube.com/", "http://localhost:3000/");
    return {
      redirectUrl: url,
    };
  },
  {
    urls: ["https://www.youtube.com/subtitle*"],
  },
  ["blocking"]
);

chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    let { url } = details;
  },
  {
    urls: ["https://www.youtube.com/watch*"],
  },
  ["blocking"]
);
