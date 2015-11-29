'use strict';

let express = require('express');
let router = express.Router();
let bodyParser = require('body-parser');
let Player = require('../models/player');
let User = require('../models/user')
let request = require('request');

let events = require('events');
let EventEmitter = new events.EventEmitter();


const expressJwt = require('express-jwt');
const jwt = require('jsonwebtoken');
const secret = "omgassomg"


//ROUTES HERE
router.route('/login')
  .post( (req, res) => {
    var userParams = req.body;
    console.log('hit login route')

    User.findOne({userName: userParams.userName}, function(err, user) {

      if (err) throw err;
      user.authenticate(userParams.password, function(error, isMatch){

        if (error) throw error;

        if (isMatch) {
          let returnObj = {userObj: user, token: jwt.sign(user, secret)}
          console.log(returnObj);
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
    console.log('Creating a new user');

    let rawParams = req.body;
    let playerName = processPlayerName(rawParams.favoritePlayer);

    debugger;
//THE FUNCTION BELOW SHOULD BE ABSTRACTED!!!!
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
    // route to view user by ID
    // .all(expressJwt({
    // secret: secret,
    // userProperty: 'auth'
    // }))

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

  .put((req, res) => {
    //route to edit user information
    console.log('Editing User Information');
    let userParams = req.body;

    if ('PlayerID' in userParams) {
      console.log('Updating user player list!');
      debugger;
      //if the front end is sending a player to add to the user's LIST
      User.findByIdAndUpdate(req.params.id,
      {$push: {favoritePlayers: userParams}},
      {new: true},
      (error, user) => {
        debugger;
        if(error) res.status(400).send({message: error.errmsg});

        else return res.status(202).send(user);
      });
    }
    else if ('deleteID' in userParams) {
      console.log('Removing player from user list!');
      User.findByIdAndUpdate(req.params.id,
      {$pull: {favoritePlayers: {PlayerID: userParams.deleteID }}},
      {new: true},
      (error, user) => {
        if (error) res.status(400).send({message: error.errmsg});

        else return res.status(202).send(user);
      });
    }
    else {
      console.log('Updating user information');
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
    console.log('Deleting a user');
    // let userID = req.body;
     User.findOneAndRemove({_id: req.params.id}, function (err) {
        if(err) console.log(err);
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
//END ROUTES

//EVENT EMITTERS


//END EVENT EMITTERS

module.exports = router;
