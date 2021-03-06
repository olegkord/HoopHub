'use strict';

let mongoose = require('mongoose');
let bcrypt = require('bcrypt');

let userSchema = new mongoose.Schema({
  userName: String,
  email: String,
  password: String,
  image: String,
  favoriteTeam: String,
  favoritePlayers: [{
    type: mongoose.Schema.Types.Mixed,  //<----- THIS IS QUESTIONABLE
    ref: 'Player'
  }],

  created_at: Date,
  updated_at: Date
});

userSchema.pre('save', function(next){
  let user = this;

  if (!user.isModified('password')) return next();

  bcrypt.genSalt(5, function(err,salt){
    if (err) return next(err);
    bcrypt.hash(user.password, salt, function(err, hash){
      if (err) return next(err);

      user.password = hash;
      next();
      })
    })
  });

userSchema.methods.authenticate = function( password, callback) {
  bcrypt.compare(password, this.password, function(err, isMatch) {
    callback(null, isMatch);
  });
};

let User = mongoose.model('User', userSchema);

module.exports = User;
