const { fetch: origFetch } = window;

// intercept incoming video data fetch
// used when loading next video
// via. https://stackoverflow.com/a/64961272/12125511
window.fetch = async (...args) => {
  const url = args[0].url;

  let response;
  try {
    response = await origFetch(...args);
  } catch (e) {
    console.log(e);
  }

  if (url) {
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
          `http://localhost:8000/extensionApi/preview/${currentVideoId}`,
          {
            signal: controller.signal,
          }
        );
        fetchedSubtitleList = await newSub.json();
      } catch (e) {
        console.log(e);
      }

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
  }
};
