const knex = require('../connections/db');
const getProductById = async (productId) => {
    return await knex('produtos').where({ id: productId }).first();
};

const verifyProducts = async (req, res, next) => {
    const { pedido_produtos } = req.body;
    let total = 0;

    try {
        const productPromises = pedido_produtos.map(async (each) => {
            const { produto_id, quantidade_produto } = each;
            const productFound = await getProductById(produto_id);

            if (!productFound) {
                throw new Error('Um ou mais produtos não existem no banco de dados.');
            }

            total += productFound.valor * quantidade_produto;
        });

        await Promise.all(productPromises);

        req.total = total;
        return next();
    } catch (error) {
        return res.status(400).json({ mensagem: error.message });
    }
};

module.exports = {
    verifyProducts
};
