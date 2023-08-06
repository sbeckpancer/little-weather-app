function displayTemperature(response) {
  console.log(response.data);
  let temperatureElement = document.querySelector("#temperature");
  let cityElement = document.querySelector("#city");
  let descriptionElement = document.querySelector("#description");
  let humidityElement = document.querySelector("#humidity");
  let speedElement = document.querySelector("#speed");
  temperatureElement.innerHTML = Math.round(response.data.temperature.current);
  cityElement.innerHTML = response.data.city;
  descriptionElement.innerHTML = response.data.condition.description;
  humidityElement.innerHTML = response.data.temperature.humidity;
  speedElement.innerHTML = Math.round(response.data.wind.speed);
}

let key = "7403et83fb4399900394coaf2dac3cbb";
let apiUrl = `https://api.shecodes.io/weather/v1/current?query=Bangkok&key=${key}&units=imperial`;

console.log(apiUrl);
axios.get(apiUrl).then(displayTemperature);
