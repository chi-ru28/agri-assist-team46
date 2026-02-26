const Joi = require('joi');

const registerUser = {
    body: Joi.object().keys({
        name: Joi.string().required(),
        phone: Joi.string().required().min(10).max(15),
        password: Joi.string().required().min(8),
        role: Joi.string().required().valid('farmer', 'shopkeeper', 'admin'),
        landSize: Joi.number().when('role', { is: 'farmer', then: Joi.required() }),
        address: Joi.string().when('role', { is: 'shopkeeper', then: Joi.required() }),
        shopName: Joi.string().when('role', { is: 'shopkeeper', then: Joi.required() }),
    }).unknown(true)
};

const loginUser = {
    body: Joi.object().keys({
        phone: Joi.string().required(),
        password: Joi.string().required(),
    }),
};

module.exports = {
    registerUser,
    loginUser,
};
