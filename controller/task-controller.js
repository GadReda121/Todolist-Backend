const Task = require("../models/task-model");
const User = require("../models/user");
const status = require('../utils/httpStatusText');

const getAllTasks = async (req, res) => {
    try {
        const userId = req.currentUser.id;
        const tasks = await Task.find({ user: userId });
        
        res.status(200).json({
            status: status.SUCCESS,
            results: tasks.length,
            data:{
                tasks
            }
        });
    } catch(e){
        res.status(500).json({
            status: status.FAIL,
            message: e.message
        });
    }
}


const getSingleTask = async (req, res) => {
    try{
        const task = await Task.findById(req.params.id);
        res.status(200).json({
            status: status.SUCCESS,
            data: {
                task
            }
        });

    }catch(e){
        res.status(500).json({
            status: status.FAIL,
            message: e.message
        });
    }
}


const addTask = async (req, res) => {
    try{
        const {title, completed} = req.body;
        const userId = req.currentUser.id;

        const newTask = await Task.create({
            title,
            completed,
            user: userId
        });

        res.status(201).json({
            status: status.SUCCESS,
            data: {
                task: newTask
            }
        });
    }
    catch(e){
        res.status(500).json({
            status: status.FAIL,
            message: e.message
        });
    }
}

const updateTask = async (req, res) => {
    try{
        const newTask = await Task.findByIdAndUpdate(req.params.id, req.body);
        res.status(200).json({
            status: status.SUCCESS,
            data: {
                task: newTask
            }
        });

    }catch(e){
        res.status(500).json({
            status: status.FAIL,
            message: e.message
        });
    }
}

const deleteTask = async (req, res) => {
    try{
        await Task.findByIdAndDelete(req.params.id);
        res.status(200).json({
            status: status.SUCCESS,
            data: null
        });

    }catch(e){
        res.status(500).json({
            status: status.FAIL,
            message: e.message
        });
    }
}

module.exports = {
    getAllTasks,
    getSingleTask,
    addTask,
    updateTask,
    deleteTask
}