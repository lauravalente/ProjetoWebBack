const User = require('../model/UserModel');

module.exports = {
    // Função para registrar um novo usuário
    registerUser: async (username, password, name) => {
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            throw new Error('Nome de usuário já existe');
        }

        const user = await User.create({
            username,
            password,
            name
        });

        return user;
    },

    // Função para atualizar um usuário
    updateUser: async (id, updateData) => {
        const user = await User.findByPk(id);
        if (!user) {
            throw new Error('Usuário não encontrado');
        }

        await user.update(updateData);
        return user;
    },

    // Função para excluir um usuário
    deleteUser: async (id) => {
        const user = await User.findByPk(id);
        if (!user) {
            throw new Error('Usuário não encontrado');
        }

        await user.destroy();
    }
};
