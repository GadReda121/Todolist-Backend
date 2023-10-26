const express = require('express');
const { getAllTasks, addTask, updateTask, deleteTask } = require('../controller/task-controller');

const router = express.Router();

router.route('/')
        .get(getAllTasks)
        .post(addTask)

router.route('/:id')
        .patch(updateTask)
        .delete(deleteTask)
        
module.exports = router;