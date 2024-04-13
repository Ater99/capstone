// models/rewardPoint.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db');

class RewardPoints extends Model {}

RewardPoints.init({
 id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
 user_id: { type: DataTypes.INTEGER, allowNull: false },
 points: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 }
}, {
 sequelize,
 modelName: 'RewardPoint',
 timestamps: true,
});

module.exports = RewardPoints;
