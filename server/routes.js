module.exports = [
  {
    method: "GET",
    path: "/subtitles/{id}",
    handler: (request, h) => {
      return h.file("subtitle.ytt", {
        confine: false,
      });
    },
  },
  {
    method: "OPTIONS",
    path: "/subtitles/{id}",
    handler: (request, h) => {
      const response = h
        .response({
          message: "hello",
          status: "okay",
        })
        .header("Access-Control-Allow-Origin", "http://localhost:80")
        .header(
          "Access-Control-Allow-Headers",
          "x-youtube-ad-signals,x-youtube-client-name,x-youtube-client-version,x-youtube-device,x-youtube-identity-token,x-youtube-page-cl,x-youtube-page-label,x-youtube-time-zone,x-youtube-utc-offset"
        );

      response.code(200);
      return response;
    },
  },

  {
    method: "GET",
    path: "/",
    handler: (request, h) => {
      return "response";
    },
  },
];
