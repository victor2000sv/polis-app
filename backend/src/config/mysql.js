const { createPool } = require("mariadb");

const {
  db: { host, port, user, password, database },
} = require("../config");

const pool = createPool({
  host,
  port,
  user,
  password,
  database,
  multipleStatements: true,
});

pool.on("error", (error) => {
  console.error("Error from pool", error);
});

module.exports = {
  pool,
};
