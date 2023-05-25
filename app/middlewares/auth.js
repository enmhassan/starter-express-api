const jwt = require("jsonwebtoken");

const config = process.env;

const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
        // || req.body.token || req.query.token || req.headers["x-access-token"];
    // console.log(token)
    if (!token) {
        if (req.path !== '/login' && req.path !== '/register') {
            return res.status(401).redirect('login')
        } else {
            return res.status(200)
        }
    }
    try {
        const decoded = jwt.verify(token, config.TOKEN_KEY);
        req.user = decoded;
    } catch (err) {
        if (req.path !== '/login' && req.path !== '/register') {
            return res.status(401).redirect('login')
        } else {
            return res.status(200)
        }

    }
    return next();
};

module.exports = verifyToken;