const Joi = require('joi');

const strongPassword = (value, helpers) => {
    if (value.length < 8) return helpers.message('Password must be at least 8 characters long');
    if (!/[a-z]/.test(value)) return helpers.message('Password must contain at least one lowercase letter');
    if (!/[A-Z]/.test(value)) return helpers.message('Password must contain at least one uppercase letter');
    if (!/[0-9]/.test(value)) return helpers.message('Password must contain at least one number');
    if (!/[@#$%^&+=!_]/.test(value)) return helpers.message('Password must contain at least one special character (@#$%^&+=!_)');
    return value;
};

const registerUser = {
    body: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required().custom(strongPassword),
        role: Joi.string().required().valid('farmer', 'shopkeeper', 'admin'),
        landSize: Joi.number().when('role', { is: 'farmer', then: Joi.required() }),
        address: Joi.string().when('role', { is: 'shopkeeper', then: Joi.required() }),
        shopName: Joi.string().when('role', { is: 'shopkeeper', then: Joi.required() }),
    }).unknown(true)
};

const loginUser = {
    body: Joi.object().keys({
        email: Joi.string().required(),
        password: Joi.string().required(),
    }),
};

module.exports = {
    registerUser,
    loginUser,
};

