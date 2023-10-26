const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    task : {
        type: String,
        required: true
    }
});

const Task = mongoose.model('all-tasks', taskSchema);
module.exports = Task;