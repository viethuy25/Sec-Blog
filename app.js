const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');

const methodOverride = require('method-override');
const BlogPost = require('./models/blogpost');

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

//home page
app.get('/',(req,res)=>{
    res.render('home');
});

//view all posts
app.get('/Posts', async(req,res)=>{
    const posts = await BlogPost.find({});
    res.render('posts/posts', { posts });
});

//new post page
app.get('/Posts/create',(req,res) => {
    res.render('posts/create');
});

//public new post
app.post('/Posts', async(req,res)=>{
    try {
        const post = new BlogPost(req.body.post);
        await post.save();
    } catch(error) {
        console.log(error);
        //res.redirect('/Posts/${post._id}')
    }
    res.redirect('/Posts')
});

//view specific post page
app.get('/Posts/:id', async(req,res)=>{
    const post = await BlogPost.findById(req.params.id);
    res.render('posts/show', { post });
});

//edit post
app.get('/Posts/:id/edit', async(req,res)=>{
    const post = await BlogPost.findById(req.params.id);
    res.render('posts/edit', { post });
});

app.put('/Posts/:id', async(req,res) => {
    try {
        const { id } = req.params;
        const post = await BlogPost.findByIdAndUpdate(id, { ...req.body.post });
        console.log(post._id);
    } catch(error) {
        console.log(error);
        res.redirect('/Posts/${post._id}')
    }
    res.redirect('/Posts')
})

//delete post
app.get('/Posts/:id/delete', async(req,res)=>{
    const post = await BlogPost.findById(req.params.id);
    res.render('posts/delete', { post });
});

app.delete('/Posts/:id', async(req,res) => {
    try {
        const { id } = req.params;
        await BlogPost.findByIdAndDelete(id);
    } catch (error) {
        console.log(error);
    }
    res.redirect('/Posts');
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
});