// extension click (top right menu)
// todo: create extension settings page
chrome.browserAction.onClicked.addListener(function (activeTab) {
  var newURL = "http://stackoverflow.com/";
  chrome.tabs.create({ url: newURL });
});

// detect every /user/subtitle request and redirect it to request server
chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    let { url } = details;

    url = url.replace("https://www.youtube.com/user/", "http://localhost:3000/");
    return {
      redirectUrl: url,
    };
  },
  {
    urls: ["https://www.youtube.com/user/subtitle*"],
  },
  ["blocking"]
);
