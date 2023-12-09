const knex = require('../connections/db');
const { uploadArquivo, deletarArquivo } = require('../services/storage');

const cadastrarProduto = async (req, res) => {
    const { descricao, valor } = req.body;
    const { file } = req;

    try {
        const insertProduct = await knex('produtos').insert({
            descricao,
            valor
        }).returning('*');

        if (file) {
            try {
                const image = await uploadArquivo(`products/${insertProduct[0].id}/${file.originalname}`, file.buffer, file.mimetype);
                await knex('produtos').where({ id: insertProduct[0].id }).update({ produto_imagem: image.url });
            } catch (error) {
                return res.status(500).json({ mensagem: "Erro interno do servidor" });
            }
        }

        const finalProduct = await knex('produtos').where({ id: insertProduct[0].id }).first();

        if (!finalProduct) {
            return res.status(400).json({ mensagem: 'O produto não foi cadastrado' });
        }

        return res.status(200).json(finalProduct);
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor" });
    }
};

const listarProdutos = async (req, res) => {
    try {
        const listAll = await knex('produtos').returning('*');
        if (!listAll.length === 0) {
            return res.status(400).json('Nenhum produto encontrado');
        }
        return res.status(200).json(listAll);
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor" });
    }
};

const encontrarIdProduto = async (req, res) => {
    const { id } = req.params;
    try {
        const productFound = await knex('produtos').where({ id }).first();
        if (!productFound) {
            return res.status(404).json({ mensagem: 'Produto não encontrado' });
        }
        return res.status(200).json(productFound);
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor" });
    }
};

const apagarArquivo = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json("O id da imagem deve ser um número válido");
    }

    try {
        const product = await knex('produtos').where({ id }).first();
        if (!product) {
            return res.status(404).json({ mensagem: "Produto não encontrado" });
        }

        if (product.produto_imagem) {
            const path = product.produto_imagem.replace(/^.*?\/products\/\d+\//, `products/${id}/`);
            await deletarArquivo(path);
        }

        await knex('produtos').where({ id }).del();

        return res.sendStatus(204);
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor' });
    }
};

module.exports = {
    cadastrarProduto,
    listarProdutos,
    encontrarIdProduto,
    apagarArquivo,
};
