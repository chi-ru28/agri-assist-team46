const mongoose = require('mongoose');

const aiUsageAnalyticsSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        role: {
            type: String,
            enum: ['farmer', 'shopkeeper', 'admin'],
            required: true,
        },
        requestType: {
            type: String,
            enum: ['chat', 'image'],
            required: true,
        },
        tokensUsed: {
            type: Number,
            required: true,
            default: 0,
            min: 0,
        },
        responseTime: {
            type: Number, // Tracking performance in ms
            min: 0,
        },
        timestamp: {
            type: Date,
            default: Date.now,
        },
    }
);

aiUsageAnalyticsSchema.index({ timestamp: -1 });
aiUsageAnalyticsSchema.index({ role: 1, timestamp: -1 });

module.exports = mongoose.model('AIUsageAnalytics', aiUsageAnalyticsSchema);
