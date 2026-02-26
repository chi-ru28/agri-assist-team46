const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('../config/env');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');

const generateToken = (userId, expires, type, secret = config.jwt.secret) => {
    const payload = {
        sub: userId,
        iat: Math.floor(Date.now() / 1000),
        exp: expires,
        type,
    };
    return jwt.sign(payload, secret);
};

const generateAuthTokens = async (user) => {
    const accessTokenExpires = Math.floor(Date.now() / 1000) + config.jwt.accessExpirationMinutes * 60;
    const accessToken = generateToken(user.id, accessTokenExpires, 'access');

    const refreshTokenExpires = Math.floor(Date.now() / 1000) + config.jwt.refreshExpirationDays * 24 * 60 * 60;
    const refreshToken = generateToken(user.id, refreshTokenExpires, 'refresh');

    // Assign refresh token to model
    user.refreshToken = refreshToken;
    await user.save();

    return {
        access: {
            token: accessToken,
            expires: new Date(accessTokenExpires * 1000),
        },
        refresh: {
            token: refreshToken,
            expires: new Date(refreshTokenExpires * 1000),
        },
    };
};

const loginUserWithPhoneAndPassword = async (phone, password) => {
    const user = await User.findOne({ phone });
    if (!user || !(await user.isPasswordMatch(password))) {
        throw new ApiError(401, 'Incorrect phone or password');
    }
    return user;
};

const logout = async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, 'Not found');
    }
    user.refreshToken = null;
    await user.save();
};

module.exports = {
    generateToken,
    generateAuthTokens,
    loginUserWithPhoneAndPassword,
    logout
};
