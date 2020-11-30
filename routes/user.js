const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');

//register user
router.get('/register', (req, res) => {
    res.render('user/register');
});

router.post('/register', catchAsync(async(req,res) => {
    try {
        const {email, username, password} = req.body;
        const user = new User({ email, username});
        const registeredUser = await User.register(user, password);
        req.flash('success', 'Welcome to my blog');
        res.redirect('/Posts')
    } catch(e) {
        req.flash('error', 'Username or email is taken, please choose another');
        res.redirect('register');
    }
    console.log(registeredUser);
}));

//login user
router.get('/login', (req, res) => {
    res.render('user/login')
});

router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login '}), (req,res) => {
    req.flash('success', 'Welcome back');
    res.redirect('/Posts')
});

//logout user
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'Goodbye');
    res.redirect('/');
});

module.exports = router;