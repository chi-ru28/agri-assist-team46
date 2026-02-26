const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    shopName: {
        type: String,
        required: true,
        trim: true,
    },
    address: {
        type: String,
        required: true,
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point',
        },
        coordinates: {
            type: [Number],
            default: [0, 0],
        }
    },
    isActive: {
        type: Boolean,
        default: false, // Pending admin approval
    },
}, { timestamps: true });

shopSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Shop', shopSchema);
