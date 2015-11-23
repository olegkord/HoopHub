'use strict';

let mongoose = require('mongoose');


let playerSchema = new mongoose.Schema({
    PlayerID: Number,
    SportsDataID: Number,
    Status: String,
    TeamID: Number,
    Team: String,
    Jersey: Number,
    PositionCategory: String,
    Position: String,
    FirstName: String,
    LastName: String,
    Height: Number,
    Weight: Number,
    BirthDate: Date,
    BirthCity: String,
    BirthState: String,
    BirthCountry: String,
    HighSchool: String,
    College: String,
    Salary: Number,
    PhotoUrl: String,
    Experience: Number
})

let Player = mongoose.model('Player', playerSchema )

module.exports = Player;
