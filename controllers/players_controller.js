'use strict';

let express = require('express');
let router = express.Router();
let bodyParser = require('body-parser');
let User = require('../models/user');
let request = require('request');



//ROUTES HERE
router.route('/:name')
//route to locate a player by name
  .get( (req,res) => {
    console.log('Searching for a player');

    let playerName = req.params.name;

    Player.find({name: playerName}, (error, player) => {
      if (error) throw error;

      else { request(options(player.PlayerID), (data) =>{
          //COMPARE TWO JSON OBJECTS IF THERE IS A DIFFERENCE, REPLACE.
        })
      }
    });
  })
//END ROUTES

function options(playerID) {
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
