module.exports = function ({ db }) {
  async function getAll(date = null) {
    const startDate = date !== null ? new Date(date) : new Date();

    let endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 1);

    const events = await db.query(
      "SELECT * FROM events WHERE date >= ? AND date < ?;",
      [startDate.toJSON().slice(0, 10), endDate.toJSON().slice(0, 10)]
    );

    return events;
  }

  return {
    getAll,
  };
};
