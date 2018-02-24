const capitalize = require('./capitalize')

// Example of use
// need ctx.User
// call injectModel('user') as middleware
// now you can call instance of User in ctx.User

// Requirements:
// require you to have models under src/model/
// make sure model is lowercase
const injectModel = model => (ctx, next) => {
    ctx[capitalize(model)] = require(`../model/${model}`)
    return next()
}

module.exports = injectModel
