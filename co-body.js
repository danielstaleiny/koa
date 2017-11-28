const body = require("co-body");

module.exports = async (ctx, next) => {
  // remove if you want to have undefined if body is empty. and change fallback to false for co-body
  ctx.request.body = {};

  // add this file to only methods which you want to parse json to. POST,PATCH,PUT

  // if (ctx.method === "GET" || ctx.method === "DELETE") {
  //   next();
  //   return;
  // }

  try {
    ctx.request.body = await body.json(ctx.req, {
      strict: true,
      fallback: true
    });
    next();
    return;
  } catch (err) {
    ctx.throw(err);
    next(err);
    return;
  }
};
