const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const {connectDB} = require("./models/connection");
const path = require("path");

const productRoute = require("./routes/productRoutes");
const orderRoute = require("./routes/orderRoutes");
const userRoute = require("./routes/userRoutes");

const logger = require("./logger");

//Route for RabbitMQ
//const mqRouter = require("./routes/mqRoutes");

connectDB();

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
app.use("/user", userRoute);

//Setup Data Route
app.use("/product", productRoute);
app.use("/order", orderRoute);

//setup RabbitMQ Route
//app.use("/msg", mqRouter);


//if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "./frontend/build")));

  app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./frontend/build/index.html"));
  });
//}


app.listen(PORT, () => {
  logger.info(`Server is listening to ${PORT}`);  
});

