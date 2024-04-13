// models/userDetails.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./user'); // Ensure path correctness

class UserDetails extends Model {}

UserDetails.init({
  // Assuming userId links UserDetails to User
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true, // Enforces one-to-one relation
    references: {
      model: 'users',
      key: 'id',
    },
  },
  phone_number: DataTypes.STRING,
  account_number: DataTypes.STRING,
  account_name: DataTypes.STRING,
  bank_name: DataTypes.STRING,
  date_of_birth: DataTypes.DATEONLY,
  // Consider including any other fields from your detailed structure
}, {
  sequelize,
  modelName: 'UserDetails',
  timestamps: true,
  paranoid: true, // If you want to enable soft deletes
});

// Establishing one-to-one relationship to User
User.hasOne(UserDetails, { foreignKey: 'userId' });
UserDetails.belongsTo(User, { foreignKey: 'userId' });

module.exports = UserDetails;
