'use strict';

const express = require('express');
const superagent = require('superagent');
require('dotenv').config();
const cors = require('cors');
const pg = require('pg');
const app = express();
app.use(cors());
const PORT = process.env.PORT;

const client = new pg.Client(process.env.DATABASE_URL);
client.on('error',err=>console.log(err));

client.connect().then( ()=> {
  app.listen(PORT, () => {
    console.log(`${PORT}`);
  })
})

function NewLocation(searchQuery, obj) {
  this.search_query = searchQuery;
  this.formatted_query = obj.display_name;
  this.latitude = obj.lat;
  this.longitude = obj.lon;
}

app.get('/location', (request,response) => {
  let searchQuery = request.query.city;
  ///do first client.query
  let sqlQuery = `SELECT * FROM location WHERE search_query = $1;`;
  let safeValues = [searchQuery];
  client.query(sqlQuery, safeValues)
    .then(sqlResults => {
      if(sqlResults.rowCount) {
        console.log('chekcing database');
        response.status(200).send(sqlResults.rows[0]);
      } else{
        let url = `https://us1.locationiq.com/v1/search.php?key=${process.env.LOCATION_DATA}&q=${searchQuery}&format=json`;
        superagent.get(url)
          .then(resultsFromSuperAgent => {
            console.log('checking api')
            let locationObject = new NewLocation(searchQuery, resultsFromSuperAgent.body[0]);
            //query to insert this result into the database so we have it for next time
            let sqlQuery2 = `insert into location (search_query, formatted_query, latitude, longitude) values ($1, $2, $3, $4);`
            let safevalues2 = [searchQuery,locationObject.formatted_query,locationObject.latitude,locationObject.longitude]

            client.query(sqlQuery2, safevalues2);
            response.status(200).send(locationObject);
          })
      }}).catch(err => console.log(err));
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
      let weatherDays = resultsFromSuperAgent.body.data.map( weatherDay => {
        let day = new Weather(weatherDay);
        console.log(day);
        return day;
      });
      console.log(weatherDays)
      response.status(200).send(weatherDays);
    }).catch(err => console.log(err));
})

function Movies(obj){
  this.title = obj.title;
  this.overview = obj.overview;
  this.average_votes = obj.average_votes;
  this.total_votes = obj.total_votes;
  this.image_url = obj.image_url;
  this.popularity = obj.popularity;
  this.released_on = obj.released_on;
}

app.get('/movies', (request,response) => {
  let search_query = request.query.search_query;
  let url = `https://api.themoviedb.org/3/movie/550?api_key=${process.env.MOVIE_API_KEY}`

  superagent.get(url)
    .query( {
      city: search_query,
      key: process.env.MOVIE_API_KEY,
    })
    .then(resultsFromSuperAgent => {
      let movieResults = resultsFromSuperAgent.body.data.map( film => {
        let eachFilm = new Movies(film);
        return eachFilm
      })
      response.status(200).send(movieResults);
    }).catch(err => console.log(err));
})

function Trail(obj) {
  this.name = obj.name;
  this.location = obj.location;
  this.length = obj.length;
  this.stars = obj.stars;
  this.star_votes = obj.star_votes;
  this.summary = obj.summary;
  this.trail_url = obj.trail_url;
  this.conditions = obj.conditions;
  this.conditions_date = obj.condition_date;
  this.condition_time = obj.condition_time;
}

app.get('/trails', (request, response) => {
  //let searchQuery = request.query.search_query;
  let lattitude = request.query.latitude;
  let longitude = request.query.longitude
  let url = `https://www.hikingproject.com/data/get-trails?lat=${lattitude}&lon=${longitude}&maxDistance=10&key=${process.env.TRAILS_DATA}`

  superagent.get(url)
    .then(resultsFromSuperAgent => {
      //console.log(resultsFromSuperAgent.body);
      let trailResults = resultsFromSuperAgent.body.trails.map(trailResult => {
        let trail = new Trail(trailResult);
        return trail;
      })
      response.status(200).send(trailResults);
    }).catch(err => console.log(err));
})
// client.connect().then( () =>{
//   app.get('*', (request,response) => {
//     response.send('oops.. something went wrong')
//   })
// })
