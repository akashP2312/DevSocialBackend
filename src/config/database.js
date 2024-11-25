const mongoose = require('mongoose');

const pass = 'Me%40mongopass23';
async function connectDB() {
    await mongoose.connect(`mongodb+srv://aspatel231293:${pass}@namastenode.ygtrw.mongodb.net/devTinder`);
}

module.exports = {
    connectDB
}