'use strict';

let express = require('express');
let router = express.Router();
let bodyParser = require('body-parser');
let Player = require('../models/player');
let User = require('../models/user')
let request = require('request');

let events = require('events');
let EventEmitter = new events.EventEmitter();

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
          return res.status(200).json(user)
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

  .put((req, res) => {
    //route to edit user information
    console.log('Editing User Information');
    let userParams = req.body;
    debugger;
    User.findByIdAndUpdate(req.params.id,
      {$set: userParams},
      {new: true},
      (error, user) => {
        debugger;
        if(error) res.status(400).send({message: error.errmsg});

        else return res.status(202).send(user);
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
//END ROUTES

//EVENT EMITTERS


//END EVENT EMITTERS

module.exports = router;
