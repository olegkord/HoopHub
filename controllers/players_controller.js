'use strict';

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const moment = require('moment');
const User = require('../models/user');
const request = require('request');
const Player = require('../models/player');
const Game = require('../models/game');

moment().format();

const API_KEY = process.env.API_KEY;

//ROUTES HERE
router.route('/:playerIdORplayerName')
  .get( (req,res) => {
    //create a joint route based on the type of input.
    let urlInput = req.params.playerIdORplayerName;
  //   let playerNameObject = processPlayerName(urlInput);
  //   let playerID = processPlayerID(urlInput);
  //   //Search mongo DB for either matching player name OR matching ID.
  //   debugger;
  //   Player.find({$or:
  //     [{PlayerID: playerID},
  //       {$and:
  //         [
  //          {FirstName: playerNameObject.FirstName},
  //          {LastName:  playerNameObject.LastName }
  //         ]}
  //       ]}
  //      ), (error, playerData) => {
  //        if (error) throw error;
  //
  //        else res.json(playerData);
  //      }
  // })
    if (isNaN(parseInt(urlInput))) {
      let playerNameObject = processPlayerName(urlInput);

      Player.find({$and: [
        {FirstName: playerNameObject.FirstName},
        {LastName: playerNameObject.LastName}]}, (error, playerData) => {
          if (error) throw error;

          else {
            res.json(playerData);
          }
      });

    }
    else {
      let playerID = urlInput;
      Player.find({PlayerID: playerID}, (error, playerData) => {
        if (error) throw error;
        else {
          res.json(playerData);
        }
      })
    }
  })


router.route('/:apiPlayerID/news')
  .get( (req,res) => {
    let playerID = req.params.apiPlayerID;
    request(playerNewsByID(playerID), (error,playerNews) => {
      if (error) throw error;
      else {
        res.json(JSON.parse(playerNews.body));
      }
    })
  })

router.route('/:apiPlayerID/stats')
  .get( (req,res) => {
    let playerID = req.params.apiPlayerID;
    let today = new Date();
    Player.find({PlayerID: playerID}, (error, player) => {
      player = player[0]._doc;
      Game.find({$and: [{DateTime: {$lt: today}},
                {$or: [{HomeTeam: player.Team},
                       {AwayTeam: player.Team}]}]}).limit(1).sort({Day: -1}).exec(
      (error, game) => {

   let gameDate = game[0]._doc.DateTime.toString();
        let playerID = res.req.params.apiPlayerID;

        let stringDate = [];

        gameDate = gameDate.split(' ');

        for (var i = 0; i < 3; i++) {
          stringDate.push(gameDate[i]);
        }

        stringDate = stringDate.join(' ');
        if (error) throw error;

        else {
          debugger;
          request(playerStatsByIDandDate(playerID, stringDate), (error, playerStats) => {
            res.json(JSON.parse(playerStats.body));
          })
        }
      });
    })
  })

//END ROUTES
function processPlayerID(inputString) {
  if (isNaN(parseInt(inputString))) {
    return 0;
  }
  else {
    return parseInt(inputString);
  }
}
function processPlayerName(name) {
  if (name.split(' ').length === 2) {
    return {FirstName: name.split(' ')[0], LastName: name.split(' ')[1]}
  }
  else {
    return {FirstName: null, LastName: null}
  }
}


function playerDataById(playerID) {
  return {
    "async": true,
    "crossDomain": true,
    "url": "https://api.fantasydata.net/nba/v2/JSON/Player/"+playerID,
    "method": "GET",
    "headers": {
      "host": "api.fantasydata.net",
      "ocp-apim-subscription-key": API_KEY,
      "cache-control": "no-cache",
    }
  }
}
function playerStatsByIDandDate(playerID, date) {
  return {
    "async": true,
    "crossDomain": true,
    "url": "https://api.fantasydata.net/nba/v2/JSON/PlayerGameStatsByPlayer/"+date+ "/"+playerID,
    "method": "GET",
    "headers": {
      "host": "api.fantasydata.net",
      "ocp-apim-subscription-key": API_KEY,
      "cache-control": "no-cache",
    }
  }
}
function playerNewsByID(playerID) {
  return {
    "async": true,
    "crossDomain": true,
    "url": "https://api.fantasydata.net/nba/v2/JSON/NewsByPlayerID/"+playerID,
    "method": "GET",
    "headers": {
      "host": "api.fantasydata.net",
      "ocp-apim-subscription-key": API_KEY,
      "cache-control": "no-cache",
    }
  }
}

module.exports = router;
