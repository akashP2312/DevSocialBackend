const express = require('express');

const app = express();
const { connectDB } = require('./config/database');

const cookieParser = require('cookie-parser');
const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const connectionRouter = require('./routes/connection');
const userRouter = require('./routes/userRoute');
const cors = require('cors');
let corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true
}

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));


app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/connection', connectionRouter);
app.use('/user', userRouter);

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
