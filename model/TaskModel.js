const { DataTypes } = require('sequelize');
const sequelize = require('../helpers/ConexãoBD');
const User = require('./UserModel');
const Project = require('./ProjectModel');

const Task = sequelize.define('Task', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [1, 50],
        },
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [1, 300],
        },
    },
    points: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 13,
        },
    }
}, {
    timestamps: true,
});

module.exports = Task;
