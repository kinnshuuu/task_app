const mongoose = require('mongoose')

const subTaskSchema = mongoose.Schema({
    taskId: {
        type: mongoose.Schema.Types.ObjectId,
        refer: 'Task',
        required: true
    },
    status: {
        type: Number,
        required: true,
        enum: [0, 1],
        default: 0
    },
    deletedAt: {
        type: Date,
        // required: true,
        default: null
    }
}, { timestamps: true })

const subTask = mongoose.model('SubTask', subTaskSchema)

module.exports = subTask