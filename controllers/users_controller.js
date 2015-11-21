'use strict';

let express = require('express');
let router = express.Router();
let bodyParser = require('body-parser');
let Player = require('../models/player');

//ROUTES HERE

router.route('/:id')
  //route to view user by ID
  .get( (req,res) => {
    console.log('Viewing user profile')

    //Body parser?
    // let userID = params.body.id;

    let userID = req.params.id;

    User.find( {id: userID}, (error, user) => {
      if (error) throw error;

      res.json(user);
    });
  })

  .put( (req, res) => {
    //route to edit user information
    console.log('Editing User information');
    let userParams = req.params;

    User.findByIdAndUpdate(userParams.id,
      {$set: userParams},
      (error, user) => {
        if(error) res.status(401).send({message: error.errmsg});

        else return res.status(200).send({message: "User update succesful"});
      })
  })

  .delete( (req,res) => {
    //route to delete a user
    console.log('Deleting a user');
    let userID = req.params.id;

    User.findByIdAndRemove(userID, (error) => {
      if(error) res.status(401).send({message: error.errmsg});

      else return res.status(200).send({message: "User delete successful"})
    });
  })




//END ROUTES

module.exports = router;
