const { DataTypes } = require('sequelize');
const sequelize = require('../helpers/ConexãoBD');

const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Garante que o nome de usuário seja único
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true, // Permite que o nome seja opcional
    },
    isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false, // Define o valor padrão como false
    }
}, {
    timestamps: true, // Adiciona createdAt e updatedAt
});

module.exports = User;
