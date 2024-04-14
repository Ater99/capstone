require('dotenv').config();

const { Sequelize } = require('sequelize');

// Print out the DATABASE_URL to debug
console.log('Database URL:', process.env.DATABASE_URL);

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // Note: setting this for demo, adjust for production as needed
    }
  }
});

sequelize.authenticate()
  .then(() => console.log('Connection has been established successfully.'))
  .catch(error => {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  });

module.exports = sequelize;
