const apiKey = '3f8f33424ba5d8a067ad97163635ccf3';
const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');
const baseUrl = "https://api.openweathermap.org/data/2.5/"
//weather?units=imperial&lat=38.6270&lon=90.1994";
const geoUrl = "http://api.openweathermap.org/geo/1.0/direct?q=";
//{city name},{state code},{country code}&limit={limit}&appid={API key}"


async function getWeatherData(city) {

    const response = await fetch(geoUrl + city + `&limit=5&appid=${apiKey}`);
    let data = await response.json();

    searchWeather(data[0].lat, data[0].lon);
}
async function searchWeather(lat, lon) {
    console.log(lat, lon)
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
  
}

async function searchForecast(lat, lon) {
    console.log(lat, lon)
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
    
}
searchBtn.addEventListener('click', function () {
    const city = cityInput.value.trim();
    if (city !== '') {
        getWeatherData(city);
        cityInput.value = '';
    }

})