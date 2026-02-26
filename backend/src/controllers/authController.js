const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const authService = require('../services/authService');
const User = require('../models/User');
const Farmer = require('../models/Farmer');
const Shop = require('../models/Shop');
const ApiError = require('../utils/ApiError');

const register = catchAsync(async (req, res) => {
    const { name, phone, password, role, ...roleData } = req.body;

    if (await User.findOne({ phone })) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Phone number already registered');
    }

    const user = await User.create({ name, phone, password, role });

    if (role === 'farmer') {
        await Farmer.create({
            userId: user._id,
            landSize: roleData.landSize,
            address: roleData.address,
            location: { type: 'Point', coordinates: [0, 0] } // Mock GeoJSON
        });
    } else if (role === 'shopkeeper') {
        await Shop.create({
            userId: user._id,
            shopName: roleData.shopName,
            address: roleData.address,
            location: { type: 'Point', coordinates: [0, 0] } // Mock GeoJSON
        });
    }

    const tokens = await authService.generateAuthTokens(user);
    res.status(httpStatus.CREATED).send({ user, tokens });
});

const login = catchAsync(async (req, res) => {
    const { phone, password } = req.body;
    const user = await authService.loginUserWithPhoneAndPassword(phone, password);
    const tokens = await authService.generateAuthTokens(user);
    res.send({ user, tokens });
});

const logout = catchAsync(async (req, res) => {
    await authService.logout(req.user._id);
    res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
    register,
    login,
    logout
};
