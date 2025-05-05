const { Pool } = require("pg");
require("dotenv").config();
// All of the following properties should be read from environment variables
// We're hardcoding them here for simplicity
// A "pool" is a collectaion of clients - it holds onto those connections.
module.exports = new Pool({
  host: "localhost", // or wherever the db is hosted
  user: "nathan_pulsemedica",
  database: "members_only",
  password: "<role_password>",
  port: parseInt(process.env.DB_PORT, 10) // The default port of postgresql.
});
