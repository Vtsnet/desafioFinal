const knex = require('../connections/db');
const validateProductId = async (req, res, next) => {
    const { id } = req.params;

    try {
        const productFound = await knex('produtos').where({ id }).first();

        if (!productFound) {
            return res.status(404).json({ mensagem: 'Produto não encontrado' });
        }

        req.product = productFound;
        next();
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor' });
    }
};

const checkDuplicateProduct = async (req, res, next) => {
    const { descricao } = req.body;

    try {
        const productFound = await knex('produtos').where({ descricao });

        if (productFound.length) {
            return res.status(400).json({ mensagem: 'Produto com descrição já existente.' });
        }

        next();
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor' });
    }
};

module.exports = {
    validateProductId,
    checkDuplicateProduct
};
