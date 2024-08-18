var express = require('express');
var path = require('path');
require('dotenv').config({ path: '.env.postgres' });
const Auth = require( './helpers/Auth.js')
const userController = require('./control/userController'); // Verifique o caminho correto
const sequelize = require('./helpers/ConexãoBD.js');
var indexRouter = require('./control/index')

var app = express();
LoginRouter = require('./control/autenticacao.js')

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/user', userController); // Integração da rota

app.use('/api', indexRouter)
app.use('/', LoginRouter)

// Sincronizar os modelos com o banco de dados
sequelize.sync()
    .then(() => {
        console.log('Banco de dados sincronizado.');
        // Iniciar o servidor aqui, se necessário
    })
    .catch((error) => {
        console.error('Erro ao sincronizar o banco de dados:', error);
    });

module.exports = app;