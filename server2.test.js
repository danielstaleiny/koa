const mongoose = require("./mongoose");
const request = require("supertest");
const app = require("./server");

const User = require("./user");

// beforeAll(async () => {
//     console.log("Prepare objects");
// });
afterAll(async () => {
    await User.remove({}).exec();
    mongoose.mongoose.connection.close();
});

test("root route", async () => {
    const response2 = await request(app.callback())
        .post("/users")
        .send({
            text: "anon"
        });
    expect(response2.body.text).toMatchSnapshot();
    const response = await request(app.callback()).get("/users/5");
    expect(response.body).toMatchSnapshot();
});
