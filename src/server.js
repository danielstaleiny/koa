const Koa = require('koa')
const server = new Koa()
const helmet = require('koa-helmet')
const errorHandler = require('./middleware/error-handler')
const mongoose = require('../lib/db/mongoose')
const Boom = require('boom')

// Routes
const indexRouter = require('./api/index')
const userRouter = require('./api/user')

// use pino for production and koa logger for development, tests
const logger =
    process.env.NODE_ENV === 'production'
        ? require('koa-pino-logger')
        : require('koa-logger')

server.use(logger())

// use DB as database and for testing use DB-test
server.use(
    mongoose({
        user: '',
        pass: '',
        host: '127.0.0.1',
        port: '27017',
        database:
            process.env.NODE_ENV === 'test'
                ? `${process.env.DB}-test`
                : process.env.DB
    })
)

const allowMth = {
    throw: true,
    notImplemented: () => Boom.notImplemented(),
    methodNotAllowed: () => Boom.methodNotAllowed()
}

server.use(helmet())
server.use(errorHandler)
// Routes
server.use(indexRouter.routes())
server.use(indexRouter.allowedMethods(allowMth))
server.use(userRouter.routes())
server.use(userRouter.allowedMethods(allowMth))

module.exports = server
