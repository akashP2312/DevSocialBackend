const validator = require('validator');

function validateSignupData(req) {
    const { firstName, lastName, emailId, password } = req.body;

    if (!firstName.length || !lastName.length) {
        throw new Error('Invalid name');
    } else if (!validator.isEmail(emailId)) {
        throw new Error('Invalid email Id');
    } else if (!validator.isStrongPassword(password)) {
        throw new Error('Enter a strong password')
    }


}

module.exports = validateSignupData;