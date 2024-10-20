// ./server.js

const express = require('express');
const connectDB = require('./config/db');
const weatherRoutes = require('./routes/weather');
const dotenv = require('dotenv');
const cors = require('cors'); // Import CORS middleware
const { startAutoUpdate } = require('./controllers/weatherController');

dotenv.config();
const app = express();

connectDB();

// Use CORS middleware
app.use(cors()); // This will allow all origins by default

app.use(express.json());
app.use('/api/weather', weatherRoutes);

// Start automatic weather data updates
startAutoUpdate();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
