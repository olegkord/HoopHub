let express = require('express');
let router = express.Router();
let multer = require('multer')

router.use(multer(
    {
        dest: './public/uploads/',
        limits: {fileSize: 1000000, files:1},
        rename: function (fieldname, filename) {
            return filename + Date.now();
        }
        console.log('multer!');
    }));
