const { Client } = require('pg');

const client = new Client({
  user: 'paul',
  host: 'localhost',
  database: 'express',
  password: 'Rladudwn1!',
  port: 5432,
});

client.connect();

module.exports = client;
