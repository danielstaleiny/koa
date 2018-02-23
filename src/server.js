const Koa = require('koa')
const server = new Koa()
const helmet = require('koa-helmet')
const errorHandler = require('./middleware/error-handler')
const mongoose = require('../lib/db/mongoose')
const router = require('./router')

// use pino for production and koa logger for development
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

server.use(helmet())
server.use(errorHandler)
server.use(router.routes())
server.use(router.allowedMethods({ throw: true }))

module.exports = server
