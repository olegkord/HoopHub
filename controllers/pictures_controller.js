let express = require('express');
let router = express.Router();
let multer = require('multer')

let uploading = multer({
  dest: __dirname + '../public/uploads/',
  limits: {fileSize: 1000000, files:1},
})

router.route('/upload') uploading, function(req, res) {
  console.log('in multer!');

})

module.exports = router
