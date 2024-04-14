const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db'); // Adjust this path to where your database connection is configured

class Saving extends Model {}

Saving.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  balance: { type: DataTypes.DECIMAL, allowNull: false },
  interest_rate: { type: DataTypes.DECIMAL, allowNull: false },
  last_interest_date: { type: DataTypes.DATE },
}, { sequelize, modelName: 'Saving' });

Saving.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Saving, { foreignKey: 'user_id' });
