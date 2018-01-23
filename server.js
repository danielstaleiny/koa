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

// returns string with first capital letter
// param: string -> string
const toUpperCaseFirst = str => `${str.charAt().toUpperCase()}${str.substr(1)}`;

// generates param for model
// generates param for searchBy attribute
// example: parseParam('id')('user')
// example: searchBy = 'id' && model= 'user'
// example: returns function which search by User.findOne({id: value})
// ctx.user = item
// and set it to model value on ctx
const parseParam = searchBy => model => async (value, ctx, next) => {
    // take schema model
    const Model = require(`./${model}`);
    var obj = {};
    // specify what to search by
    // example: {id: value}
    obj[searchBy] = value;
    try {
        let item = await Model.findOne(obj);
        // make sure to return 404 if none was found
        if (!item)
            return ctx.throw(404, `${toUpperCaseFirst(model)} not found`);
        ctx[model] = item;
        return next();
    } catch (e) {
        return ctx.throw(500, e);
    }
};

const compose = (...fns) => {
    return result => {
        const list = fns.slice();

        while (list.length > 0) {
            result = list.pop()(result);
        }

        return result;
    };
};

const pipe = (...fns) => {
    return compose(...fns.reverse());
};

const injectModel = model => (ctx, next) => {
    ctx[model] = require(`./${model.toLowerCase()}`);
    return next();
};

const create = model => async ctx => {
    // create user with body
    const item = new ctx[model](ctx.request.body);
    try {
        const savedItem = await item.save();
        ctx.status = 201;
        ctx.body = savedItem;
    } catch (e) {
        return ctx.throw(500, e);
    }
};

const get = model => ctx => {
    ctx.status = 200;
    ctx.body = ctx[model];
};

const userControllerGet = get("user");
// const userControllerPost =  create("User");
const parseById = parseParam("id");
const userParam = parseById("user");

router
    .param("user", userParam)
    .post("/users", jsonParser, injectModel("User"), create("User"))
    .get("/users/:user", userControllerGet)
    // .get("/users/:user", ctx => {
    // User.getById();
    // ctx.status = 200;
    // ctx.body = ctx.user;
    // })
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
