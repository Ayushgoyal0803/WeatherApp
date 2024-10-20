// app.js

// Function to fetch weather data from the backend
const fetchWeatherData = async () => {
    const response = await fetch('http://localhost:5000/api/weather/data'); // Ensure correct URL
    const data = await response.json();
    displayWeather(data);
};


// Function to display the weather data on the webpage
const displayWeather = (weatherData) => {
    const weatherDisplay = document.getElementById('weatherDisplay');
    weatherDisplay.innerHTML = ''; // Clear previous entries

    weatherData.forEach(entry => {
        const weatherEntry = document.createElement('div');
        weatherEntry.classList.add('weather-entry');

        weatherEntry.innerHTML = `
            <h2>${entry.city}</h2>
            <p>Avg Temp: ${entry.averageTemperature}°C</p>
            <p>Max Temp: ${entry.maxTemperature}°C</p>
            <p>Min Temp: ${entry.minTemperature}°C</p>
            <p>Condition: ${entry.dominantCondition}</p>
            <p>Reason: ${entry.dominantConditionReason}</p>
            
        `;
        weatherDisplay.appendChild(weatherEntry);
    });
};


// Event listener for adding a new city
document.getElementById('form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the default form submission

    const cityInput = document.getElementById('cityInput');
    const cityName = cityInput.value.trim(); // Get the input value

    const response = await fetch('http://localhost:5000/api/weather/addCity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cityName })
    });

    if (response.ok) {
        cityInput.value = ''; // Clear the input field
        fetchWeatherData(); // Refresh weather data
        console.log(cityName);
    } else {
        const result = await response.json();
        alert(result.message); // Show error message if adding fails
    }
});

// Initial fetch to display weather data
fetchWeatherData();
