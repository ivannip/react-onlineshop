const mongoose = require("mongoose");
const logger = require("../logger");
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

var conn = null;

exports.connectDB = () => {
      const LOCAL_DB = "mongodb://127.0.0.1:27017/tdecDB";
      mongoose.connect(process.env.MONGODB_URL || LOCAL_DB, {
        useNewUrlParser: true,
      });

      conn = mongoose.connection;
      conn.once("open", async function () {
        logger.info("Connected to the Database.");
      });
      conn.on("error", function (error) {
        logger.error("Mongoose Connection Error : " + error);
      });
}

exports.createSession = async () => {
  try {
    const session = await conn.startSession();
    return session;
  } catch (err) {
    console.log(err);
    logger.error(err);
  }
}

