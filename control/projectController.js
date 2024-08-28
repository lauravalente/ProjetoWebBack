const express = require('express');
const projectService = require('../servico/projectService');
const { validaAcesso } = require('../helpers/Auth');
const User = require('../model/UserModel');

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
        const limit = parseInt(req.query.limite) || 5; // Padrão: 5
        const page = parseInt(req.query.pagina) || 1;  // Padrão: 1

        // Validação dos parâmetros de página
        if (page < 1) {
            return res.status(400).json({ message: 'Página deve ser um número positivo' });
        }

        // Recupera os projetos com paginação
        const { rows: projects, count } = await projectService.getAllProjects(limit, page);

        // Retorna os projetos paginados e informações sobre a paginação
        res.status(200).json({
            total: count,                     // Total de projetos
            totalPages: Math.ceil(count / limit), // Total de páginas
            currentPage: page,                // Página atual
            limit: limit,                     // Limite de registros por página
            projects: projects                // Lista de projetos na página atual
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


router.put('/:id', validaAcesso, async (req, res) => {
    const { projectName } = req.body;
    const leaderUsername = req.usuario.username; // Obtendo o nome de usuário do líder a partir do token

    try {
        // Recupera o projeto pelo ID
        const project = await projectService.getProjectById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Projeto não encontrado' });
        }

        // Verifica se o usuário autenticado é o líder do projeto
        const leader = await User.findOne({ where: { username: leaderUsername } });
        if (!leader || project.leaderUsername !== leader.username) {
            return res.status(403).json({ message: 'Você não tem permissão para atualizar este projeto' });
        }

        // Atualiza o projeto com os dados fornecidos
        const updatedProject = await projectService.updateProject(req.params.id, { projectName });

        // Envia o projeto atualizado como resposta
        res.status(200).json(updatedProject);
    } catch (error) {
        // Retorna uma mensagem de erro em caso de falha
        res.status(400).json({ message: 'Erro ao atualizar projeto', error: error.message });
    }
});


// Rota para excluir um projeto
router.delete('/:id', validaAcesso, async (req, res) => {
    const projectId = req.params.id;
    const leaderUsername = req.usuario.username; // Obtendo o nome de usuário do líder a partir do token

    try {
        // Recupera o projeto
        const project = await projectService.getProjectById(projectId);
        if (!project) {
            return res.status(404).json({ mensagem: 'Projeto não encontrado' });
        }

        // Recupera o líder associado ao username
        const leader = await User.findOne({ where: { username: leaderUsername } });
        if (!leader) {
            return res.status(404).json({ mensagem: 'Líder não encontrado' });
        }

        // Verifica se o usuário autenticado é o líder do projeto
        if (project.leaderUsername !== leader.username) {
            return res.status(403).json({ mensagem: 'Você não tem permissão para excluir este projeto' });
        }

        // Exclui o projeto
        await projectService.deleteProject(projectId);

        // Envia uma resposta de sucesso ao cliente
        res.status(200).json({ mensagem: 'Projeto excluído com sucesso' });
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro ao excluir projeto', erro: error.message });
    }
});


module.exports = router;
