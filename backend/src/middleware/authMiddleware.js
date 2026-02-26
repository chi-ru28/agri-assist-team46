const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');
const User = require('../models/User');
const config = require('../config/env');

const auth = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            throw new ApiError(401, 'Please authenticate');
        }

        const decoded = jwt.verify(token, config.jwt.secret);
        const user = await User.findById(decoded.sub || decoded.id);

        if (!user) {
            throw new ApiError(401, 'User not found, authentication failed');
        }

        req.user = user;
        next();
    } catch (error) {
        next(new ApiError(401, 'Please authenticate'));
    }
};

module.exports = auth;
