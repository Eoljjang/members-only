const { Pool } = require("pg");
require("dotenv").config();
// All of the following properties should be read from environment variables
// We're hardcoding them here for simplicity
// A "pool" is a collectaion of clients - it holds onto those connections.
let pool;

// Running on Render or other hosted service
if (process.env.DB_URL) {
  pool = new Pool({
    connectionString: process.env.DB_URL,
    ssl: {
      rejectUnauthorized: false // Required on Render
    }
  });
} else {
  // Local development config
  pool = new Pool({
    host: "localhost",
    user: process.env.POOL_USER,
    database: "members_only",
    password: process.env.POOL_PASSWORD,
    port: parseInt(process.env.DB_PORT, 10)
  });
}
