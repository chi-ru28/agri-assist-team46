const express = require('express');
const weatherController = require('../controllers/weatherController');
const auth = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/', auth, authorize('farmer'), weatherController.getWeather);

module.exports = router;
