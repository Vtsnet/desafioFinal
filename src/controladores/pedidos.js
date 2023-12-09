const knex = require('../connections/db');
const { format } = require('date-fns');

const registerOrder = async (req, res) => {
    const { data, pedido_produtos } = req.body;
    const totalPrice = req.total;
    try {
        const dataOrder = data ? data : format(new Date(), 'dd-MM-yyyy');
        const registerTotalOrder = await knex('pedidos').insert({ data: dataOrder, valor_total: totalPrice }).returning('*');
        for (const each of pedido_produtos) {
            await knex('pedido_produtos').insert({ pedido_id: registerTotalOrder[0].id, produto_id: each.produto_id, quantidade_produto: each.quantidade_produto }).returning('*');
        };

        const formatedData = format(registerTotalOrder[0].data, 'dd-MM-yyyy');

        const returnObject = {
            id: registerTotalOrder[0].id,
            data: formatedData,
            valor_total: registerTotalOrder[0].valor_total
        };

        return res.status(201).json(returnObject);
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor.' });
    };
};

const listOrders = async (req, res) => {
    const { a_partir } = req.query;
    try {
        const query = knex('pedidos')
            .select({
                pedido_id: 'pedidos.id',
                valor_total: 'pedidos.valor_total',
                data: 'pedidos.data',
                pedido_produto_id: 'pedido_produtos.id',
                quantidade_produto: 'pedido_produtos.quantidade_produto',
                valor_produto: 'produtos.valor',
                produto_id: 'pedido_produtos.produto_id'
            })
            .leftJoin('pedido_produtos', 'pedidos.id', 'pedido_produtos.pedido_id')
            .leftJoin('produtos', 'pedido_produtos.produto_id', 'produtos.id').modify((queryBuilder) => {
                if (a_partir) {
                    queryBuilder.where('pedidos.data', '>=', a_partir);
                }
            });

        const orders = await query;

        const formatedData = orders.map((element) => {
            const formatedData = format(element.data, 'dd-MM-yyyy')
            return {
                ...element,
                data: formatedData
            };
        });

        const groupedOrders = {};

        for (const each of formatedData) {
            const {
                pedido_id,
                valor_total,
                data,
                pedido_produto_id,
                quantidade_produto,
                valor_produto,
                produto_id
            } = each;

            if (!groupedOrders[pedido_id]) {
                groupedOrders[pedido_id] = {
                    pedido: { id: pedido_id, valor_total, data },
                    pedido_produtos: []
                };
            };

            groupedOrders[pedido_id].pedido_produtos.push({
                id: pedido_produto_id,
                quantidade_produto,
                valor_produto,
                pedido_id,
                produto_id
            });
        };

        const finalList = Object.values(groupedOrders);

        return res.status(200).json(finalList);
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor.' });
    };
};

module.exports = {
    registerOrder,
    listOrders
};