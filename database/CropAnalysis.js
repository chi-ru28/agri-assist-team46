const mongoose = require('mongoose');

const cropAnalysisSchema = new mongoose.Schema(
    {
        farmerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        imageUrl: {
            type: String,
            required: true,
        },
        deficiency: {
            type: String,
            required: true,
        },
        severity: {
            type: String,
            enum: ['low', 'medium', 'high', 'critical'],
            required: true,
        },
        recommendedFertilizer: {
            type: String,
            trim: true,
        },
        dosagePerAcre: {
            type: String,
            trim: true,
        },
        healthScore: {
            type: Number,
            min: 0,
            max: 100,
        },
        weatherCondition: {
            type: String,
        },
        precautions: [
            {
                type: String,
            },
        ],
    },
    { timestamps: true }
);

cropAnalysisSchema.index({ farmerId: 1, createdAt: -1 });

module.exports = mongoose.model('CropAnalysis', cropAnalysisSchema);
