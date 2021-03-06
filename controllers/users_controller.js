'use strict';

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const Player = require('../models/player');
const User = require('../models/user')
const request = require('request');
const events = require('events');
const EventEmitter = new events.EventEmitter();
const expressJwt = require('express-jwt');
const jwt = require('jsonwebtoken');
const secret = "omgassomg"

//ROUTES HERE
router.route('/login')
  .post( (req, res) => {
    let userParams = req.body;
    User.findOne({userName: userParams.userName}, function(err, user) {
      if (err) throw err;
      user.authenticate(userParams.password, function(error, isMatch){
        if (error) throw error;
        if (isMatch) {
          let returnObj = {userObj: user, token: jwt.sign(user, secret)}
          return res.status(200).json(returnObj.userObj);
        }
        else {
          return res.status(401).send({message: "unauthorized"})
        }
     });
    });
  });

router.route('/new')
//route to create a new user
  .post( (req,res) => {
    let rawParams = req.body;
    let playerName = processPlayerName(rawParams.favoritePlayer);

    Player.find({$and: [
      {FirstName: playerName.FirstName},
      {LastName: playerName.LastName}]},
      (error, player) => {
        if (error) throw error;

       else {
         let newUserParams = {
           userName: rawParams.userName,
           email: rawParams.email,
           password: rawParams.password,
           favoriteTeam: rawParams.favoriteTeam,
           favoritePlayers: player, //player has been located by name and added to params
           image: rawParams.image
         };

         let newUser = new User(newUserParams)

         newUser.save( (error) => {
           if (error) res.status(400).send({message: error.errmsg});

           else res.status(200).json(newUser);
         })
      }
   })
//END ABSTRACT ME

})

  router.route('/:id')
  .get( (req,res) => {
    let userID = req.params.id;
    User.find( {_id: userID}, (error, user) => {
      if (error) throw error;
      res.json(user);
    });
  })

  .put((req, res) => {
    //route to edit user information
    let userParams = req.body;
    if ('PlayerID' in userParams) {
      console.log('Updating user player list!');

      User.findByIdAndUpdate(req.params.id,
      {$push: {favoritePlayers: userParams}},
      {new: true},
      (error, user) => {
        if(error) res.status(400).send({message: error.errmsg});
        else return res.status(202).send(user);
      });
    }
    else if ('deleteID' in userParams) {
      User.findByIdAndUpdate(req.params.id,
      {$pull: {favoritePlayers: {PlayerID: userParams.deleteID }}},
      {new: true},
      (error, user) => {
        if (error) res.status(400).send({message: error.errmsg});

        else return res.status(202).send(user);
      });
    }
    else {
       User.findByIdAndUpdate(req.params.id,
         {$set: userParams},
         {new: true},
         (error, user) => {
           if(error) res.status(400).send({message: error.errmsg});
           else return res.status(202).send(user);
        })
    }
  })

  .delete((req, res) => {
    //route to delete a user
     User.findOneAndRemove({_id: req.params.id}, function (err) {
        if(err) throw err;
        res.send('User Deleted');
        });
     });

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

module.exports = router;
