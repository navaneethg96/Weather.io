
const KELVIN = 273;
const API_KEY = '9cd7976097a8ce31c255219e85764976';
const weather = {};
weather.temperature = {
    unit: 'celsius'
};

let icon = document.querySelector('.weather-icon');
let temp = document.querySelector('.temperature-value p');
let desc = document.querySelector('.temperature-description p');
let locationEle = document.querySelector('.location p');
let notification = document.querySelector('.notification');

document.querySelector('.search button').addEventListener('click', () => {
    fetchWeather(document.querySelector('.search-bar').value);
});
document.querySelector('.search-bar').addEventListener('keyup', (event) => {
    if (event.key == 'Enter')
        fetchWeather(document.querySelector('.search-bar').value);
});

//fetches the weather details from API based on the place name
function fetchWeather(city) {
    fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`)
        .then((response) => response.json())
        .then((data) => {
            if (data.message == "city not found") {
                weather.iconId = 'unknown';
                weather.temperature.value = "-";
                weather.desc = null;
                desc.innerHTML = '-';
                weather.locationEle = 'NA';
            } else {
                weather.iconId = data.weather[0].icon;
                weather.temperature.value = Math.round(data.main.temp);
                weather.desc = data.weather[0].description;
                weather.city = data.name;
                weather.country = data.sys.country;
            }
            displayWeather();
        });
}

// displays the weather in the DOM
function displayWeather() {
    icon.innerHTML = `<img src="icons/${weather.iconId}.png" alt="weather">`;
    temp.innerHTML = `${weather.temperature.value}°<span>C</span>`;
    if (weather.desc == null) {
        document.querySelector('.search-bar').value = '';
        desc.innerHTML = '-';
        locationEle.innerHTML = 'Location NA';
    } else {
        desc.innerHTML = weather.desc;
        locationEle.innerHTML = `${weather.city}, ${weather.country}`;
    }
}

// checks if geolocation feature is supported on the device
if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(setPosition, showError);
} else {
    notification.style.display = 'block';
    notification.innerHTML = `<p>Browser Doesn't Support Geolocation</p>`;
}

// set coordinates if device supports geolocation
function setPosition(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    getWeather(latitude, longitude);
}

//  fetch weather details from API based on the coordinates passed
function getWeather(latitude, longitude) {
    let api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;
    fetch(api)
        .then((response) => response.json())
        .then((data) => {
            weather.iconId = data.weather[0].icon;
            weather.temperature.value = Math.round(data.main.temp - KELVIN);
            weather.desc = data.weather[0].description;
            weather.city = data.name;
            weather.country = data.sys.country;
        })
        .then(() => displayWeather());
}

// Display error msg if device geolocation is disabled in it
function showError(error) {
    notification.style.display = 'block';
    notification.innerHTML = `<p> ${error.message} </p>`;
}

// conversion of °C to °F
function celsiusToFahrenheit(temp) {
    return (temp * 9 / 5) + 32;
}

// conversion of temperature scale on click of it
temp.addEventListener("click", () => {
    if (weather.temperature.unit === 'celsius' && weather.temperature.value) {
        let fahrenheit = celsiusToFahrenheit(weather.temperature.value);
        fahrenheit = Math.round(fahrenheit);
        temp.innerHTML = `${fahrenheit}°<span>F</span>`;
        weather.temperature.unit = 'fahrenheit';
    } else {
        temp.innerHTML = `${weather.temperature.value}°<span>C</span>`;
        weather.temperature.unit = 'celsius';
    }
});
