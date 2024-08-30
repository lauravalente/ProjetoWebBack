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

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use('/api/projects', projectController); 
app.use('/api/tasks', taskController); 
app.use('/user', userController); 
app.use('/', LoginRouter);
app.use('/install', installRoutes);


module.exports = app;
