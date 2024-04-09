//global variables

const weatherAppAPIKey = "ac72967ce9d3c5739719b87341910126";
const cityForm = document.querySelector("#city-form");
const cityInputEl = document.querySelector("#city-input");
const cityHistoryContainer = document.querySelector("#city-history");
const todaysWeather = document.querySelector("#todays-weather");
const fiveDayWeather = document.querySelector("#five-day-weather");


let cityHistory = [];

const heresTodaysWeather = function(city, weatherData){
    const today = dayjs().format("MM-DD-YYYY");
    const temperature = weatherData.main.temp;
    const iconUrl = `https://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`;
    const humidityPercent = weatherData.main.humidity;
    const windSpeed = weatherData.wind.speed;
    
    const weatherCard = document.createElement("div");
    const weatherCardBody = document.createElement("div");
    const heading = document.createElement("h3");
    const weatherIcon = document.createElement("img");
    const tempF = document.createElement("p");
    const wind = document.createElement("p");
    const humidity = document.createElement("p");

    weatherCard.setAttribute("class", "card bg-light border border primary text-dark");
    weatherCardBody.setAttribute("class", "card-body");
    weatherCard.append(weatherCardBody);
    
    heading.setAttribute("class", "h3 card-title");
    tempF.setAttribute("class", "card-text");
    wind.setAttribute("class", "card-text");
    humidity.setAttribute("class", "card-text");

    heading.textContent = `${city} [${today}]`;
    heading.append(weatherIcon);
    weatherIcon.setAttribute("src", iconUrl);
    tempF.textContent = `Temp: ${temperature}`;
    humidity.textContent = `Humidity: ${humidityPercent} %`;
    wind.textContent = `Wind Speed: ${windSpeed} mph`;
    weatherCardBody.append(heading, tempF, wind, humidity);

    todaysWeather.innerHTML = "";
    todaysWeather.append(weatherCard);
}

const createForecast = function (forecastData){
    const iconUrl = `https://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`;
    const temperature = forecastData.main.temp;
    const humidityPercent = forecastData.main.humidity;
    const windSpeed = forecastData.wind.speed;

    const forecastColumn = document.createElement("div");
    const forecastCard = document.createElement("div");
    const forecastCardBody = document.createElement("div");
    const forecastCardHeading = document.createElement("h4");
    const weatherIcon = document.createElement("img");
    const tempF = document.createElement("p");
    const wind = document.createElement("p");
    const humidity = document.createElement("p");

    forecastColumn.append(forecastCard)
    forecastCard.setAttribute("class", "card bg-light border border primary text-dark");
    forecastCardBody.setAttribute("class", "card-body");
    forecastCard.append(forecastCardBody);

    forecastColumn.setAttribute("class", "col-md");
    forecastColumn.classList.add("five-day-card");
    forecastCard.setAttribute("class", "card bg-primary text-white");
    forecastCardBody.setAttribute("class", "card-body");
    forecastCardHeading.setAttribute("class", "h4 card-title");
    tempF.setAttribute("class", "card-text");
    wind.setAttribute("class", "card-text");
    humidity.setAttribute("class", "card-text");

    forecastCardHeading.textContent = dayjs(forecastData.dt_txt).format("MM/DD/YYYY");
    forecastCardHeading.append(weatherIcon);
    weatherIcon.setAttribute("src", iconUrl);
    tempF.textContent = `Temp: ${temperature}`;
    humidity.textContent = `Humidity: ${humidityPercent} %`;
    wind.textContent = `Wind Speed: ${windSpeed} mph`;
    forecastCardBody.append(forecastCardHeading, tempF, wind, humidity);

    fiveDayWeather.append(forecastColumn);
}

const heresTheForecast = function(weatherData){

    const startDate = dayjs().add(1, "day").startOf("day").unix();
    const endDate = dayjs().add(6, "day").startOf("day").unix();

    const headingColumn = document.createElement("div");
    headingColumn.setAttribute("class", "col-12")

    fiveDayWeather.innerHTML = "";
    fiveDayWeather.append(headingColumn);

    for(let index = 0; index < weatherData.length; index += 8){
        if(weatherData[index].dt >= startDate && weatherData[index].dt < endDate)
            if(weatherData[index].dt_txt.slice(11,13) === "12"){

            }
    }
}

//weather hunter
const howsTheWeather = function (location){
    
    const latitude = location.lat;
    const longitude = location.lon;
    const city = location.name;
    
    const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=imperial&appid=${weatherAppAPIKey}`;
    fetch(weatherUrl).then(function(response) {
        return response.json();
    }).then(function(data){
        console.log(data)

        heresTodaysWeather(city, data.list[0])
        heresTheForecast(data.list)

        }
    );
}

const listCityHistory = function (){

    cityHistoryContainer.innerHTML = "";
    for (let index = 0; index < cityHistory.length; index++){

        const cityButton = document.createElement("button");
        cityButton.setAttribute("type", "button");
        cityButton.setAttribute("class", "btn btn-secondary");
        cityButton.setAttribute("city-search", cityHistory[index]);
        cityButton.classList.add("city-button");
        cityButton.textContent = cityHistory[index];
        cityHistoryContainer.append(cityButton);
    }
}

//Logs the city that was looked up into the aside
const weatherHistory = function(cityInput){
    
    if (cityHistory.indexOf(cityInput) !== -1){
        return;
    }
    
    cityHistory.push(cityInput);
    localStorage.setItem("cityHistory", JSON.stringify(cityHistory));

    listCityHistory();
}

//This is our location hunter, using cityInput to get a latitude and longitude
const wheresTheWeather = function (cityInput) {

    const locationUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityInput}&appid=${weatherAppAPIKey}`;
    fetch(locationUrl).then(function(response){
        return response.json();
    }).then(function(data){
        
        console.log(data)
        //In case the city does not exist
        if(!data[0]){
            alert("City not found!");
        } else {
            weatherHistory(cityInput); //Stores the city in local storage
            howsTheWeather(data[0]); //Gets the weather information

        }
    }).catch(function(error){
        console.log(error);
    });
}

//City button event handler
const chooseYourCity = function (event){
    event.preventDefault();

    const cityInput = cityInputEl.value.trim();
    if (cityInput){
        wheresTheWeather(cityInput);
    }

    cityInputEl.value="";
}

const returnToCity = function (event){
    console.log(event.target)

    if(!event.target.matches(".city-button")){
        return;
    }

        const buttonElement = event.target;

        const citySearch = buttonElement.getAttribute("city-search");
        
    howsTheWeather(citySearch);
    

}

const initialize = function(){

    const storedCityHistory = JSON.parse(localStorage.getItem("cityHistory"));
    if (storedCityHistory) {
        cityHistory = storedCityHistory;
    }
    listCityHistory();
}

//the main event(s)
initialize()

cityForm.addEventListener("submit", chooseYourCity);
cityHistoryContainer.addEventListener("click", returnToCity);


// const sameDayForecast = function(forecast){
//     const sameDayWeatherCard = {
//         cityName: cityInputEl,
//         date: today,
//         temperature: main.temp,
//         humidity: main.humidity,
//         windSpeed: wind.speed
//     }

//     console.log(sameDayWeatherCard)
// }

// const fiveDayForecast = function(forecast){
//     const fiveDayForecastCard = {
//         cityName: cityInputEl,
//         date: "4/8/2024",
//         temperature: main.temp,
//         humidity: main.humidity,
//         windSpeed: wind.speed
//     }
// }