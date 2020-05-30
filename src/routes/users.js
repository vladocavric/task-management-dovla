//======================================================================================================================
//  REQUIREMENTS
const express = require('express');
const multer = require('multer')
const sharp = require('sharp')
const User = require('../models/user');
const auth = require('../middleware/auth')
const {sendWelcomeEmail, sendCancelEmail} = require('../emails/account')
const router = express.Router({mergeParams: true});

//======================================================================================================================
const upload = multer({
    // dest: 'public/avatar',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
            return cb(new Error('The file format is not supported'))
        }
        cb(undefined, true)
    }
})
//======================================================================================================================
//  USER ROUTES
router.get('/me', auth, async (req, res) => {
    res.send(req.user)
    // try {
    //     const users = await User.find({})
    //     res.send(users)
    //     // render('users', {users: users})
    // } catch (e) {
    //     res.status(500).send(err)
    // }
})

router.post('/', async (req, res) => {
    const newUser = new User(req.body)
    try {
        await newUser.save()
        sendWelcomeEmail(newUser.email, newUser.name)
        const token = await newUser.generateAuthToken()
        res.status(201).send({newUser, token})
    } catch (e) {
        res.status(500).send(e)
    }
})

router.post('/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token})
    } catch (e) {
        res.status(400).send()
    }
})

router.post('/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send('you are logout now')
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/logout-all', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send('you are logout now')
    } catch (e) {
        res.status(500).send()
    }
})

// router.get('/:id', async (req, res) => {
//     try {
//         const user = await User.findById(req.params.id)
//         if (!user) {
//             return res.status(404).send()
//         }
//         res.send(user)
//         // render('user', {user: user})
//     } catch (e) {
//         res.status(500).send(e)
//     }
// })

router.patch('/me', auth, async (req, res) => {
    const updatesForUser = req.body;
    const updates = Object.keys(updatesForUser);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({error: 'Invalid updates'})
    }

    try {
        // moze ovako ili ovo ispod, stvar je preferencije
        // const user = await User.findById(req.user._id)
        // updates.forEach((update) => {
        //     user[update] = req.body[update]
        // })
        // await  user.save()

        updates.forEach((update) => req.user[update] = req.body[update])

        await req.user.save()

        res.status(200).send(req.user)
        // res.status(200).render('user',{user: req.user})
    } catch (e) {
        res.status(500).send(e)
    }
})

router.delete('/me', auth, async (req, res) => {
    try {
        // const user = await User.findByIdAndDelete(req.user._id)
        // if (!user) {
        //     return res.status(404).send({error: "this user does not exist"})
        // }

        await req.user.remove()
        sendCancelEmail(req.user.email, req.user.name)
        res.status(200).send(req.user)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.post('/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({error: error.message})
})

router.delete('/me/avatar', auth, async (req, res) => {
    try {
        req.user.avatar = undefined
        await req.user.save()
        res.status(200).send(req.user)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user || !user.avatar) {
            throw new Error()
        }

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch (e) {
        res.status(404).send(e)
    }
})

module.exports = router;