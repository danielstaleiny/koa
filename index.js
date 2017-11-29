const Koa = require("koa");
const Router = require("koa-router");
const server = new Koa();
const router = new Router();
const helmet = require("koa-helmet");
const errorHandler = require("./error-handler");

const jsonParser = require("./co-body");

const port = process.env.PORT || 3000;
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
  })
  .all("*", ctx => ctx.throw(404));

if (process.env.NODE_ENV === "development") {
  const logger = require("koa-logger");
  server.use(logger());
}

server.use(helmet());
server.use(errorHandler);
server.use(router.routes());
server.use(router.allowedMethods({ throw: true }));

server.listen(port);
console.log(`Server listening on port ${port}`);
