const ApiError = require('../utils/ApiError');

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(new ApiError(401, 'Not authenticated'));
        }

        if (!roles.includes(req.user.role)) {
            return next(new ApiError(403, 'Forbidden: insufficient privileges'));
        }

        next();
    };
};

module.exports = authorize;
