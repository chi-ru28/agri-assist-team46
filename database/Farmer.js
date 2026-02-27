const mongoose = require('mongoose');

const farmerSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        landSize: {
            type: Number,
            required: true,
            min: 0,
        },
        crops: [
            {
                type: String,
                trim: true,
            },
        ],
        soilType: {
            type: String,
            trim: true,
        },
        irrigationType: {
            type: String,
            trim: true,
        },
        location: {
            type: {
                type: String,
                enum: ['Point'],
                default: 'Point',
            },
            coordinates: {
                type: [Number], // [longitude, latitude]
                required: true,
            },
        },
    },
    { timestamps: true }
);

// Indexes
farmerSchema.index({ userId: 1 });
farmerSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Farmer', farmerSchema);
