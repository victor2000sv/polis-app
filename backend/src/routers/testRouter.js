const express = require("express");

module.exports = function ({ crons }) {
  const router = express.Router();

  router.get("/", async (req, res) => {
    try {
      await crons.startLoop();
    } catch {}
    res.status(200).end();
  });

  return router;
};
