const awilix = require("awilix");
const container = awilix.createContainer();
const config = require("./config");

const { port } = config;

container.register({
  db: awilix.asFunction(require("./data/database")),

  app: awilix.asFunction(require("./routers")),
});

const app = container.resolve("app");
app.listen(port, () => console.log(`Listening at port: ${port}`));
