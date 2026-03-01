const catchAsync = (fn) => (req, res, next) => {
    return Promise.resolve(fn(req, res, next)).catch(err => {
        if (typeof next === 'function') {
            return next(err);
        }
        throw err;
    });
};

module.exports = catchAsync;
