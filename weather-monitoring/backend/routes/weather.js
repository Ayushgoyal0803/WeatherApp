//  ../routes/weather.js

const express = require('express');
const router = express.Router();

const {
    updateWeatherData,
    getWeatherData,
    updateWeatherDataWithCities,
    addCity,
    removeCity,
} = require('../controllers/weatherController');

// Route to manually trigger an update of weather data
router.get('/update', updateWeatherData);

// Route to retrieve current weather data
router.get('/data', getWeatherData);

// Route to update weather data for user-specified cities
router.post('/updateWithCities', updateWeatherDataWithCities);

// // Route to add a new city
router.post('/addCity', addCity);




module.exports = router;
