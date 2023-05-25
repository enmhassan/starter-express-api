const express = require('express');
const router = express.Router();
//custom middleware to authorize access for pages
const authMiddleware = require('../middlewares/auth');
const pageController = require('../controllers/pageController')

//Register
router.get('/register', pageController.registerForm);

//Login
router.get('/login',authMiddleware, pageController.loginForm);

//Logout
router.get('/', pageController.home);

module.exports = router;