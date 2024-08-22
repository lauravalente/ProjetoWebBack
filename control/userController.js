const express = require('express');
const router = express.Router();
const userService = require('../servico/userService'); // Verifique o caminho
const Auth = require('../helpers/Auth');
const User = require('../model/UserModel'); // Adicione essa linha

router.post('/register', async (req, res) => {
    try {
        const { username, password, name, isAdmin } = req.body;

        // Verifica se isAdmin foi enviado na requisição
        if (isAdmin !== undefined) {
            return res.status(400).json({ status: false, msg: 'Não é permitido definir isAdmin no registro.' });
        }

        if (!username || !password || !name) {
            return res.status(400).json({ status: false, msg: 'Todos os dados são obrigatórios' });
        }

        const user = await userService.registerUser(username, password, name);

        res.status(201).json({ status: true, msg: 'Usuário registrado com sucesso', user });
    } catch (error) {
        console.error(error.message);
        res.status(400).json({ status: false, msg: error.message });
    }
});

router.post('/admin', Auth.validaAcesso, Auth.verifyAdmin, async (req, res) => {
    try {
        const { name, username, password } = req.body;

        if (!name || !username || !password) {
            return res.status(400).json({ error: 'Nome, nome de usuário e senha são obrigatórios.' });
        }

        // Cria um novo usuário administrador
        const newUser = await User.create({ name, username, password, isAdmin: true });

        res.status(201).json({ message: 'Administrador criado com sucesso.', user: newUser });
    } catch (error) {
        console.error('Erro ao criar administrador:', error.message);
        res.status(500).json({ error: 'Erro ao criar administrador.', details: error.message });
    }
});


module.exports = router;
