'use strict';

let request = require('request');
let express = require('express');
let path = require('path');
let logger = require('morgan');
let bodyParser = require('body-parser');
let multer = require('multer');

let app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

let mongoose = require('mongoose');
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/HoopHub');

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', (callback) => {
  console.log('mongoose connected');
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

  console.log('connected on port: '+port+' host: '+host)
});
