const Koa = require("koa");
const Router = require("koa-router");
const server = new Koa();
const router = new Router();
const mongoose = require("./mongoose");

const helmet = require("koa-helmet");
const errorHandler = require("./error-handler");

const jsonParser = require("./co-body");

const User = require("./user.js");

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

router
    .param("user", async (id, ctx, next) => {
        // console.log("id ", id);
        // finds by _id
        // let user = await User.findById(id);

        let user = new User({ id, text: "ni8ceee" });
        user = await user.save();
        // let user = await User.findOne({ id });
        // if (!user) return ctx.throw(404, "User id not found");

        console.log(user);
        // await user.save();
        ctx.user = user;
        return next();
    })
    .get("/users/:user", ctx => {
        User.getById();
        ctx.status = 200;
        ctx.body = ctx.user;
    })
    .get("/", ctx => {
        ctx.throw(400, "waaa");
    })
    .post("/", jsonParser, ctx => {
        ctx.throw(500, ctx.request.body.name);
    });

// use pino for production and koa logger for development
if (process.env.NODE_ENV === "development") {
    const logger = require("koa-logger");
    server.use(logger());
}

const databaseName = process.env.NODE_ENV === "test" ? "koa-test" : "koa";

server.use(
    mongoose({
        user: "",
        pass: "",
        host: "127.0.0.1",
        port: "27017",
        database: databaseName
    })
);

server.use(helmet());
server.use(errorHandler);
server.use(router.routes());
server.use(router.allowedMethods({ throw: true }));

module.exports = server;
