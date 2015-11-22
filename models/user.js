'use strict';

let mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
  userName: String,
  email: String,
  password: String,
  image: String,
  favoriteTeam: String,
  favoritePlayers: [],

  created_at: Date,
  updated_at: Date

})

var User = mongoose.model('User', userSchema )

module.exports = User;
