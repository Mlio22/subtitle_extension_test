const Hapi = require("@hapi/hapi");
const routes = require("./routes");
const Path = require("path");

const startServer = async () => {
  const server = Hapi.server({
    host: "localhost",
    port: process.env.NODE_ENV !== "production" ? "localhost" : "0.0.0.0",
    routes: {
      cors: {
        credentials: true,
      },
      files: {
        relativeTo: Path.join(__dirname, "subtitles"),
      },
    },
  });

  await server.register(require("@hapi/inert"));

  //   todo: routing
  server.route(routes);

  await server.start();
  console.log(`server berjalan di ${server.info.uri}`);
};

startServer();
