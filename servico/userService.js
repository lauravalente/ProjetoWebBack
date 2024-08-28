const User = require('../model/UserModel');
const Project = require('../model/ProjectModel');

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
    },

    // Função para listar todos os usuários de um projeto com paginação
    getUsersByProject: async (projectId, limit, page) => {
        const offset = (page - 1) * limit;

        const project = await Project.findByPk(projectId);
        if (!project) {
            throw new Error('Projeto não encontrado');
        }

        const users = await User.findAll({
            where: { projectId },
            limit: limit,
            offset: offset
        });

        return users;
    },

    // Função para listar todos os usuários com paginação
    getAllUsers: async (limit, page) => {
        const offset = (page - 1) * limit;

        const users = await User.findAndCountAll({
            limit: limit,
            offset: offset
        });

        return users;
    }
};
