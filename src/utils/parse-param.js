const capitalize = require('./capitalize')
// user is -> /:user -> has to match params in path
// id is your local variable you can call it whatever
// router.param('user', (id, ctx, next))

// generates param for model
// example: parseParam('user')
// example: returns function which search by User.findOne({id: value})
// ctx.user = item
// and set it to model value on ctx

const parseParam = model => async (value, ctx, next) => {
    // take schema model
    const Model = require(`../model/${model}`)
    try {
        let item = await Model.findOne({})
        // make sure to return 404 if none was found
        if (!item) return ctx.throw(404, `${capitalize(model)} not found`)
        ctx[model] = item
        return next()
    } catch (e) {
        return ctx.throw(500, e)
    }
}

module.exports = parseParam
