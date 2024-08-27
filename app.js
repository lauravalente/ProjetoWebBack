var express = require('express');
var path = require('path');
require('dotenv').config({ path: '.env.postgres' });
const { User, Project, Task } = require('./model/index'); // Importar do arquivo de configuração
const userController = require('./control/userController');
const LoginRouter = require('./control/autenticacao.js');
const projectController = require('./control/projectController');
const taskController = require('./control/taskController');

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/projects', projectController); // Integração da rota de projetos
app.use('/api/tasks', taskController); // Integração da rota de tarefas
app.use('/user', userController); // Integração da rota
app.use('/', LoginRouter);

// Verifica se já existe um administrador no sistema
User.findOne({ where: { isAdmin: true } })
    .then(adminExists => {
        if (!adminExists) {
            // Cria o administrador padrão
            return User.create({
                name: 'Admin',
                username: 'admin@example.com',
                password: 'admin123', 
                isAdmin: true,
            });
        }
    })
    .then(newAdmin => {
        if (newAdmin) {
            console.log('Administrador padrão criado.');
        }
    })
    .catch(error => {
        console.error('Erro ao criar administrador:', error);
    });

module.exports = app;
