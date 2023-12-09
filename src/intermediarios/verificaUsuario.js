const knex = require('../connections/db');
const alreadyExist = async (req, res, next) => {
    const { email } = req.body;
    try {
        const userFound = await knex('usuarios').where({ email }).first();
        if (userFound) {
            return res.status(404).json({ mensagem: "Esse usuario ja existe no sistema." });
        };
        next();
    } catch (erro) {
        return res.status(500).json({ mensagem: "Erro interno do servidor" });
    };
};
module.exports = {
    alreadyExist,
};