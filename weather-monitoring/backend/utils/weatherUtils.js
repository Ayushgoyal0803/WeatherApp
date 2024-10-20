const axios = require('axios');
const Weather = require('../models/Weather');

const API_KEY = process.env.OPENWEATHER_API_KEY;
const CITIES = ['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Kolkata', 'Hyderabad', 'Bathinda' ];

const fetchWeatherData = async () => {
    const weatherData = [];
    for (const city of CITIES) {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`);
        const tempCelsius = response.data.main.temp - 273.15; // Convert from Kelvin to Celsius
        const condition = response.data.weather[0].main; // Get the main weather condition
        weatherData.push({ city, temp: tempCelsius, condition });
    }
    return weatherData;
};

const aggregateWeatherData = async (data) => {
    const date = new Date().toISOString().split('T')[0]; // Get today's date

    const dailySummary = {
        date,
        averageTemperature: 0,
        maxTemperature: -Infinity,
        minTemperature: Infinity,
        dominantCondition: '',
        dominantConditionReason: '',
        conditionCount: {},
    };

    for (const entry of data) {
        dailySummary.averageTemperature += entry.temp;
        dailySummary.maxTemperature = Math.max(dailySummary.maxTemperature, entry.temp);
        dailySummary.minTemperature = Math.min(dailySummary.minTemperature, entry.temp);

        // Count conditions and store the reason for the condition
        dailySummary.conditionCount[entry.condition] = {
            count: (dailySummary.conditionCount[entry.condition]?.count || 0) + 1,
            reason: entry.weather[0].description, // Store the reason
        };
    }

    dailySummary.averageTemperature /= data.length; // Calculate average temperature

    // Find the dominant weather condition and its reason
    const dominantCondition = Object.keys(dailySummary.conditionCount).reduce((a, b) =>
        dailySummary.conditionCount[a].count > dailySummary.conditionCount[b].count ? a : b
    );
    dailySummary.dominantCondition = dominantCondition;
    dailySummary.dominantConditionReason = dailySummary.conditionCount[dominantCondition].reason; // Store the reason

    // Save to database
    await Weather.create(dailySummary);
};

module.exports = { fetchWeatherData, aggregateWeatherData };
