const Joi = require('joi');

const addProduct = {
    body: Joi.object().keys({
        name: Joi.string().required(),
        category: Joi.string().required().valid('fertilizer', 'pesticide', 'tool', 'seed'),
        type: Joi.string().required().valid('organic', 'chemical', 'hardware'),
        price: Joi.number().required().min(0),
        stock: Joi.number().required().min(0),
    })
};

const updateStock = {
    params: Joi.object().keys({
        id: Joi.string().required(), // Simple MongoID format length check can be added
    }),
    body: Joi.object().keys({
        stock: Joi.number().required().min(0)
    })
};

module.exports = {
    addProduct,
    updateStock
};
