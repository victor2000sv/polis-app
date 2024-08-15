module.exports = function ({ db }) {
  const exports = {};

  exports.setup = async () => {
    const results = await db.query("SELECT COUNT(id) FROM events");
    console.log(results);
  };

  return exports;
};
