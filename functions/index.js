const fetch = require("node-fetch");
exports.handler = async (event, context) => {
  const API_ENDPOINT = "http://54.169.236.48:5000/subtitles/a";

  try {
    const response = await fetch(API_ENDPOINT);
    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify({ data }),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error }),
    };
  }
};
