# Weather API Project

This is a front-end JavaScript project that uses the [Open-Meteo API](https://open-meteo.com/) to display weather data for a user-selected location. It is part of my Open API Portfolio Work.

**Live site**: [weather-api-project-one.vercel.app](https://weather-api-project-one.vercel.app)  
**GitHub repo**: [github.com/locirin/weather-api-project](https://github.com/locirin/weather-api-project)


## About

This application pulls weather data from Open-Meteo, an open source API that provides free weather forecasts based on geographic coordinates. The app supports:

- **Current weather**
- **Historical weather** (based on selected date)
- **Temperature display in Celsius or Fahrenheit**, based on user preference

Users can enter a city or ZIP code and use navigation buttons to request specific weather data. Each data point is fetched via a **separate GET request**, based on user input.


## Features

- Uses two separate GET requests:
  - One to display **temperature**
  - One to display **weather condition**
- Supports Celsius and Fahrenheit toggle
- Responsive design using media queries (mobile-first, tablet, and desktop breakpoints)
- Clean styling with accessible layout and text
- Displays user-friendly weather descriptions based on standard weather codes


## How to Run Locally

- To test or explore the project locally:
- In your terminal or command prompt, run:
   git clone https://github.com/locirin/weather-api-project.git

- Open the folder in your code editor
- Open index.html in your browser
- Or visit the live version on Vercel: weather-api-project-one.vercel.app


## Technologies

- HTML
- CSS
- JavaScript
- Responsive Web Design (RWD)
- Fetch API