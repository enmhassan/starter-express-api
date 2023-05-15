require("dotenv").config()
const express = require('express')
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const auth = require("./app/middlewares/auth")
const app = express();
const cookieParser = require("cookie-parser")
const mongoose = require("mongoose");

// Set the view engine to Pug
app.set('view engine', 'pug');

// Set the directory where your Pug templates will be stored
app.set('views', './views');

app.use(express.json())
app.use(cookieParser())
// importing user context
const User = require("./app/models/user");

//Generate token key
const TOKEN_KEY = process.env.TOKEN_KEY;

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
        console.log(req)
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
            res.status(200).json(user);
        } else {
        console.log("failureeeeeeeeeeeeeeeeeeeeeeeeeeee")
        res.status(400).send("Invalid Credentials");
        }
    } catch (err) {
        console.log(err);
    }
});


//Login page
app.get("/login", (req, res) => {
    res.status(200).render('login');
});


//Welcome page authenticated
app.get("/welcome", (req, res) => {
    res.status(200).send("Welcome !!!");
    console.log(req.cookies.token)
});

module.exports = app;