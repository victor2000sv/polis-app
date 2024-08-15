const express = require("express");

module.exports = function ({ eventsData }) {
  const router = express.Router();

  router.get("/all", async (req, res) => {
    const { date } = req.query;
    try {
      const events = await eventsData.getAll(date);
      if (events.length == 0) return res.status(404).end();
      return res.status(200).json(events);
    } catch (error) {
      console.log(error);

      res.status(500).end();
    }
  });

  return router;
};
