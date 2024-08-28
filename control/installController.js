const express = require('express');
const router = express.Router();
const sequelize = require('../helpers/ConexãoBD');
const User = require('../model/UserModel');
const Project = require('../model/ProjectModel');
const Task = require('../model/TaskModel');

router.get('/', async (req, res) => {
    try {
        // Sincroniza os modelos com o banco de dados
        await sequelize.sync({ force: true });

        // Criação de dados iniciais para a tabela de usuários
        await User.bulkCreate([
            { username: 'admin', password: 'admin', name: 'Admin User', isAdmin: true },
            { username: 'Laura', password: '123', name: 'Laura Valente', isAdmin: true },
            { username: 'Gabriel', password: '123', name: 'Gabriel Furtado', isAdmin: false },
            { username: 'Ludmila', password: '123', name: 'Ludmila Valente', isAdmin: false },
            { username: 'Luciana', password: '123', name: 'Luciana Valente', isAdmin: false },
            { username: 'Matheus', password: '123', name: 'Matheus Souza', isAdmin: false }
        ]);

        // Criação de dados iniciais para a tabela de projetos
        await Project.bulkCreate([
            { projectName: 'Project One', leaderUsername: 'admin' },
            { projectName: 'Project Alpha', leaderUsername: 'Laura' },
            { projectName: 'Project Beta', leaderUsername: 'Gabriel' },
            { projectName: 'Project Gamma', leaderUsername: 'Ludmila' },
            { projectName: 'Project Delta', leaderUsername: 'Matheus' },
            { projectName: 'Project Epsilon', leaderUsername: 'Luciana' }
        ]);

        // Criação de dados iniciais para a tabela de tarefas
        await Task.bulkCreate([
            { title: 'Criar a tela de login', description: 'Desenvolver a tela de login do usuário', points: 5, projectId: 1, requesterId: 1, responsibleId: 2, createdById: 1 },
            { title: 'Criar API de login', description: 'Implementar API para autenticação de login', points: 8, projectId: 1, requesterId: 2, responsibleId: 3, createdById: 2 },
            { title: 'Criar tela inicial', description: 'Desenvolver a tela inicial do aplicativo', points: 3, projectId: 2, requesterId: 3, responsibleId: 4, createdById: 3 },
            { title: 'Configurar o projeto', description: 'Configurar a estrutura inicial do projeto', points: 10, projectId: 3, requesterId: 4, responsibleId: 1, createdById: 4 },
            { title: 'Garantir tela inicial responsiva', description: 'Garantir que a tela inicial seja responsiva', points: 7, projectId: 4, requesterId: 1, responsibleId: 2, createdById: 1 }
        ]);
        

        res.status(200).json({ message: 'Banco de dados instalado e populado com sucesso.' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao instalar o banco de dados', error: error.message });
    }
});

module.exports = router;
