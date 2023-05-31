// Load environment variables from .env file
require("dotenv").config()
//The express module is used to create the web application
const express = require('express')
const app = express();
//configure the server to include the appropriate CORS headers in the response
const cors = require('cors')
//limit the rate of requests based on a predefined threshold
const limiter = require('./app/middlewares/ratelimiter')
//cookie-parser is middleware that parses cookies in incoming requests
const cookieParser = require("cookie-parser")
//get database connect function from database.js
const mongoose = require('./config/database');
//importing routes
const routes = require('./app/routes/index');
//urlencoded middleware is used to parse incoming request bodies in URL-encoded format, 
//which is typically used for HTML form submissions. 
//This middleware will parse the data and add it to the req.body object in the request object.
app.use(express.urlencoded({ extended: true }));

//json middleware is used to parse incoming request bodies in JSON format, 
//which is commonly used in modern web applications that use APIs. 
//This middleware will also parse the data and add it to the req.body object in the request object.
app.use(express.json())
//use limiter middleware to imit the rate of requests based on a predefined threshold.
app.use(limiter);
// Middleware to parse cookies in incoming requests
app.use(cookieParser())
app.use(cors({
    origin: 'https://uxispace.web.app',
    credentials: true,
}))
// Set the view engine to Pug
app.set('view engine', 'pug');

// Set the directory where your Pug templates will be stored
app.set('views', './views');

//use the router function
app.use('/', routes);

//Generate token key
const TOKEN_KEY = process.env.TOKEN_KEY;

//Get port from .env
const { API_PORT } = process.env;
const port = process.env.PORT || API_PORT;

//coonect to db
mongoose.connection.once('open', () => {
    console.log("Successfully connected to database")
    app.listen(port, ()=>{
        console.log(`Server is listening on port ${port}`)
    })
})

module.exports = app;