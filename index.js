require("dotenv").config();
const app = require("./src/server");

const port = process.env.PORT || 3000;
console.log(`Server listening on port ${port}`);
app.listen(port);
