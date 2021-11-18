const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");
const fs = require("fs");
const https = require("https");
const db = require("./json/db.json");
const languages = require("./json/language.json");

const langNameSearcher = (langCode) => {
  for (const lang of languages) {
    if (lang.languageCode === langCode) {
      return lang.languageName.simpleText;
    }
  }
};

app.use(
  cors({
    origin: (origin, callback) => {
      return callback(null, true);
    },
    credentials: true,
  })
);

const tls = {
  key: fs.readFileSync("./server/certificates/system.key"),
  cert: fs.readFileSync("./server/certificates/system.pem"),
};
const options = {
  root: path.join(__dirname),
  dotfiles: "allow",
};
app.get("/", (req, res) => {
  res.sendFile("subtitles/subtitle.ytt", options, () => {});
});

app.get("/subtitle", (req, res) => {
  const { requestVideoId = null, requestLangCode = null, requestSubtitleId = null } = req.query;
  if (requestVideoId) {
    console.log(requestVideoId);
    const subtitle_detail = db[requestVideoId];

    if (subtitle_detail) {
      if (requestSubtitleId !== null && requestLangCode !== null) {
        const subtitleWithLangDetail = subtitle_detail[requestLangCode],
          subtitle = subtitleWithLangDetail.find(
            (subtitle) => subtitle.id === Number(requestSubtitleId)
          );
        console.log(subtitle);
        return res.sendFile(`subtitles/${subtitle.filename}.ytt`, options, () => {});
      }

      let subtitleList = [];
      Object.keys(subtitle_detail).forEach((subtitleLang) => {
        if (subtitleLang !== "name") {
          subtitle_detail[subtitleLang].forEach((subtitles) => {
            const { id: generatedSubtitleId, creator } = subtitles;

            subtitleList.push({
              baseUrl: `subtitle?requestVideoId=${requestVideoId}&requestLangCode=${subtitleLang}&requestSubtitleId=${generatedSubtitleId}`,
              isTranslatable: false,
              languageCode: `${subtitleLang} (${creator})`,
              name: { simpleText: `${langNameSearcher(subtitleLang)} - ${creator}` },
              vssId: `.${langNameSearcher(subtitleLang)} (${creator})`,
            });
          });
        }
      });
      return res.json(subtitleList);
    }
  }
});

const port = 3000;

app.listen(port, () => {
  console.log("listening at port " + port);
});
