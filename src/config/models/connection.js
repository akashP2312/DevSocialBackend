const mongoose = require('mongoose');
const User = require('./user');

const connectionSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.ObjectId,
        ref: 'User'
    },
    toUserId: {
        type: mongoose.ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
        enum: {
            values: ['interested', 'ignored', 'accepted', 'rejected'],
            message: '{VALUE} is not valid option for {PATH}'
        }
    }
});

connectionSchema.index = { fromUserId: 1, toUserId: 1 }

connectionSchema.pre("save", function (next) {
    if (this.fromUserId.equals(this.toUserId)) {
        throw new Error('Cannot send request to yourself!!')
    }
    next();
})

const ConnectionRequest = mongoose.model('connection', connectionSchema);
module.exports = ConnectionRequest;