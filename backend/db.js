require('dotenv').config();

const { Sequelize } = require('sequelize');

// Creating a new Sequelize instance using the connection string
const sequelize = new Sequelize(process.env.DATABASE_URL);

// Test the connection
sequelize.authenticate()
  .then(() => console.log('Connection has been established successfully.'))
  .catch(error => {
    console.error('Unable to connect to the database:', error);
    process.exit(1); // Exit the process if the connection fails
  });

module.exports = sequelize;
