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

