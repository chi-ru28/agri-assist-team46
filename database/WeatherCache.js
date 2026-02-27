const mongoose = require('mongoose');

const weatherCacheSchema = new mongoose.Schema(
    {
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
        temperature: {
            type: Number,
            required: true,
        },
        humidity: {
            type: Number,
        },
        rainProbability: {
            type: Number,
            min: 0,
            max: 100,
        },
        fetchedAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: false } // We use fetchedAt instead
);

// TTL Index: Deletes the cache exactly 30 minutes (1800 seconds) after it is fetched
weatherCacheSchema.index({ fetchedAt: 1 }, { expireAfterSeconds: 1800 });
// Also useful to search if we've already cached a location nearby
weatherCacheSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('WeatherCache', weatherCacheSchema);
