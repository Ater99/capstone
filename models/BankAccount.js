const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('Empower360', 'postgres', 'Atermadhol99@', {
 host: 'localhost',
 dialect: 'postgres',
 // Add any other configurations you need
});

const BankAccount = sequelize.define('BankAccount', {
 id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
},


 email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
 },
 phone_number: {
    type: DataTypes.STRING,
    allowNull: false,
 },
 dateOfBirth: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'dateofbirth', // Explicitly set the column name to match the database
 },
 occupation: {
    type: DataTypes.STRING,
    allowNull: false,
 },
 
 accountNumber: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'account_number',
 },
 accountName: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'account_name',
 },
 /* bankName: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'bank_name',
 }, */
 pin: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'pin_hash',
 },
},
 {
 tableName: 'bankaccounts', // Explicitly set the table name to match your database
});

module.exports = BankAccount;
