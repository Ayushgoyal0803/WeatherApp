//  ../models/Weather.js

const mongoose = require('mongoose');

const WeatherSchema = new mongoose.Schema({
    date: { type: String, required: true },
    averageTemperature: { type: Number, required: true },
    maxTemperature: { type: Number, required: true },
    minTemperature: { type: Number, required: true },
    dominantCondition: { type: String, required: true },
    dominantConditionReason: { type: String, required: true },
    city: { type: String, required: true }
});

const Weather = mongoose.model('Weather', WeatherSchema);

module.exports = Weather;
