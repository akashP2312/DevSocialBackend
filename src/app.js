const express = require('express');

const app = express();

app.use("/test", (req, res) => {
    res.send("Hello from test API");
});

app.use('/home', (req, res) => {
    res.send("Hello from home API");
});



app.listen('4322', () => {
    console.log('server started successfully');
})