const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ['user', 'ai'],
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    tokensUsed: {
        type: Number,
    }
}, { timestamps: true }); // Automatically adds createdAt for timestamp

const chatHistorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    messages: [messageSchema],
}, { timestamps: true });

module.exports = mongoose.model('ChatHistory', chatHistorySchema);
