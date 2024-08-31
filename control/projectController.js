const express = require('express');
const projectService = require('../servico/projectService');
const { validaAcesso } = require('../helpers/Auth');
const User = require('../model/UserModel');
const isLeader = require('../helpers/IsLeader');

const router = express.Router();

router.post('/', validaAcesso, async (req, res) => {
    const { projectName } = req.body;
    const leaderUsername = req.usuario.username; // Obtendo o nome de usuário do líder a partir do token

    try {
        const project = await projectService.createProject(projectName, leaderUsername);
        res.status(201).json(project);
    } catch (error) {
        res.status(400).json({ message: 'Erro ao criar projeto', error });
    }
});

router.get('/', validaAcesso, async (req, res) => {
    try {
        const limit = parseInt(req.query.limite) || 5; 
        const page = parseInt(req.query.pagina) || 1; 

        if (page < 1) {
            return res.status(400).json({ message: 'Página deve ser um número positivo' });
        }

        const { rows: projects, count } = await projectService.getAllProjects(limit, page);

        // Retorna os projetos paginados e informações sobre a paginação
        res.status(200).json({
            total: count,                     
            totalPages: Math.ceil(count / limit), 
            currentPage: page,                
            limit: limit,                     
            projects: projects                
        });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar projetos', error: error.message });
    }
});

router.get('/:id', validaAcesso, async (req, res) => {
    try {
        const project = await projectService.getProjectById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Projeto não encontrado' });
        }
        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar projeto', error: error.message });
    }
});

router.put('/:id', validaAcesso, isLeader, async (req, res) => {
    const { projectName } = req.body;

    try {
        // Atualiza o projeto com os dados fornecidos
        const updatedProject = await projectService.updateProject(req.params.id, { projectName });
        res.status(200).json(updatedProject);
    } catch (error) {
        res.status(400).json({ message: 'Erro ao atualizar projeto', error: error.message });
    }
});

router.delete('/:id', validaAcesso, isLeader, async (req, res) => {
    const projectId = req.params.id;

    try {
        await projectService.deleteProject(projectId);
        res.status(200).json({ mensagem: 'Projeto excluído com sucesso' });
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro ao excluir projeto', erro: error.message });
    }
});

router.post('/:projectId/user/:userId', validaAcesso, isLeader, async (req, res) => {
    const { projectId, userId } = req.params;

    try {
        // Vincula o usuário ao projeto
        await projectService.addUserToProject(projectId, userId);
        res.status(200).json({ message: 'Usuário vinculado ao projeto com sucesso' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao vincular usuário ao projeto', error: error.message });
    }
});

module.exports = router;
