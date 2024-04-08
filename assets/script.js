//global variables

const weatherAppAPIKey = "ac72967ce9d3c5739719b87341910126";
const cityForm = document.querySelector("#city-form");
const cityInputEl = document.querySelector("#city-input");
const cityHistoryContainer = document.querySelector("#city-history");
const todaysWeather = document.querySelector("#todays-weather");
const fiveDayWeather = document.querySelector("#five-day-weather");
const today = dayjs("MM-DD-YYYY");

let cityHistory = [];

const weather = function (latitude, longitude){
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

    const storedCityHistory = JSON.parse(localStorage.getItem("cityHistory"));
    
    cityHistoryContainer.innerHTML = "";
    for (let index = 0; index < storedCityHistory.length; index++){
        const cityButton = document.createElement("button");
        cityButton.setAttribute("type", "button");
        cityButton.setAttribute("class", "btn btn-secondary");
        cityButton.classList.add("history-button")
        cityButton.textContent = storedCityHistory[index];
        cityHistoryContainer.append(cityButton);
    }
}
listCityHistory();

const weatherHistory = function(cityInput){

    console.log(cityInput);

    if (cityInput === ""){
        return;
    }
    
    // if (cityHistory.indexOf(cityInput !== -1)){
    //     return;
    // }
    
    cityHistory.push(cityInput);
    console.log(cityHistory, "City History");
    localStorage.setItem("cityHistory", JSON.stringify(cityHistory));
    listCityHistory();
}

//This is our weather hunter
const howsTheWeather = function (cityInput) {

    //This is the first fetch quest for the geolocation, latitude & longitude
    const locationUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityInput}&appid=${weatherAppAPIKey}`;
    fetch(locationUrl).then(function(response){
        return response.json();
    }).then(function(data){
        
        if(!data[0]){
            alert("City not found!");
        } else {
            console.log(data);
            console.log(cityInput);
            const latitude = data[0].lat;
            const longitude = data[0].lon;
            weatherHistory(cityInput);
            weather(latitude, longitude)

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
        howsTheWeather(cityInput);
    }

    cityInputEl.value="";
}

const init = function(){
    const storedCityHistory = JSON.parse(localStorage.getItem("cityHistory"));
    if (storedCityHistory){
        cityHistory = storedCityHistory;
    }
    console.log(storedCityHistory);
}

init()

cityForm.addEventListener("submit", chooseYourCity);

// //Here is the function to figure out the weather
// const howsTheWeather = function(){

//     
    

//         //This is where we nest into the next fetch quest, for the weather
       

//             }
//         })

//     })
// }

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