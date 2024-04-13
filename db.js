// db.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('Empower360', 'postgres', 'Atermadhol99@', {
 host: 'localhost',
 dialect: 'postgres',
 port: 5432,
});

// Test the connection
sequelize.authenticate()
 .then(() => console.log('Connection has been established successfully.'))
 .catch(error => {
    console.error('Unable to connect to the database:', error);
    process.exit(1); // Exit the process if the connection fails
 });

module.exports = sequelize;
