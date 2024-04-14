const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db');

class momo extends Model {}

momo.init({
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  user_id: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  },
  
  amount: { 
    type: DataTypes.DECIMAL(10, 2), // Updated for precision
    allowNull: false 
  },
  
}, {
  sequelize,
  modelName: 'momo',
  timestamps: true,
});

module.exports = momo;
