'use strict';

let mongoose = require('mongoose');

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

User.pre('save', function(next){
userSchema.pre('save', function(next){

  var user = this;
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
});
userSchema.methods.authenticate = function( password, callback) {
User.methods.authenticate = function( password, callback) {
  bcrypt.compare(password, this.password, function(err, isMatch) {
    callback(null, ismatch);
  });
};

var User = mongoose.model('User', userSchema)

module.exports = User;
