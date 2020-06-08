'use strict';

const express = require('express');
require('dotenv').config();

const app = express();

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log('listening');
})

//error handling:
app.get('*', (request,response) => {
  response.send('oops.. something went wrong')
})

function NewLocation(searchQuery, obj) {
  this.searchQuery = searchQuery;
  this.formattedQuery = obj.display_name;
  this.latitude = obj.lat;
  this.longitude = obj.lon;

}

app.get('/location', (request,response) => {
  try {
    let searchQuery = request.query.city;
    let geoData = require('./data/location.json');
    let returnObj = new NewLocation(searchQuery, geoData[0]);
  } catch(err){
    response.status(500).send('whoops. Something went wrong');
  }
})
