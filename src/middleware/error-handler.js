module.exports = async (ctx, next) => {
    try {
        await next()
    } catch (err) {
        if (err.isBoom) {
            ctx.status = err.output.statusCode || 500
            ctx.body = err.output.payload
        } else {
            console.error(err)
            ctx.status = 500
            ctx.body = {
                error: 'internal server error',
                message: 'Internal server error'
            }
        }
    }
}
