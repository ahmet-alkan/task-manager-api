const request = require('supertest') 
const app = require('../src/app')
const User = require('../src/models/user')
const { user1, user1Id, setupDB } = require('./fixtures/db')


beforeEach(setupDB)

afterEach(() => {
})

test('Should sign up a new user', async () => {
    const response = await request(app).post('/users').send({
        name: 'Ahmet test',
        email: 'test.ahmet@test.com',
        password: 'ahmetalkan',

    }).expect(201)
    //Assert database changed correctly
    const user = await User.findById({_id: response.body.user._id})
    expect(user).not.toBeNull()

    expect(response.body).toMatchObject({
        user:{
            name: 'Ahmet test',
            email: 'test.ahmet@test.com',
        },
        token: user.tokens[0].token
    })

    expect(user.password).not.toBe('ahmetalkan')
})

test('Should log in existing user', async () => {
    const response = await request(app).post('/users/login').send({
        email: user1.email,
        password: user1.password
    }).expect(200)

    const user = await User.findById(user1Id)
    expect(response.body.token).toBe(user.tokens[1].token)
})

test('Should not log in non-existing user', async () => {
    await request(app).post('/users/login').send({
        email: 'non@exist.co',
        password: '123lksdfnf'
    }).expect(400)
} )

test('Should get profile for user', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${user1.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not get profile for unauthenticated user', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

test('Should delete account for user', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${user1.tokens[0].token}`)
        .send()
        .expect(200)

    const user = await User.findById(user1Id)
    expect(user).toBeNull()
})

test('Shpuld not delete account for unauthenticated user', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})

// test('', async () => {

// })

test('Should Upload avatar image', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization',`Bearer ${user1.tokens[0].token}`)
        .attach('avatar','tests/fixtures/profile-pic.jpg')
        .expect(200)

    const user = await User.findById(user1Id)
    expect(user.avatar).toEqual(expect.any(Buffer))
})
 
test('Should update user', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization',`Bearer ${user1.tokens[0].token}`)
        .send({
            name: 'Amet'
        })
        .expect(200)

    const user = await User.findById(user1Id)
    expect(user.name).toBe('Amet')
})

test('Should not Update user for bad fields', async () => {
    request(app)
        .patch('/users/me')
        .set('Authorization',`Bearer ${user1.tokens[0].token}`)
        .send({
            location: 'hello'
        })
        .expect(400)
})