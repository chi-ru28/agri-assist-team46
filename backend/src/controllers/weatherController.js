const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const weatherService = require('../services/weatherService');
const Farmer = require('../models/Farmer');
const ApiError = require('../utils/ApiError');

const getWeather = catchAsync(async (req, res) => {
    const farmer = await Farmer.findOne({ userId: req.user._id });
    if (!farmer) throw new ApiError(httpStatus.NOT_FOUND, 'Farmer details not found');

    const weatherData = await weatherService.getWeatherForecast(
        farmer.address || 'Unknown',
        farmer.location.coordinates
    );

    res.send(weatherData);
});

module.exports = {
    getWeather
};
