const apiKey = "19a347dc98c2ade8cd48d9aeefcb2939";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchBox = document.querySelector(".search input");
const searchBtn = document.getElementById("searchBtn");
const weatherIcon = document.querySelector(".weather-icon");

async function checkWeather(city){
    if(city === "") return;

    try{
        const response = await fetch(apiUrl + city + `&appid=${apiKey}`);

        if(!response.ok){
            throw new Error("City not found");
        }

        const data = await response.json();

        document.querySelector(".city").innerHTML = data.name;
        document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
        document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
        document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";

        const weatherMain = data.weather[0].main;

        if(weatherMain === "Clouds"){
            weatherIcon.src = "clouds.png";
        } else if(weatherMain === "Clear"){
            weatherIcon.src = "clear.png";
        } else if(weatherMain === "Rain"){
            weatherIcon.src = "rain.png";
        } else if(weatherMain === "Drizzle"){
            weatherIcon.src = "drizzle.png";
        } else if(weatherMain === "Mist"){
            weatherIcon.src = "mist.png";
        }

        // Suggestion
        let suggestion = "";
        const temp = data.main.temp;

        if(temp <= 15){
            suggestion = "It's cold, wear a jacket 🧥";
        } else if(temp <= 25){
            suggestion = "Pleasant weather, wear light clothes 👕";
        } else {
            suggestion = "It's hot, wear breathable clothes 🩳";
        }

        if(weatherMain === "Rain"){
            suggestion = "Carry an umbrella ☔";
        }

        document.querySelector(".suggestion-text").innerHTML = suggestion;

        document.querySelector(".weather").style.display = "block";
        document.querySelector(".error").style.display = "none";
        document.querySelector(".suggestion").style.display = "block";

        // IMPORTANT → load icons
        lucide.createIcons();

    } catch(error){
        document.querySelector(".error").style.display = "block";
        document.querySelector(".weather").style.display = "none";
        document.querySelector(".suggestion").style.display = "none";
    }
}

searchBtn.addEventListener("click", () => {
    checkWeather(searchBox.value);
});
