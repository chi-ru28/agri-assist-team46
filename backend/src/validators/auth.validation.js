const Joi = require('joi');

const phoneOrEmail = Joi.string().required().custom((value, helpers) => {
    // If it contains an '@', treat it as email with no length limit
    if (value.includes('@')) {
        return value;
    }
    // If it's purely numerical, enforce 10 digits
    if (/^\d+$/.test(value)) {
        if (value.length !== 10) {
            return helpers.message('Phone number must be exactly 10 digits');
        }
        return value;
    }
    // Otherwise fallback if they entered other chars
    return value;
});

const registerUser = {
    body: Joi.object().keys({
        name: Joi.string().required(),
        phone: phoneOrEmail,
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

