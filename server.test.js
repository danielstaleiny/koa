const mongoose = require("./mongoose");
const request = require("supertest");
const app = require("./server");

const User = require("./user");

beforeAll(async () => {
    console.log("index beforeall");
    await User.remove({}).exec();
});
test("root route", async () => {
    const response = await request(app.callback()).get("/users/5");
    expect(response.body).toMatchSnapshot();
});

afterAll(async () => {
    console.log("index afterall");
    mongoose.mongoose.connection.close(function() {
        console.log("Connection with MongoDB closed");
    });
});
