const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const User = require('../model/UserModel.js'); 

// Rota para autenticação
router.post('/auth', async (req, res) => {
    const { usuario, senha } = req.body;

    try {
        const user = await User.findOne({ where: { username: usuario } });

        if (!user) {
            return res.status(404).json({ logged: false, mensagem: 'Usuário não encontrado' });
        }

        const isPasswordValid = user.password === senha; 

        if (isPasswordValid) {
            // Gera o token JWT
            const token = jwt.sign(
                { usuario: { id: user.id, username: user.username, isAdmin: user.isAdmin } },
                '123!@#', 
                { expiresIn: '30m' } 
            );
            res.json({ logged: true, token });
        } else {
            res.status(403).json({ logged: false, mensagem: 'Senha inválida' });
        }
    } catch (error) {
        res.status(500).json({ logged: false, mensagem: 'Erro no servidor', error: error.message });
    }
});

module.exports = router;
