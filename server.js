'use strict';

const request = require('request');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/HoopHub');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', (callback) => {

})


let user = require('./controllers/users_controller');
let player = require('./controllers/players_controller');
let tweet = require('./controllers/twitter_controller')

app.use('/users', user);
app.use('/player', player);
app.use('/', tweet);

let server = app.listen(process.env.PORT || 3000, () => {
  let host = server.address().address;
  let port = server.address().port;
});
