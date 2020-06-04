//======================================================================================================================
const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const {userOneId, userOne, setupDB} = require('./fixtures/db')
//======================================================================================================================
beforeEach(setupDB)
//======================================================================================================================
test('Should signup a new user', async () => {
    const res = await request(app)
        .post('/users')
        .send({
            name: 'Milomir',
            email: 'jurgenklopp.testiti+2@gmail.com',
            password: 'dovla123'
        })
        .expect(201)
    const user = await User.findById(res.body.newUser._id)
    expect(user)
        .not
        .toBeNull()
    expect(res.body)
        .toMatchObject({
            newUser: {
                name: 'Milomir',
                email: 'jurgenklopp.testiti+2@gmail.com'
            },
            token: user.tokens[0].token
        })
    expect(user.password).not.toBe('dovla123')
})

test('Should login existing user', async () => {
    const res = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    })
        .expect(200)
        .expect('Content-Type', /json/)
    const user = await User.findById(userOneId)
    expect(res.body.token)
        .toBe(user.tokens[1].token)
})

test('Should not login non existing user', async () => {
    await request(app)
        .post('/users/login')
        .send({
            email: 'nesto@neko.com',
            password: userOne.password
        })
        .expect(400)
})

test('Should get profile for user', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
        .expect('Content-Type', /json/)
})

test('Should not get profile for for anonimus user', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

test('Should delete user', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    const user = await User.findById(userOneId)
    expect(user)
        .toBeNull()
})

test('Should not delete profile for anonimus user', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})

test('should uplad profile pic', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/profile-pic.jpg')
        .expect(200)
    const user = await User.findById(userOneId)
    expect(user.avatar)
        .toEqual(expect.any(Buffer))
})

test('Should update user name', async () => {
    const name = 'Milomir'
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name
        })
        .expect(200)
    const user = await User.findById(userOneId)
    expect(user.name)
        .toBe(name)
})

test('Should not update user name', async () => {
    const name = 'Milomir'
    await request(app)
        .patch('/users/me')
        .send({
            name
        })
        .expect(401)
    const user = await User.findById(userOneId)
    expect(user.name)
        .not
        .toBe(name)
})

// User Test Ideas
//
// Should not signup user with invalid name/email/password
// Should not update user if unauthenticated
// Should not update user with invalid name/email/password
// Should not delete user if unauthenticated