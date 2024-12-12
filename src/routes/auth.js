const express = require('express');

const authRouter = express.Router();
const validateSignupData = require('../utils/validations');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../config/models/user');



authRouter.post('/signup', async (req, res, next) => {

    console.log(req.body);
    try {
        validateSignupData(req);

        const { firstName, lastName, emailId, password } = req.body;

        const encryptedPass = await bcrypt.hash(password, 10);

        const user = new User({
            firstName,
            lastName,
            emailId,
            password: encryptedPass
        });
        const savedUser = await user.save();

        const jwtToken = await savedUser.getJWT();
        res.cookie("token", jwtToken);

        res.json({ message: "user saved successfully", data: savedUser });
    } catch (error) {
        next(error);
    }
});

authRouter.post('/login', async (req, res) => {
    const { emailId, password } = req.body;

    try {
        const storedUser = await User.findOne({ emailId: emailId });
        console.log(storedUser)
        if (!storedUser) {
            return res.status(401).send("Invalid credentials");
        }
        const isValid = await bcrypt.compare(password, storedUser.password)
        if (isValid) {
            const jwtToken = await storedUser.getJWT();
            res.cookie("token", jwtToken, {
                httpOnly: true, // Secure cookie, inaccessible to JavaScript
                secure: false,   // Send cookie only over HTTPS (set false for local testing)
                sameSite: 'None' // Required for cross-origin requests
            });
            return res.send(storedUser);
        } else {
            return res.status(401).send("Invalid credentials")
        }

    } catch (err) {
        return res.status(401).send('ERROR :' + err)
    }
});

authRouter.post('/logout', async (req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now())
    }).send("Logout successfully!")
})

module.exports = authRouter;