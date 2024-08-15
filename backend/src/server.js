const awilix = require("awilix");
const container = awilix.createContainer();
const config = require("./config");

const { port } = config;

container.register({
  db: awilix.asFunction(require("./data/database")),
  eventsData: awilix.asFunction(require("./data/events")),

  testRouter: awilix.asFunction(require("./routers/testRouter")),
  eventsRouter: awilix.asFunction(require("./routers/eventsRouter")),

  app: awilix.asFunction(require("./managers/app")),
  crons: awilix.asFunction(require("./managers/crons")),
});

const app = container.resolve("app");
const crons = container.resolve("crons");

async function startupCrons() {
  try {
    await crons.setup();
  } catch (e) {
    console.log(e.message);
  }
  await crons.startLoop();
}

startupCrons();

app.listen(port, () => console.log(`Listening at port: ${port}`));
