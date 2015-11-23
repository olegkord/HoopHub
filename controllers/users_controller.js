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

router.route('/login')
  // route for users to login
  

//END ROUTES

module.exports = router;
