// models/program.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db'); // Adjust this path as necessary

class Program extends Model {}

Program.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  type: { 
    type: DataTypes.ENUM,
    values: ['financial_literacy', 'entrepreneurship'], // Specify the allowed values
    allowNull: false 
  },
  description: { type: DataTypes.TEXT },
  status: { type: DataTypes.STRING }, // Consider if ENUM is suitable here as well
}, { sequelize, modelName: 'Program' });

module.exports = Program;
