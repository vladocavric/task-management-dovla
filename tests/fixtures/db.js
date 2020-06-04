//======================================================================================================================
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('../../src/models/user')
const Task = require('../../src/models/task')
//======================================================================================================================
const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    name: 'Jurgen',
    email: 'jurgenklopp.testiti@gmail.com',
    password: 'dovla123',
    tokens: [{
        token: jwt.sign({_id: userOneId}, process.env.JWT_SECRET)
    }]
}
const userTwoId = new mongoose.Types.ObjectId()
const userTwo = {
    _id: userTwoId,
    name: 'Murinjo',
    email: 'jurgenklopp.testiti+1@gmail.com',
    password: 'dovla123',
    tokens: [{
        token: jwt.sign({_id: userOneId}, process.env.JWT_SECRET)
    }]
}
//======================================================================================================================
const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: 'First task',
    done: false,
    author: userOne._id
}

const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Second task',
    done: true,
    author: userOne._id
}

const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: '3rd task',
    done: false,
    author: userTwo._id
}
//======================================================================================================================
const setupDB = async () => {
    await User.deleteMany()
    await Task.deleteMany()
    await new User(userOne).save()
    await new User(userTwo).save()
    await new Task(taskOne).save()
    await new Task(taskTwo).save()
    await new Task(taskThree).save()
}

module.exports = {
    userOneId,
    userOne,
    userTwo,
    taskOne,
    setupDB
}

