const express = require('express');

const app = express();

const { adminMiddleware } = require('./middlewares/admin')

app.get('/admin/data',
    adminMiddleware,
    (req, res) => {
        res.send("sent all data to admin")
    })

app.post('/admin/createUser',
    adminMiddleware,
    (req, res) => {
        res.send("user created successfully")
    })

app.listen('4322', () => {
    console.log('server started successfully');
})