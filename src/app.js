const express = require('express');

const app = express();
const { connectDB } = require('./config/database');
const User = require('./config/models/user');

app.use(express.json());

app.post('/signup', async (req, res, next) => {

    console.log(req.body);
    try {
        const user = new User(req.body);
        await user.save();
        res.send("user saved successfully");
    } catch (error) {
        next(error);
    }
});

app.get('/feed', async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch {
        res.status(500).send("some error occured")
    }
})

app.post('/user', async (req, res) => {
    console.log(req.body)
    try {
        const users = await User.find(req.body);
        res.send(users);
    } catch {
        res.status(500).send("some error occured")
    }
})

app.patch('/user', async (req, res, next) => {
    const filter = req.body.filter;
    const update = req.body;

    try {
        await User.updateMany(filter, update, { runValidators: true });
        res.send("user data updated successfully")
    } catch (err) {
        next(err);
    }


})

app.use((err, req, res, next) => {
    console.log('first block');
    if (err) {
        res.status(500).send('error occured ' + err.message)
    }

})

connectDB().then(() => {
    console.log("Database connected successfully");
    app.listen('7777', () => {
        console.log('server started successfully');
    })
}).catch(err => console.log("some Error occured", err))
