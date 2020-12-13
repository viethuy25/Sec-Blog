const BlogPost = require('../models/blogpost');
const path = require('path')

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

    const post = new BlogPost(req.body.post);
    post.set(image.url, req.file.location);
    post.set(image.filename, req.file.key);
    console.log(post)
    await post.save();
    req.flash('success', 'Successfully made a new post')
    res.redirect('/Posts')
}

//show post
module.exports.showPost = async(req,res, next)=>{
    const post = await BlogPost.findById(req.params.id);
    if (!post) {
        req.flash('error', 'Post not found');
        return res.redirect('/Posts');
    }
    res.render('posts/show', { post });
}

//edit post
module.exports.renderEditPost = async(req,res, next)=>{
    const post = await BlogPost.findById(req.params.id);
    res.render('posts/edit', { post });
}

module.exports.editPost = async(req,res, next) => {
    const { id } = req.params;
    const post = await BlogPost.findByIdAndUpdate(id, { ...req.body.post });
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