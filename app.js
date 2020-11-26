const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const e = require('express');

const blogpost = require('./routes/blogpost');

mongoose.connect('mongodb://localhost:27017/sec_blog', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
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
app.use(express.static(path.join(__dirname, 'public')));

app.use('/Posts', blogpost)

//home page
app.get('/',(req,res)=>{
    res.render('home');
});

app.all("*", (req,res,next) => {
    next(new ExpressError ("404, PAGE NOT FOUND", 404));
});

app.use((err, req, res, next) => {
    const {statusCode = 500} = err;
    if (!err.msg) err.msg="Unknown Error"
    res.status(statusCode).render('error', {err});
});

app.listen(3000, () => {
    console.log('Serving on port 3000');
});