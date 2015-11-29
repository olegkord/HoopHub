var Twit = require('twit');

const API_KEY = process.env.API_KEY;
const CONSUMER_KEY = process.env.CONSUMER_KEY;
const CONSUMER_SECRET = process.env.CONSUMER_SECRET;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

var T = new Twit({
    consumer_key:         CONSUMER_KEY  // Your Consumer Key
  , consumer_secret:      CONSUMER_SECRET  // Your Consumer Secret
  , access_token:         ACCESS_TOKEN  // Your Access Token
  , access_token_secret:  ACCESS_TOKEN_SECRET  // Your Access Token Secret
});

T.get('search/tweets', { q: 'amirjohnson', count: 10 }, function(err, data, response) {
  // Do something with the JSON data returned.
  //  (Consult Twitter's documentation on the format:
  //    https://dev.twitter.com/rest/reference/get/search/tweets)
  console.log(data);
});
