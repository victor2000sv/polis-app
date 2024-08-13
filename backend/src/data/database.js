const { pool } = require("../config/mysql");

module.exports = function ({}) {
  const exports = {};

  exports.query = async (query, values = null) => {
    try {
      const conn = await pool.getConnection();

      let results;
      if (values) results = await conn.query(query, values);
      else results = await conn.query(query);

      conn.release();

      return results;
    } catch (error) {
      console.error("Query Error", error);
      throw error;
    }
  };

  return exports;
};
