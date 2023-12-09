const joi = require('joi');

const orderBodySchema = joi.object({
    data: joi.string().trim().min(1).max(10).messages({
        'any.required': 'O campo data está vazio',
        'string.empty': 'O campo data está vazio',
        'string.min': 'Quantidade de caracteres inválido',
        'string.max': 'O campo data tem o limite máximo de {#limit} caracteres'
    }),

    pedido_produtos: joi.array().items(
        joi.object({
            produto_id: joi.number().integer().required().min(1).messages({
                'any.required': 'O campo produto_id é obrigatório',
                'number.integer': 'Apenas valores inteiros são permitidos',
                'number.min': 'O valor minimo permitido é {#limit}',
                'number.base': 'O número informado não é um valor válido',
            }),

            quantidade_produto: joi.number().integer().required().min(0).messages({
                'any.required': 'O campo produto_id é obrigatório',
                'number.integer': 'Apenas valores inteiros são permitidos',
                'number.min': 'O valor minimo permitido é {#limit}',
                'number.base': 'O número informado não é um valor válido',
            })
        })
    ).required().messages({
        'any.required': 'O campo pedido_produtos é obrigatório, junto com o produto_id e quantidade_produto',
    })
});

module.exports = orderBodySchema;