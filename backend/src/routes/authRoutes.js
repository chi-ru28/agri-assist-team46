const express = require('express');
const authController = require('../controllers/authController');
const validate = require('../middleware/validate');
const authValidation = require('../validators/auth.validation');
const { authLimiter } = require('../middleware/rateLimiter');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', authLimiter, validate(authValidation.registerUser), authController.register);
router.post('/login', authLimiter, validate(authValidation.loginUser), authController.login);
router.post('/logout', auth, authController.logout);

module.exports = router;
