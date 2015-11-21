'use strict';

let mongoose = require('mongoose');

let User = new mongoose.Schema({
  userName: String,
  email: String,
  password: String,
  //image: <<object>>
  favoriteTeam: String
})

module.exports = mongoose.model('User',User);
