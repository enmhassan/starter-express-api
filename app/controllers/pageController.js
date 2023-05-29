// importing user context
const User = require("../models/user");

//Login page
function loginForm(req, res) {
    if (req.user) {
        return res.redirect('/')
    }
    res.status(200).render('login');
}


//Register page
function registerForm(req, res) {
    const token = req.cookies.token;
    if (req.user) {
        return res.redirect('/')
    }
    res.status(200).render('register');
}


//home page 
function home(req, res) {
    const userName = req.cookies.username;
    if (userName) {
        return res.status(200).render('index', { userName });
    } else {
        return res.status(200).render('index');
    }
}

module.exports = {
    loginForm,
    registerForm,
    home,
}