//Variables to store API key and API url
const API_KEY = 'b99f308a84c42a7a2c701a26eba18058'
const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=Stockholm,Sweden&units=metric&APPID=${API_KEY}`
const API_FORECAST_URL = `https://api.openweathermap.org/data/2.5/forecast?q=Stockholm,Sweden&units=metric&APPID=${API_KEY}`

const weatherApp = document.getElementById('weatherApp')
const weekDays = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"]

fetch(API_URL)
    .then((res) => res.json())
    .then((data) => {

        //Store sunrise and sunset time in variables
        const sunrise = new Date(data.sys.sunrise * 1000)
        const sunset = new Date(data.sys.sunset * 1000)

        //Store weather types in variable
        const typeOfWeather = data.weather[0].main

        weatherApp.innerHTML += `
        <section class="weather-card">
        <p>${data.weather[0].description} | ${Math.round(data.main.temp * 10) / 10}°</p>
            <p>sunrise ${sunrise.getHours() < 10 ? '0' + sunrise.getHours() : sunrise.getHours()}.${sunrise.getMinutes()}</p>
            <p>sunset ${sunset.getHours() < 10 ? '0' + sunset.getHours() : sunset.getHours()}.${sunset.getMinutes()}</p>
        </section>
        `
        //Statement to change bg-color depending on weather
        if (typeOfWeather === "Clear") {
            weatherApp.innerHTML += `<img class="icon" src="./design/design2/icons/noun_Sunglasses_2055147.svg"><h2 class="description">Get your sunnies on. Stockholm is looking rather great today.</h2>`
            weatherApp.style.color = "#2A5510"
            weatherApp.parentNode.style.backgroundColor = "#F7E9B9"
          } else if (typeOfWeather === "Clouds") {
            weatherApp.innerHTML += `<img class="icon" src="./design/design2/icons/noun_Cloud_1188486.svg"><h2 class="description">Light a fire and get cosy. Stockholm is looking grey today.</h2>`
            weatherApp.style.color = "#F47775"
            weatherApp.parentNode.style.backgroundColor = "#F4F7F8"
            //All the other weather types will be caught under this description
          } else {
            weatherApp.innerHTML += `<img class="icon" src="./design/design2/icons/noun_Umbrella_2030530.svg"><h2 class="description">Don't forget your umbrella! It's wet in Stockholm today!</h2>`
            weatherApp.style.color = "#164A68"
            weatherApp.parentNode.style.backgroundColor = "#A3DEF7"
          }
          //Fetch the forecast
    })
    .then(() => {
        fetch(API_FORECAST_URL)
        .then((res) => res.json())
        .then((data) => {
        //Filter to use forecast for the same hour each day
        const filteredForecast = data.list.filter(item => item.dt_txt.includes('12:00')) 
        //Loop through each day of forecast 
        filteredForecast.forEach((day) => {
            //Convert date to text 
            const date = new Date(day.dt * 1000)
            console.log(date)
            const dayName = weekDays[date.getDay()]
            //Putting the info into the html.
            weatherApp.innerHTML += `
            <section class="forecast">
            <p class="forecast-text">${dayName}</p>
            <p class="forecast-text"> ${Math.round(day.main.temp * 10) / 10}°</p>
          </section>
            `             
    })
        })
        .catch((err) => console.log("Error in second fetch: ", err))
    })
    .catch((err) => console.log("Error: ", err))