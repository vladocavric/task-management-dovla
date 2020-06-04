//======================================================================================================================
//  REQUIREMENTS
const express = require('express');
const Task = require('../models/task');
const auth = require('../middleware/auth')
const router = express.Router({mergeParams: true});

//======================================================================================================================
//  TASKS ROUTES

// GET /tssks?completed=true
// GET /tasks?soertBY=createdAt:des
router.get('/', auth, async (req, res) => {
    const match = {}
    const sort = {}
    if (req.query.done) {
        match.done = req.query.done === 'true'
    }
    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }
    try {
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.status(200).send(req.user.tasks)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.post('/', auth, async (req, res) => {
    const newTask = new Task({
        ...req.body,
        author: req.user._id,
    })
    // const newTask = {
    //    ...req.body,
    //     author:  req.user._id
    // }
    try {
        await newTask.save()
        // Task.create(newTask, async (err, task) => {
        //     try {
        //         console.log(newTask)
        //     } catch (e) {
        //         res.status(500).send(e)
        //     }
        // })
        res.status(201).send(newTask)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/:id', auth, async (req, res) => {
    const _id = req.params.id
    // console.log(URLid)
    // console.log(typeof URLid)
    try {
        const task = await Task.findOne({_id, author: req.user._id})

        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.patch('/:id', auth, async (req, res) => {
    const updatesForTask = req.body;
    const updates = Object.keys(updatesForTask);
    const allowedUpdates = ['description', 'done'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({error: 'Not valid updates'})
    }

    try {
        // const task = await Task.findByIdAndUpdate(req.params.id, updatesForTask, {new: true, runValidators: true})

        // const task = await Task.findById(req.params.id);
        // if (task.author != req.user.id) {
        //     return res.statu(403).send('this is not your task')
        // }

        const task = await Task.findOne({_id: req.params.id, author: req.user._id})

        if (!task) {
            return res.status(404).send()
        }
        updates.forEach((update) => {
            task[update] = req.body[update]
        });
        await task.save();
        res.status(200).send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.delete('/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({_id: req.params.id, author: req.user._id})
        // console.log(task.author)
        // console.log(typeof task.author)
        // console.log(req.user.id)
        // console.log(typeof req.user.id)

        if (!task) {
            return res.status(404).send({error: 'this task does not exist'})
        }
        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})


module.exports = router;