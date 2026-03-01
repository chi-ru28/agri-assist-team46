const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const aiService = require('../services/aiService');
const mlService = require('../services/mlService');
const CropAnalysis = require('../models/CropAnalysis');

const analyzeImage = catchAsync(async (req, res) => {
    if (!req.file) {
        return res.status(httpStatus.BAD_REQUEST).send({ message: 'No image uploaded' });
    }

    try {
        // Try to get predictions from our FASTAPI ML Server first
        const mlPrediction = await mlService.predictImage(req.file.path);

        // Use Gemini AI to get deep recommendations based on the ML found deficiency
        const analysisData = await aiService.analyzeImage(req.file.path, req.file.mimetype);

        const cropAnalysis = await CropAnalysis.create({
            farmerId: req.user._id,
            imageUrl: `/uploads/${req.file.filename}`,
            deficiency: mlPrediction.deficiency || analysisData.deficiency,
            severity: analysisData.severity,
            recommendation: {
                fertilizer: analysisData.recommendedFertilizer,
                dosagePerAcre: analysisData.dosagePerAcre,
                precautions: analysisData.precautions
            },
            healthScore: analysisData.healthScore,
            mlConfidence: mlPrediction.confidence
        });

        res.status(httpStatus.OK).send(cropAnalysis);
    } catch (error) {
        // Fallback or bubble up
        throw error;
    }
});

const predictFertilizer = catchAsync(async (req, res) => {
    const data = req.body;
    const prediction = await mlService.predictFertilizer(data);
    res.status(httpStatus.OK).send(prediction);
});

module.exports = {
    analyzeImage,
    predictFertilizer
};
