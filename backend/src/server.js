const awilix = require("awilix");
const container = awilix.createContainer();
const config = require("./config");

const { port } = config;

container.register({
  db: awilix.asFunction(require("./data/database")),

  app: awilix.asFunction(require("./managers/app")),
  crons: awilix.asFunction(require("./managers/crons")),
});

const app = container.resolve("app");
const crons = container.resolve("crons");

app.listen(port, () => console.log(`Listening at port: ${port}`));
