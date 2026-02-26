const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const aiService = require('../services/aiService');
const CropAnalysis = require('../models/CropAnalysis');

const analyzeImage = catchAsync(async (req, res) => {
    if (!req.file) {
        return res.status(httpStatus.BAD_REQUEST).send({ message: 'No image uploaded' });
    }

    const analysisData = await aiService.analyzeImage(req.file.path, req.file.mimetype);

    const cropAnalysis = await CropAnalysis.create({
        farmerId: req.user._id,
        imageUrl: `/uploads/${req.file.filename}`,
        deficiency: analysisData.deficiency,
        severity: analysisData.severity,
        recommendation: {
            fertilizer: analysisData.recommendedFertilizer,
            dosagePerAcre: analysisData.dosagePerAcre,
            precautions: analysisData.precautions
        },
        healthScore: analysisData.healthScore
    });

    res.status(httpStatus.OK).send(cropAnalysis);
});

module.exports = {
    analyzeImage
};
