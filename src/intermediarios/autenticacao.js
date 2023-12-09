const knex = require('../connections/db');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const respondWithError = (res, status, message) => {
    res.status(status).json({ mensagem: message });
};

const authorization = async (req, res, next) => {
    try {
        const { authorization } = req.headers;

        if (!authorization) {
            return respondWithError(res, 401, 'Não autorizado');
        }

        const token = authorization.replace('Bearer ', '').trim();
        const { id } = jwt.verify(token, process.env.JWT);

        const login = await knex('usuarios').where({ id }).first();

        if (!login) {
            return respondWithError(res, 404, 'Usuário não encontrado.');
        }

        const { senha, ...user } = login;
        req.user = user;

        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError && error.name === 'JsonWebTokenError') {
            return respondWithError(res, 403, 'Sem permissão');
        } else {
            return respondWithError(res, 500, 'Erro interno do servidor');
        }
    }
};

module.exports = authorization;
