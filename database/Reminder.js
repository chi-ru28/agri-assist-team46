const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        type: {
            type: String,
            enum: ['fertilizer', 'irrigation', 'pesticide'],
            required: true,
        },
        message: {
            type: String,
            required: true,
            trim: true,
        },
        scheduledDate: {
            type: Date,
            required: true,
        },
        isCompleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

// Optimize chron job retrieval mapping by filtering user schedules accurately
reminderSchema.index({ userId: 1, scheduledDate: 1 });

module.exports = mongoose.model('Reminder', reminderSchema);
