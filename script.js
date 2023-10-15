// Variable to store the API key
const API_KEY = 'b99f308a84c42a7a2c701a26eba18058';

// Function to format time with leading zeros
const formatTime = (time) => {
    return time < 10 ? `0${time}` : time;
};

// Function to fetch and display weather data
const fetchAndDisplayWeather = (location) => {
  const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&APPID=${API_KEY}`;
  const API_FORECAST_URL = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&units=metric&APPID=${API_KEY}`;
  const weatherApp = document.getElementById('weatherApp');
  const weekDays = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

  fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
          // Get the timezone offset from the API response in seconds
          const timezoneOffset = data.timezone;

          // Convert UTC sunrise and sunset times to local time
          const now = new Date();
          const localSunrise = new Date(data.sys.sunrise * 1000 + timezoneOffset * 1000 + (now.getTimezoneOffset() * 60000));
          const localSunset = new Date(data.sys.sunset * 1000 + timezoneOffset * 1000 + (now.getTimezoneOffset() * 60000));

          // Store weather types in variable
          const typeOfWeather = data.weather[0].main;

          // Store temperature in variable and convert from Kelvin to Celsius
          const temperature = Math.round(data.main.temp * 10) / 10;

          // Update the HTML with weather data
          weatherApp.innerHTML = `
              <section class="weather-card">
                  <p>${data.weather[0].description} | ${temperature}°</p>
                  <p>sunrise ${formatTime(localSunrise.getHours())}:${formatTime(localSunrise.getMinutes())}</p>
                  <p>sunset ${formatTime(localSunset.getHours())}:${formatTime(localSunset.getMinutes())}</p>
              </section>
          `;

          // Update background and text color based on weather type
          if (typeOfWeather === "Clear") {
              weatherApp.innerHTML += `<img class="icon" src="./design/design2/icons/noun_Sunglasses_2055147.svg"><h2 class="description">Get your sunnies on. ${location} is looking rather great today.</h2>`;
              weatherApp.style.color = "#2A5510";
              weatherApp.parentNode.style.backgroundColor = "#F7E9B9";
          } else if (typeOfWeather === "Clouds") {
              weatherApp.innerHTML += `<img class="icon" src="./design/design2/icons/noun_Cloud_1188486.svg"><h2 class="description">Light a fire and get cosy. ${location} is looking grey today.</h2>`;
              weatherApp.style.color = "#F47775";
              weatherApp.parentNode.style.backgroundColor = "#F4F7F8";
          } else {
              weatherApp.innerHTML += `<img class="icon" src="./design/design2/icons/noun_Umbrella_2030530.svg"><h2 class "description">Don't forget your umbrella! It's wet in ${location} today!</h2>`;
              weatherApp.style.color = "#164A68";
              weatherApp.parentNode.style.backgroundColor = "#A3DEF7";
          }
      })
      .then(() => {
          fetch(API_FORECAST_URL)
              .then((res) => res.json())
              .then((data) => {
                  // Filter to use forecast for the same hour each day
                  const filteredForecast = data.list.filter((item) => item.dt_txt.includes('12:00'));

                  // Update the HTML with the forecast data
                  filteredForecast.forEach((day) => {
                      const date = new Date(day.dt * 1000);
                      const dayName = weekDays[date.getDay()];
                      weatherApp.innerHTML += `
                          <section class="forecast">
                              <p class="forecast-text">${dayName}</p>
                              <p class="forecast-text"> ${Math.round(day.main.temp * 10) / 10}°</p>
                          </section>
                      `;
                  });
              })
              .catch((err) => console.log("Error in fetching forecast: ", err));
      })
      .catch((err) => console.log("Error: ", err));
};

// Function to handle search for different cities
const searchCity = () => {
  let searchValue = searchInput.value;
  fetchAndDisplayWeather(searchValue);
  // Clearing input field
  searchInput.value = '';
};

// Function to handle Enter key press
const handleKeyPress = (event) => {
  if (event.key === 'Enter') {
    searchCity();
    // Prevent form submission
    event.preventDefault();
  }
};

// Function to fetch and display weather data based on user's location
const fetchAndDisplayWeatherByLocation = () => {
  const userLocationElement = document.getElementById('userLocation');

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const userLatitude = position.coords.latitude;
      const userLongitude = position.coords.longitude;
      const API_LOCATION_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${userLatitude}&lon=${userLongitude}&units=metric&APPID=${API_KEY}`;

      fetch(API_LOCATION_URL)
        .then((res) => res.json())
        .then((data) => {
          const userLocation = data.name;
          userLocationElement.textContent = `Your Current Location: ${userLocation}`;
          fetchAndDisplayWeather(userLocation);
        })
        .catch((err) => {
          console.log("Error fetching user location data: ", err);
          userLocationElement.textContent = "Failed to fetch location. Showing Stockholm as default.";
          fetchAndDisplayWeather('Stockholm,Sweden');
        });
    });
  } else {
    userLocationElement.textContent = "Geolocation is not supported by this browser.";
  }
};

// Call the function to fetch and display default location's weather
fetchAndDisplayWeather('Stockholm,Sweden');

// Call the function to fetch weather based on user's location
fetchAndDisplayWeatherByLocation();