const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "../../.env.local") });

module.exports = {
  port: !parseInt(process.env.PORT) ? 8080 : process.env.PORT,
  db: {
    host: process.env.DB_HOST,
    port: !parseInt(process.env.DB_PORT) ? 3306 : process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  },
};
