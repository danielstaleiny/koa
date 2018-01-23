// const fetchData = () => {
//     return new Promise((resolve, reject) => resolve("success"));
// };

// test("the test", async () => {
//     const data = await fetchData();
//     expect(data).toBe("success");
// });

const mongoose = require("./mongoose");

const User = require("./user");
const request = require("supertest");
const app = require("./server");

beforeAll(async () => {
    await User.remove({}).exec();
    console.log("server beforeall");
});

test("root route", async () => {
    const response = await request(app.callback()).get("/users/4");
    expect(response.body).toMatchSnapshot();
});

afterAll(async () => {
    console.log("server afterall");
    mongoose.mongoose.connection.close(function() {
        console.log("Connection with MongoDB closed");
    });
});
