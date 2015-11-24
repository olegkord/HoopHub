'use strict';

let express = require('express');
let router = express.Router();
let bodyParser = require('body-parser');
let User = require('../models/user');
let request = require('request');
let Player = require('../models/player');

const API_KEY = process.env.API_KEY;


//ROUTES HERE
router.route('/:name')
//route to locate a player by name
  .get( (req,res) => {

    debugger;
    let playerName = req.params.name;

    let playerNameObject = processPlayerName(playerName);

    Player.find({$and: [
      {FirstName: playerNameObject.FirstName},
      {LastName: playerNameObject.LastName}]}, (error, playerData) => {
        if (error) throw error;

        else {
          res.json(playerData);
        }
    })
  })

router.route('/:apiPlayerID/news')
  .get( (req,res) => {
    let playerID = params.apiPlayerID;
    request(playerNewsByID(playerID), (error,playerNews) => {
      res.json(playerNews)
    })

  })

//END ROUTES

function processPlayerName(name) {
  if (name.split(' ').length === 2) {
    return {FirstName: name.split(' ')[0], LastName: name.split(' ')[1]}
  }
  else {
    return 'INCORRECT NAME'
  }
}

function findPlayerByName(playerName) {
  console.log('Locating ' + playerName)
  //find the player from our current DB
  debugger;
  Player.find({$and: [
    {FirstName: playerName.FirstName},
    {LastName: playerName.LastName}]}, (error, playerData) => {
      if (error) throw error;

      else {
        debugger;
        console.log(playerData);
      }
    })
  }

function playerNewsByID(playerID) {
  console.log('defining API query options');
  return {
    url: 'https://api.fantasydata.net/nba/v2/JSON/NewsByPlayerID/'+PlayerID,
    Host: 'api.fantasydat.net',
    "Ocp-Apim-Subscription-Key": API_KEY
}

module.exports = router;
