const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { Product, Shop } = require('../models/index');
const ApiError = require('../utils/ApiError');

const addProduct = catchAsync(async (req, res) => {
    const shop = await Shop.findOne({ where: { userId: req.user.id } });
    if (!shop) throw new ApiError(httpStatus.NOT_FOUND, 'Shop details not found');
    if (!shop.isActive) throw new ApiError(httpStatus.FORBIDDEN, 'Shop not approved yet');

    const product = await Product.create({ ...req.body, shopId: shop.id });
    res.status(httpStatus.CREATED).send(product);
});

const updateStock = catchAsync(async (req, res) => {
    const product = await Product.findByPk(req.params.id);
    if (!product) throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');

    const shop = await Shop.findByPk(product.shopId);
    if (shop.userId !== req.user.id) {
        throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized');
    }

    product.inventoryCount = req.body.stock;
    await product.save();
    res.send(product);
});

const getProducts = catchAsync(async (req, res) => {
    const shop = await Shop.findOne({ where: { userId: req.user.id } });
    if (!shop) throw new ApiError(httpStatus.NOT_FOUND, 'Shop details not found');

    const products = await Product.findAll({ where: { shopId: shop.id } });
    res.send(products);
});

module.exports = {
    addProduct,
    updateStock,
    getProducts
};
