const mongoose = require('mongoose');

const chatHistorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    messages: [{
        role: {
            type: String,
            required: true,
            enum: ['user', 'ai']
        },
        content: {
            type: String,
            required: true
        },
        tokensUsed: {
            type: Number,
            default: 0
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
    }]
}, { timestamps: true });

module.exports = mongoose.model('ChatHistory', chatHistorySchema);
