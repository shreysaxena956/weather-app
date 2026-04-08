const apiKey = "19a347dc98c2ade8cd48d9aeefcb2939";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchBox = document.querySelector(".search-bar input");
const searchBtn = document.getElementById("searchBtn");
const weatherCard = document.querySelector(".weather-card");
const weatherIcon = document.querySelector(".weather-icon");

const sunglasses = document.getElementById("sunglasses");
const umbrella = document.getElementById("umbrella");

async function checkWeather(city){

    if(city === "") return;

    try{
        const response = await fetch(apiUrl + city + `&appid=${apiKey}`);

        if(!response.ok){
            alert("City not found");
            return;
        }

        const data = await response.json();
        console.log(data);

        const weatherMain = data.weather[0].main;

        // UI
        document.querySelector(".city").innerHTML = data.name;
        document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
        document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
        document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";

        // ICON
        if(weatherMain === "Clouds"){
            weatherIcon.src = "clouds.png";
        } else if(weatherMain === "Clear"){
            weatherIcon.src = "clear.png";
        } else if(weatherMain === "Rain"){
            weatherIcon.src = "rain.png";
        } else {
            weatherIcon.src = "clear.png";
        }

        // BACKGROUND
        if(weatherMain === "Clear"){
            document.body.style.backgroundImage = "url('clearback.jpg')";
        } else if(weatherMain === "Rain"){
            document.body.style.backgroundImage = "url('rainback.jpg')";
        } else if(weatherMain === "Clouds"){
            document.body.style.backgroundImage = "url('cloudback.jpg')";
        }

        // SHOW CARD
        weatherCard.style.display = "block";

        // RESET ACCESSORIES
        sunglasses.classList.add("hidden");
        umbrella.classList.add("hidden");

        // APPLY ANIMATION
        if(weatherMain === "Clear"){
            sunglasses.classList.remove("hidden");
        }
        else if(weatherMain === "Rain"){
            umbrella.classList.remove("hidden");
        }

    } catch(error){
        alert("Something went wrong");
    }
}

searchBtn.addEventListener("click", () => {
    checkWeather(searchBox.value.trim());
});

searchBox.addEventListener("keypress", (e) => {
    if(e.key === "Enter"){
        checkWeather(searchBox.value.trim());
    }
});