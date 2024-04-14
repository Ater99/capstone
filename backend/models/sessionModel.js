// SessionModel.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db'); // Adjust the path to your db.js file

const SessionModel = sequelize.define('Session', {
  sid: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  expires: DataTypes.DATE,
  data: DataTypes.TEXT,
  userId: DataTypes.INTEGER, // Add a field to store the user ID
}, {
  tableName: 'Sessions', // This should match the table name you're using in SequelizeStore
});

module.exports = SessionModel;
