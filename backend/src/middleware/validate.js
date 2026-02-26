const Joi = require('joi');
const ApiError = require('../utils/ApiError');

const validate = (schema) => (req, res, next) => {
    const validSchema = {};
    if (schema.params) validSchema.params = schema.params;
    if (schema.query) validSchema.query = schema.query;
    if (schema.body) validSchema.body = schema.body;

    const reqObj = {};
    if (schema.params) reqObj.params = req.params;
    if (schema.query) reqObj.query = req.query;
    if (schema.body) reqObj.body = req.body;

    const { value, error } = Joi.object(validSchema)
        .prefs({ errors: { label: 'key' }, abortEarly: false })
        .validate(reqObj);

    if (error) {
        const errorMessage = error.details.map((details) => details.message).join(', ');
        return next(new ApiError(400, errorMessage));
    }

    Object.assign(req, value);
    return next();
};

module.exports = validate;
