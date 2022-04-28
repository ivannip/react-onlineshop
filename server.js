const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const conn = require("./models/connection");
const path = require("path");

const productRoute = require("./routes/productRoutes");
const orderRoute = require("./routes/orderRoutes");
const userRouter = require("./routes/userRoutes");
const mqRouter = require("./routes/mqRoutes");


const PORT = process.env.PORT || "3001";
mongoose.Promise = global.Promise;

const app = express();
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.json());

//Setup authenticate Strategy
require("./strategies/JwtStrategy");
require("./strategies/LocalStrategy");
require("./authenticate");

//Setup Authorization route
app.use(passport.initialize());
app.use("/user", userRouter);

app.use("/product", productRoute);
app.use("/order", orderRoute);
app.use("/msg", mqRouter);


if (process.env.NODE_ENV === "production") {
  app.use(express.static("frontend/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
  });
}


app.listen(PORT, () => {
    console.log(`Server is listening to ${PORT}`)
});

