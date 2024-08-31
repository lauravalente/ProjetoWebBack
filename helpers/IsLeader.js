const projectService = require('../servico/projectService');
const User = require('../model/UserModel');

const isLeader = async (req, res, next) => {
    const projectId = req.params.id || req.params.projectId; 
    const leaderUsername = req.usuario.username;

    try {
        // recupera
        const project = await projectService.getProjectById(projectId);
        if (!project) {
            return res.status(404).json({ message: 'Projeto não encontrado' });
        }

        // verifica se é lider
        if (project.leaderUsername !== leaderUsername) {
            return res.status(403).json({ message: 'Você não tem permissão para realizar esta ação' });
        }
        next();
    } catch (error) {
        res.status(500).json({ message: 'Erro ao validar', error: error.message });
    }
};

module.exports = isLeader;
