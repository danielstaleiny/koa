const Router = require('koa-router')
const router = new Router()
const capitalize = require('../utils/capitalize')
// Middleware
const parseJSON = require('../middleware/co-body')
const inject = require('../middleware/inject-model')
const parse = require('../middleware/parse-param')
// Controller
const { get, save, put, patch, remove } = require('../controller/index')

router.get('/ping', ctx => {
    ctx.status = 200
    ctx.body = { msg: 'pong' }
})

module.exports = router
