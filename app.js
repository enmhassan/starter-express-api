// Load environment variables from .env file
require("dotenv").config()

// Import the required dependencies

//The express module is used to create the web application
const express = require('express')
const app = express();
//bcryptjs is used for hashing passwords
const bcrypt = require("bcryptjs")
//jsonwebtoken is used for creating and verifying JSON Web Tokens
const jwt = require("jsonwebtoken")
//custom middleware to authorize access for pages
const auth = require("./app/middlewares/auth")
//cookie-parser is middleware that parses cookies in incoming requests
const cookieParser = require("cookie-parser")
//mongoose is a MongoDB object modeling tool that allows us to interact with the database in an easy and intuitive way
const mongoose = require("mongoose");

//urlencoded middleware is used to parse incoming request bodies in URL-encoded format, 
//which is typically used for HTML form submissions. 
//This middleware will parse the data and add it to the req.body object in the request object.
app.use(express.urlencoded({ extended: true }));

//json middleware is used to parse incoming request bodies in JSON format, 
//which is commonly used in modern web applications that use APIs. 
//This middleware will also parse the data and add it to the req.body object in the request object.
app.use(express.json())

// Middleware to parse cookies in incoming requests
app.use(cookieParser())

// Set the view engine to Pug
app.set('view engine', 'pug');

// Set the directory where your Pug templates will be stored
app.set('views', './views');

// importing user context
const User = require("./app/models/user");

//Generate token key
const TOKEN_KEY = process.env.TOKEN_KEY;

//Get port from .env
const { API_PORT } = process.env;
const port = process.env.PORT || API_PORT;

//coonect to db
const connect = () => {
    //connecting to the database
    mongoose.connect(
        "mongodb+srv://enmhassan:fpVmF1VpgRzjB0yu@cluster0.ho0mqai.mongodb.net/?retryWrites=true&w=majority", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    )
    .then(() => {
        console.log("Successfully connected to database")
        app.listen(port, ()=>{
            console.log(`Server is listening on port ${port}`)
        })
    })
    .catch((error) => {
        console.log("database connection failed");
        console.error(error);
        process.exit(1);
    });
};

connect();


// Register API
app.post("/api/register", async (req, res) => {
    try {
        //get user input
        const { first_name, last_name, email, password } = req.body;
        //validate user input
        if (!(email && password && first_name && last_name)) {
            res.status(400).send("All inputs are required");
        }
        //check if user already exist
        const oldUser = await User.findOne({ email });

        if (oldUser) {
            return res.status(400).send("User already exist. Please login")
        }
        //Encrypt user password
        encryptedPassword = await bcrypt.hash(password, 10);
        //create user
        const user = await User.create({
            first_name,
            last_name,
            email: email.toLowerCase(),
            password: encryptedPassword,
        });
        //create token
        const token = jwt.sign(
            { user_id: user._id, email },
            TOKEN_KEY,
            {
                expiresIn: "2h",
            }
        );
        //save user token
        user.token = token
        //return new user
        res.status(201).json(user);
    } catch (err) {
        console.log(err);
    }
});

// Login API
app.post("/api/login", async (req, res) => {
    try {
        //get user input
        const { email, password } = req.body;
        //validate user input
        if(!(email && password)) {
            res.status(400).send("All inputs are required");
        }
        // validate if user exists
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            //create token
            const token = jwt.sign(
                { user_id: user._id, email },
                TOKEN_KEY, 
                {
                    expiresIn: "2h",
                }
            )
             //save user token
            user.token = token;
            //set the token as a cookie
            res.cookie('token', token, { sameSite: false, httpOnly: false })
            //user
            return res.redirect('/')
        } else {
        // res.status(400).send("Invalid Credentials");
        }
    } catch (err) {
        console.log(err);
    }
});


//Logout api
app.post("/api/logout", auth, async(req, res) => {
    try {
        // Get the user from the request object
        const email = req.email;
        const user = await User.findOne({ email });
        console.log(user)
        // Clear the user token in the database
        user.token = null;
        await user.save();
        //Clear the token cookie in the response
        res.clearCookie("token");
        //Redirect the user to the login page
        return res.redirect('/login');
    } catch (err) {
        console.log(err);
    }
})


//Login page
app.get("/login", (req, res) => {
    res.status(200).render('login');
});


//Welcome page authenticated
app.get("/", auth, (req, res) => {
    res.status(200).render('index');
});

module.exports = app;