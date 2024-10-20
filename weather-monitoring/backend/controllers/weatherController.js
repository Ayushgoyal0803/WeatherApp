// ../controllers/weatherController.js

const Weather = require('../models/Weather');

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

let weatherData = []; // In-memory array to hold weather data
const temperatureThreshold = 35; // Temperature threshold for alerts
let consecutiveAlertCount = 0; // Counter for consecutive alerts

const cities = ['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Kolkata', 'Hyderabad', 'Bathinda'];
// Function to fetch weather data from the OpenWeather API for a list of cities
const fetchWeatherFromAPI = async () => {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const weatherData = [];
    
    for (const city of cities) {
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`);
            if (!response.ok) {
                throw new Error(`Error fetching data for ${city}: ${response.status} ${response.statusText}`);
            }
            const data = await response.json();
            // console.log(data);
            
            weatherData.push(data); // Add the city's weather data to the array
        } catch (error) {
            console.error(`Error fetching weather data for ${city}: ${error.message}`);
        }
    }

    return weatherData;
};

// Function to check and log alerts if the temperature exceeds a threshold
const checkAlerts = (data) => {
    const currentTemperature = parseFloat(data.averageTemperature);

    if (currentTemperature > temperatureThreshold) {
        consecutiveAlertCount++;
        if (consecutiveAlertCount >= 2) {
            console.log(`Alert! Temperature exceeded ${temperatureThreshold}°C for ${consecutiveAlertCount} consecutive updates.`);
        }
    } else {
        consecutiveAlertCount = 0; // Reset count if temperature is within limit
    }
};

// Function to update weather data and save it to MongoDB
const updateWeatherData = async () => {
    try {
        // If no cities are provided, fetch cities from the database
        // if (!cities.length) {
        //     const cityRecords = await City.find();
        //     cities = cityRecords.map(city => city.name);
        // }

        // Fetch weather data for the cities
        const data = await fetchWeatherFromAPI();

        // Process the data and check for alerts
        weatherData = data.map((entry) => ({
            city: entry.name,
            date: new Date(entry.dt * 1000), // Use the date from the API data
            averageTemperature: (entry.main.temp - 273.15).toFixed(2), // Convert Kelvin to Celsius
            maxTemperature: (entry.main.temp_max - 273.15).toFixed(2),
            minTemperature: (entry.main.temp_min - 273.15).toFixed(2),
            dominantCondition: entry.weather[0].main,
            dominantConditionReason: entry.weather[0].description
        }));

        // Check for alerts in the updated weather data
        weatherData.forEach(entry => {
            checkAlerts(entry);
        });

        // Save the weather data to MongoDB
        await aggregateWeatherData(weatherData);

        console.log('Weather data updated and saved successfully.');
    } catch (error) {
        console.error('Error updating weather data:', error.message);
    }
};

// Function to aggregate and save weather data into MongoDB
const aggregateWeatherData = async (data) => {
    for (const entry of data) {
        const dailySummary = {
            date: entry.date, // Using the date from the API
            averageTemperature: entry.averageTemperature,
            maxTemperature: entry.maxTemperature,
            minTemperature: entry.minTemperature,
            dominantCondition: entry.dominantCondition,
            dominantConditionReason: entry.dominantConditionReason,
            city: entry.city,
        };

        try {
            // Check if a record for this city and date already exists
            const existingRecord = await Weather.findOne({ city: entry.city, date: entry.date });

            if (!existingRecord) {
                await Weather.create(dailySummary);
                console.log(`Weather data for ${entry.city} saved successfully.`);
            } else {
                console.log(`Weather data for ${entry.city} on ${entry.date} already exists. Skipping.`);
            }
        } catch (error) {
            console.error('Error saving weather data:', error);
        }
    }
};

// Function to handle user-requested city updates
const updateWeatherDataWithCities = async (req, res) => {
    const { cities } = req.body; // Get cities from the request body
    try {
        await updateWeatherData(cities);
        res.json({ success: true, message: 'Weather data updated successfully.', weatherData });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating weather data.' });
    }
};

// Function to get the current weather data (in-memory)
const getWeatherData = (req, res) => {
    res.json(weatherData); // Send the current weather data to the client
};

// Function to start auto-updating weather data every 5 minutes (300,000 ms)
const startAutoUpdate = () => {
    updateWeatherData(); // Initial weather data fetch
    setInterval(updateWeatherData, 300000); // Fetch weather data every 5 minutes
};

// Function to dynamically add a new city
const addCity = async (req, res) => {
    const { cityName } = req.body;
    try {
        if (!cityName) {
            return res.status(400).json({ message: 'City name is required' });
        }

        // Normalize city name for better matching
        const normalizedCityName = cityName.trim().toLowerCase();

        // Check if city already exists
        if (cities.some(city => city.toLowerCase() === normalizedCityName)) {
            return res.status(400).json({ message: 'City already exists' });
        }

        cities.push(normalizedCityName); // Add new city
        await fetchWeatherFromAPI(normalizedCityName); // Fetch weather data for the new city
        await updateWeatherData(); // Update weather data
        res.status(200).json({ message: `${normalizedCityName} added successfully` });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add city' });
    }
};


module.exports = { 
    updateWeatherData, 
    getWeatherData, 
    startAutoUpdate, 
    updateWeatherDataWithCities, 
    addCity,
    
};
