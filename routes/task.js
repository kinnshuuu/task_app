const express = require('express');
const {
    createTask,
    updateTask,
    deleteTaskById,
    getAllTasks,
    getTaskById,
    createSubtask,
    getSubtaskById,
    getAllSubtasks,
    UpdateSubtask,
    DeleteSubtask,
} = require('../controllers/task')
const taskRouter = express.Router();

taskRouter.route('/').get(getAllTasks) //get all tasks
                     .post(createTask) //create Task
taskRouter.route('/:taskId').get(getTaskById) // get task
                            .patch(updateTask) //update Task
                            .delete(deleteTaskById) //delete Task
taskRouter.route('/:taskId/subtask').get(getAllSubtasks)
                                    .post(createSubtask)
taskRouter.route('/:taskId/subtask/:subTaskId').get(getSubtaskById) //get subtask
                                               .patch(UpdateSubtask)
                                               .delete(DeleteSubtask)


module.exports = taskRouter