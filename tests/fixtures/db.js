const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../src/models/user')
const Task = require('../../src/models/task')

const user1Id = new mongoose.Types.ObjectId()
const user1 = {
    _id: user1Id,
    name: 'Mike',
    email: 'ahmet@asdasdasdx.com',
    password: 'ahmetalkan',
    tokens:[{
        token: jwt.sign({_id: user1Id },process.env.JSON_WEB_TOKEN_SECRET)
    }]
}

const user2Id = new mongoose.Types.ObjectId()
const user2 = {
    _id: user2Id,
    name: 'Mustafa',
    email: 'Mustafa@asdasdasdx.com',
    password: 'ahmetalkan',
    tokens:[{
        token: jwt.sign({_id: user2Id },process.env.JSON_WEB_TOKEN_SECRET)
    }]
}

const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: 'First task',
    completed: false,
    owner: user1Id
}

const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Second task',
    completed: false,
    owner: user1Id
}

const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Third task',
    completed: false,
    owner: user2Id
}

const setupDB = async () => {
    await User.deleteMany()
    await Task.deleteMany()
    await new User(user1).save()
    await new User(user2).save()
    await new Task(taskOne).save()
    await new Task(taskTwo).save()
    await new Task(taskThree).save()
}

module.exports = {
    user1,
    user1Id,
    setupDB,
    taskOne,
    user2,
    taskTwo,
    taskThree,
    user2Id
}