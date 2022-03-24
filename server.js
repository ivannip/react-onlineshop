const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const productRoute = require("./routes/productRoutes");
const orderRoute = require("./routes/orderRoutes");

const PORT = process.env.PORT || "3001";

const app = express();
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use("/product", productRoute);
app.use("/order", orderRoute);

//Setup Database Connection
const LOCAL_DB = "mongodb://127.0.0.1:27017/tdecDB";
mongoose.connect(process.env.MONGODB_URL || LOCAL_DB, {
  useNewUrlParser: true,
});

mongoose.connection.once("open", function () {
  console.log("Connected to the Database.");
});
mongoose.connection.on("error", function (error) {
  console.log("Mongoose Connection Error : " + error);
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static("frontend/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
  });
}

app.listen(PORT, () => {
    console.log(`Server is listening to ${PORT}`)
});

