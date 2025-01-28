Weather Dashboard
A simple weather dashboard that fetches and displays weather data for multiple cities. Users can add new cities and receive real-time updates. The application uses the OpenWeather API and stores weather data in MongoDB.

Table of Contents
Features
Technologies Used
Installation
Usage
API Endpoints
License


Features

View current weather data for predefined cities.
Add new cities to the dashboard.
Automatic weather updates every 5 minutes.
Alerts for high temperatures.



Technologies Used
Frontend: HTML, CSS, JavaScript
Backend: Node.js, Express.js
Database: MongoDB
API: OpenWeather API
Others: Axios, Mongoose, dotenv, cors
Installation
Prerequisites
Node.js (v12 or later)
MongoDB (locally or a cloud instance)
Steps
Clone the repository:

git clone https://github.com/Ayushgoyal0803/WeatherApp.git cd weather-dashboard

Install backend dependencies:

Navigate to the server directory (if your server files are in a separate folder):

cd server npm install

Set up environment variables:

Create a .env file in the root directory of your server with the following content:

OPENWEATHER_API_KEY=your_openweather_api_key
MONGODB_URI=mongodb://localhost:27017/weatherDB
PORT=5000

Replace your_openweather_api_key with your actual API key from OpenWeather.

Install frontend dependencies:

If your frontend code is in a separate folder, navigate there and run:

cd frontend
npm install

Run the application:

Start the server:

node server.js

Open your browser and go to http://localhost:5000 (or your specified port) to see the weather dashboard.

Usage
Upon loading, the dashboard displays the current weather for predefined cities.
To add a new city, enter the city name in the input field and submit the form.
Weather data is automatically refreshed every 5 minutes.
API Endpoints
GET /api/weather/data: Retrieve current weather data for all cities.
GET /api/weather/update: Manually trigger an update of weather data.
POST /api/weather/addCity: Add a new city to track weather.



