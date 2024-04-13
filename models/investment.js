const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db'); // Ensure this is the correct path to your Sequelize connection

class Investment extends Model {}

Investment.init({
    // Define the attributes of the model
    amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    period: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    bankPin: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'Investment',
    tableName: 'investments', // Explicitly setting the table name to lowercase
    freezeTableName: true, // This prevents Sequelize from trying to rename the table
    timestamps: false // Disables the automatic creation of createdAt and updatedAt fields
});

module.exports = Investment;
