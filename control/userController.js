const express = require('express');
const router = express.Router();
const userService = require('../servico/userService'); // Verifique o caminho

router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ status: false, msg: 'Nome de usuário e senha são obrigatórios' });
        }

        const user = await userService.registerUser(username, password);

        res.status(201).json({ status: true, msg: 'Usuário registrado com sucesso', user });
    } catch (error) {
        console.error(error.message);
        res.status(400).json({ status: false, msg: error.message });
    }
});

module.exports = router;
