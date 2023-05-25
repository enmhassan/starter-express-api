const jwt = require("jsonwebtoken");

const config = process.env;

const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
        // || req.body.token || req.query.token || req.headers["x-access-token"];
    // console.log(token)
    if (!token && req.path !== '/login') {
        res.redirect('login')
    }
    try {
        const decoded = jwt.verify(token, config.TOKEN_KEY);
        req.user = decoded;
    } catch (err) {
        res.status(401);
    }
    return next();
};

module.exports = verifyToken;