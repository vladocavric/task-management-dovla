// CRUD

const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const ObjectID = mongodb.ObjectID;

const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-management';

// const id = new ObjectID();
// console.log(id)
// console.log(id.toHexString())
// console.log(id.getTimestamp())

MongoClient.connect(connectionURL, {useNewUrlParser: true, useUnifiedTopology: true}, (error, client) => {
    if (error) {
        return console.log('Unable to connect to database')
    }
    // console.log('Connected correctly!')
    const db = client.db(databaseName);


    // db.collection('user').findOne({_id: ObjectID('5eb30e03e9fd780d30639dfb')}, (err, user) => {
    //     if(err){
    //         return console.log('unable to find user')
    //     }
    //     console.log(user)
    // })

    // db.collection('user').find({age: { $lt: 34 }}).toArray((err, users) => {
    //     if (err) {
    //         return console.log(err)
    //     }
    //     console.log(users)
    // })
    //
    // db.collection('user').find({age: 34}).count((err, count) => {
    //     if (err) {
    //         return console.log(err)
    //     }
    //     console.log(count)
    // })

    // db.collection('tasks').findOne({_id: ObjectID('5eb311f4a55a083140655154')}, (err, task) => {
    //     if(err){
    //         return console.log('unable to find user')
    //     }
    //     console.log(task)
    // })
    //
    // db.collection('tasks').find({completed: true}).toArray((err, tasks) => {
    //     if (err) {
    //         return console.log(err)
    //     }
    //     console.log(tasks)
    // })

    // db.collection('user').insertOne({
    //     _id: id,
    //     name: 'Sime',
    //     age: 36
    // }, (err, result) => {
    //     if(err){
    //         return console.log('unable to insert user')
    //     }
    //     console.log(result.ops)
    // })


    // db.collection('user').insertMany([
    //     {
    //         name: 'Jelena',
    //         age: 25
    //     },
    //     {
    //         name: 'Milijana',
    //         ane: 28
    //     },
    //     {
    //         name: 'Marija',
    //         age: 30
    //     }
    // ], (err, result) => {
    //     if(err){
    //         return console.log('unable to insert users')
    //     }
    //     console.log(result.ops)
    // })


    // db.collection('tasks').insertMany([
    //     {
    //         desctiption: 'Miliana',
    //         completed: true
    //     },
    //     {
    //         desctiption: 'Aleksandra',
    //         completed: true
    //     },
    //     {
    //         desctiption: 'Jelena',
    //         completed: false
    //     }
    // ], (err, result) => {
    //     if(err){
    //         return console.log('unable to insert users')
    //     }
    //     console.log(result.ops)
    // })

    // db.collection('user').updateOne({
    //     _id: ObjectID("5eb30e03e9fd780d30639dfb")
    // }, {
    //     $set: {name: 'Mitar'}
    // }).then((result) => {
    //     console.log(result)
    // }).catch((error) => {
    //     console.log(error)
    // })

    // db.collection('user').updateOne({
    //     _id: ObjectID("5eb30e03e9fd780d30639dfb")
    // }, {
    //     $inc: {age: 1}
    // }).then((result) => {
    //     console.log(result)
    // }).catch((error) => {
    //     console.log(error)
    // })

    // db.collection('tasks').updateMany({
    //     completed: false
    // }, {
    //     $set: {completed: true}
    // }).then((result) => {
    //     console.log(result)
    // }).catch((error) => {
    //     console.log(error)
    // })

    // db.collection('user').deleteMany({age: {$lte: 30}})
    //     .then((result) => {
    //     console.log(result)
    // }).catch((error) => {
    //     console.log(error)
    // })

    db.collection('tasks').deleteOne({description: 'Jelena'})
        .then((result) => {
            console.log(result)
        }).catch((error) => {
        console.log(error)
    })
})