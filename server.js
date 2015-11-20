'use strict';

let request = require('request');
let express = require('express');
let path = require('path');
let logger = require('logger');
let bodyParser = require('body-parser');

let app = express();

app.use(logger('dev'));
app.user(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

let user = require('./controllers/users_controller');
let player = require('./controllers/players_controller');

let server = app.listen(3000, () => {
  let host = server.address().address;
  let port = server.address().port;

  console.log('connected on port: '+port+' host: '+host)
});
