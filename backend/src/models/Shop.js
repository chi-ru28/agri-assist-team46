const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    shopName: {
        type: String,
        default: ''
    },
    address: {
        type: String,
        default: ''
    },
    location: {
        type: { type: String, default: 'Point' },
        coordinates: { type: [Number], default: [0, 0] }
    }
}, { timestamps: true });

shopSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Shop', shopSchema);
