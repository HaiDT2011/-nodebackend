const { configDotenv } = require("dotenv");
const app = require("./src/app");

const PORT = process.env.PORT

const server = app.listen(PORT, () => {
  console.log("handle connect port");
});



// process.on("SIGINT", () => {
//   server.close(() => {
//     console.log("Exist");
//   });
// });
