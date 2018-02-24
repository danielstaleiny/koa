const capitalize = require('../utils/capitalize')

/*
 * Make sure that you call these functions with lovercased model name.
 */

// Comments
// These are right way of retrieving, updating, patching and removing documents.
// These methods makes sure that mongoose middleware methods are called
// beforeSave AfterSave etc. you got the point
// validate objects before calling these functions
// use lovercase names because it correspons to lovercase model name
// such as user.js  get('user')

// THESE METHODS WILL NOT TRIGGER MONGOOSE MIDDLEWARE
// AVOID USING
// User.create();
// User.findByIdAndUpdate();
// User.findOneAndUpdate();
// User.remove();
// User.findByIdAndRemove();
// User.findOneAndRemove();

// ---- General methods ----

// loop over body and updates values for keys.
const setBodyAttribute = model => ctx => {
    const parse = key => {
        return (ctx[model][key] = ctx.request.body[key])
    }
    return Object.keys(ctx.request.body).map(parse)
}

// returns object of type ['model']
const get = model => ctx => {
    ctx.status = 200
    ctx.body = ctx[model]
}
// create new document and save it to database
const save = model => async ctx => {
    // create user with body
    const item = new ctx[(capitalize(model))](ctx.request.body)
    try {
        const savedItem = await item.save()
        ctx.status = 201
        ctx.body = savedItem
    } catch (e) {
        throw e
    }
}
// updates whole document.
const put = model => async ctx => {
    setBodyAttribute(model)(ctx)
    try {
        const putObject = await ctx[model].save()
        ctx.status = 200
        ctx.body = putObject
    } catch (e) {
        throw e
    }
}
// doesn't return anything
// patch value of the document
const patch = model => async ctx => {
    try {
        ctx[model].set(ctx.request.body)
        await ctx[model].save()
        ctx.status = 204
    } catch (e) {
        throw e
    }
}

// removes object
const remove = model => async ctx => {
    try {
        await ctx[model].remove()
        ctx.status = 204
    } catch (e) {
        throw e
    }
}

module.exports = { get, save, put, patch, remove }
