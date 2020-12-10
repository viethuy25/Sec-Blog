const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const e = require('express');

aws.config.update({
    "accessKeyId":  process.env.Access_ID,
    "secretAccessKey": process.env.Secret,
    "region" : process.env.Region_name
})

const s3 = new aws.S3()

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'new-test-1',
        metadata: function (req, file, cb) {
            console.log('Here');
            cb(null, {fieldName: file.fieldname});
          },
          key: function (req, file, cb) {
            console.log('Here 2');
            cb(null, Date.now().toString())
          }
    }),
    fileFilter: function (req, file, cb) {
        console.log(file.mimetype);
        if(file.mimetype === "image/jpg"  || 
        file.mimetype ==="image/jpeg"  || 
        file.mimetype ===  "image/png"){
            cb(null, true);
        } else {
            cb(new Error("Image uploaded is not of type jpg/jpeg or png"),false);
        }
    }
});

module.exports = {
    aws,
    upload
}

//open in browser to see upload form
// app.get('/', function (req, res) {
// res.sendFile(__dirname + '/index.html');//index.html is inside node-cheat
// });

// //use by upload form
// app.post('/upload', upload.array('upl',1), function (req, res, next) {
// res.send("Uploaded!");
// });

// app.listen(3000, function () {
// console.log('Example app listening on port 3000!');
// });