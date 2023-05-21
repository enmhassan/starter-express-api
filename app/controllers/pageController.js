// importing user context
const User = require("./app/models/user");

//Login page
function loginForm(req, res) {
    const token = req.cookies.token;
    if (token) {
        return res.redirect('/')
    }
    res.status(200).render('login');
}


//Register page
function registerForm(req, res) {
    const token = req.cookies.token;
    if (token) {
        return res.redirect('/')
    }
    res.status(200).render('register');
}


//home page 
function home(req, res) {
    const email = req.user.email;
    User.findOne({ email })
        .then(user => {
            const userName = user.first_name;
            res.status(200).render('index', { userName });
        })
        .catch(error => {
            console.log(error);
            res.status(500).send('Internal Server Error');
        });
}

module.exports = {
    loginForm,
    registerForm,
    home,
}