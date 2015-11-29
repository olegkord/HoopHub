let express = require('express');
let router = express.Router();
let multer = require('multer')

// let uploading = multer({
//   dest: __dirname + './public/uploads/',
//   limits: {fileSize: 1000000, files:1},
// })

app.post('/',[ multer({ dest: './public/uploads/'}), function(req, res){
    console.log(req.body) // form fields
    console.log(req.files) // form files
    res.status(204).end()
}]);

app.listen(3000);
// router.route('/upload') uploading, function(req, res) {
//   console.log('in multer!');
//
// })

module.exports = router
