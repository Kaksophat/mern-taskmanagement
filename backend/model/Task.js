const { text } = require('express');
const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
})

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    priority:{
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Low'
    },
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Completed'],
        default: 'Pending'
    },
    dueDate: {
        type: Date,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
    },
    assignedTo: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
    }],
    attachments: [{
        type: String, // URL or file path
    }],
    todoCheckList: [todoSchema],
    progress:{type: Number, default: 0},

}
, { timestamps: true }
)

module.exports = mongoose.model('Task', taskSchema);
