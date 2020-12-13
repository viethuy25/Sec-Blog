const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const UserController = require('../controllers/user')

//register user
router.route('/register')
    .get(UserController.renderRegister)
    .post(catchAsync(UserController.registerUser));

//login user
router.route('/login')
    .get(UserController.renderLogin)
    .post(passport.authenticate('local', {failureFlash: true, failureRedirect: '/login '}), UserController.login);

//logout user
router.get('/logout', UserController.logout);

module.exports = router;