const compose = require('./compose')
// compose reverse
// executes form left to right
const pipe = (...fns) => {
    return compose(...fns.reverse())
}

module.exports = pipe
