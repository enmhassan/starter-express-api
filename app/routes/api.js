const express = require('express');
const router = express.Router();
//custom middleware to authorize access for pages
const authMiddleware = require('../middlewares/auth');
const authController = require('../controllers/authController')

//Register
router.post('/register', authController.register);

//Login
router.post('/login', authController.login);

//Logout
router.post('/logout', authMiddleware, authController.logout);

module.exports = router;