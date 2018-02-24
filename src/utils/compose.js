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

module.exports = compose
