const express = require('express');
const taskService = require('../servico/taskService');
const { validaAcesso } = require('../helpers/Auth');

const router = express.Router();

router.post('/', validaAcesso, async (req, res) => {
    const { title, description, points, projectId, requesterId, responsibleId } = req.body;
    const createdById = req.usuario.id; 

    try {
        const task = await taskService.createTask(
            title, 
            description, 
            points, 
            projectId, 
            requesterId, 
            responsibleId, 
            createdById
        );

        res.status(201).json(task); 
    } catch (error) {
        console.error("Erro ao criar a tarefa:", error.message);

        let statusCode = 500;
        let errorMessage = 'Erro ao criar tarefa';

        if (error.message.includes('não encontrado')) {
            statusCode = 404;
            errorMessage = error.message;
        }

        res.status(statusCode).json({ message: errorMessage });
    }
});

router.get('/', validaAcesso, async (req, res) => {
    const { limite = 5, pagina = 1 } = req.query; 

    try {
        const tasks = await taskService.getAllTasks(Number(limite), Number(pagina));
        res.status(200).json(tasks);
    } catch (error) {
        let statusCode = 500;
        let errorMessage = 'Erro ao buscar tarefas';

        if (error.message.includes('O limite deve ser')) {
            statusCode = 400;
            errorMessage = error.message;
        }

        res.status(statusCode).json({ mensagem: errorMessage });
    }
});

router.get('/:id', validaAcesso, async (req, res) => {
    try {
        const task = await taskService.getTaskById(req.params.id);
        res.status(200).json(task);
    } catch (error) {
        let statusCode = 500;
        let errorMessage = 'Erro ao buscar tarefa';

        if (error.message.includes('não encontrada')) {
            statusCode = 404;
            errorMessage = error.message;
        }

        res.status(statusCode).json({ mensagem: errorMessage });
    }
});

router.get('/project/:projectId', validaAcesso, async (req, res) => {
    const { limite = 5, pagina = 1 } = req.query; 
    const projectId = req.params.projectId;

    try {
        const tasks = await taskService.getAllTasksByProjectId(projectId, Number(limite), Number(pagina));
        res.status(200).json(tasks);
    } catch (error) {
        let statusCode = 500;
        let errorMessage = 'Erro ao buscar tarefas';

        if (error.message.includes('O limite deve ser')) {
            statusCode = 400;
            errorMessage = error.message;
        } else if (error.message.includes('Projeto não encontrado')) {
            statusCode = 404;
            errorMessage = error.message;
        }

        res.status(statusCode).json({ mensagem: errorMessage });
    }
});

router.put('/:id', validaAcesso, async (req, res) => {
    const { title, description, points, projectId, requesterId, responsibleId } = req.body;
    const userId = req.usuario.id; 

    try {
        const task = await taskService.getTaskById(req.params.id);
        
        if (!task) {
            return res.status(404).json({ message: 'Tarefa não encontrada' });
        }

        // Verifica se o usuário que está tentando atualizar a tarefa é o criador da tarefa
        if (task.createdById !== userId) {
            return res.status(403).json({ message: 'Você não tem permissão para atualizar esta tarefa' });
        }

        const updatedTask = await taskService.updateTask(req.params.id, {
            title,
            description,
            points,
            projectId,
            requesterId,
            responsibleId
        });

        res.status(200).json(updatedTask);
    } catch (error) {
        let statusCode = 500;
        let errorMessage = 'Erro ao atualizar tarefa';

        // Verifica se houve um problema com os IDs referenciados (projeto, solicitante, responsável)
        if (error.message.includes('não encontrado')) {
            statusCode = 404;
            errorMessage = error.message;
        }

        res.status(statusCode).json({ message: errorMessage });
    }
});

router.delete('/:id', validaAcesso, async (req, res) => {
    const taskId = req.params.id;
    const userId = req.usuario.id; 

    try {
        await taskService.deleteTask(taskId, userId);
        res.status(200).json({ mensagem: 'Tarefa excluída com sucesso' });
    } catch (error) {
        let statusCode = 500;
        let errorMessage = 'Erro ao excluir tarefa';

        if (error.message.includes('não encontrada')) {
            statusCode = 404;
            errorMessage = error.message;
        } else if (error.message.includes('permissão')) {
            statusCode = 403;
            errorMessage = error.message;
        }

        res.status(statusCode).json({ mensagem: errorMessage });
    }
});


module.exports = router;
