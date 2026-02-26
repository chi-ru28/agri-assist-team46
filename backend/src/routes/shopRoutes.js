const express = require('express');
const shopController = require('../controllers/shopController');
const auth = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');
const validate = require('../middleware/validate');
const shopValidation = require('../validators/shop.validation');

const router = express.Router();

router.route('/products')
    .post(auth, authorize('shopkeeper'), validate(shopValidation.addProduct), shopController.addProduct)
    .get(auth, authorize('shopkeeper'), shopController.getProducts);

router.route('/products/:id/stock')
    .put(auth, authorize('shopkeeper'), validate(shopValidation.updateStock), shopController.updateStock);

module.exports = router;
