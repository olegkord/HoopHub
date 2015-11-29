'use strict';

let Twit = require('twit');
let fs = require('fs');
let mongojs = require('mongojs');
let express = require('express');
let router = express.Router();


const CONSUMER_KEY = process.env.CONSUMER_KEY;
const CONSUMER_SECRET = process.env.CONSUMER_SECRET;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;


// gets twitter cred
var T = new Twit({
    consumer_key:         CONSUMER_KEY  // Your Consumer Key
  , consumer_secret:      CONSUMER_SECRET  // Your Consumer Secret
  , access_token:         ACCESS_TOKEN  // Your Access Token
  , access_token_secret:  ACCESS_TOKEN_SECRET  // Your Access Token Secret
});

let connectionString = process.env.MONGO_URL ? process.env.MONGO_URL + '/tweets' : 'tweets';
let collectionName = 'NBA';
let hashtag = '#NBA';

let db = mongojs(connectionString,[collectionName]);

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
