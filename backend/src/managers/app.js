const express = require("express");
const bodyParser = require("body-parser");

const app = express();

module.exports = function ({ testRouter, eventsRouter }) {
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(function (req, res, next) {
    console.log(req.method, req.url);

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Access-Control-Expose-Headers", "*");

    next();
  });

  app.use("/test", testRouter);
  app.use("/events", eventsRouter);

  return app;
};
