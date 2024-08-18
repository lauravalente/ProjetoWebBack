// model/userModel.js
const { DataTypes } = require('sequelize');
const sequelize = require('../helpers/ConexãoBD');

const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: true,
});

module.exports = User;
