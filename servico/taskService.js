const Task = require('../model/TaskModel');
const User = require('../model/UserModel');
const Project = require('../model/ProjectModel');

module.exports = {
    createTask: async (title, description, points, projectId, requesterId, responsibleId, createdBy) => {
        const project = await Project.findByPk(projectId);
        const requester = await User.findByPk(requesterId);
        const responsible = await User.findByPk(responsibleId);

        if (!project) {
            throw new Error('Projeto não encontrado');
        }
        if (!requester) {
            throw new Error('Solicitante não encontrado');
        }
        if (!responsible) {
            throw new Error('Responsável não encontrado');
        }

        const task = await Task.create({
            title,
            description,
            points,
            projectId,
            requesterId,
            responsibleId,
            createdBy
        });

        return task;
    },

    getAllTasks: async () => {
        return Task.findAll();
    },

    getTaskById: async (id) => {
        const task = await Task.findByPk(id);
        if (!task) {
            throw new Error('Tarefa não encontrada');
        }
        return task;
    },

    updateTask: async (id, updateData) => {
        const task = await Task.findByPk(id);
        if (!task) {
            throw new Error('Tarefa não encontrada');
        }

        await task.update(updateData);
        return task;
    },

    deleteTask: async (id) => {
        const task = await Task.findByPk(id);
        if (!task) {
            throw new Error('Tarefa não encontrada');
        }

        await task.destroy();
    }
};
