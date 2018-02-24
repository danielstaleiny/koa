const app = require('../server')
const request = require('supertest')
const mongoose = require('../../lib/db/mongoose')

const User = require('../model/user')

afterAll(async () => {
    await User.remove({}).exec()
    mongoose.mongoose.connection.close()
})

test('POST', async () => {
    const res = await request(app.callback())
        .post('/users')
        .send({
            text: 'anon'
        })
    expect(res.status).toBe(201)
    expect(res.body.text).toBe('anon')

    // snapshot
    const withoutId = res.body
    delete withoutId.id
    expect(withoutId).toMatchSnapshot()
})
