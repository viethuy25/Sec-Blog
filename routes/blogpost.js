const express = require('express');
const router = express.Router();
const {BlogPostSchemaJoi} = require('../models/blogPostJoi');

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const BlogPost = require('../models/blogpost');
const e = require('express');

const validateBlogPost = (req, res, next) => {
    const { error } = BlogPostSchemaJoi.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

//view all posts
router.get('/', catchAsync(async(req,res)=>{
    const posts = await BlogPost.find({});
    res.render('posts/posts', { posts });
}));

//new post page
router.get('/create',(req,res) => {
    res.render('posts/create');
});

//publish new post
router.post('/', validateBlogPost, catchAsync(async(req,res ,next)=>{
    const post = new BlogPost(req.body.post);
    await post.save();
    req.flash('success', 'Successfully made a new post')
    res.redirect('/Posts')
}));

//view specific post page
router.get('/:id', catchAsync(async(req,res, next)=>{
    const post = await BlogPost.findById(req.params.id);
    if (!post) {
        req.flash('error', 'Post not found');
        return res.redirect('/Posts');
    }
    res.render('posts/show', { post });
}));

//edit post
router.get('/:id/edit', catchAsync(async(req,res, next)=>{
    const post = await BlogPost.findById(req.params.id);
    res.render('posts/edit', { post });
}));

router.put('/:id', validateBlogPost, catchAsync(async(req,res, next) => {
    const { id } = req.params;
    const post = await BlogPost.findByIdAndUpdate(id, { ...req.body.post });
    req.flash('success', 'Successfully update a post')
    res.redirect('/Posts')
}));

//delete post
router.get('/:id/delete', catchAsync(async(req,res, next)=>{
    const post = await BlogPost.findById(req.params.id);
    res.render('posts/delete', { post });
}));

router.delete('/:id', catchAsync(async(req,res, next) => {
    const { id } = req.params;
    await BlogPost.findByIdAndDelete(id);
    req.flash('success', 'Successfully delete a post')
    res.redirect('/Posts');
}));

module.exports= router;