const { fetch: origFetch } = window;
let initialSubtitleList, currentUrl, currentVideoId;

// request subtitle for corresponding youtube video id
// when the tab loading youtube for first time (of that session)
// or when reloading a youtube page (by using ctrl+r or ctrl+F5)
try {
  currentUrl = window.location.search;
  currentVideoId = currentUrl.replace("?v=", "").split("&list")[0];

  origFetch(`http://localhost:3000/subtitle?requestVideoId=${currentVideoId}`)
    .then((response) => response.json())
    .then((responseJson) => {
      initialSubtitleList = responseJson;
    });

  // sleep function for block other process
  function sleep(miliseconds) {
    var currentTime = new Date().getTime();
    while (currentTime + miliseconds >= new Date().getTime()) {}
  }

  // sleep for 1 sec
  setTimeout(() => {
    sleep(1000);
  }, 1000);
} finally {
}

// detect current video data variable (window.ytInitialPlayerResponse) setting and intercept it
if (!window.ytInitialPlayerResponse) {
  Object.defineProperty(window, "ytInitialPlayerResponse", {
    get() {
      return this.ytInitialPlayerResponse_;
    },
    async set(val) {
      try {
        let captionTotal = 0;
        if (val.captions?.playerCaptionsTracklistRenderer?.captionTracks) {
          // if captions property is available i.e this video has captions from video owner
          // just add our captions list to it
          captionTotal = val.captions.playerCaptionsTracklistRenderer.captionTracks.length;
        } else {
          // add captions blank property directly if captions property not available
          // i.e. this video doesn't have any caption
          if (initialSubtitleList) {
            val["captions"] = {
              playerCaptionsTracklistRenderer: {
                captionTracks: [],
                audioTracks: [
                  {
                    captionTrackIndices: [],
                  },
                ],
              },
            };
          }
        }
        if (initialSubtitleList) {
          for (const sub of initialSubtitleList) {
            // add to captions.playerCaptionsTracklistRenderer.captionTracks to add our captions
            val.captions.playerCaptionsTracklistRenderer.captionTracks[captionTotal] = sub;

            // add to captions.playerCaptionsTracklistRenderer.audioTracks[0].captionTrackIndices
            // to make it recognized by youtube player
            val.captions.playerCaptionsTracklistRenderer.audioTracks[0].captionTrackIndices[
              captionTotal
            ] = captionTotal++;
          }
        }
      } catch (e) {
        console.log(e);
      } finally {
      }

      this.ytInitialPlayerResponse_ = val;
    },
  });
}

// intercept incoming video data fetch
// used when loading next video
// via. https://stackoverflow.com/a/64961272/12125511
window.fetch = async (...args) => {
  const url = args[0].url;
  const response = await origFetch(...args);

  /* work with the cloned response in a separate promise
     chain -- could use the same chain with `await`. */
  if (url.includes("https://www.youtube.com/youtubei/v1/player?key")) {
    const resClone = await response.clone(),
      resJson = await resClone.json();

    let fetchedSubtitleList;

    try {
      currentUrl = window.location.search;
      currentVideoId = currentUrl.replace("?v=", "").split("&list")[0];

      // fetch from fansub for new subtitles
      // set fetch timeout
      const controller = new AbortController();
      setTimeout(() => {
        controller.abort();
        console.log("timeout reached");
      }, 1000);

      const newSub = await origFetch(
        `http://localhost:3000/subtitle?requestVideoId=${currentVideoId}`,
        {
          signal: controller.signal,
        }
      );
      fetchedSubtitleList = await newSub.json();
    } catch (e) {
      console.log(e);
    }

    let captionTotal;

    if (resJson.captions?.playerCaptionsTracklistRenderer?.captionTracks) {
      const captions = resJson.captions.playerCaptionsTracklistRenderer.captionTracks;
      let captionTotal = captions.length;

      // adds caption to last captionlist
      if (fetchedSubtitleList) {
        for (const sub of fetchedSubtitleList) {
          resJson.captions.playerCaptionsTracklistRenderer.captionTracks[captionTotal] = sub;

          resJson.captions.playerCaptionsTracklistRenderer.audioTracks[0].captionTrackIndices[
            captionTotal
          ] = captionTotal++;
        }
      }
    } else {
      // adds caption to last captionlist
      if (fetchedSubtitleList) {
        resJson["captions"] = {
          playerCaptionsTracklistRenderer: {
            captionTracks: [],
            audioTracks: [
              {
                captionTrackIndices: [],
              },
            ],
          },
        };

        let captionTotal = 0;
        for (const sub of fetchedSubtitleList) {
          resJson.captions.playerCaptionsTracklistRenderer.captionTracks[captionTotal] = sub;

          resJson.captions.playerCaptionsTracklistRenderer.audioTracks[0].captionTrackIndices[
            captionTotal
          ] = captionTotal++;
        }
      }
    }

    return new Response(new Blob([JSON.stringify(resJson)], { type: "application/json" }));
  }

  return response;
};
