const { PostgreSQL: { CONNECT } } = require('fxsql');

const POOL = CONNECT({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

module.exports = POOL;