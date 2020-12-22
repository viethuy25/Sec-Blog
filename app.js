if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');

const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
// const {spawn} = require('child_process');
// const helper = require('./utils/help')

const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const mongoSanitize = require('express-mongo-sanitize');

const userRoute = require('./routes/user');
const blogpostRoute = require('./routes/blogpost');
const { MongoStore } = require('connect-mongo');
const dbURL = process.env.DB_URL || 'mongodb://localhost:27017/sec_blog';
const MongoDBStore = require("connect-mongo")(session);
//process.env.DB_URL ||
mongoose.connect(dbURL, {
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
app.use(mongoSanitize({
    replaceWith: '_'
}));

const secret = process.env.SECRET || 'thisshouldbebettersecret!';
const store = new MongoDBStore({
    url: dbURL,
    secret,
    touchAfter: 24*3600
});

store.on("error", function (e) {
    console.log("Session store error: ", e)
})
const sessionConfig = {
    store,
    name : 'blog',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie:{
        httpOnly: true,
        //secure: true,
        expires: Date.now() + 1000 * 60 * 60 *24 *7,
        age: 1000 * 60 * 60 *24 *7
    }
}
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) => {
    res.locals.user = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/', userRoute);
app.use('/Posts', blogpostRoute)

//home page
app.get('/',(req,res)=>{
    // var dataToSend;
    // // spawn new child process to call the python script
    // const python = spawn('python', ['./utils/blog_utils.py', '1607983555135' ]);
    // // collect data from script
    // python.stdout.on('data', function (data) {
    //     console.log('Pipe data from python script ...');
    //     //console.log(helper.encode(data));
    //     dataToSend = data;
    // });
    // //debugging
    // python.stderr.on('data', (data) => {
    //     console.log(`error:${data}`);
    //  });

    // // in close event we are sure that stream from child process is closed
    // python.on('close', (code) => {
    //     console.log(`child process close all stdio with code ${code}`);
    //     //console.log(dataToSend);
    //     // send data to browser
    //     res.render('home', { dataToSend })
    // });
    res.render('home')
});

//edit page
app.get('/about', (req,res) => {
    res.render('about');
});

app.all("*", (req,res,next) => {
    next(new ExpressError ("404, PAGE NOT FOUND", 404));
});

app.use((err, req, res, next) => {
    const {statusCode = 500} = err;
    if (!err.msg) err.msg="Unknown Error"
    console.log(err)
    res.status(statusCode).render('error', {err});
});

app.listen(3000, () => {
    console.log('Serving on port 3000');
});