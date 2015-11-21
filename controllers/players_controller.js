'use strict';

let express = require('express');
let router = express.Router();
let bodyParser = require('body-parser');
let User = require('../models/user');

//ROUTES HERE
router.route('/:name')
  .get( (req,res) => {
    console.log('Searching for a player');

    

  })



//END ROUTES

module.exports = router;
