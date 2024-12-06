const express = require('express');
const { useAuthValidator } = require('../middlewares/admin');
const ConnectionRequest = require('../config/models/connection');
const User = require('../config/models/user');
const Connection = require('../config/models/connection');

const connectionRouter = express.Router();

connectionRouter.post('/request/:status/:id', useAuthValidator, async (req, res) => {
    const fromUser = req.user;
    const toUserId = req.params.id;
    const status = req.params.status;

    try {
        const allowedStatus = ["interested", "ignored"];

        if (!allowedStatus.includes(status)) {
            throw new Error("Invalid status")
        }

        const toUser = await User.findById(toUserId);
        console.log(toUser)
        if (!toUser) {
            throw new Error('User not Found')
        };

        const isConnectionPresent = await Connection.findOne({
            $or: [{
                fromUserId: toUserId,
                toUserId: fromUser._id
            }, {
                fromUserId: fromUser._id,
                toUserId
            }]
        })
        if (isConnectionPresent) {
            throw new Error('Connection already available ')
        }
        const connectionRequest = new ConnectionRequest({
            fromUserId: fromUser._id,
            toUserId: toUserId,
            status
        });
        await connectionRequest.save();
        res.send('Connection successful');
    } catch (err) {
        res.status(400).send('' + err);
    }
});

connectionRouter.post('/review/:status/:requestId', useAuthValidator, async (req, res) => {

    try {
        const loggedInUser = req.user;
        const status = req.params.status;
        const requestId = req.params.requestId;

        const allowedStatus = ['approved', 'rejected'];

        if (!allowedStatus.includes(status)) {
            throw new Error('You can either approve or reject this request.')
        }

        const connectionData = await Connection.findOne({
            $and: [{
                _id: requestId
            },
            { status: 'interested' }, {
                toUserId: loggedInUser._id
            }
            ]
        });

        if (!connectionData) {
            throw new Error('connection does not exist')
        }
        console.log(connectionData);

        connectionData.status = status;
        connectionData.save();

        res.send('request ' + status + ' successfully');
    }
    catch (err) {
        res.status(400).send('ERROR: ' + err.message);
    }

})

module.exports = connectionRouter;