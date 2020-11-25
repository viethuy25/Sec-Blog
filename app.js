const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const {BlogPostSchemaJoi} = require('./models/blogPostJoi');

const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const BlogPost = require('./models/blogpost');
const e = require('express');

mongoose.connect('mongodb://localhost:27017/sec_blog', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

const validateBlogPost = (req, res, next) => {
    const { error } = BlogPostSchemaJoi.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

//home page
app.get('/',(req,res)=>{
    res.render('home');
});

//view all posts
app.get('/Posts', catchAsync(async(req,res)=>{
    const posts = await BlogPost.find({});
    res.render('posts/posts', { posts });
}));

//new post page
app.get('/Posts/create',(req,res) => {
    res.render('posts/create');
});

//public new post
app.post('/Posts', validateBlogPost, catchAsync(async(req,res ,next)=>{
    const post = new BlogPost(req.body.post);
    await post.save();
    res.redirect('/Posts')
}));

//view specific post page
app.get('/Posts/:id', catchAsync(async(req,res, next)=>{
    const post = await BlogPost.findById(req.params.id);
    res.render('posts/show', { post });
}));

//edit post
app.get('/Posts/:id/edit', catchAsync(async(req,res, next)=>{
    const post = await BlogPost.findById(req.params.id);
    res.render('posts/edit', { post });
}));

app.put('/Posts/:id', validateBlogPost, catchAsync(async(req,res, next) => {
    const { id } = req.params;
    const post = await BlogPost.findByIdAndUpdate(id, { ...req.body.post });
    console.log(post._id);
    res.redirect('/Posts')
}));

//delete post
app.get('/Posts/:id/delete', catchAsync(async(req,res, next)=>{
    const post = await BlogPost.findById(req.params.id);
    res.render('posts/delete', { post });
}));

app.delete('/Posts/:id', catchAsync(async(req,res, next) => {
    const { id } = req.params;
    await BlogPost.findByIdAndDelete(id);
    res.redirect('/Posts');
}));

app.all("*", (req,res,next) => {
    next(new ExpressError ("404, PAGE NOT FOUND", 404));
})

app.use((err, req, res, next) => {
    const {statusCode = 500} = err;
    if (!err.msg) err.msg="Unknown Error"
    res.status(statusCode).render('error', {err});
});

app.listen(3000, () => {
    console.log('Serving on port 3000');
});