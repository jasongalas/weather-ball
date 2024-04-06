const weatherAppAPIKey = "ac72967ce9d3c5739719b87341910126";
// const cityInput = document.querySelector("#city-input");
// const buttonClick = document.querySelector("#hows-the-weather")

// //Here is the function to figure out the weather
// const howsTheWeather = function(){

    const city = "San Salvador"

    //This is the first fetch quest for the geolocation, latitude & longitude
    const locationUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${weatherAppAPIKey}`;
    fetch(locationUrl).then(function(response){
        return response.json();
    }).then(function(data){
        console.log("--------- First request with geolocation --------")
        console.log(data);

        //Here we're putting latitude and longitude into variables.
        const latitude = data[0].lat;
        const longitude = data[0].lon;
        console.log(latitude, longitude);

        //This is where we nest into the next fetch quest, for the weather
        const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=imperial&appid=${weatherAppAPIKey}`
        fetch(weatherUrl).then(function(response2) {
            return response2.json();
        }).then(function(data2){
            console.log("--------- Second request with forecast --------")
            console.log(data2);
            for(let i = 0; i < data2.list.length; i++){
                console.log(data2.list[i].main.temp)
                console.log(data2.list[i].main.humidity)
                console.log(data2.list[i].wind.speed)
            }
        })

    })
// }

    // howsTheWeather()