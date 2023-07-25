const apiKey = '1fc4b31d67d8d0207c46a74601afe1c2';
const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');
const weatherInfoContainer = document.getElementById('weather-info');
const forecastContainer = document.getElementById('forecast');

searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city !== '') {
        getWeatherData(city);
        cityInput.value = '';
    }
});

function getWeatherData(city) {
    const apiUrl = `api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=1fc4b31d67d8d0207c46a74601afe1c2`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            displayWeatherData(data);
        })
}

function displayWeatherData(data) {
    const currentWeather = data.current;

    const weatherCard = document.createElement('div');
    weatherCard.classList.add('weather-card');

    const weatherInfo = `
        <h2>${data.location.name}</h2>
        <p>Date: ${currentWeather.last_updated}</p>
        <p>Temperature: ${currentWeather.temp_c}°C</p>
        <p>Humidity: ${currentWeather.humidity}%</p>
        <p>Wind Speed: ${currentWeather.wind_kph} km/h</p>
        <img src="${currentWeather.condition.icon}" alt="Weather Icon">
    `;

    weatherCard.innerHTML = weatherInfo;

    weatherInfoContainer.innerHTML = '';
    weatherInfoContainer.appendChild(weatherCard);
}
