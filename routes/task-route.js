const express = require('express');
const { getAllTasks, addTask, getSingleTask, updateTask, deleteTask } = require('../controller/task-controller');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

router.route('/')
        .get(verifyToken, getAllTasks)
        .post(verifyToken, addTask)


router.route('/:id')
        .get(verifyToken, getSingleTask)
        .patch(verifyToken, updateTask)
        .delete(verifyToken, deleteTask)
        
module.exports = router;