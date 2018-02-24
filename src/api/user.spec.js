const app = require('../server')
const request = require('supertest')
const mongoose = require('../../lib/db/mongoose')

const User = require('../model/user')

let postObj = { text: 'anon' }

let localUser = {}

let mockUser = { text: 'test' }

beforeAll(async () => {
    const user = new User(mockUser)
    localUser = await user.save()
})

afterAll(async () => {
    await User.remove({}).exec()
    mongoose.mongoose.connection.close()
})

describe('/users', () => {
    test('POST', async () => {
        const res = await request(app.callback())
            .post('/users')
            .send(postObj)
        expect(res.status).toBe(201)
        Object.keys(postObj).map(key =>
            expect(res.body[key]).toBe(postObj[key])
        )
        // snapshot
        const withoutId = res.body
        delete withoutId.id
        expect(withoutId).toMatchSnapshot()
    })

    describe('/:user', () => {
        test('GET by id', async () => {
            const res = await request(app.callback()).get(
                `/users/${localUser.id}`
            )
            expect(res.status).toBe(200)
            Object.keys(mockUser).map(key =>
                expect(res.body[key]).toBe(mockUser[key])
            )

            // snapshot
            const withoutId = res.body
            delete withoutId.id
            expect(withoutId).toMatchSnapshot()
        })

        test('PUT', async () => {
            const res = await request(app.callback())
                .put(`/users/${localUser.id}`)
                .send({ text: 'put' })
            expect(res.status).toBe(200)
            expect(res.body.text).toBe('put')

            // snapshot
            const withoutId = res.body
            delete withoutId.id
            expect(withoutId).toMatchSnapshot()
        })
        test('PATCH', async () => {
            const res = await request(app.callback())
                .patch(`/users/${localUser.id}`)
                .send({ text: 'patch' })
            expect(res.status).toBe(204)
        })
        test('DELETE', async () => {
            const res = await request(app.callback()).del(
                `/users/${localUser.id}`
            )
            expect(res.status).toBe(204)
        })
        test('DELETE ERROR', async () => {
            const res = await request(app.callback()).del(
                `/users/${localUser.id}`
            )
            expect(res.status).toBe(404)
        })
    })
})
