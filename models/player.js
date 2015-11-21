'use strict';

let mongoose = require('mongoose');


let Player = new mongoose.Schema({
    "PlayerID": 20000441,
    "SportsDataID": null,
    "Status": "Active",
    "TeamID": 1,
    "Team": "WAS",
    "Jersey": 3,
    "PositionCategory": "G",
    "Position": "SG",
    "FirstName": "Bradley",
    "LastName": "Beal",
    "Height": 77,
    "Weight": 207,
    "BirthDate": "1993-06-28T00:00:00",
    "BirthCity": "St. Louis",
    "BirthState": "Missouri",
    "BirthCountry": null,
    "HighSchool": null,
    "College": "Florida",
    "Salary": 5694674,
    "PhotoUrl": "http://static.fantasydata.com/headshots/nba/low-res/20000441.png",
    "Experience": 3
})

module.exports = mongoose.model('Player',Player);
