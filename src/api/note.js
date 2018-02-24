const Router = require('koa-router')
const jsonParser = require('./middleware/co-body')
const capitalize = require('./utils/capitalize')
const inject = require('./utils/inject-model')
const { get, save, put, patch, remove } = require('./controller/index')

const router = new Router()

router.prefix('/notes')

module.exports = router
