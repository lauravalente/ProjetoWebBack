const Task = require('../model/TaskModel');
const User = require('../model/UserModel');
const Project = require('../model/ProjectModel');

module.exports = {
    createTask: async (title, description, points, projectId, requesterId, responsibleId, createdById) => {
        const project = await Project.findByPk(projectId);
        if (!project) {
            throw new Error('Projeto não encontrado');
        }

        const requester = await User.findByPk(requesterId);
        if (!requester) {
            throw new Error('Solicitante não encontrado');
        }

        const responsible = await User.findByPk(responsibleId);
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
            createdById
        });

        return task;
    },

    getAllTasks: async (limit, page) => {
        const offset = (page - 1) * limit; 

        const validLimits = [5, 10, 30];
        if (!validLimits.includes(limit)) {
            throw new Error('O limite deve ser 5, 10 ou 30');
        }

        return Task.findAndCountAll({
            limit: limit,
            offset: offset,
        });
    },
    getTaskById: async (id) => {
        const task = await Task.findByPk(id);
        if (!task) {
            throw new Error('Tarefa não encontrada');
        }
        return task;
    },
    getAllTasksByProjectId: async (projectId, limit, page) => {
        const offset = (page - 1) * limit; 

        const validLimits = [5, 10, 30];
        if (!validLimits.includes(limit)) {
            throw new Error('O limite deve ser 5, 10 ou 30');
        }

        const project = await Project.findByPk(projectId);
        if (!project) {
            throw new Error('Projeto não encontrado');
        }

        return Task.findAndCountAll({
            where: { projectId: projectId },
            limit: limit,
            offset: offset,
        });
    },

        updateTask: async (id, updateData) => {
            const task = await Task.findByPk(id);
            if (!task) {
                throw new Error('Tarefa não encontrada');
            }

            await task.update(updateData);
            return task;
        },

        deleteTask: async (id, userId) => {
            const task = await Task.findByPk(id);
        
            if (!task) {
                throw new Error('Tarefa não encontrada');
            }
        
            if (task.createdById !== userId) {
                throw new Error('Você não tem permissão para excluir esta tarefa');
            }
        
            await task.destroy();
        },
};
