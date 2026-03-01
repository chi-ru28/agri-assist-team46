const express = require('express');
const aiController = require('../controllers/aiController');
const auth = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');
const upload = require('../middleware/upload');

const router = express.Router();

router.post('/analyze', auth, authorize('farmer'), upload.single('image'), aiController.analyzeImage);
router.post('/predict-fertilizer', auth, authorize('farmer'), aiController.predictFertilizer);

module.exports = router;
