module.exports = function ({ db }) {
  async function getAll(date = new Date().toJSON().slice(0, 10)) {}

  return {
    getAll,
  };
};
