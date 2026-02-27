const mongoose = require('mongoose');

// Subdocument schema for individual messages inside a history thread
const messageSchema = new mongoose.Schema(
    {
        sender: {
            type: String,
            enum: ['user', 'ai'],
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        language: {
            type: String,
            default: 'en',
        },
        timestamp: {
            type: Date,
            default: Date.now,
        },
    },
    { _id: false } // No need for individual IDs for every single string sent
);

const chatHistorySchema = new mongoose.Schema(
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
        messages: [messageSchema],
    },
    { timestamps: true }
);

// Optimized index configuration for fetching recent histories instantly
chatHistorySchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('ChatHistory', chatHistorySchema);
