const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db');

class Loan extends Model {}

Loan.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  provider: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      isDecimal: true,
      min: 0.01, // Ensure the amount is greater than zero
    },
  },
  // balance: {
  //   type: DataTypes.DECIMAL(10, 2),
  //   allowNull: false,
  //   validate: {
  //     isDecimal: true,
  //     min: 0, // The balance can be zero but not negative
  //   },
  //   // No default value here since it should be explicitly set to match the amount at loan creation
  // },
  interest_rate: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 5.0, // Default interest rate of 5%
  },
  phone_number: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true, // Validate that the email is in a valid format
    },
  },
  full_names: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  current_employment_status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  start_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW, // Default start date to the current date
  },
  due_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'pending', // Default status when a loan is created
  },
}, { sequelize, modelName: 'Loan' });

module.exports = Loan;
