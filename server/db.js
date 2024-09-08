// PostgreSQL connection setup using the 'pg' library
const { Pool } = require("pg");
const dotenv = require("dotenv");

dotenv.config();

// Configure the PostgreSQL pool using environment variables
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
