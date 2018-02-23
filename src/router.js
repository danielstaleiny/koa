const Router = require('koa-router')
const router = new Router()
const capitalize = require('../lib/utils/capitalize')
const User = require('./model/user.js')
const jsonParser = require('./middleware/co-body')

// **** router docs ****

//   .get|put|post|patch|delete|del ⇒ Router
//   .routes ⇒ function
//   .use([path], middleware) ⇒ Router
//   .prefix(prefix) ⇒ Router
//   .allowedMethods([options]) ⇒ function
//   .redirect(source, destination, code) ⇒ Router
//   .route(name) ⇒ Layer | false
//   .url(name, params [, options]) ⇒ String | Error
//   .param(param, middleware) ⇒ Router

// user is -> /:user -> has to match params in path
// id is your local variable you can call it whatever
// router.param('user', (id, ctx, next))

// generates param for model
// generates param for searchBy attribute
// example: parseParam('id')('user')
// example: searchBy = 'id' && model= 'user'
// example: returns function which search by User.findOne({id: value})
// ctx.user = item
// and set it to model value on ctx
const parseParam = searchBy => model => async (value, ctx, next) => {
    // take schema model
    const Model = require(`./model/${model}`)
    var obj = {}
    // specify what to search by
    // example: {id: value}
    obj[searchBy] = value
    try {
        let item = await Model.findOne(obj)
        // make sure to return 404 if none was found
        if (!item) return ctx.throw(404, `${capitalize(model)} not found`)
        ctx[model] = item
        return next()
    } catch (e) {
        return ctx.throw(500, e)
    }
}

// executes form right to left
const compose = (...fns) => {
    return result => {
        const list = fns.slice()

        while (list.length > 0) {
            result = list.pop()(result)
        }

        return result
    }
}

// compose reverse
// executes form left to right
const pipe = (...fns) => {
    return compose(...fns.reverse())
}

// make sure model is lowercase
const injectModel = model => (ctx, next) => {
    ctx[capitalize(model)] = require(`./model/${model}`)
    return next()
}

// make sure model is lowercase
const save = model => async ctx => {
    // create user with body
    const item = new ctx[(capitalize(model))](ctx.request.body)
    try {
        const savedItem = await item.save()
        ctx.status = 201
        ctx.body = savedItem
        console.log(ctx.status)
    } catch (e) {
        return ctx.throw(500, e)
    }
}

// make sure model is lowercase
const get = model => ctx => {
    ctx.status = 200
    ctx.body = ctx[model]
}

// make sure model is lowercase
const put = model => async ctx => {
    setBodyAttribute(model)(ctx)
    try {
        const putObject = await ctx[model].save()
        ctx.status = 201
        ctx.body = putObject
    } catch (e) {
        return ctx.throw(500, e)
    }
}

const setBodyAttribute = model => ctx => {
    const parse = key => {
        return (ctx[model][key] = ctx.request.body[key])
    }
    return Object.keys(ctx.request.body).map(parse)
}

// make sure model is lowercase
const patch = model => async ctx => {
    try {
        ctx[model].set(ctx.request.body)
        const patchObject = await ctx[model].save()
        ctx.status = 201
        ctx.body = patchObject
    } catch (e) {
        return ctx.throw(500, e)
    }
}

// make sure model is lowercase
const remove = model => async ctx => {
    try {
        const removedObject = await ctx[model].remove()
        ctx.status = 201
        ctx.body = removedObject
    } catch (e) {
        return ctx.throw(500, e)
    }
}

const userControllerGet = get('user')
// const userControllerPost =  create("User");
const parseById = parseParam('id')
const userParam = parseById('user')

router
    .param('user', userParam)
    .post('/users', jsonParser, injectModel('user'), save('user'))
    .get('/users/:user', userControllerGet)
    .put('/users/:user', jsonParser, put('user'))
    .patch('/users/:user', jsonParser, patch('user'))
    .delete('/users/:user', remove('user'))
    // .get("/users/:user", ctx => {
    // User.getById();
    // ctx.status = 200;
    // ctx.body = ctx.user;
    // })
    .get('/', ctx => {
        ctx.throw(400, 'waaa')
    })
    .post('/', jsonParser, ctx => {
        ctx.throw(500, ctx.request.body.name)
    })

module.exports = router
