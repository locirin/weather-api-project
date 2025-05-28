/* 
Project: Weather API
Location: San Francisco
Objectives: To show two data points using Open-Meteo API

~~~ Planning:
Assure with console.log that JS is running
Declare API url for SF (using lat and long)
Data fetch from API
Confirm the Response
Convert received response to JSON
Declare current_weather section
Make paragraph elements for temperature and weather condition
Make weather-box and show the data inside
Logging for each step
*/

// Confirm JS is working
console.log("JS is linked and running");

// Declare API url for SF (using lat and long)
const apiUrl = "https://api.open-meteo.com/v1/forecast?latitude=37.7749&longitude=-122.4194&current_weather=true";
console.log("Fetching weather data from:", apiUrl);

// Define readable weather codes. 
// Source: WMO standardized weather codes used by Open-Meteo 
// as per https://open-meteo.com/en/docs#weather_variable_documentation

const weatherDescriptions = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Depositing rime fog",
  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",
  56: "Light freezing drizzle",
  57: "Dense freezing drizzle",
  61: "Slight rain",
  63: "Moderate rain",
  65: "Heavy rain",
  66: "Light freezing rain",
  67: "Heavy freezing rain",
  71: "Slight snow fall",
  73: "Moderate snow fall",
  75: "Heavy snow fall",
  77: "Snow grains",
  80: "Slight rain showers",
  81: "Moderate rain showers",
  82: "Violent rain showers",
  85: "Slight snow showers",
  86: "Heavy snow showers",
  95: "Thunderstorm",
  96: "Thunderstorm with slight hail",
  99: "Thunderstorm with heavy hail"
};

// Data fetch from API
fetch(apiUrl)
  .then(function(response) {
    console.log("Response from the API is OK");

    // Check for OK response (status code 200–299)
    if (!response.ok) {
      throw new Error("Network error");
    }

    // Convert response to JSON
    return response.json();
  })
  .then(function(data) {
    console.log("Converted response to JSON");
    console.log("Full data object:", data);

    // Declare current_weather section
    let weather = data.current_weather;
    console.log("Current weather data:", weather);

    // Show the weather on the page
    let output = document.getElementById("weather-box");
    console.log("Found output area in HTML");

    // Show temperature data
    let temperature = document.createElement("p");
    temperature.textContent = "Temperature: " + weather.temperature + " °C";
    console.log("Temperature reading in C:", temperature.textContent);

   // Weather description
    let conditionText = weatherDescriptions[weather.weathercode] || "Unknown condition";
    let condition = document.createElement("p");
    condition.textContent = "Condition: " + conditionText;
    console.log("Condition created:", condition.textContent);

    // Add all to page
    output.appendChild(temperature);
    output.appendChild(condition);
    console.log("All weather info added to page");
  })
  .catch(function(error) {
    console.error("Error fetching weather data:", error);
  });
