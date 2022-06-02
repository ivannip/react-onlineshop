const express = require("express");
const {createOrder, updateOrder, deleteAllOrder, showAllOrder, showConfirmedOrder} = require("../controls/orderControl")
const router = express.Router();
const setupProxy = require("./setupProxy");


//setup proxy for server client connection with diff ports, added for deployment in local nginx
router.use(setupProxy);

router.post("/new", createOrder);

router.post("/status/:status", updateOrder);

router.delete("/deleteAll", deleteAllOrder);

router.get("/all", showAllOrder);

router.get("/confirm/:month/:year", showConfirmedOrder);

module.exports = router;