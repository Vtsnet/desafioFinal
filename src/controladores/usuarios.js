const knex = require('../connections/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const cadastrarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body;
    try {
        const encriptedPassword = await bcrypt.hash(senha, 10);
        const newUser = await knex('usuarios').insert({ nome, email, senha: encriptedPassword }).returning(['id','nome', 'email']);

        if (!newUser) {
            return res.status(400).json({ mensagem: 'O usuário não foi cadastrado.' });
        };

        return res.status(201).json(newUser[0]);
    } catch (erro) {
        return res.status(500).json({ mensagem: "Erro interno do servidor" });
    };
};

const loginUser = async (req, res) => {
    const { email, senha } = req.body;

    try {
        const userFound = await knex('usuarios').where({ email }).first();

        if (!userFound) {
            return res.status(400).json({ mensagem: "Usário não encontrado" });
        };

        const verifyPassword = await bcrypt.compare(senha, userFound.senha);

        if (!verifyPassword) {
            return res.status(400).json({ mensagem: "O email ou senha não conferem" });
        };

        const token = jwt.sign({ id: userFound.id }, process.env.JWT, { expiresIn: '8h' });

        const { senha: _, ...userData } = userFound;

        return res.status(200).json({
            usuario: userData,
            token
        });
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor" });
    };
};


module.exports = {
    cadastrarUsuario,
    loginUser
};