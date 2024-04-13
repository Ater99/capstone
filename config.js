// config.js
require('dotenv').config();

const config = {
  db: {
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'Empower360',
    password: process.env.DB_PASSWORD, 
    port: process.env.DB_PORT || 5432,
  },
  port: process.env.PORT || 3000,
};

module.exports = config;
