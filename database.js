const { PostgreSQL } = require('fxsql');
const { CONNECT } = PostgreSQL;
const POOL = CONNECT({
  host: 'localhost',
  user: 'paul',
  database: 'express',
});

module.exports = POOL;

/* const { Client } = require('pg');

const client = new Client({
  user: 'paul',
  host: 'localhost',
  database: 'express',
  port: 5432,
});

client.connect();

module.exports = client;
 */
