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

  router.get("/types", async (req, res) => {
    try {
      const types = await eventsData.getTypes();
      if (types.length == 0) return res.status(404).end();
      res.status(200).json(types);
    } catch (error) {
      console.log(error);
      res.status(500).end();
    }
  });

  router.get("/types/rank", async (req, res) => {
    let { year } = req.query;
    year = year ? year : new Date().getFullYear();
    try {
      const rankedTypes = await eventsData.getTypeRankListByYear(year);
      if (rankedTypes.length == 0) return res.status(404).end();
      res.status(200).json(rankedTypes);
    } catch (error) {
      console.error(error);

      res.status(500).end();
    }
  });

  router.get("/types/stats", async (req, res) => {
    const { type: typeId, year } = req.query;
    if (!typeId) return res.status(400).end();

    try {
      const stats = await eventsData.getTypeStatistics(
        typeId,
        year ? year : new Date().getFullYear()
      );
      if (!stats) return res.status(404).end();

      res.status(200).json(stats);
    } catch (error) {
      console.error(error);
      res.status(500).end();
    }
  });

  router.get("/list", async (req, res) => {
    let { page, perPage } = req.query;
    page = page ? page : 1;
    perPage = perPage ? perPage : 20;

    try {
      const events = await eventsData.listAll(perPage, page);
      if (events.length == 0) return res.status(404).end();
      res.status(200).json(events);
    } catch (e) {
      console.error(e);
      res.status(500).end();
    }
  });

  router.get("/:id", async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).end();
    try {
      const event = await eventsData.getById(id);
      if (!event) return res.status(404).end();
      res.status(200).json(event);
    } catch (e) {
      console.error(e);
      res.status(500).end();
    }
  });

  return router;
};
