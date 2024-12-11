const express = require('express');
const path = require('path');

const app = express();
const { connectDB } = require('./config/database');

const cookieParser = require('cookie-parser');
const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const connectionRouter = require('./routes/connection');
const userRouter = require('./routes/userRoute');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');

let corsOptions = {
    origin: ['http://localhost:5173', 'http://devsocialuibucket.s3-website.eu-north-1.amazonaws.com'],
    credentials: true
}

app.use(express.static(path.join(__dirname, 'build')));
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(helmet());
// app.use(compression());

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/connection', connectionRouter);
app.use('/user', userRouter);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
})

app.use((err, req, res, next) => {
    console.log('first block');
    if (err) {
        res.status(500).send('error occured ' + err.message)
    }

})

const PORT = process.env.PORT || 7777;
connectDB().then(() => {
    console.log("Database connected successfully");
    app.listen(PORT, () => {
        console.log('server started successfully');
    })
}).catch(err => console.log("some Error occured", err))
