const request = require('supertest')
const Task = require('../src/models/task')
const app = require('../src/app')
const { user1, user1Id,user2Id,taskThree,taskTwo, setupDB,taskOne,user2 } = require('./fixtures/db')


beforeEach(setupDB)

test('Should Create task for user', async () => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${user1.tokens[0].token}`)
        .send({
            description:'test task 1'
        }).expect(201)

        const task = await Task.findById(response.body._id)
        expect(task).not.toBeNull()
        expect(task.completed).toBe(false)
})

test('Should Fetch all task for User1', async () => {
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${user1.tokens[0].token}`)
        .send()
        .expect(200)
 
    expect(response.body.length).toBe(2)
})

test('Should not delete first task for Secons user ', async () => {
    await request(app)
        .delete(`/tasks/${taskOne._id}`)
        .set('Authorization',`Bearer ${user2.tokens[0].token}`)
        .send()
        .expect(404)

    expect(await Task.findById(taskOne._id)).not.toBeNull()
})