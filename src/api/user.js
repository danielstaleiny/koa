const Router = require('koa-router')

//Middleware
const parseJSON = require('../middleware/co-body')
const inject = require('../middleware/inject-model')
const parse = require('../middleware/parse-param')

// Controller
const { get, save, put, patch, remove } = require('../controller/index')

const router = new Router()

router
    .prefix('/users')
    .param('user', parse('user'))
    .post('/', parseJSON, inject('user'), save('user'))
    .get('/:user', get('user'))
    .put('/:user', parseJSON, put('user'))
    .patch('/:user', parseJSON, patch('user'))
    .delete('/:user', remove('user'))

module.exports = router
