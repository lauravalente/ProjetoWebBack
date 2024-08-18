const jwt = require('jsonwebtoken')
const express = require('express')
const router = express.Router()

router.post("/auth", (req, res) => {
    let {usuario, senha} = req.body
    if(usuario != ""  && usuario == senha) {
        let token = jwt.sign({usuario: usuario}, '123!@#', {expiresIn: '30 min'})
        res.json({logged: true, token: token})
    }else {
        res.status(403).json({logged: false, mensagem: 'Usuário e senha inválidos'})
    }
})


module.exports = router;