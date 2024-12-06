const express = require('express');

const profileRouter = express.Router();
const { useAuthValidator } = require('../middlewares/admin');
const User = require('../config/models/user');
const bcrypt = require('bcrypt');

profileRouter.post('/searchUser', async (req, res) => {
    console.log(req.body)
    try {
        const users = await User.find(req.body);
        res.send(users);
    } catch {
        res.status(500).send("some error occured")
    }
})

profileRouter.get('/profile/view', useAuthValidator, async (req, res) => {
    try {
        res.send(req.user);
    } catch (err) {
        res.status(401).send("ERROR " + err);
    }
});


profileRouter.patch('/profile/edit', useAuthValidator, async (req, res, next) => {
    const filter = req.user._id;
    const update = req.body;

    try {
        const data = await User.findByIdAndUpdate(filter, update, { runValidators: true });
        res.json({
            message: "profile updated successfully",
            data
        })
    } catch (err) {
        next(err);
    }
});

profileRouter.patch('/profile/password', async (req, res) => {
    const newPassword = req.body.newPassword;
    const currentPassword = req.body.currentPassword;
    const userEmail = req.body.emailId;

    console.log(userEmail);
    console.log(newPassword);

    try {
        const userData = await User.find({ 'emailId': userEmail });

        console.log(userData);

        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, userData[0].password);
        console.log(isCurrentPasswordValid)

        if (isCurrentPasswordValid) {
            const encryptedPass = await bcrypt.hash(newPassword, 10);
            const updatedUser = await User.findOneAndUpdate({ emailId: userEmail }, { password: encryptedPass });
            res.send("password changed successfully.")
        } else {
            throw new Error("Please enter correct password");
        }

    } catch (err) {
        res.status(401).send(err);
    }
})


profileRouter.get('/feed', useAuthValidator, async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch {
        res.status(500).send("some error occured")
    }
})


module.exports = profileRouter;