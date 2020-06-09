'use strict';

const express = require('express');
require('dotenv').config();

const app = express();

const cors = require('cors');
app.use(cors());

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`${PORT}`);
})

function NewLocation(searchQuery, obj) {
  this.search_query = searchQuery;
  this.formatted_query = obj.display_name;
  this.latitude = obj.lat;
  this.longitude = obj.lon;

}

app.get('/location', (request,response) => {
  try {
    let searchQuery = request.query.city;
    let geoData = require('./data/location.json');
    let returnObj = new NewLocation(searchQuery, geoData[0]);
    response.status(200).send(returnObj);
  } catch(err){
    response.status(500).send('whoops. Something went wrong');
  }
})

function Weather(obj) {
  this.forecast = obj.weather.description;
  this.time = obj.datetime;
}

app.get('/weather', (request,response) => {
  try {
    let weatherDays = []
    let weatherData = require('./data/weather.json');
    weatherData.data.forEach( weatherDay => {
      let day = new Weather(weatherDay);
      weatherDays.push(day)
    })
    response.status(200).send(weatherDays);
  } catch(err){
    response.status(500).send('storm clouds a coming cuz we did something wrong')
  }
})

//error handling:
app.get('*', (request,response) => {
  response.send('oops.. something went wrong')
})

//make weather constructor
//need forecast and time properties
// use description for forecast
// in route: bring in weather.json
//make empty array to push loop into
// after, loop over "data" in weather.json
//after loop, response.send the array
