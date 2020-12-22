const express = require('express');
const passport = require('passport');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const UserController = require('../controllers/user')
const {isLoggedIn} = require('../middleware')

//register user
router.route('/register')
    .get(UserController.renderRegister)
    .post(catchAsync(UserController.registerUser));

//login user
router.route('/login')
    .get(UserController.renderLogin)
    .post(passport.authenticate('local', {failureFlash: true, failureRedirect: '/login '}), UserController.login);

//logout user
router.get('/logout', isLoggedIn, UserController.logout);

//change user info
router.route('/info')
    .get(isLoggedIn, UserController.renderInfo);

module.exports = router;