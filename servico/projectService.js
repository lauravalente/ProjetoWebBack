const Project = require('../model/ProjectModel');
const User = require('../model/UserModel');

module.exports = {
    createProject: async (projectName, leaderUsername) => {
        const leader = await User.findOne({ where: { username: leaderUsername } });
        if (!leader) {
            throw new Error('Líder do projeto não encontrado');
        }
        if (await Project.findOne({ where: { leaderUsername: leader.username } })) {
            throw new Error('O líder já está vinculado a outro projeto');
        }

        const project = await Project.create({
            projectName,
            leaderUsername: leader.username
        });

        return project;
    },

    getAllProjects: async (limit, page) => {
        const offset = (page - 1) * limit; // Calcula o offset com base na página e no limite
    
        // Validação dos parâmetros de limite
        const validLimits = [5, 10, 30];
        if (!validLimits.includes(limit)) {
            throw new Error('O limite deve ser 5, 10 ou 30');
        }
    
        // Busca os projetos com paginação
        return Project.findAndCountAll({
            limit: limit,
            offset: offset,
        });
    },

    getProjectById: async (id) => {
        const project = await Project.findByPk(id);
        if (!project) {
            throw new Error('Projeto não encontrado');
        }
        return project;
    },

    updateProject: async (id, updateData) => {
        const project = await Project.findByPk(id);
        if (!project) {
            throw new Error('Projeto não encontrado');
        }

        await project.update(updateData);
        return project;
    },
        // Função para excluir um projeto
    deleteProject: async (id) => {
        try {
            // Encontra o projeto pelo ID
            const project = await Project.findByPk(id);
            if (!project) {
                throw new Error('Projeto não encontrado');
            }

            // Exclui o projeto
            await project.destroy();

            // Retorna uma mensagem de sucesso
            return { mensagem: 'Projeto excluído com sucesso' };
        } catch (error) {
            // Lança um erro que pode ser capturado pelo controlador
            throw new Error(`Erro ao excluir o projeto: ${error.message}`);
        }
    },
    addUserToProject: async (projectId, userId) => {
        // Recupera o projeto pelo ID
        const project = await Project.findByPk(projectId);
        if (!project) {
            throw new Error('Projeto não encontrado');
        }

        // Recupera o usuário pelo ID
        const user = await User.findByPk(userId);
        if (!user) {
            throw new Error('Usuário não encontrado');
        }

        // Verifica se o usuário já está associado a outro projeto
        if (user.projectId && user.projectId !== projectId) {
            throw new Error('Usuário já está associado a outro projeto');
        }

        // Associa o usuário ao projeto
        user.projectId = projectId;
        await user.save();

        return { message: 'Usuário vinculado ao projeto com sucesso' };
    }
};
