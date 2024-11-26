const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 15,
    },
    lastName: {
        type: String
    },
    age: {
        type: Number,
        min: 18
    },
    city: {
        type: String,
        default: 'Anand'
    },
    gender: {
        type: String,
        validate: {
            validator: function (value) {
                if (value === 'Male' || value == 'Female') {
                    return true;
                }
                return false;
            },
            message: "value must be Male or Female"
        },

    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minLength: 5
    },
    skills: {
        type: [String]
    }
},
    { timestamps: true });

const User = mongoose.model('user', userSchema);

module.exports = User;