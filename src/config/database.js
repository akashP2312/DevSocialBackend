const mongoose = require('mongoose');

require('dotenv').config();
const mongoUri = process.env.MONGO_URI;
console.log(mongoUri);
async function connectDB() {
    await mongoose.connect(mongoUri);
}

module.exports = {
    connectDB
}