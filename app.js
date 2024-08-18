var express = require('express');
var path = require('path');
const Auth = require( './helpers/Auth.js')

var indexRouter = require('./routes/index')

var app = express();
LoginRouter = require('./routes/autenticacao.js')

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api', indexRouter)
app.use('/', LoginRouter)

module.exports = app;