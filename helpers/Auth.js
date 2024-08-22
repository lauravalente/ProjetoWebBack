const jwt = require('jsonwebtoken');
const User = require('../model/UserModel.js');

module.exports = {
    validaAcesso: (req, res, next) => {
        const bearer = req.headers['authorization'] || '';
        const token = bearer.split(' ')[1]; // Pega o token após 'Bearer'
    
        if (!token) {
          return res.status(401).json({ mensagem: 'Token não fornecido' });
        }
    
        jwt.verify(token, '123!@#', (err, obj) => {
          if (err) {
            return res.status(403).json({ mensagem: 'Token inválido' });
          }
    
          req.usuario = obj.usuario; // Define req.usuario com as informações do token
          next();
        });
      },
      verifyAdmin: async (req, res, next) => {
        const usuario = req.usuario;
    
        if (!usuario || !usuario.id) {
          return res.status(403).json({ mensagem: 'Usuário não autenticado' });
        }
    
        try {
          // Encontre o usuário no banco de dados usando o ID fornecido
          const user = await User.findByPk(usuario.id);
    
          if (user && user.isAdmin) {
            next(); // Usuário é administrador, permitir a ação
          } else {
            res.status(403).json({ mensagem: 'Acesso negado. Privilégios de administrador necessários.' });
          }
        } catch (error) {
          console.error('Erro ao verificar permissões:', error.message);
          res.status(500).json({ mensagem: 'Erro ao verificar permissões do usuário.', error: error.message });
        }
      }
    };
