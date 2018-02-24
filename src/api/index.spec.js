const app = require('../server')
const request = require('supertest')
const mongoose = require('../../lib/db/mongoose')

afterAll(async () => {
    mongoose.mongoose.connection.close()
})

test('ping should return pong', async () => {
    const res = await request(app.callback()).get('/ping')
    expect(res.body).toMatchSnapshot()
    expect(res.body.msg).toBe('pong')
})
