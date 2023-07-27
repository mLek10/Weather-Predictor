const apiKey = '3f8f33424ba5d8a067ad97163635ccf3';
const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');
const baseUrl = "https://api.openweathermap.org/data/2.5/"
//weather?units=imperial&lat=38.6270&lon=90.1994";
const geoUrl = "https://api.openweathermap.org/geo/1.0/direct?q=";
//{city name},{state code},{country code}&limit={limit}&appid={API key}"

// Function to save the searched city in local storage
function saveCityToLocalStorage(city) {
    let cities = JSON.parse(localStorage.getItem("searchedCities")) || [];
    if (!cities.includes(city)) {
        cities.push(city);
        localStorage.setItem("searchedCities", JSON.stringify(cities));
    }
}

// Function to load the saved cities from local storage and display them in the "Search Cities" box
function loadSearchedCities() {
    let cities = JSON.parse(localStorage.getItem("searchedCities")) || [];
    const sideBar = document.getElementById("sideBar");
    sideBar.innerHTML = "<h2>Search History</h2>";
    const ul = document.createElement("ul");
    cities.forEach(city => {
        const li = document.createElement("li");
        li.textContent = city;
        ul.appendChild(li);
    });
    sideBar.appendChild(ul);
        // Add click event listener to search history elements here, to display weather data again when clicked
        ul.addEventListener("click", function (event) {
            if (event.target.tagName === "LI") {
                const city = event.target.textContent;
                cityInput.value = city;
                handleSearch();
            }
        });
    
}

async function getWeatherData(city) {

    const response = await fetch(geoUrl + city + `&limit=5&appid=${apiKey}`);
    let data = await response.json();
    saveCityToLocalStorage(city);
    searchWeather(data[0].lat, data[0].lon);
}
async function searchWeather(lat, lon) {
    const response = await fetch(baseUrl + `weather?units=imperial&lat=${lat}&lon=${lon}&appid=${apiKey}`);
    let data = await response.json();
    console.log(data)
    searchForecast(lat, lon);
    var card = document.createElement("div")
    card.setAttribute("class", "card");
    var cardTitle = document.createElement("h2")
    cardTitle.setAttribute("class", "card-title")
    cardTitle.textContent = data.name
    console.log(cardTitle)
    card.appendChild(cardTitle)
    document.getElementById("weatherContainer").appendChild(card)
    displayCurrentWeather(data);
}

async function searchForecast(lat, lon) {
    console.log("Fetching current weather data for lat:", lat, "lon:", lon);
    const response = await fetch(baseUrl + `forecast?units=imperial&lat=${lat}&lon=${lon}&appid=${apiKey}`);
    let data = await response.json();
    console.log(data)
    var forecastArray = []
    for (var i = 0; i < data.list.length; i++) {
        var targetTime = data.list[i].dt_txt.split(" ").pop()
        if (targetTime === "12:00:00") {
            forecastArray.push(data.list[i])
        }
    }
    displayForecast(forecastArray);
}
searchBtn.addEventListener('click', function () {
    const city = cityInput.value.trim();
    if (city !== '') {
        getWeatherData(city);
        cityInput.value = '';
    }

})
// Function handles the city search
async function handleSearch() {
    const city = cityInput.value.trim();
    if (city !== "") {
        const weatherData = await getWeatherData(city);
        if (weatherData) {
            displayCurrentWeather(weatherData.current);
            displayForecast(weatherData.forecast);
        }
        cityInput.value = "";
    }
}

// Function displays current weather conditions
async function displayCurrentWeather(data) {
    console.log("Displaying current weather data:", data);
    const container = document.getElementById("weatherContainer");
    container.innerHTML = "";

    const card = document.createElement("div");
    card.setAttribute("class", "card bg-light mb-3");

    const cardTitle = document.createElement("h2");
    cardTitle.setAttribute("class", "card-title");
    cardTitle.textContent = data.name;

    // date, icon, temperature, humidity, wind speed here
    const dateElement = document.createElement("p");
    dateElement.textContent = new Date(data.dt * 1000).toLocaleDateString();

    const iconElement = document.createElement("img");
    iconElement.setAttribute("src", `https://openweathermap.org/img/w/${data.weather[0].icon}.png`);
    iconElement.setAttribute("alt", data.weather[0].description);

    const temperatureElement = document.createElement("p");
    temperatureElement.textContent = `Temperature: ${data.main.temp} °F`;


    const humidityElement = document.createElement("p");
    humidityElement.textContent = `Humidity: ${data.main.humidity}%`;

    const windElement = document.createElement("p");
    windElement.textContent = `Wind Speed: ${data.wind.speed} mph`;

    // Append weather details to the card
    card.appendChild(cardTitle);
    card.appendChild(dateElement);
    card.appendChild(iconElement);
    card.appendChild(temperatureElement);
    card.appendChild(humidityElement);
    card.appendChild(windElement);

    container.appendChild(card);
}

// Function to display 5-day forecast
function displayForecast(data) {
    console.log("Displaying forecast data:", data);
    const forecastContainer = document.getElementById("forecastContainer");
    forecastContainer.innerHTML = "";

    for (const forecastData of data) {
        const forecastCard = document.createElement("div");
        forecastCard.setAttribute("class", "card bg-light mb-3");

        // date, icon, temperature, humidity, wind speed here
        const dateElement = document.createElement("p");
        dateElement.textContent = new Date(forecastData.dt * 1000).toLocaleDateString();

        const iconElement = document.createElement("img");
        iconElement.setAttribute("src", `https://openweathermap.org/img/w/${forecastData.weather[0].icon}.png`);
        iconElement.setAttribute("alt", forecastData.weather[0].description);

        const temperatureElement = document.createElement("p");
        temperatureElement.textContent = `Temperature: ${forecastData.main.temp} °F`;

        const humidityElement = document.createElement("p");
        humidityElement.textContent = `Humidity: ${forecastData.main.humidity}%`;

        const windElement = document.createElement("p");
        windElement.textContent = `Wind Speed: ${forecastData.wind.speed} mph`;

        // Append forecast details 
        forecastCard.appendChild(dateElement);
        forecastCard.appendChild(iconElement);
        forecastCard.appendChild(temperatureElement);
        forecastCard.appendChild(humidityElement);
        forecastCard.appendChild(windElement);

        forecastContainer.appendChild(forecastCard);
    }
}
searchBtn.addEventListener("click", handleSearch);
window.addEventListener("load", loadSearchedCities);
