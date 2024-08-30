const express = require('express');
const router = express.Router();
const userService = require('../servico/userService'); 
const Auth = require('../helpers/Auth');
const User = require('../model/UserModel'); 

// Rota para registrar um novo usuário
router.post('/register', async (req, res) => {
    try {
        const { username, password, name, isAdmin } = req.body;

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

router.get('/project/:projectId', Auth.validaAcesso, async (req, res) => {
    const { limite = 5, pagina = 1 } = req.query;

    try {
        const projectId = parseInt(req.params.projectId);
        const users = await userService.getUsersByProject(Number(projectId), Number(limite), Number(pagina));

        res.status(200).json({
            users: users,
            total: users.length,
            limit: Number(limite),
            page: Number(pagina)
        });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar usuários do projeto', error: error.message });
    }
});

router.get('/', Auth.validaAcesso, async (req, res) => {
    const { limite = 5, pagina = 1 } = req.query;

    try {
        const users = await userService.getAllUsers(Number(limite), Number(pagina));

        res.status(200).json({
            users: users.rows,
            total: users.count,
            limit: Number(limite),
            page: Number(pagina),
            totalPages: Math.ceil(users.count / Number(limite))
        });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar usuários', error: error.message });
    }
});

// Rota para criar um novo usuário administrador
router.post('/admin', Auth.validaAcesso, Auth.verifyAdmin, async (req, res) => {
    try {
        const { name, username, password } = req.body;

        if (!name || !username || !password) {
            return res.status(400).json({ error: 'Nome, nome de usuário e senha são obrigatórios.' });
        }

        const newUser = await User.create({ name, username, password, isAdmin: true });

        res.status(201).json({ message: 'Administrador criado com sucesso.', user: newUser });
    } catch (error) {
        console.error('Erro ao criar administrador:', error.message);
        res.status(500).json({ error: 'Erro ao criar administrador.', details: error.message });
    }
});

router.put('/:id', Auth.validaAcesso, async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        const updateData = req.body;
        const usuario = req.usuario;

        // Verifica se o usuário está tentando atualizar a si mesmo ou se é um administrador
        if (usuario.id !== userId) {
            const currentUser = await User.findByPk(usuario.id);
            const userToUpdate = await User.findByPk(userId);

            if (!currentUser.isAdmin || (userToUpdate && userToUpdate.isAdmin)) {
                return res.status(403).json({ mensagem: 'Acesso negado. Você só pode atualizar a si mesmo ou outros usuários não administradores.' });
            }
        }

        const updatedUser = await userService.updateUser(userId, updateData);

        res.status(200).json({ message: 'Usuário atualizado com sucesso.', user: updatedUser });
    } catch (error) {
        console.error('Erro ao atualizar usuário:', error.message);
        res.status(500).json({ error: 'Erro ao atualizar usuário.', details: error.message });
    }
});


router.delete('/:id', Auth.validaAcesso, async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        const usuario = req.usuario;

        // Verifica se o usuário está tentando excluir a si mesmo ou se é um administrador
        if (usuario.id !== userId) {
            const currentUser = await User.findByPk(usuario.id);
            const userToDelete = await User.findByPk(userId);

            if (!currentUser.isAdmin || (userToDelete && userToDelete.isAdmin)) {
                return res.status(403).json({ mensagem: 'Acesso negado. Você só pode excluir a si mesmo ou outros usuários não administradores.' });
            }
        }

        await userService.deleteUser(userId);

        res.status(200).json({ message: 'Usuário excluído com sucesso.' });
    } catch (error) {
        console.error('Erro ao excluir usuário:', error.message);
        res.status(500).json({ error: 'Erro ao excluir usuário.', details: error.message });
    }
});


module.exports = router;
