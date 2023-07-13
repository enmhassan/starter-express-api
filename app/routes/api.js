const express = require('express');
const router = express.Router();
//custom middleware to authorize access for pages
const authMiddleware = require('../middlewares/auth');
const authController = require('../controllers/authController')
const clanController = require('../controllers/clanController')

//Register
router.post('/register', authController.register);

//Login
router.post('/login', authController.login);

//Logout
router.post('/logout', authMiddleware, authController.logout);

//Create Clan
router.post('/createclan', clanController.clan);

//Get Clan
router.get('/clan', clanController.getClan);


module.exports = router;