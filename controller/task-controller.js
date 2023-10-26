const Task = require("../models/task-model")

const getAllTasks = async (req, res) => {
    try {

        const tasks = await Task.find({},{'__v': false});

        res.status(200).json({
            status: 'success',
            results: tasks.length,
            data:{
                tasks
            }
        });
    } catch(e){
        res.status(500).json({
            status: 'fail',
            message: e.message
        });
    }
}

const addTask = async (req, res) => {
    try{
        const newTask = await Task.create(req.body);
        res.status(201).json({
            status: 'success',
            data: {
                task: newTask
            }
        });
    }
    catch(e){
        res.status(500).json({
            status: 'fail',
            message: e.message
        });
    }
}

const updateTask = async (req, res) => {
    try{
        const newTask = await Task.findByIdAndUpdate(req.params.id, req.body);
        res.status(200).json({
            status: 'success',
            data: {
                task: newTask
            }
        });

    }catch(e){
        res.status(500).json({
            status: 'fail',
            message: e.message
        });
    }
}

const deleteTask = async (req, res) => {
    try{
        const newTask = await Task.findByIdAndDelete(req.params.id);
        res.status(200).json({
            status: 'success',
            data: null
        });

    }catch(e){
        res.status(500).json({
            status: 'fail',
            message: e.message
        });
    }
}

module.exports = {
    getAllTasks,
    addTask,
    updateTask,
    deleteTask
}