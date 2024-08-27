const express = require('express');
const taskService = require('../servico/taskService');
const { validaAcesso } = require('../helpers/Auth');

const router = express.Router();

router.post('/', validaAcesso, async (req, res) => {
    const { title, description, points, projectId, requesterId, responsibleId } = req.body;
    try {
        const task = await taskService.createTask(title, description, points, projectId, requesterId, responsibleId, req.usuario.id);
        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ message: 'Erro ao criar tarefa', error });
    }
});

router.get('/', async (req, res) => {
    try {
        const tasks = await taskService.getAllTasks();
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar tarefas', error });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const task = await taskService.getTaskById(req.params.id);
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar tarefa', error });
    }
});

router.put('/:id', validaAcesso, async (req, res) => {
    const { title, description, points, projectId, requesterId, responsibleId } = req.body;
    try {
        const updatedTask = await taskService.updateTask(req.params.id, { title, description, points, projectId, requesterId, responsibleId });
        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(400).json({ message: 'Erro ao atualizar tarefa', error });
    }
});

router.delete('/:id', validaAcesso, async (req, res) => {
    try {
        await taskService.deleteTask(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Erro ao excluir tarefa', error });
    }
});

module.exports = router;
