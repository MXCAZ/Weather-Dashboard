
var searchButton = document.querySelector('#searchButton');
var pastSearch = document.querySelector('#past-search');
var currentForecast = document.querySelector('#current-forecast');
var weatherContainer = document.querySelector('#weather-container');
var fiveDaysTitle = document.querySelector('#forecast');
var fiveDaysContainer = document.querySelector('#five-container');
var inputCity = document.querySelector('#cityInput'); 
var fiveContainer = document.querySelector('#ive-days-forecast')
var cleanWeather = document.querySelector('#container')
var buttonClear = document.querySelector('#clear')

var cities =[];
var searchCity = inputCity.value

var saveSearch = function(){
  localStorage.setItem('cities', JSON.stringify(cities))
}
 
loadCities()

searchButton.addEventListener("submit", function(event){
  event.preventDefault();

  
  var searchCity = inputCity.value
  
  if(searchCity){
   
  requestApi(searchCity);
  requestApiForecast(searchCity);
  prevSearch(searchCity);
  
 }
  else{alert("Please put a city name");
  } return;
      
  })

function requestApi(city){
  var apiKey = "8c88829ef9666e9b022fd1fbf55f2d18"
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;
  fetch(url)
    .then((response)=>response.json())
    .then(data =>{
     
     
    currentForecastFirst(data)

     console.log(data)})
    .catch(err=> console.log(err))
    
}

function requestApiForecast(city){
  var apiKey = "8c88829ef9666e9b022fd1fbf55f2d18"
  let url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`;
  fetch(url)
    .then((response)=>response.json())
    .then(data =>{
    
    
fiveDaysContainerCard(data)

     console.log(data)})
    .catch(err=> console.log(err))
    
}

 var fiveDaysContainerCard = function(data){

  fiveDaysContainer.textContent = ""
  fiveDaysTitle.innerHTML = `5- Day Forecast:`

  var dailyForecast = data.list;
  for(var i=5; i < dailyForecast.length; i=i+8){

    var forecast = dailyForecast[i];

  var iconUrl = `https://openweathermap.org/img/w/${forecast.weather[0].icon}.png`;
  var temperature = forecast.main.temp;
  var humidity = forecast.main.humidity;
  var windSpeed = forecast.wind.speed;
  
var card = document.createElement('div');
var cardHeader = document.createElement('div');
var cardBody = document.createElement('div');
var cardTitle = document.createElement('h5');
var cardIcon = document.createElement('img');
var cardTemp = document.createElement('p');
var cardHumidity = document.createElement('p');
var cardWind = document.createElement('p')

card.append(cardHeader,cardBody);
cardBody.append(cardTitle, cardIcon, cardTemp, cardHumidity, cardWind);

card.setAttribute('class', "card text-bg-info mb-3");
cardHeader.setAttribute('class', 'card-header');
cardBody.setAttribute('class', 'card-body');
cardTitle.setAttribute('class', 'card-title');
cardIcon.setAttribute('src', iconUrl)
cardTemp.setAttribute('class', 'card-text')
cardHumidity.setAttribute('class', 'card-text')
cardWind.setAttribute('class', 'card-text');

cardHeader.textContent = moment.unix(forecast.dt).format('MMM D, YYYY');
cardTitle.textContent = forecast.name
cardTemp.textContent = `Temperature: ${temperature}°F`
cardHumidity.textContent = `Humidity: ${humidity}%`
cardWind.textContent = `Wind Speed ${windSpeed}%`


fiveDaysContainer.append(card);
  }
   
}

function createButton(city){

  var button = document.createElement('button');
  button.setAttribute('class', 'd-flex w-100 btn-light border p-2 mt-2 ');
  button.setAttribute('data-city',city)
  button.textContent = city;
  pastSearch.append(button);
  

}

var pastSearchHandler = function(event){
  var city = event.target.getAttribute('data-city')
  

  if(city){
    
    requestApi(city);
    requestApiForecast(city);
   
    
  }
}
  
function currentForecastFirst(data){

var date = moment().format('MMMM Do YYYY');
var iconUrl = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`;
var temperature = data.main.temp;
var humidity = data.main.humidity;
var windSpeed = data.wind.speed;

currentForecast.innerHTML = `<h3>${data.name} (${date}) <img src="${iconUrl}"> </h3> 
<p>Temperature: ${temperature}°F</p>
<p> Humidity: ${humidity}%</p>
<p> Wind Speed: ${windSpeed}%</p>`

}

function prevSearch(city){
  var apiKey = "8c88829ef9666e9b022fd1fbf55f2d18"
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;
  fetch(url)
    .then((response)=>response.json())
    .then(data =>{
      var cityName = data.name;
      
      var prevSearch = cities.includes(cityName);

      if(!prevSearch){
        cities.push(cityName)
        saveSearch()
        createButton(cityName)
        
      }

      else{
        alert('You already had that city')
       
       } 

     console.log(data)})
    .catch(err=> console.log(err))
    

}

function loadCities() {
  var citiesLoaded = localStorage.getItem("cities")
  
  if(!citiesLoaded) {
      return false;
  }
  
  else{

    citiesLoaded = JSON.parse(citiesLoaded);

  for (var i=0; i < citiesLoaded.length; i++) {
      requestApi(citiesLoaded[i])
      requestApiForecast(citiesLoaded[i])
      createButton(citiesLoaded[i])
      
  }
}
}

buttonClear.addEventListener('click', function(){
  localStorage.clear()
  currentForecast.innerHTML= ''
  fiveDaysContainer.innerHTML = ''
  fiveDaysTitle.innerHTML=''
  pastSearch.innerHTML=''
  location.reload()
  
})


pastSearch.addEventListener('click', pastSearchHandler)


