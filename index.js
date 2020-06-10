'use strict';

const express = require('express');
const superagent = require('superagent');
require('dotenv').config();
const cors = require('cors');

const app = express();
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
  let searchQuery = request.query.city;

  let url = `https://us1.locationiq.com/v1/search.php?key=${process.env.LOCATION_DATA}&q=${searchQuery}&format=json`;

  superagent.get(url)
    .then(resultsFromSuperAgent => {let locationObject = new NewLocation(searchQuery, resultsFromSuperAgent.body[0]);
      response.status(200).send(locationObject);
    })
})

function Weather(obj) {
  this.forecast = obj.weather.description;
  this.time = obj.datetime;
}

app.get('/weather', (request,response) => {
  let searchQuery = request.query.search_query;
  let url = `https://api.weatherbit.io/v2.0/forecast/daily?city=${searchQuery}&key=${process.env.WEATHER_DATA}&days=8`

  superagent.get(url)
    .then(resultsFromSuperAgent => {
      //do something
      console.log(resultsFromSuperAgent.body.data);
      let weatherDays = resultsFromSuperAgent.body.data.map( weatherDay => {
        let day = new Weather(weatherDay);
        console.log(day);
        return day;
      })
      console.log(weatherDays)
      response.status(200).send(weatherDays);
    }).catch(err => console.log(err));

  //let weatherData = require('./data/weather.json');
  // catch(err){
  //   response.status(500).send('storm clouds a coming cuz we did something wrong')
  // }
})

// app.get('/weather', (request,response) => {
//   try {
//     let weatherData = require('./data/weather.json');
//     let weatherDays = weatherData.data.map( weatherDay => {
//       let day = new Weather(weatherDay);
//       console.log(day);
//       return day;
//     })
//     console.log(weatherDays)
//     response.status(200).send(weatherDays);
//   } catch(err){
//     response.status(500).send('storm clouds a coming cuz we did something wrong')
//   }
// })

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
