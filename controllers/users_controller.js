'use strict';

let express = require('express');
let router = express.Router();
let bodyParser = require('body-parser');
let Player = require('../models/player');
let User = require('../models/user')
let request = require('request');

//ROUTES HERE

router.route('/new')
//route to create a new user
  .post( (req,res) => {
    console.log('Creating a new user');

    let rawParams = req.body;

    let playerNameObject = processPlayerName(rawParams.favoritePlayer);



    debugger;
    // $.get('/player/'+rawParams.favoritePlayer, 'json').done( (player) => {
    //   console.log(player);
    // })

    findUserFirstPlayer(playerNameObject);

    let newUserParams = {
      name: rawParams.name,
      email: rawParams.email,
      password: rawParams.password,
      favoriteTeam: rawParams.favoriteTeam,
  //    favoritePlayers: [rawParams.favoritePlayer],
      image: rawParams.image
    };

    let newUser = new User(newUserParams)

    newUser.save( (error) => {
      debugger;
      if (error) res.status(400).send({message: error.errmsg});

      else res.status(200).send({
        userID: newUser._id
      });
    })
  })


router.route('/:id')
  //route to view user by ID
  .get( (req,res) => {
    console.log('Viewing user profile');

    //Body parser?
    // let userID = params.body.id;

    let userID = req.params.id;
    console.log('ID viewing: ' + userID);

    User.find( {_id: userID}, (error, user) => {
      if (error) throw error;

      res.json(user);
    });
  })

  .put( (req, res) => {
    //route to edit user information
    console.log('Editing User information');
    let userParams = req.body;

    User.findByIdAndUpdate(userParams.id,
      {$set: userParams},
      (error, user) => {
        if(error) res.status(400).send({message: error.errmsg});

        else return res.status(202).send({message: "User update succesful"});
      })
  })

  .delete( (req,res) => {
    //route to delete a user
    console.log('Deleting a user');
    let userID = req.body.id;

    User.findByIdAndRemove(userID, (error) => {
      if(error) res.status(400).send({message: error.errmsg});

      else return res.status(200).send({message: "User delete successful"})
    });
  })
////////////////////////
/////HELPER FUNCTIONS///
////////////////////////
function processPlayerName(name) {
  if (name.split(' ').length === 2) {
    return {FirstName: name.split(' ')[0], LastName: name.split(' ')[1]}
  }
  else {
    return 'INCORRECT NAME'
  }
}


function findUserFirstPlayer(playerName) {
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



//END ROUTES

module.exports = router;
