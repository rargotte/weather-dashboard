const maxNumCities = 8;
const APIKey = "8fdcf25ee03510def140878928e9c9ce";
var cityListedEl = "";
var citySearch = "";
var arrayLocalStorage = new Array;
var city = "";
var idCity = "";
var temp = "";

function handleLocalStorage() {
    var deleteIndex = "";
    arrayLocalStorage = JSON.parse(localStorage.getItem("weather"));
    localStorage.clear("weather");

    if (idCity == "city-00") {
        /*User selected search a new city*/
        if (!arrayLocalStorage) {
            arrayLocalStorage = [city];
        } else {
            deleteIndex = arrayLocalStorage.indexOf(city, 0);
            if (deleteIndex !== -1) {
                arrayLocalStorage.splice(deleteIndex, 1)
            }
            arrayLocalStorage.unshift(city);
        }
    }
    localStorage.setItem("weather", JSON.stringify(arrayLocalStorage));
    localStorage.setItem("aqui va", city);
}

function updateButtons() {
    $("#search-input")[0].value = "";
    arrayLocalStorage = JSON.parse(localStorage.getItem("weather"));
    if (arrayLocalStorage) {
        for (var i = 0; i < arrayLocalStorage.length; i++) {
            $("#city-" + i).children("button").text(arrayLocalStorage[i])
        }
    }
}

/*Main function to read local storage and update Dashboard*/
function initDashboard() {
    /*to upload any prevoius data from local storage*/
    updateButtons();

    /*set in local storage...*/
    $(".btn").click(function (event) {
        event.preventDefault();
        cityListedEl = $(this).parents(".store-city");
        citySearch = $(this).siblings(".form-input").val();
        var isButton = event.target.nodeName === 'BUTTON';
        /* if (!isButton) {
             return
         }*/
        if (citySearch) {
            city = citySearch;
            idCity = "city-00";


        } else if (cityListedEl.attr("id")) {
            city = cityListedEl.children("button").text();
            idCity = cityListedEl.attr("id");

        }

        weatherFetch();





    });



};

function showInfo(data) {
    var coord = data.coord;
    var today = moment();
    var ResultEl = document.getElementById("result");
    var cityH1 = document.createElement("h1");
    var cityResultEl = document.getElementById("city-result");

    /*Logic to show the city name and day*/
    if (!cityResultEl) {
        var cityResultEl = document.createElement("div");
    } else
        cityResultEl.innerHTML = "";

    cityH1.textContent = data.name + " (" + today.format("MMM Do, YYYY") + ")";
    cityResultEl.setAttribute("id", "city-result")
    cityResultEl.append(cityH1);

    ResultEl.prepend(cityResultEl);

    fetchDetails(coord);


};



function fetchDetails(myCoord) {

    var lat = myCoord.lat
    var long = myCoord.lon
    var coordinates = "lat=" + lat + "&lon=" + long;
    var queryURL2 = "https://api.openweathermap.org/data/2.5/onecall?" + coordinates + "&exclude=hourly,minutely" + "&units=imperial" + "&appid=" + APIKey;
    var weatherData = "";

    fetch(queryURL2)
        .then(function (response) {

            if (response.status === 200) {

            }
            return response.json();
        })
        .then(function (data) {

            fillUpHeader(data);
            fillUpCard(data);
        })
}

function fillUpHeader(data) {

    var cityResultEl = document.getElementById("city-result");
    /*temp*/
    var tempEl = document.createElement("h2");
    tempEl.textContent = "Temp: " + data.current.temp + " °F"
    cityResultEl.appendChild(tempEl);
    /*wind*/
    var windE1 = document.createElement("h2");
    windE1.textContent = "Wind: " + data.current.wind_speed + " MPH";
    cityResultEl.appendChild(windE1);

    /*humidity*/
    var humidE1 = document.createElement("h2");
    humidE1.textContent = "Humidity: " + data.current.humidity + "%";
    cityResultEl.appendChild(humidE1);

    /*UVI*/
    var uviE1 = document.createElement("h2");
    uviE1.textContent = "UVI    : " + data.current.uvi;
    cityResultEl.appendChild(uviE1);
}

function fillUpCard(data) {
    var day = moment();
    var cardGroupEl = document.getElementById("cardgroup");
    cardGroupEl.classList.remove("no-display");


    for (var i = 0; i < 5; i++) {
        day.add(1, 'days');
        console.log(day.format("MMM Do, YYYY"));
        var cardEl = document.getElementById("card-" + i);

        cardEl.innerHTML = "";


        var cardBodyEl = document.createElement("div");
        cardBodyEl.setAttribute("class", "card-body text-info");

        var cardTitleEl = document.createElement("h5");
        cardTitleEl.setAttribute("class", "info-card-title");
        cardTitleEl.textContent = day.format("MMM Do, YYYY");
        cardBodyEl.appendChild(cardTitleEl);

        var cardIcon = document.createElement("img");
        cardIcon.setAttribute("class", "card-img-top");
        cardIcon.setAttribute( "src", "https://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + "@2x.png");
        cardBodyEl.appendChild(cardIcon);

        var cardTempEl = document.createElement("p");
        cardTempEl.setAttribute("class", "card-text");
        cardTempEl.textContent = "Temp: " + data.daily[i].temp.day;
        cardBodyEl.appendChild(cardTempEl);

        var cardWindEl = document.createElement("p");
        cardWindEl.setAttribute("class", "card-text");
        cardWindEl.textContent = "Wind: " + data.daily[i].wind_speed;
        cardBodyEl.appendChild(cardWindEl);

        var cardHumidEl = document.createElement("p");
        cardHumidEl.setAttribute("class", "card-text");
        cardHumidEl.textContent = "Humidity: " + data.daily[i].humidity;
        cardBodyEl.appendChild(cardHumidEl);

        var cardUVIEl = document.createElement("p");
        cardUVIEl.setAttribute("class", "card-text ");
        cardUVIEl.textContent = "UVI: " + data.daily[i].uvi;
        if (data.daily[i].uvi <= 2) {
            cardUVIEl.setAttribute("class", "green-backgd");
        } else if (data.daily[i].uvi <= 5) {
            cardUVIEl.setAttribute("class", "yellow-backgd");
        } else if (data.daily[i].uvi <= 7) {
            cardUVIEl.setAttribute("class", "orange-backgd");
        } else
            cardUVIEl.setAttribute("class", "red-backgd");
        cardBodyEl.appendChild(cardUVIEl);

        cardEl.appendChild(cardBodyEl);

    }
}

function weatherFetch() {


    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;
    if (city !== "") {
        fetch(queryURL)
            .then(function (response) {
                console.log(response);
                if (response.status === 200) {

                    handleLocalStorage();
                    updateButtons();
                }
                return response.json();
            })
            .then(function (data) {
                showInfo(data);
            })


    }
}




/*Once the HTML is loaded update*/
/*$(document).ready(initDashboard);*/
initDashboard();