const express = require('express');
const chatController = require('../controllers/chatController');
const auth = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');
const upload = require('../middleware/upload');
const Joi = require('joi');
const validate = require('../middleware/validate');

const router = express.Router();

const chatValidation = {
    body: Joi.object().keys({
        message: Joi.string().allow('').max(2000)
    })
};

router.get('/history', auth, authorize('farmer', 'shopkeeper'), chatController.getHistory);
router.get('/report', auth, authorize('farmer', 'shopkeeper'), chatController.generateReport);
router.post('/', auth, authorize('farmer', 'shopkeeper'), upload.single('image'), validate(chatValidation), chatController.chat);

module.exports = router;
