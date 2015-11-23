'use strict';

let express = require('express');
let router = express.Router();
let bodyParser = require('body-parser');
let User = require('../models/user');
let request = require('request');
let Player = require('../models/player');


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

function options(playerID) {
  console.log('defining API query options');
  return {
    url: 'https://api.fantasydata.net/nba/v2/JSON/Player/'+PlayerID,
    Host: 'api.fantasydat.net',
//-------->OLEG'S Key:
    "Ocp-Apim-Subscription-Key": 'd29863acdf714a50a97247181f9563e9'
//-------->STEVE'S Key:
//          Ocp-Apim-Subscription-Key: '350faf5499d24addaa79a4ab6b949145';
  }
}

module.exports = router;
