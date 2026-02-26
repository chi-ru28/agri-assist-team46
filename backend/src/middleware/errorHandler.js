const mongoose = require('mongoose');
const httpStatus = require('http-status');
const config = require('../config/env');
const logger = require('../utils/logger');
const ApiError = require('../utils/ApiError');

// Convert non-ApiError to ApiError
const errorConverter = (err, req, res, next) => {
    let error = err;
    if (!(error instanceof ApiError)) {
        const statusCode =
            error.statusCode || error instanceof mongoose.Error ? 400 : 500;
        const message = error.message || 'Internal Server Error';
        error = new ApiError(statusCode, message, false, err.stack);
    }
    next(error);
};

// Unified Error handler
const errorHandler = (err, req, res, next) => {
    let { statusCode, message } = err;

    // Hide details in production
    if (config.env === 'production' && !err.isOperational) {
        statusCode = 500;
        message = 'Internal Server Error';
    }

    res.locals.errorMessage = err.message;

    const response = {
        code: statusCode,
        message,
        ...(config.env === 'development' && { stack: err.stack }),
    };

    if (config.env === 'development') {
        logger.error(err);
    }

    res.status(statusCode).send(response);
};

module.exports = {
    errorConverter,
    errorHandler,
};
