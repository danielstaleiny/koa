const Koa = require("koa");
const Router = require("koa-router");
const server = new Koa();
const router = new Router();
const helmet = require("koa-helmet");
const errorHandler = require("./error-handler");

const jsonParser = require("./co-body");

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

router
  .get("/", ctx => {
    ctx.throw(400, "waaa");
  })
  .post("/", jsonParser, ctx => {
    ctx.throw(500, ctx.request.body.name);
  });

if (process.env.NODE_ENV === "development") {
  const logger = require("koa-logger");
  server.use(logger());
}

server.use(helmet());
server.use(errorHandler);
server.use(router.routes());
server.use(router.allowedMethods({ throw: true }));

server.listen(3000);
