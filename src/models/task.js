//======================================================================================================================
//  REQUIREMENTS
const mongoose = require('mongoose');
//======================================================================================================================
//  MONGOOSE MODEL
const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        trim: true,
        required: true
    },
    done: {
        type: Boolean,
        required: false,
        default: false
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
})
const Task = mongoose.model('Task', taskSchema)

module.exports = Task;