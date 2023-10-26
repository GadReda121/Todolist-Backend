const express = require('express');
const { getAllTasks, addTask } = require('../controller/task-controller');

const router = express.Router();

router.route('/')
        .get(getAllTasks)
        .post(addTask)

        
module.exports = router;