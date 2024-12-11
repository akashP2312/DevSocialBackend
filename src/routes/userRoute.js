const express = require('express');
const { useAuthValidator } = require('../middlewares/admin');
const Connection = require('../config/models/connection');
const User = require('../config/models/user');


const userRouter = express.Router();

userRouter.get('/connections', useAuthValidator, async (req, res) => {
    const loggedInUser = req.user;

    try {
        const userConnections = await Connection.find({
            $and: [
                {
                    status: 'accepted'
                },
                {
                    $or: [{
                        fromUserId: loggedInUser._id
                    },
                    {
                        toUserId: loggedInUser._id
                    }]
                }
            ]
        }).populate('fromUserId', 'firstName lastName city skills imageUrl age about').populate('toUserId', 'firstName lastName city skills imageUrl age about');

        const filteredData = userConnections.map(connection => {
            const otherUserData = connection.fromUserId.equals(loggedInUser._id) ? connection.toUserId : connection.fromUserId;
            return {
                _id: connection._id,
                userData: otherUserData
            }

        })

        res.send(filteredData)
    }
    catch (err) {
        res.send('ERROR: ' + err.message);
    }
});

userRouter.get('/requests/received', useAuthValidator, async (req, res) => {
    const loggedInUser = req.user;

    try {
        const requests = await Connection.find({
            $and: [{
                toUserId: loggedInUser._id
            }, {
                status: 'interested'
            }]
        }).populate('fromUserId', 'firstName lastName city skills about age imageUrl');
        res.send(requests);
    }
    catch (err) {
        res.send('ERRRO: ' + err.message);
    }
});

userRouter.get('/feed', useAuthValidator, async (req, res) => {
    const loggedInUser = req.user;
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;

    const skipRecords = (page - 1) * limit;

    try {
        const userConnections = await Connection.find({
            $or: [{ fromUserId: loggedInUser._id },
            { toUserId: loggedInUser._id }
            ]
        });

        const removeUsers = new Set();
        userConnections.forEach(user => {
            removeUsers.add(user.fromUserId.toString());
            removeUsers.add(user.toUserId.toString());
        });

        const feedData = await User.find({
            $and: [
                { _id: { $nin: Array.from(removeUsers) } },
                { _id: { $ne: loggedInUser._id } }
            ]
        }).select("firstName lastName skills city imageUrl age gender about")
            .skip(skipRecords)
            .limit(limit);

        res.send(feedData)
    } catch (err) {
        res.status(400).send('ERROR: ' + err.message)
    }
})

module.exports = userRouter;