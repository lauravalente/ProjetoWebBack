var express = require('express');
var router = express.Router();
const Auth = require( '../helpers/Auth.js')

router.get("/", (req, res) => {
  res.json({status: true, msg: "Hello World!"})
})

router.get('/rota-protegida', Auth.validaAcesso, (req, res) => {
  res.json({ mensagem: 'Bem vindo' });
});

module.exports = router;//
