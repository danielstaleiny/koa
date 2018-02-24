const Router = require('koa-router')
const parseJSON = require('../middleware/co-body')
const inject = require('../utils/inject-model')
const { get, save, put, patch, remove } = require('../controller/index')
//parse param
const parse = require('../utils/parse-param')

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
