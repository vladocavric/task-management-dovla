//======================================================================================================================
//  REQUIREMENTS
const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')
//======================================================================================================================
//  MONGOOSE MODEL

const userSchema = new mongoose.Schema({
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
            if (!validator.isEmail(value)) {
                throw new Error('The emeil is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value) {
            // if(validator.isIn(value.toLocaleLowerCase(),['password', '1234567', 1234567, 'qwerty', 'qwertz'])){
            //     throw new Error('The password is not secure')
            // }
            if (value.toLowerCase().includes('password') || value.includes('1234567') || value.includes(1234567)) {
                throw new Error('The password is not secure')
            }
        }
    },
    avatar: {
        type: Buffer
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
})

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'author'
})

userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete  userObject.password
    delete  userObject.tokens
    delete  userObject.avatar

    return userObject
}

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET)

    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email})
    if (!user) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error('Username or password are incorrect')
    }
    return user
}

userSchema.pre('save', async function (next) {
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

// delete users tas when user is removed
userSchema.pre('remove', async function (next) {
    const user = this
    await Task.deleteMany({author: user._id})
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User;
//======================================================================================================================
