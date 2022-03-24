const express = require("express");
const Order = require("../models/order");
const router = express.Router();

//setup proxy for server client connection with diff ports, added for deployment in local nginx
router.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Credentials", true);
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
    next();
  });

router.post("/new", (req, res) => {
    console.log(req.body);
    const order = new Order(req.body);
    order.save( (err, saveRecord) => {
        !err?res.json(saveRecord):res.send(err);
    })
});

// router.get("/all", (req, res) => {
//   Order.find({}, (err, foundRecords) => {
//       if (err) {
//           res.send(err);
//       } else {
//           (foundRecords.length > 0)?res.json(foundRecords):res.send("No record found!");
//       }
//   })
// });

router.get("/all", (req,res) => {
  Order.find({})
  .populate(
    {path: "purchasedItems.product", model: "product"})
  .exec( (err, foundRecords) => {
    if (err) {
            console.log(err);
            res.send(err);
    } else {
            (foundRecords.length > 0)?res.json(foundRecords):res.send("No record found!");
    }
  })
})

module.exports = router;