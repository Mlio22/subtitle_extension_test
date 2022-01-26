// inject inline code for get subtitle list immediately
const currentUrl = window.location.search,
  currentVideoId = currentUrl.replace("?v=", "").split("&list")[0];

let initialResponse = null;

function injectScript(response) {
  let subtitleListGetterCode = `// Code here.
let initialSubtitleList = ${response};

try{
  if (!window.ytInitialPlayerResponse) {
    Object.defineProperty(window, "ytInitialPlayerResponse", {
      get() {
        console.error("get");
        return this.ytInitialPlayerResponse_;
      },
      async set(val) {
        console.error("set");
        let captionTotal = 0;

        console.log(initialSubtitleList, val)

        try{
        if (val.videoDetails) {
          // if original response wanted to be added after extension
          console.log("original response added after extension");
          this.ytInitialPlayerResponse_ = val;

          if (!val.captions) {
            // if val is original response but doesn't have caption property
            this.ytInitialPlayerResponse_.captions = {
              playerCaptionsTracklistRenderer: {
                captionTracks: [],
                audioTracks: [
                  {
                    captionTrackIndices: [],
                  },
                ],
              },
            }
          }

          captionTotal = val.captions.playerCaptionsTracklistRenderer.captionTracks.length;
        }
        else {
          console.log("extension response added after original");
          // if extension response wanted to be added after original
          if(this.ytInitialPlayerResponse_) {
            captionTotal =
            this.ytInitialPlayerResponse_.captions.playerCaptionsTracklistRenderer.captionTracks
              .length;
          } else {
            this.ytInitialPlayerResponse_ = {}
            this.ytInitialPlayerResponse_.captions = {
              playerCaptionsTracklistRenderer: {
                captionTracks: [],
                audioTracks: [
                  {
                    captionTrackIndices: [],
                  },
                ],
              },
            }
          }
        }

        if (initialSubtitleList) {
          for (const sub of initialSubtitleList) {
            // add to captions.playerCaptionsTracklistRenderer.captionTracks to add our captions
            this.ytInitialPlayerResponse_.captions.playerCaptionsTracklistRenderer.captionTracks[
              captionTotal
            ] = sub;

            // add to captions.playerCaptionsTracklistRenderer.audioTracks[0].captionTrackIndices
            // to make it recognized by youtube player
            this.ytInitialPlayerResponse_.captions.playerCaptionsTracklistRenderer.audioTracks[0].captionTrackIndices[
              captionTotal
            ] = captionTotal++;
          }
          window.ytplayer.bootstrapPlayerResponse = this.ytInitialPlayerResponse_
        }
        }
        catch(e){
          console.log(e);
        }
      }
    });
  }else {
    console.log('fail');
    location.reload();
  }
}
catch(e){
  console.log(e);
}
`;

  let subtitleGetterScript = document.createElement("script");
  subtitleGetterScript.textContent = subtitleListGetterCode;
  (document.head || document.documentElement).appendChild(subtitleGetterScript);
}

chrome.runtime.sendMessage({ ask: { videoId: currentVideoId } }, function (response) {
  if (currentVideoId) {
    if (response === null) {
      fetch(`http://localhost:8000/extensionApi/preview/${currentVideoId}`)
        .then((response) => response.json())
        .then((responseJson) => {
          chrome.runtime.sendMessage({
            send: { videoId: currentVideoId, initialResponse: responseJson },
          });
          console.log("reloading");
          return location.reload();
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      injectScript(response);
    }
  }
});

// inject request interceptor for get next video subtitle list
const requestInterceptorScript = document.createElement("script");
requestInterceptorScript.src = chrome.runtime.getURL("scripts/requestInterceptor.js");
(document.head || document.documentElement).appendChild(requestInterceptorScript);
