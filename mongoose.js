var mongoose = require("mongoose");

// inspired from koa-mongoose
// uri: https://github.com/Jackong/koa-mongoose

mongoose.Promise = global.Promise;

var middleware = (module.exports = options => {
    mongoose = options.mongoose ? options.mongoose : mongoose;

    //mode: model
    var db = mongoose.connection;
    middleware.models = {};
    middleware.dbs = {};
    middleware.open(db, options);
    return async (ctx, next) => {
        var database =
            typeof options.database === "function"
                ? options.database(ctx)
                : options.database ||
                  options.uri.match(/\/[^\/]+$/)[0].replace("/", "");

        if (!middleware.dbs.hasOwnProperty(database)) {
            middleware.dbs[database] = db.useDb(database);
        }

        await next();
    };
});

middleware.mongoose = mongoose;

middleware.open = (db, options) => {
    if (!options && (!options.host || !options.port) && !options.uri) {
        throw new Error("options not found");
    }

    var database =
        typeof options.database === "function" ? undefined : options.database;

    var uri =
        options.uri ||
        `mongodb://${options.user
            ? options.user + ":" + options.pass + "@"
            : ""}${options.host}:${options.port}${database
            ? "/" + database
            : ""}`;

    process.on("SIGINT", function() {
        db.close(function() {
            process.exit(1);
        });
    });
    db.on("error", err => {
        db.close();
        console.error(err);
        process.exit(1);
    });

    if (options.events) {
        for (var evt in options.events) {
            db.on(evt, options.events[evt]);
        }
    }

    db.openUri(uri, options.mongodbOptions);

    return db;
};
