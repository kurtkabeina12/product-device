const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'financial-platform',
  password: '122712',
  port: 5000,
});

module.exports = pool;

