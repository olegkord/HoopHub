'use strict';

const Twit = require('twit');
const fs = require('fs');
const mongojs = require('mongojs');
const express = require('express');
const router = express.Router();

const CONSUMER_KEY = process.env.CONSUMER_KEY;
const CONSUMER_SECRET = process.env.CONSUMER_SECRET;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

// gets twitter cred
let T = new Twit({
    consumer_key:         CONSUMER_KEY  // Your Consumer Key
  , consumer_secret:      CONSUMER_SECRET  // Your Consumer Secret
  , access_token:         ACCESS_TOKEN  // Your Access Token
  , access_token_secret:  ACCESS_TOKEN_SECRET  // Your Access Token Secret
});

let connectionString = process.env.MONGOLAB_URI || 'mongodb://localhost/HoopHub';
debugger;
let collectionName = 'NBA';
let hashtag = '#NBA';

debugger;
let db = mongojs(connectionString,[collectionName], {authMechanism: 'ScramSHA1'});

T.get('search/tweets', {q: 'nba',  count:10 },  (err, tweet) => {
  if (err) throw err;
  db.NBA.insert(tweet);
})

router.get('/tweets', (req, res, next) => {
  db.NBA.find().sort({ created_at: -1}, (err, tweets) => {
    if (err) throw err;

    res.json(tweets);
  });
});

module.exports = router;
