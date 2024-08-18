const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const sequelize = require('../helpers/ConexãoBD.js'); // Importa a conexão com o banco de dados
const User = require('../model/UserModel.js'); // Importa o modelo de usuário (é necessário criar esse modelo)

router.get("/auth", async (req, res) => {
    const { usuario, senha } = req.body;

    try {
        // Verifica se o usuário existe no banco de dados
        const user = await User.findOne({ where: { username: usuario } });
        
        if (!user) {
            return res.status(403).json({ logged: false, mensagem: 'Usuário não encontrado' });
        }
        
        // Verifica se a senha está correta
        const isPasswordValid = user.password === senha; // Aqui é uma comparação simples, mas idealmente use hash

        if (isPasswordValid) {
            const token = jwt.sign({ usuario: usuario }, '123!@#', { expiresIn: '30 min' });
            res.json({ logged: true, token: token });
        } else {
            res.status(403).json({ logged: false, mensagem: 'Senha inválida' });
        }
    } catch (error) {
        res.status(500).json({ logged: false, mensagem: 'Erro no servidor', error: error.message });
    }
});

module.exports = router;