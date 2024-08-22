var express = require('express');
var path = require('path');
require('dotenv').config({ path: '.env.postgres' });
const Auth = require( './helpers/Auth.js')
const userController = require('./control/userController'); // Verifique o caminho correto
const sequelize = require('./helpers/ConexãoBD.js');
var indexRouter = require('./control/index')
const jwt = require('jsonwebtoken');
const User = require('./model/UserModel'); // Adicione esta linha

var app = express();
LoginRouter = require('./control/autenticacao.js')

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/user', userController); // Integração da rota
app.use('/api', indexRouter)
app.use('/', LoginRouter)


// Sincronizar os modelos com o banco de dados
sequelize.sync({ alter: true }) // Sincroniza sem perder dados existentes, apenas ajusta a tabela
    .then(() => {
        console.log('Banco de dados sincronizado.');

        // Verifica se já existe um administrador no sistema
        return User.findOne({ where: { isAdmin: true } });
    })
    .then(adminExists => {
        if (!adminExists) {
            // Cria o administrador padrão
            return User.create({
                name: 'Admin',
                username: 'admin@example.com',
                password: 'admin123', // Certifique-se de hashear a senha
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
        console.error('Erro ao sincronizar o banco de dados ou criar administrador:', error);
    });


module.exports = app;