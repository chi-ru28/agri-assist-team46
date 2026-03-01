const mongoose = require('mongoose');

const cropAnalysisSchema = new mongoose.Schema({
    farmerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    imageUrl: {
        type: String,
    },
    deficiency: String,
    severity: String,
    recommendation: {
        fertilizer: String,
        dosagePerAcre: String,
        precautions: String
    },
    healthScore: Number,
    mlConfidence: Number
}, { timestamps: true });

module.exports = mongoose.model('CropAnalysis', cropAnalysisSchema);
