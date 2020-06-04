//======================================================================================================================
//  REQUIREMENTS
const path = require('path')
const express = require('express');
const hbs = require('hbs');
const request = require('request');
const mongoose = require('mongoose');
const validator = require('validator')
const multer = require('multer')
const app = express();
const User = require('./models/user');
const Task = require('./models/task');
const userRoutes = require('./routes/users');
const tasksRoutes = require('./routes/tasks');
const indexRoutes = require('./routes/index');
//======================================================================================================================
//======================================================================================================================
//======================================================================================================================
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '../views'));
hbs.registerPartials(path.join(__dirname, '../views/partials'));
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json())
//======================================================================================================================
// ROUTES
app.use(indexRoutes)
app.use('/users', userRoutes);
app.use('/tasks', tasksRoutes);

//======================================================================================================================
// VARIABLES
//
const mongo = process.env.TASK_DB
const port = process.env.PORT;
//======================================================================================================================
mongoose.connect(mongo, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});

//======================================================================================================================
// 404
app.get('*', function (req, res) {
    res.send('404');
});

module.exports = app