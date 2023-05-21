//bcryptjs is used for hashing passwords
const bcrypt = require("bcryptjs")
//jsonwebtoken is used for creating and verifying JSON Web Tokens
const jwt = require("jsonwebtoken")
// importing user context
const User = require("../models/user");

const TOKEN_KEY = process.env.TOKEN_KEY;

// Register API
async function register(req, res) {
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
        //set the token as a cookie
        res.cookie('token', token, { sameSite: true, httpOnly: true })
        //return new user
        res.status(201).redirect('/');
    } catch (err) {
        console.log(err);
    }
}

// Login API
async function login(req, res) {
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
                    expiresIn: "15m",
                }
            )
             //save user token
            user.token = token;
            //set the token as a cookie
            res.cookie('token', token, { sameSite: true, httpOnly: true })
            //user
            return res.redirect('/')
        } else {
        // res.status(400).send("Invalid Credentials");
        }
    } catch (err) {
        console.log(err);
    }
}

//Logout api
async function logout(req, res) {
    try {
        // Get the user from the request object
        console.log(req)
        const email = req.user.email;
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
}


module.exports = {
    register,
    login,
    logout,
};