/**
 * SkyGlass Weather App - Logic
 * ----------------------------
 * Replace YOUR_API_KEY_HERE with your OpenWeather API Key.
 */

const API_KEY = '19a347dc98c2ade8cd48d9aeefcb2939'; 
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

// DOM Elements
const cityInput = document.getElementById('city-input');
const cityNameDisplay = document.getElementById('city-name');
const currentTimeDisplay = document.getElementById('current-time');
const temperatureDisplay = document.getElementById('temperature');
const conditionDisplay = document.getElementById('weather-condition');
const clothingText = document.getElementById('clothing-text');
const clothingIcon = document.getElementById('clothing-icon');
const characterImg = document.getElementById('character-img');
const newsList = document.getElementById('news-list');
const animationLayer = document.getElementById('card-animation-layer');
const spinner = document.getElementById('loading-spinner');
const dynamicBg = document.getElementById('dynamic-bg');

// App State
let currentCity = '';
let currentCityTimezone = 0; // Offset in seconds from UTC

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    updateTime();
    setInterval(updateTime, 60000); // Update every minute
    
    // Default mock data or search for a city
    loadMockNews();
    fetchWeather('London');
    
    // Event Listeners
    cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const city = cityInput.value.trim();
            if (city) fetchWeather(city);
        }
    });

    // Check if lucide is ready
    if (window.lucide) lucide.createIcons();
});

function updateTime() {
    // Get the UTC time by adding the local offset to system time
    const utc = Date.now() + (new Date().getTimezoneOffset() * 60000);
    // Create new Date based on city's timezone offset
    const cityTime = new Date(utc + (currentCityTimezone * 1000));
    
    const options = { hour: '2-digit', minute: '2-digit', hour12: true };
    currentTimeDisplay.textContent = cityTime.toLocaleTimeString([], options);
}

// --- API Calls ---
async function fetchWeather(city) {
    if (API_KEY === 'YOUR_API_KEY_HERE') {
        alert('Please insert your OpenWeather API Key in script.js at line 7!');
        return;
    }

    showLoading(true);
    try {
        const response = await fetch(`${BASE_URL}?q=${city}&appid=${API_KEY}&units=metric`);
        if (!response.ok) throw new Error('City not found');
        
        const data = await response.json();
        updateUI(data);
    } catch (error) {
        console.error(error);
        cityNameDisplay.textContent = 'Error: City not found';
        temperatureDisplay.textContent = '--';
    } finally {
        showLoading(false);
    }
}

function showLoading(isLoading) {
    spinner.classList.toggle('hidden', !isLoading);
}

// --- UI Updates ---
function updateUI(data) {
    const { name, main, weather, sys, dt, timezone } = data;
    const condition = weather[0].main.toLowerCase();
    const description = weather[0].description;
    const temp = Math.round(main.temp);
    
    // Day/Night logic based on city's local dawn/dusk times (UTC vs UTC)
    const isDay = dt > sys.sunrise && dt < sys.sunset;

    // 1. Basic Info
    cityNameDisplay.textContent = name;
    temperatureDisplay.textContent = temp;
    conditionDisplay.textContent = description;

    // 2. City Timezone Update
    currentCityTimezone = timezone;
    updateTime();

    // 3. Clothing Advice
    updateClothingAdvice(temp, condition);

    // 3. Character State
    updateCharacter(temp, condition);

    // 4. Dynamic Background & Animations
    updateDynamicTheme(condition, isDay);
    
    // Refresh Icons
    if (window.lucide) lucide.createIcons();
}

function updateClothingAdvice(temp, condition) {
    let advice = '';
    let iconName = 'shirt';

    if (temp > 28) {
        advice = "It's hot out there! Wear light cotton clothes and stay hydrated.";
        iconName = 'sun';
    } else if (temp > 18) {
        advice = "Perfect weather. A t-shirt or light shirt is ideal.";
        iconName = 'shirt';
    } else if (temp > 10) {
        advice = "A bit chilly. A light jacket or sweater is recommended.";
        iconName = 'thermometer';
    } else {
        advice = "Brrr! It's cold. Wear a warm coat, scarf, and maybe gloves.";
        iconName = 'wind';
    }

    if (condition.includes('rain') || condition.includes('drizzle')) {
        advice += " Also, don't forget an umbrella!";
        iconName = 'umbrella';
    } else if (condition.includes('storm')) {
        advice = "Thunderstorms detected. Stay indoors and carry a sturdy umbrella if must.";
        iconName = 'zap';
    }

    clothingText.textContent = advice;
    clothingIcon.innerHTML = `<i data-lucide="${iconName}"></i>`;
}

function updateCharacter(temp, condition) {
    let state = 'default';

    if (condition.includes('rain') || condition.includes('drizzle') || condition.includes('storm')) {
        state = 'rain';
    } else if (temp < 12) {
        state = 'cold';
    } else if (temp > 30) {
        state = 'hot';
    }

    characterImg.style.opacity = '0';
    setTimeout(() => {
        characterImg.src = `assets/boy_${state}.png`;
        characterImg.style.opacity = '1';
    }, 300);
}

function updateDynamicTheme(condition, isDay) {
    // Clear previous animations
    animationLayer.innerHTML = '';
    
    let bgImage = 'default.jpg';
    let themeClass = isDay ? 'weather-clear-day' : 'weather-clear-night';

    if (condition.includes('clear')) {
        bgImage = isDay ? 'clear am.jpeg' : 'night clear.webp';
        if (!isDay) spawnStars();
    } else if (condition.includes('cloud')) {
        bgImage = isDay ? 'cloudy am.jpg' : 'cloudnight.jpg';
        spawnClouds();
    } else if (condition.includes('rain') || condition.includes('drizzle') || condition.includes('storm')) {
        bgImage = isDay ? 'rainy morning.jpg' : 'rain night hary.jpg';
        spawnRain();
        if (condition.includes('storm')) {
            // Add lightning effect periodically
            setInterval(flashLightning, 4000);
        }
    } else if (condition.includes('mist') || condition.includes('fog') || condition.includes('haze')) {
        bgImage = isDay ? 'fog morning.jpg' : 'foggy night.jpg';
    }

    // Apply background image and color theme
    dynamicBg.style.backgroundImage = `url('${bgImage}')`;
    document.body.className = themeClass;
}

// --- Weather Visuals Spawning ---

function spawnRain() {
    for (let i = 0; i < 60; i++) { /* Increased density slightly for better look */
        const drop = document.createElement('div');
        drop.className = 'rain-particle';
        drop.style.left = Math.random() * 100 + '%';
        drop.style.animationDuration = (Math.random() * 0.3 + 0.4) + 's'; /* Faster fall */
        drop.style.animationDelay = Math.random() * 0.5 + 's'; /* Less initial delay */
        animationLayer.appendChild(drop);
    }
}

function spawnStars() {
    for (let i = 0; i < 50; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.width = star.style.height = Math.random() * 3 + 'px';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDuration = (Math.random() * 2 + 1) + 's';
        star.style.animationDelay = Math.random() * 2 + 's';
        animationLayer.appendChild(star);
    }
}

function spawnClouds() {
    for (let i = 0; i < 6; i++) {
        const cloud = document.createElement('div');
        cloud.className = 'cloud-svg';
        cloud.innerHTML = `<i data-lucide="cloud" style="width: 100px; height: 100px;"></i>`;
        cloud.style.top = Math.random() * 60 + '%';
        cloud.style.left = '-150px';
        cloud.style.animationDuration = (Math.random() * 10 + 15) + 's'; /* Faster drift */
        cloud.style.animationDelay = (Math.random() * 5) + 's'; /* Less delay */
        animationLayer.appendChild(cloud);
    }
    if (window.lucide) lucide.createIcons();
}

function flashLightning() {
    const flash = document.createElement('div');
    flash.style.position = 'absolute';
    flash.style.width = '100%';
    flash.style.height = '100%';
    flash.style.background = 'rgba(255,255,255,0.2)';
    flash.style.zIndex = '3';
    animationLayer.appendChild(flash);
    setTimeout(() => flash.remove(), 100);
}

// --- Mock News ---
function loadMockNews() {
    const news = [
        "Unusually warm trends expected this weekend across the coast.",
        "New study shows air quality in cities is improving rapidly.",
        "How to protect your garden from upcoming spring storms.",
        "The best places to see the northern lights this season.",
        "Technological breakthrough in rainfall prediction AI."
    ];

    newsList.innerHTML = news.map(title => `
        <div class="news-item">
            <p class="news-title">${title}</p>
        </div>
    `).join('');
}
