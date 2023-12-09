const joi = require('joi');

const productBodySchema = joi.object({
    descricao: joi.string().trim().required().min(1).max(80).messages({
        'any.required': 'O campo descrição é obrigatório',
        'string.empty': 'O campo descrição é obrigatório',
        'string.min': 'Quantidade de caracteres inválido',
        'string.max': 'O campo descrição tem o limite máximo de {#limit} caracteres'
    }),

    valor: joi.number().integer().required().positive().messages({
        'any.required': 'O campo valor é obrigatório',
        'number.integer': 'Apenas valores inteiros são permitidos',
        'number.positive': 'Valor inválido, tente um numero positivo',
        'number.base': 'O número informado não é um valor válido',
    })
});

module.exports = productBodySchema;