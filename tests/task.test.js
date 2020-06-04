//======================================================================================================================
const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/models/task')
const {
    userOne,
    userOneId,
    userTwo,
    taskOne,
    setupDB
} = require('./fixtures/db')
//======================================================================================================================
beforeEach(setupDB)
//======================================================================================================================

test('should create task for user', async () => {
    const res = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: 'first task from my test'
        })
        .expect(201)
    const task = await Task.findById(res.body._id)
    expect(task)
        .not.toBeNull()
    expect(task.done)
        .toEqual(false)
})

test('should get users tasks', async () => {
    const res = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
        .expect('Content-Type', /json/)
    expect(res.body.length)
        .toEqual(2)
})

// test('should not delete strangers task', async () => {
//     console.log(taskOne.author)
//     console.log(userTwo._id)
//     const res = await request(app)
//         .delete(`/tasks/${taskOne._id}`)
//         .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
//         .send()
//         .expect(404)
//          //something is wrong here todo: should investigate
// })

// Task Test Ideas
//
// Should not create task with invalid description/completed
// Should not update task with invalid description/completed
// Should delete user task
// Should not delete task if unauthenticated
// Should not update other users task
// Should fetch user task by id
// Should not fetch user task by id if unauthenticated
// Should not fetch other users task by id
// Should fetch only completed tasks
// Should fetch only incomplete tasks
// Should sort tasks by description/completed/createdAt/updatedAt
// Should fetch page of tasks