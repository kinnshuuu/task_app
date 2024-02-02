const Task = require('../models/task')
const Subtask = require('../models/subTask')

const createTask = async (req, res) => {
    try {
        const { title, description, dueDate } = req.body
        const userId = req.userId;
        if (!title || !description || !dueDate) {
            res.status(400).json(
                {
                    success: false,
                    message: "Invalid Credentials"
                }
            )
            return
        }
        const newTask = await Task.create({
            title: title,
            dueDate: dueDate,
            description: description,
            userId: userId
        })
        res.status(200).json({
            success: true,
            message: "Task Created",
            newTask: newTask
        })
    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: err
        })
    }
}

const updateTask = async (req, res) => {
    try {
        const taskId = req.params.taskId;
        const { title, description, dueDate, status } = req.body;

        // Check if task exists
        const existingTask = await Task.findById(taskId);
        if (!existingTask) {
            return res.status(404).json({
                success: false,
                message: 'Task not found',
            });
        }

        existingTask.title = title || existingTask.title;
        existingTask.description = description || existingTask.description;
        existingTask.dueDate = dueDate || existingTask.dueDate;
        existingTask.status = status || existingTask.status;

        const updatedTask = await existingTask.save();

        res.status(200).json({
            success: true,
            message: 'Task updated successfully',
            updatedTask: updatedTask,
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message,
        });
    }
};

const getAllTasks = async (req, res) => {
    try {
        const userId = req.userId;

        // Fetch all tasks for the given userId
        const tasks = await Task.find({ userId: userId, deletedAt: null });

        res.status(200).json({
            success: true,
            tasks: tasks,
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message,
        });
    }
};

const getTaskById = async (req, res) => {
    try {
        const taskId = req.params.taskId;
        const userId = req.userId;

        // Fetch the task by ID for the given userId
        const task = await Task.findOne({ _id: taskId, userId: userId, deletedAt: null });

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found',
            });
        }

        res.status(200).json({
            success: true,
            task: task,
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message,
        });
    }
};

const deleteTaskById = async (req, res) => {
    try {
        const taskId = req.params.taskId;
        const userId = req.userId;

        // Find the task by ID for the given userId
        const task = await Task.findOne({ _id: taskId, userId: userId, deletedAt: null });

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found',
            });
        }

        // Soft-delete the task by setting the deletedAt field
        task.deletedAt = new Date();
        await task.save();

        res.status(200).json({
            success: true,
            message: 'Task deleted successfully',
            deletedTask: task,
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message,
        });
    }
};

const createSubtask = async (req, res) => {
    try {
        const taskId = req.params.taskId;

        const task = await Task.findOne({ _id: taskId, deletedAt: null });

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found',
            });
        }
        const subtask = await Subtask.create({
            taskId: taskId
        })
        res.status(200).json({
            success: true,
            subtask: subtask,
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message,
        });
    }
}

const getAllSubtasks = async (req, res) => {
    try {

        const taskId = req.params.taskId;
        const task = await Task.findOne({ _id: taskId, deletedAt: null });

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found',
            });
        }

        const allSubtasks = await Subtask.find({ taskId: taskId, deletedAt: null });

        res.status(200).json({
            success: true,
            subtasks: allSubtasks,
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err,
        });
    }
};

const getSubtaskById = async (req, res) => {
    try {
        const taskId = req.params.taskId;

        const task = await Task.findOne({ _id: taskId, deletedAt: null });

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found',
            });
        }
        const subtaskId = req.params.subTaskId;

        const subtask = await Subtask.findOne({ _id: subtaskId, taskId: taskId, deletedAt: null });

        if (!subtask) {
            return res.status(404).json({ success: false, message: 'SubTask not found' });
        }

        // Respond with the retrieved subTask
        res.status(200).json({
            success: true,
            subtask: subtask,
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err,
        });
    }
};

const UpdateSubtask = async (req, res) => {
    try {
        const taskId = req.params.taskId;
        const { newTaskId, status } = req.body;

        const task = await Task.findOne({ _id: taskId, deletedAt: null });

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found',
            });
        }
        const subtaskId = req.params.subTaskId;

        const subtask = await Subtask.findOne({ _id: subtaskId, taskId: taskId, deletedAt: null });

        if (!subtask) {
            return res.status(404).json({ success: false, message: 'SubTask not found' });
        }

        subtask.status = status || subtask.status
        subtask.taskId = newTaskId || subtask.taskId

        const updatedSubTask = await subtask.save();
        // Respond with the retrieved subTask
        res.status(200).json({
            success: true,
            subtask: updatedSubTask,
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err,
        });
    }
};

const DeleteSubtask = async (req, res) => {
    try {
        const taskId = req.params.taskId;

        const task = await Task.findOne({ _id: taskId, deletedAt: null });

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found',
            });
        }
        const subtaskId = req.params.subTaskId;

        const subtask = await Subtask.findOne({ _id: subtaskId, taskId: taskId, deletedAt: null });

        if (!subtask) {
            return res.status(404).json({ success: false, message: 'SubTask not found' });
        }

        
        subtask.deletedAt = new Date()

        const updatedSubTask = await subtask.save();
        // Respond with the retrieved subTask
        res.status(200).json({
            success: true,
            subtask: updatedSubTask,
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err,
        });
    }
};


module.exports = {
    createTask,
    createSubtask,
    updateTask,
    getAllTasks,
    getTaskById,
    deleteTaskById,
    UpdateSubtask,
    getSubtaskById,
    getAllSubtasks,
    DeleteSubtask,
}