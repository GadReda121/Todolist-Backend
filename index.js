const express = require('express');
const mongoose = require('mongoose');
const { FAIL } = require('./utils/httpStatusText');
require('dotenv').config();

const url = process.env.DB_URL;
mongoose.connect(url);

const app = express();
app.use(express.json());

// Cors
const cors = require('cors');
app.use(cors());

const taskRouter = require('./routes/task-route');
app.use('/api/tasks', taskRouter);

const userRouter = require('./routes/user');
app.use('/api/auth', userRouter);

app.all('*', (req, res, next) => {
    res.status(404).json({
        status: FAIL,
        message: `Can't find ${req.originalUrl}`
    });
})

app.listen(process.env.URL, () => console.log('listening at 5000'));