const mongoose = require('mongoose');

const { Schema } = mongoose;
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 15,
    },
    lastName: {
        type: String,
        minLength: 3,
        maxLength: 10
    },
    age: {
        type: Number,
        min: 18,
        max: 90
    },
    city: {
        type: String,
        default: 'Anand',
        minLength: 3,
        maxLength: 10
    },
    gender: {
        type: String,
        enum: {
            values: ['Male', 'Female'],
            message: '{VALUE} is not supported'
        }

    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        minLength: 5,
        maxLength: 40,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid email ID')
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error('password is not strong')
            }
        }
    },
    skills: {
        type: [String],
        validate(value) {
            if (value.length > 10) {
                throw new Error('Only 9 skills are allowed')
            }
        }
    },
    about: {
        type: String,
        default: 'This is default about me.'
    },
    imageUrl: {
        type: String,
        default: 'https://www.shutterstock.com/image-vector/vector-flat-illustration-grayscale-avatar-600nw-2264922221.jpg'
    }
},
    { timestamps: true });

userSchema.methods.getJWT = async function () {
    console.log('this', this)
    const jwtToken = jwt.sign({ _id: this._id }, "Me@jwtpass2312");
    console.log('token', jwtToken);
    return jwtToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;