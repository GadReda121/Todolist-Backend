const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const url = process.env.DB_URL;
mongoose.connect(url);

const app = express();
app.use(express.json());

const taskRouter = require('./routes/task-route');
app.use('/api/tasks', taskRouter);


app.all('*', (req, res, next) => {
    res.status(404).json({
        status: 'fail',
        message: `Can't find ${req.originalUrl}`
    });
})

app.listen(process.env.URL, () => console.log('listening at 5000'));