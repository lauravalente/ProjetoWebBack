var express = require('express');
var path = require('path');
require('dotenv').config({ path: '.env.postgres' });
const { User, Project, Task } = require('./model/index'); // Importar do arquivo de configuração
const userController = require('./control/userController');
const LoginRouter = require('./control/autenticacao.js');
const projectController = require('./control/projectController');
const taskController = require('./control/taskController');
const installRoutes = require('./control/installController');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger.json');

var app = express();

// Rota para a documentação Swagger
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/projects', projectController); // Integração da rota de projetos
app.use('/api/tasks', taskController); // Integração da rota de tarefas
app.use('/user', userController); // Integração da rota
app.use('/', LoginRouter);
app.use('/install', installRoutes);


module.exports = app;
