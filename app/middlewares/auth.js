const jwt = require("jsonwebtoken");

const config = process.env;

const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
        // || req.body.token || req.query.token || req.headers["x-access-token"];
    // console.log(token)
    if (!token) {
        return res.redirect('login')
    }
    try {
        const decoded = jwt.verify(token, config.TOKEN_KEY);
        req.user = decoded;
        console.log(decoded)
    } catch (err) {
        return res.status(401).send("Invalid Token");
    }
    return next();
};

module.exports = verifyToken;