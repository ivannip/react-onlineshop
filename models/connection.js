const mongoose = require("mongoose");

if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
  }

//Setup Database Connection
const LOCAL_DB = "mongodb://127.0.0.1:27017/tdecDB";
mongoose.connect(process.env.MONGODB_URL || LOCAL_DB, {
  useNewUrlParser: true,
});

const conn = mongoose.connection;
conn.once("open", function () {
  console.log("Connected to the Database.");
});
conn.on("error", function (error) {
  console.log("Mongoose Connection Error : " + error);
});

module.exports = conn;