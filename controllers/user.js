const User = require('../models/user');

//new user
module.exports.renderRegister = (req, res) => {
    res.render('user/register');
}

module.exports.registerUser = async(req,res) => {
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
}

//login
module.exports.renderLogin = (req, res) => {
    res.render('user/login')
}

module.exports.login = (req,res) => {
    req.flash('success', 'Welcome back');
    res.redirect('/Posts')
}

//logout 
module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'Goodbye');
    res.redirect('/');
}