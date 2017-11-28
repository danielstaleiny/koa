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

router.post("/", jsonParser, ctx => {
  ctx.response.ok(ctx.request.body);
});

app.use(responseHandler());
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(3000);
