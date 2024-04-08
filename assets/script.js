//global variables

const weatherAppAPIKey = "ac72967ce9d3c5739719b87341910126";
const cityForm = document.querySelector("#city-form");
const cityInputEl = document.querySelector("#city-input");
const cityHistoryContainer = document.querySelector("#city-history");
const todaysWeather = document.querySelector("#todays-weather");
const fiveDayWeather = document.querySelector("#five-day-weather");
const today = dayjs("MM-DD-YYYY");

let cityHistory = [];

//weather hunter
const howsTheWeather = function (latitude, longitude){
    const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=imperial&appid=${weatherAppAPIKey}`
    fetch(weatherUrl).then(function(response2) {
        return response2.json();
    }).then(function(data2){
        console.log("--------- Second request with forecast --------")
        console.log(data2);
        for(let index = 0; index < data2.list.length; index += 8){

            console.log(data2.list[index].dt_txt);

            const temperature = data2.list[index].main.temp
            const humidity = data2.list[index].main.humidity
            const windSpeed = data2.list[index].wind.speed

            console.log(temperature)
            console.log(humidity)
            console.log(windSpeed)
        }
    });
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
        
        //In case the city does not exist
        if(!data[0]){
            alert("City not found!");
        } else {
            console.log(data);
            const latitude = data[0].lat;
            const longitude = data[0].lon;
            weatherHistory(cityInput);
            howsTheWeather(latitude, longitude);

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
    } else {
        const buttonElement = event.target;

        const citySearch = buttonElement.getAttribute("city-search");
        alert(citySearch)
    howsTheWeather(citySearch);
    }

}

const initialize = function(){

    const storedCityHistory = JSON.parse(localStorage.getItem("cityHistory"));
    if (storedCityHistory) {
        cityHistory = storedCityHistory;
    }
    listCityHistory();
}

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