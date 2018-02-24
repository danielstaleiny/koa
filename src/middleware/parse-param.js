const capitalize = require('../utils/capitalize')
const Boom = require('boom')
// user is -> /:user -> has to match params in path
// id is your local variable you can call it whatever
// router.param('user', (id, ctx, next))

// generates param for model
// example: parseParam('user')
// example: returns function which search by User.findOne({id: value})
// ctx.user = item
// and set it to model value on ctx

const parseParam = model => async (value, ctx, next) => {
    if (!value || value == 'undefined')
        throw Boom.badRequest(`${value} is invalid param`)
    // take schema model
    const Model = require(`../model/${model}`)
    let item
    try {
        item = await Model.findOne({ id: value }).exec()
    } catch (e) {
        throw e
    }
    // make sure to return 404 if none was found
    if (!item) throw Boom.notFound(`${capitalize(model)} not found`)
    ctx[model] = item
    await next()
}

module.exports = parseParam
