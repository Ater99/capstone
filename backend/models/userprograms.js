const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('../models/User'); // Adjust this path as necessary
const Program = require('./programs'); // Adjust this path as necessary

class UserProgram extends Model {}

UserProgram.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    full_names: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true,
        },
    },
    phone_number: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
    },
    educationlevel: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
    },
    currentjob: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
            },
    program_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
    },
    status: {
        type: DataTypes.STRING,
        allowNull: true, // Change allowNull to true
        defaultValue: null, // Set default value to null
        validate: {
            isIn: [['enrolled', 'completed', 'dropped', null]], // Add null to the list of valid values
        },
    },
    /* user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
    },
 */    program_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Program,
            key: 'id',
        },
    },
}, {
    sequelize,
    modelName: 'UserProgram',
    tableName: 'UserPrograms', 
    timestamps: true, // Includes createdAt and updatedAt fields automatically
});

// Define the many-to-many relationships
User.belongsToMany(Program, { through: UserProgram, foreignKey: 'user_id', otherKey: 'program_id', as: 'programs' });
Program.belongsToMany(User, { through: UserProgram, foreignKey: 'program_id', otherKey: 'user_id', as: 'users' });

// Add a custom method to the UserProgram model
UserProgram.prototype.isEnrolledInProgram = async function(programId) {
    const enrollment = await this.getPrograms({
        where: { program_id: programId },
    });
    return enrollment.length > 0;
};

module.exports = UserProgram;
