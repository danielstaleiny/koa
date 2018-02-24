const Router = require('koa-router')
const router = new Router()
const parseJSON = require('../middleware/co-body')
const capitalize = require('../utils/capitalize')
const inject = require('../utils/inject-model')
const { get, save, put, patch, remove } = require('../controller/index')
//parse param
const parse = require('../utils/parse-param')

router.get('/ping', ctx => {
    ctx.status = 200
    ctx.body = { msg: 'pong' }
})

module.exports = router
