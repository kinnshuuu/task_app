const mongoose = require('mongoose')

const TaskSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['TODO', 'IN_PROGRESS', 'DONE'],
        default: 'TODO'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        refer: 'User',
        required: true
    },
    deletedAt: {
        type: Date,
        // required: true,
        default: null
    }
}, { timestamps: true })

const task = mongoose.model('Task', TaskSchema)

module.exports = task