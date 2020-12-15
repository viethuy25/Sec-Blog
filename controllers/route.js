const BlogPost = require('../models/blogpost');
const path = require('path')
const help = require('../utils/help')

const aws = require('aws-sdk');
aws.config.update({
    "accessKeyId":  process.env.Access_ID,
    "secretAccessKey": process.env.Secret,
    "region" : process.env.Region_name
})

const s3 = new aws.S3()

//all posts
module.exports.index = async(req,res)=>{
    const posts = await BlogPost.find({});
    res.render('posts/posts', { posts });
}

//create new post
module.exports.renderNewForm = (req,res) => {
    res.render('posts/create');
}

module.exports.createNewPost = async(req,res ,next)=>{
    console.log(req.body, req.file);
    if(path.extname(req.file.originalname).toLowerCase() == '.jpg' ||
    (path.extname(req.file.originalname).toLowerCase() == '.png') ||
    (path.extname(req.file.originalname).toLowerCase() == '.jpeg')) {
        console.log('Success');
    } else {
        console.log('False');
    }

    const post = new BlogPost({
        title: req.body.post.title,
        description: req.body.post.description,
        author: req.body.post.author,
        image: [
            {
                url: req.file.location,
                filename: req.file.key
            }
        ]
    });
    console.log(post)
    await post.save();
    req.flash('success', 'Successfully made a new post')
    res.redirect('/Posts')
}

//show post
module.exports.showPost = async(req,res, next)=>{
    var params = { Bucket: 'new-test-1', Key: '1607983555135' };
    const post = await BlogPost.findById(req.params.id);
    if (!post) {
            req.flash('error', 'Post not found');
            return res.redirect('/Posts');
        }
    s3.getObject(params, function(err, data) {
        if (err) {
            return res.send({ "error": err });
        }
        dataToSend = help.encode(data.Body);
        console.log(data);
        res.render('posts/show',{ post, dataToSend });
    });
      
    // const post = await BlogPost.findById(req.params.id);
    // console.log(post);
    // if (!post) {
    //     req.flash('error', 'Post not found');
    //     return res.redirect('/Posts');
    // }
    // res.render('posts/show', { post });
}

//edit post
module.exports.renderEditPost = async(req,res, next)=>{
    const post = await BlogPost.findById(req.params.id);
    res.render('posts/edit', { post });
}

module.exports.editPost = async(req,res, next) => {
    const { id } = req.params;
    const post = await BlogPost.findByIdAndUpdate(id, { 
        title: req.body.post.title,
        description: req.body.post.description,
        author: req.body.post.author,
        image: [
            {
                url: req.file.location,
                filename: req.file.key
            }
        ]
     });
    console.log(post)
    req.flash('success', 'Successfully update a post')
    res.redirect('/Posts')
}

//delete post
module.exports.renderDeletePost = async(req,res, next)=>{
    const post = await BlogPost.findById(req.params.id);
    res.render('posts/delete', { post });
}

module.exports.deletePost = async(req,res, next) => {
    const { id } = req.params;
    await BlogPost.findByIdAndDelete(id);
    req.flash('success', 'Successfully delete a post')
    res.redirect('/Posts');
}

//search post
module.exports.searchPost = async(req,res) => {
    const keyword = req.body.keyword;
    const posts = await BlogPost.find({
        $text: {
            $search: keyword
        }
    });
    res.render('posts/search', { posts , keyword});
}