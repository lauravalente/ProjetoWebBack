const jwt = require('jsonwebtoken')

module.exports = {
    validaAcesso : (req, res, next) => {
        let bearer = req.headers['authorization'] || ''
        let token = bearer.split(" ")
        if(token[0] == 'Bearer') {
            token = token[1]
        }
        jwt.verify(token, '123!@#', (err, obj) => {
            if(err) res.status(403).json({mensagem: "token inválido"})
                else {
                    req.usuario = obj.usuario
                    next()
                }
        })
    }
}