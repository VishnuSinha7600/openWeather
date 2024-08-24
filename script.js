const apiKey = 'be375a7195d948bb8633bda65cb10dbe';
const baseUrl = 'https://api.openweathermap.org/data/2.5/';

document.getElementById('search-btn').addEventListener('click', fetchWeather);

function fetchWeather() {
    const city = document.getElementById('city-search').value;
    if (city) {
        fetch(`${baseUrl}weather?q=${city}&appid=${apiKey}`)
            .then(response => response.json())
            .then(data => displayCurrentWeather(data))
            .catch(error => handleError(error));
    }
}

function displayCurrentWeather(data) {
    const weatherDiv = document.getElementById('current-weather');
    weatherDiv.innerHTML = `
        <h2>${data.name}</h2>
        <p>${data.weather[0].description}</p>
        <p>Temperature: ${data.main.temp}°C</p>
    `;
}

function handleError(error) {
    alert('Failed to fetch weather data. Please try again.');
}


let currentPage = 1;
const itemsPerPage = 10;

function fetchForecast(city) {
    fetch(`${baseUrl}forecast/daily?q=${city}&cnt=30&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => displayForecast(data))
        .catch(error => handleError(error));
}

function displayForecast(data) {
    const forecastDiv = document.getElementById('forecast');
    const paginatedData = data.list.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    paginatedData.forEach(day => {
        forecastDiv.innerHTML += `
            <div>
                <p>Date: ${new Date(day.dt * 1000).toLocaleDateString()}</p>
                <p>Temperature: ${day.temp.day}°C</p>
            </div>
        `;
    });
    setupPaginationControls(data.list.length);
}

function setupPaginationControls(totalItems) {
    const paginationDiv = document.getElementById('pagination-controls');
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    paginationDiv.innerHTML = '';
    for (let i = 1; i <= totalPages; i++) {
        paginationDiv.innerHTML += `<button onclick="goToPage(${i})">${i}</button>`;
    }
}

function goToPage(page) {
    currentPage = page;
    document.getElementById('forecast').innerHTML = '';
    fetchForecast(document.getElementById('city-search').value);
}


document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

function toggleTheme() {
    const currentTheme = document.body.classList.toggle('dark-theme') ? 'dark-theme' : 'light-theme';
    localStorage.setItem('theme', currentTheme);
}

window.onload = function() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.body.classList.add(savedTheme);
    }
};
