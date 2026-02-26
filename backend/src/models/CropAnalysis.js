const mongoose = require('mongoose');

const cropAnalysisSchema = new mongoose.Schema({
    farmerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
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
        enum: ['Low', 'Medium', 'High', 'Unknown'],
        default: 'Unknown'
    },
    recommendation: { // Combined recommendation details
        fertilizer: String,
        dosagePerAcre: String,
        precautions: String
    },
    healthScore: {
        type: Number,
        min: 0,
        max: 100
    },
    date: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

module.exports = mongoose.model('CropAnalysis', cropAnalysisSchema);
