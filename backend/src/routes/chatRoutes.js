const express = require('express');
const chatController = require('../controllers/chatController');
const auth = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');
const Joi = require('joi');
const validate = require('../middleware/validate');

const router = express.Router();

const chatValidation = {
    body: Joi.object().keys({
        message: Joi.string().required().max(1000)
    })
};

router.post('/', auth, authorize('farmer', 'shopkeeper'), validate(chatValidation), chatController.chat);

module.exports = router;
