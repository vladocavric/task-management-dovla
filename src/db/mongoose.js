const mongoose = require('mongoose');
const validator = require('validator')

const dbUrl = 'mongodb://localhost:27017/task-management-api';

mongoose.connect(dbUrl, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true});

const User = mongoose.model('User',{
    name: {
        type: String,
        default: 'Nina',
        trim: true,
    },
    age: {
        type: Number,
        min: 18
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if(!validator.isEmail(value)){
                throw new Error('The emeil is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value){
            // if(validator.isIn(value.toLocaleLowerCase(),['password', '1234567', 1234567, 'qwerty', 'qwertz'])){
            //     throw new Error('The password is not secure')
            // }
            if(value.toLowerCase().includes('password') || value.includes('1234567') || value.includes(1234567)) {
                throw new Error('The password is not secure')
            }
        }
    }
})

const Task = mongoose.model('Task',{
    title: {
        type: String,
        trim: true,
        required: true
    },
    body: {
        type: String,
        trim: true,
        required: true
    },
    done: {
        type: Boolean,
        required: false,
        default: false
    }
})

// const newUser = new User({
//     name: 'Cavric - Vlado ',
//     age: '25',
//     email: ' dovla@cavric.com     ',
//     password: 1234567
// })
//
// newUser.save()
//     .then((user) => {
//   console.log(user)
// }).catch((err) => {
//     console.log(err)
// });

const newTask = new Task({
    title: '   new task   ',
    body: '    the body of new task    ',
    // done: true

});

newTask.save()
.then((task) => {
    console.log(task)
}).catch((err) => {
    console.log(err)
})