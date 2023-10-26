const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title : {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    completed : {
        type: Boolean,
        default: false
    },
    date : {
        type: Date,
        default: Date.now()
    },
});

const Task = mongoose.model('all-tasks', taskSchema);
module.exports = Task;