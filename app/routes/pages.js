const express = require('express');
const router = express.Router();
//custom middleware to authorize access for pages
const authMiddleware = require('../middlewares/auth');
const pageController = require('../controllers/pageController')

//Register
router.post('/register', pageController.registerForm);

//Login
router.post('/login', pageController.loginForm);

//Logout
router.post('/', authMiddleware, pageController.home);

module.exports = router;