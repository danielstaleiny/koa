const mongoose = require('../../lib/db/mongoose')
const request = require('supertest')
const app = require('../server')

const User = require('../model/user')

beforeAll(async () => {
    // await User.remove({}).exec();
})
test('root route', async () => {
    const response2 = await request(app.callback())
        .post('/users')
        .send({
            id: 5,
            text: 'anon'
        })

    expect(response2.body).toMatchSnapshot()
    const response = await request(app.callback()).get('/users/5')
    expect(response.body).toMatchSnapshot()
    console.log(response.body)
})

afterAll(async () => {
    await User.remove({}).exec()
    mongoose.mongoose.connection.close()
})
