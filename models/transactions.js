const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db');

class transactions extends Model {}

transactions.init({
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  user_id: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  },
  accountNumber: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  type: { 
    type: DataTypes.STRING, 
    allowNull: false  // deposit, withdrawal, transfer, paybill
  },
  amount: { 
    type: DataTypes.DECIMAL(10, 2), // Updated for precision
    allowNull: false 
  },
  status: { 
    type: DataTypes.STRING, 
    allowNull: false  // e.g., pending, completed
  },
  recipientAccountNumber: { 
    type: DataTypes.STRING, 
    allowNull: true  // For transfer transactions
  },
  paymentMethod: { 
    type: DataTypes.STRING, 
    allowNull: true  // For paybill transactions, e.g., mobileMoney, bankTransfer, payBill
  },
  paymentDetails: { 
    type: DataTypes.JSON, 
    allowNull: true  // JSON object to store variable payment details
  },
  billId: { 
    type: DataTypes.STRING, 
    allowNull: true  // For identifying the bill in paybill transactions
  }
}, {
  sequelize,
  modelName: 'Transaction',
  timestamps: true,
});

module.exports = transactions;
