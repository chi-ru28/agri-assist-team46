const mongoose = require('mongoose');

const adminLogSchema = new mongoose.Schema(
    {
        adminId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        action: {
            type: String,
            required: true,
            trim: true,
        },
        targetUser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        timestamp: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: false }
);

// TTL index to aggressively trim out logs after 90 days (7776000 seconds)
adminLogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });
adminLogSchema.index({ adminId: 1, timestamp: -1 });

module.exports = mongoose.model('AdminLog', adminLogSchema);
