const mongoose = require('mongoose');

const farmerSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    landSize: {
        type: Number,
        required: true,
    },
    crops: {
        type: [String],
        default: [],
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point',
        },
        coordinates: {
            type: [Number],
            default: [0, 0], // [longitude, latitude]
        },
        address: String
    },
}, { timestamps: true });

farmerSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Farmer', farmerSchema);
