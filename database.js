const { PostgreSQL } = require('fxsql');
const { CONNECT } = PostgreSQL;
const POOL = CONNECT({
  host: 'localhost',
  user: 'paul',
  password: 'Rladudwn1!',
  database: 'express',
});

module.exports = POOL;

/* const { Client } = require('pg');

const client = new Client({
  user: 'paul',
  host: 'localhost',
  database: 'express',
  password: 'Rladudwn1!',
  port: 5432,
});

client.connect();

module.exports = client;
 */
