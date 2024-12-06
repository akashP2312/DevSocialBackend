const jwt = require('jsonwebtoken');
const User = require('../config/models/user');


const useAuthValidator = async (req, res, next) => {
    try {
        const cookie = req.cookies;
        const token = cookie.token;
        if (!token) {
            throw new Error("User is not authorized.")
        }
        const tokenPayload = jwt.verify(token, 'Me@jwtpass2312');

        const userData = await User.findById(tokenPayload._id);
        if (!userData) {
            throw new Error("User data not found. Please login again!")
        }
        req.user = userData;
        next();

    } catch (err) {
        res.status(401).send('ERROR :' + err)
    }

};

module.exports = {
    useAuthValidator
}