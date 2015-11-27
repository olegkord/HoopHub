'use strict';

let mongoose = require('mongoose');

let gameSchema = new mongoose.Schema({
    "GameID": Number,
    "Season": Number,
    "SeasonType": Number,
    "Status": String,
    "Day": Date,
    "DateTime": Date,
    "AwayTeam": String,
    "HomeTeam": String,
    "AwayTeamID": Number,
    "HomeTeamID": Number,
    "StadiumID": Number,
    "Channel": String,
    "Attendance": Number,
    "AwayTeamScore": Number,
    "HomeTeamScore": Number,
    "Updated": Date,
    "Quarter": String,
    "TimeRemainingMinutes": Number,
    "TimeRemainingSeconds": Number,
    "PointSpread": Number,
    "OverUnder": Number,
    "AwayTeamMoneyLine": Number,
    "HomeTeamMoneyLine": Number
})

let Game = mongoose.model('Game', gameSchema);

module.exports = Game;
