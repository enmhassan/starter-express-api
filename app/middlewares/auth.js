const jwt = require("jsonwebtoken");

const config = process.env;

const verifyToken = (req, res, next) => {
    console.log(req)
    const token = req.cookies.token;
        // || req.body.token || req.query.token || req.headers["x-access-token"];
    // console.log(token)
    if (!token) {
        return res.redirect('login')
    }
    try {
        const decoded = jwt.verify(token, config.TOKEN_KEY);
        req.user = decoded;
    } catch (err) {
        if (req.path !== 'login' && req.path !== 'register') {
            return res.status(401)
        } else {
            return res.status(200)
        }

    }
    return next();
};

module.exports = verifyToken;