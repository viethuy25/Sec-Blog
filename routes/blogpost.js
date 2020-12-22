const express = require('express');
const router = express.Router();
const {BlogPostSchemaJoi} = require('../models/blogPostJoi');
const {isLoggedIn} = require('../middleware')

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const BlogPost = require('../models/blogpost');
const e = require('express');

const multer = require('multer');
const aws = require('aws-sdk');
const multerS3 = require('multer-s3');

const BlogPostController = require('../controllers/route')

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
        acl: 'public-read',
        metadata: function (req, file, cb) {
            cb(null, {fieldName: file.fieldname});
          },
          key: function (req, file, cb) {
            cb(null, Date.now().toString())
          }
    }),
    fileFilter: function (req, file, cb) {
        if(file.mimetype === "image/jpg"  || 
        file.mimetype ==="image/jpeg"  || 
        file.mimetype ===  "image/png"){
            cb(null, true);
        } else {
            cb(new Error("Image uploaded is not of type jpg/jpeg or png"),false);
        }
    }
});

const validateBlogPost = (req, res, next) => {
    const { error } = BlogPostSchemaJoi.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

router.route('/')
    .get(catchAsync(BlogPostController.index)) //view all posts
    .post(isLoggedIn, upload.single('image'), validateBlogPost, catchAsync(BlogPostController.createNewPost)); //publish new post
//isLoggedIn, validateBlogPost
//search page
router.post('/search', catchAsync(BlogPostController.searchPost));

//new post page
router.get('/create', isLoggedIn, BlogPostController.renderNewForm);

router.route('/:id')
    .get(catchAsync(BlogPostController.showPost)) //view specific post page
    .put(isLoggedIn, upload.single('image'), validateBlogPost, catchAsync(BlogPostController.editPost)) //edit a post
    .delete(isLoggedIn, catchAsync(BlogPostController.deletePost)); //delete post

//edit post
router.get('/:id/edit', isLoggedIn, catchAsync(BlogPostController.renderEditPost));

//delete post
router.get('/:id/delete', isLoggedIn, catchAsync(BlogPostController.renderDeletePost));

module.exports= router;