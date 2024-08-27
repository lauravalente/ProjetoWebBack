const { DataTypes } = require('sequelize');
const sequelize = require('../helpers/ConexãoBD');
const User = require('./UserModel'); // Verifique o caminho

const Project = sequelize.define('Project', {
    projectName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    leaderUsername: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'username',
        },
    }
}, {
    timestamps: true,
});

module.exports = Project;
