const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const Product = require('../models/Product');
const Shop = require('../models/Shop');
const ApiError = require('../utils/ApiError');

const addProduct = catchAsync(async (req, res) => {
    const shop = await Shop.findOne({ userId: req.user._id });
    if (!shop) throw new ApiError(httpStatus.NOT_FOUND, 'Shop details not found');
    if (!shop.isActive) throw new ApiError(httpStatus.FORBIDDEN, 'Shop not approved yet');

    const product = await Product.create({ ...req.body, shopId: shop._id });
    res.status(httpStatus.CREATED).send(product);
});

const updateStock = catchAsync(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');

    const shop = await Shop.findById(product.shopId);
    if (shop.userId.toString() !== req.user._id.toString()) {
        throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized');
    }

    product.stock = req.body.stock;
    await product.save();
    res.send(product);
});

const getProducts = catchAsync(async (req, res) => {
    const shop = await Shop.findOne({ userId: req.user._id });
    if (!shop) throw new ApiError(httpStatus.NOT_FOUND, 'Shop details not found');

    const products = await Product.find({ shopId: shop._id });
    res.send(products);
});

module.exports = {
    addProduct,
    updateStock,
    getProducts
};
