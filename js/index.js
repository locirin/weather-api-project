// =======================================================================
// Project: Weather API
// Location: User selection
// Objectives: To show current and historical weather data using Open-Meteo API
// =======================================================================

// =======================================================================
// =======================================================================
// =======================================================================

// ==========  Confirm JS is working =====================================

console.log("JS is linked and running");

// =======================================================================
// ======================== Step 1: Weather codes description ============
// Used by Open-Meteo (WMO standardized weather codes)
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
  99: "Thunderstorm with heavy hail",
};

// =======================================================================
// ================= Step 2: Declaration of global variables =====================
let latitude;
let longitude;
let name;
let country;

// ==============================================================================
// ============= Step 3: Adding listened for Search button =======================

document
  .getElementById("weather-form")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // stop page refreshing

    // Getting user input data
    const location = document.getElementById("location").value;

    // Getting selected temperature unit
    const unit = document.getElementById("unit").value;

    // Logging
    console.log("User provided location:", location);
    console.log("User selected unit:", unit);

    // =======================================================================
    // ============ Step 4: Adding geocoding api url

    const geocodeUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      location
    )}&count=1`;

    console.log("Geocoding API URL:", geocodeUrl);

    // =======================================================================
    // ============== Step 5: Fetching location data
    fetch(geocodeUrl)
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Geocoding failed");
        }
        return response.json();
      })

      .then(function (data) {
        console.log("Geocoding data received:", data);

        if (!data.results || data.results.length === 0) {
          throw new Error("Location not found");
        }

        // const { latitude, longitude, name, country } = data.results[0];
        ({ latitude, longitude, name, country } = data.results[0]);
        // document.getElementById("historical-section").style.display = "block"; // moved to Step 8 because it comes up too soon

        console.log("Found location:", name, country);
        console.log("Latitude:", latitude);
        console.log("Longitude:", longitude);

        // =======================================================================
        // =========== Step 6: Construct weather API URL depending on what to show

        // let weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,wind_speed_10m`;

        let weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,wind_speed_10m,pressure_msl&daily=temperature_2m_max,temperature_2m_min&timezone=auto`;

        if (unit === "fahrenheit") {
          weatherUrl += "&temperature_unit=fahrenheit&wind_speed_unit=mph";
        }

        console.log("Weather API URL:", weatherUrl);

        // =======================================================================
        // ============  Step 7: Fetch weather data ==============================

        return fetch(weatherUrl)
          .then(function (response) {
            if (!response.ok) {
              throw new Error("Weather fetch failed");
            }
            return response.json();
          })
          .then(function (weatherData) {
            console.log("Weather data received:", weatherData);

            const current = weatherData.current;
            console.log("Current temperature:", current.temperature_2m);
            console.log("Feels like:", current.apparent_temperature);
            console.log("Wind speed:", current.wind_speed_10m);

            // =======================================================================
            // ============== Step 8: What to show as search result

            let output = document.getElementById("weather-box");
            output.innerHTML = ""; // clear old data
            output.style.display = "block";

            // Show City, Country display
            // const cityName = document.createElement("h3");
            // cityName.textContent = `Current weather for ${name}, ${country}`; // name,country via geocoding
            // cityName.classList.add("section-title");
            // const main = document.querySelector("main");
            // main.appendChild(cityName);
            const locationTitle = document.getElementById("location-title");
            locationTitle.textContent = `Current weather for ${name}, ${country}`;

            // Show Current Temperature
            const temp = document.createElement("p");
            temp.textContent = `Temperature: ${current.temperature_2m} °${
              unit === "fahrenheit" ? "F" : "C"
            }`;

            // Show Current Feels like
            const feels = document.createElement("p");
            feels.textContent = `Feels like: ${current.apparent_temperature} °${
              unit === "fahrenheit" ? "F" : "C"
            }`;

            // Show Current Wind speed
            const wind = document.createElement("p");
            wind.textContent = `Wind speed: ${current.wind_speed_10m} ${
              unit === "fahrenheit" ? "mph" : "km/h"
            }`;

            // Show Current barometric pressure
            const pressure = document.createElement("p");
            pressure.textContent = `Barometric pressure: ${
              current.pressure_msl
            } ${unit === "fahrenheit" ? "inHg" : "hPa"}`;

            // Show Current high and low for a day
            const daily = weatherData.daily;

            const high = document.createElement("p");
            high.textContent = `Today's High: ${daily.temperature_2m_max[0]} °${
              unit === "fahrenheit" ? "F" : "C"
            }`;

            const low = document.createElement("p");
            low.textContent = `Today's Low: ${daily.temperature_2m_min[0]} °${
              unit === "fahrenheit" ? "F" : "C"
            }`;

            // Add selected data to the page
            // output.appendChild(cityName);
            output.appendChild(temp);
            output.appendChild(feels);
            output.appendChild(high);
            output.appendChild(low);
            output.appendChild(pressure);
            output.appendChild(wind);

            // Show historical  weather box after Current weather is shown
            document.getElementById("historical-section").style.display =
              "block";
          })

          .catch(function (error) {
            console.error("Error fetching weather:", error);
          });
      });
  });

// =======================================================================
// ============== Step 9: Historical Weather form, Listener for

document
  .getElementById("historical-form")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Preventing form refreshing the page

    // Search by location should come first. If not ==> then STOP
    if (!latitude || !longitude) {
      alert("Please search for a city or zip first.");
      return;
    }

    // Getting selected date form
    const selectedDate = document.getElementById("history-date").value;
    if (!selectedDate) return;

    // Preventing future dates
    // const today = new Date().toISOString().split("T")[0];
    // if (selectedDate > today) {
    //   alert("Please pick a date in the past. Future dates are not supported.");
    //   return;
    // }

    // The above is replace with:
    // Convert date strings to Date objects
    const selectedDateObj = new Date(selectedDate);
    selectedDateObj.setHours(0, 0, 0, 0); // time normalization

    const today = new Date();
    today.setHours(0, 0, 0, 0); // time normalization

    const cutoffDate = new Date();
    cutoffDate.setDate(today.getDate() - 5); // 5-day for archive data
    cutoffDate.setHours(0, 0, 0, 0);

    // Check for future or too-recent date
    if (selectedDateObj > cutoffDate) {
      alert(
        "Historical data is only available for dates more than 5 days ago."
      );
      return;
    }

    // =======================================================================
    // =========== Step 10: Historical weather: creating URL for historical weather API

    let unit = document.getElementById("unit").value;
    // let historyUrl = `https://api.open-meteo.com/v1/history?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,pressure_msl&timezone=auto&start_date=${selectedDate}&end_date=${selectedDate}`;

    // let historyUrl = `https://archive-api.open-meteo.com/v1/era5?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,pressure_msl&timezone=auto&start_date=${selectedDate}&end_date=${selectedDate}`;

    let historyUrl = `https://archive-api.open-meteo.com/v1/era5?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min&hourly=pressure_msl&timezone=auto&start_date=${selectedDate}&end_date=${selectedDate}`;

    // Adding unit selection
    let finalUrl = historyUrl;
    // let finalUrl =
    //   "https://archive-api.open-meteo.com/v1/era5?latitude=48.85341&longitude=2.3488&daily=temperature_2m_max,temperature_2m_min,pressure_msl&timezone=auto&start_date=2024-05-01&end_date=2024-05-01";
    console.log("Final historical URL:", finalUrl);

    if (unit === "fahrenheit") {
      finalUrl +=
        "&temperature_unit=fahrenheit&wind_speed_unit=mph&pressure_unit=inchmercury";
    }

    fetch(finalUrl)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch historical weather");
        return res.json();
      })
      .then((historyData) => {
        const historyBox = document.getElementById("historical-box");
        historyBox.innerHTML = "";

        document.getElementById("historical-box").style.display = "block";

        const date = selectedDate;
        const max = historyData.daily.temperature_2m_max[0];
        const min = historyData.daily.temperature_2m_min[0];
        const pressure = historyData.hourly.pressure_msl[0];

        // const title = document.createElement("h4");
        // title.textContent = `Historical Weather for ${date}`;

        // Moving Historical title outside the box
        const locationTitle = document.createElement("h3");

        // locationTitle.textContent = `Historical Weather for ${date}`;
        //Converting date from yyyy-mm-dd to mm-dd-yyyy
        const [year, month, day] = date.split("-");
        const formattedDate = `${month}/${day}/${year}`;

        // Adding location and historical date to the title
        locationTitle.textContent = `Historical Weather for ${name} ${formattedDate}`;

        locationTitle.classList.add("subsection-title");

        // Historical search result title goes above search results box
        const historicalSection = document.getElementById("historical-section");
        historicalSection.insertBefore(locationTitle, historyBox);

        const hi = document.createElement("p");
        hi.textContent = `High: ${max}°${unit === "fahrenheit" ? "F" : "C"}`;

        const lo = document.createElement("p");
        lo.textContent = `Low: ${min}°${unit === "fahrenheit" ? "F" : "C"}`;

        const pres = document.createElement("p");
        pres.textContent = `Pressure: ${pressure} ${
          unit === "fahrenheit" ? "inHg" : "hPa"
        }`;

        // historyBox.appendChild(title);
        historyBox.appendChild(hi);
        historyBox.appendChild(lo);
        historyBox.appendChild(pres);
      })
      .catch((err) => {
        console.error("Error fetching historical weather:", err);
      });
  });

// =======================================================================
// =========== Footer
// Getting the current year
const today = new Date();
const thisYear = today.getFullYear();

// Creating a new element footer
const footer = document.createElement("footer");

// Creating p element and coryright info
const copyright = document.createElement("p");

// STRETCH: Using unicode Symbol
copyright.innerHTML = `\u00A9 Irina Lo ${thisYear}`;

// Adding copyright content to the footer
footer.appendChild(copyright);

// Adding the footer to the body
document.body.appendChild(footer);

// Console output check
console.log(`Footer is added to the bottom of the page.`, footer);

// // Declare API url for SF (using lat and long)
// let apiUrl = "https://api.open-meteo.com/v1/forecast?latitude=37.7749&longitude=-122.4194&current_weather=true";
// console.log("Fetching weather data from:", apiUrl);

// // Data fetch from API
// fetch(apiUrl)
//   .then(function(response) {
//     console.log("Response from the API is OK");

//     // Check for OK response (status code 200–299)
//     if (!response.ok) {
//       throw new Error("Network error");
//     }

//     // Convert response to JSON
//     return response.json();
//   })
//   .then(function(data) {
//     console.log("Converted response to JSON");
//     console.log("Full data object:", data);

//     // Declare current_weather section
//     let weather = data.current_weather;
//     console.log("Current weather data:", weather);

//     // Show the weather on the page
//     let output = document.getElementById("weather-box");
//     console.log("Found output area in HTML");

//     // Show temperature data
//     let temperature = document.createElement("p");
//     temperature.textContent = "Temperature: " + weather.temperature + " °C";
//     console.log("Temperature reading in C:", temperature.textContent);

//    // Weather description
//     let conditionText = weatherDescriptions[weather.weathercode] || "Unknown condition";
//     let condition = document.createElement("p");
//     condition.textContent = "Condition: " + conditionText;
//     console.log("Condition created:", condition.textContent);

//     // Add all to page
//     output.appendChild(temperature);
//     output.appendChild(condition);
//     console.log("All weather info added to page");
//   })
//   .catch(function(error) {
//     console.error("Error fetching weather data:", error);
//   });
