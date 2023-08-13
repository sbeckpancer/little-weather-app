function formatDate(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }

  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];
  return `${day} ${hours}:${minutes}`;
}

//we need to fix how the day is displayed in the forecast. Right now
//it is 161100932. We need it to be a day of the week.

function formatDay(timestamp) {
  // the parameter passed to the function will be a timestamp
  let date = new Date(timestamp * 1000);

  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily; //creates an array called Forecast with the weather data for each of 7 days

  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row justify-content-evenly">`; //opening the row

  forecast.forEach(function (forecastDay, index) {
    //forecastDay is the parameter for the function
    //below we can get pieces out of the object forecastDay without [0], just forecastDay.condition.icon, for example
    if (index > 0 && index < 7) {
      forecastHTML =
        forecastHTML +
        `
     <div class ="col-2">
      <div class="weather-forecast-date">${formatDay(forecastDay.time)}</div> 
      
      <img src="http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${
        forecastDay.condition.icon
      }.png" width="48"></img>
    <div class="weather-forecast-temperatures">
      <span class="weather-forecast-temperature-max">
        ${Math.round(forecastDay.temperature.maximum)}°
      </span>
      <span class="weather-forecast-temperature-min">
         ${Math.round(forecastDay.temperature.minimum)}°
      </span>
    </div>
    </div>
  `;
    }
  });

  forecastHTML = forecastHTML + `</div>`; //closing the row
  forecastElement.innerHTML = forecastHTML; //putting this inside the forecast element that we selected before
}

function getForecast(coordinates) {
  console.log(coordinates);

  let key = "7403et83fb4399900394coaf2dac3cbb";
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?lon=${coordinates.longitude}&lat=${coordinates.latitude}&key=${key}&units=imperial`;

  console.log(apiUrl);
  axios.get(apiUrl).then(displayForecast);
}

function displayTemperature(response) {
  let temperatureElement = document.querySelector("#temperature");
  let cityElement = document.querySelector("#city");
  let descriptionElement = document.querySelector("#description");
  let humidityElement = document.querySelector("#humidity");
  let speedElement = document.querySelector("#speed");
  let dateElement = document.querySelector("#date");
  let iconElement = document.querySelector("#icon");

  fahrenheitTemperature = response.data.temperature.current;

  temperatureElement.innerHTML = Math.round(fahrenheitTemperature);
  cityElement.innerHTML = response.data.city;
  descriptionElement.innerHTML = response.data.condition.description;
  humidityElement.innerHTML = response.data.temperature.humidity;
  speedElement.innerHTML = Math.round(response.data.wind.speed);
  dateElement.innerHTML = formatDate(response.data.time * 1000);
  iconElement.setAttribute(
    "src",
    `http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${response.data.condition.icon}.png`
  );
  iconElement.setAttribute("alt", `${response.data.condition.description}`);

  getForecast(response.data.coordinates);
}

function search(city) {
  let key = "7403et83fb4399900394coaf2dac3cbb";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${key}&units=imperial`;

  axios.get(apiUrl).then(displayTemperature);
}

function handleSubmit(event) {
  event.preventDefault();
  let cityInputElement = document.querySelector("#city-input");
  search(cityInputElement.value);
}

function displayCelsiusTemperature(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  // remove the active class from the fahrenheitlink
  fahrenheitLink.classList.remove("active");
  // add the active class to the celsius link
  celsiusLink.classList.add("active");
  let celsiusTemperature = ((fahrenheitTemperature - 32) * 5) / 9;

  temperatureElement.innerHTML = Math.round(celsiusTemperature);
}

function displayFahrenheitTemperature(event) {
  event.preventDefault();

  let temperatureElement = document.querySelector("#temperature");
  // add the active class to the fahrenheitlink
  fahrenheitLink.classList.add("active");
  // remove the active class from the fahrenheit link
  celsiusLink.classList.remove("active");
  temperatureElement.innerHTML = Math.round(fahrenheitTemperature);
}

let fahrenheitTemperature = null;

let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelsiusTemperature);

search("Paris");
