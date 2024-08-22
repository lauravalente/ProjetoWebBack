const User = require('../model/UserModel');

const registerUser = async (username, password, name) => {
    // Verifica se o usuário já existe
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
        throw new Error('Nome de usuário já existe');
    }

    // Cria um novo usuário com username e senha em texto claro
    const user = await User.create({
        username,
        password, 
        name
    });

    return user;
};

module.exports = { registerUser };
