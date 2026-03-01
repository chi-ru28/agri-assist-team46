const mongoose = require('mongoose');

const farmerSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    landSize: {
        type: Number,
        default: 0
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

farmerSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Farmer', farmerSchema);
