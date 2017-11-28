const Koa = require("koa");
const Router = require("koa-router");
const app = new Koa();
const router = new Router();

const jsonParser = require("./co-body");
const responseHandler = require("./response-handler");

app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}`);
});

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

router.post("/", jsonParser, ctx => {
  ctx.response.ok(ctx.request.body);
});

app.use(responseHandler());
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(3000);
