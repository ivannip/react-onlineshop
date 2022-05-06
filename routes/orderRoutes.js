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
    const order = new Order(req.body);
    // const URL = "http://localhost:3001/"+"product/amends";
    //  (async () => {
    //   try {
    //     const response = await axios.post(URL, {purchasedItems: order.purchasedItems});
    //     order.save( (err, saveRecord) => {
    //       !err?res.json(saveRecord):res.send(err);
    //     })
    //   } catch (err) {
    //     res.send(err);
    //   }    
    // })();
    order.save( (err, saveRecord) => {
          !err?res.json(saveRecord):res.send(err);
    })
});

router.post("/status/:status", (req, res) => {
  Order.findByIdAndUpdate(req.body._id, {status: req.params.status}, {new: true}, (err, updatedRec) => {
    !err?res.json(updatedRec):res.send(err);
  })
})

router.delete("/deleteAll", (req, res) => {
  Order.deleteMany({}, (err, result) => {
    !err?res.send("Delete Success"):res.sendStatus(err);
  })
})

router.get("/all", (req,res) => {
    Order.find({})
    .populate(
      {path: "purchasedItems.product", model: "product"})
    .exec( (err, foundRecords) => {
      if (err) {
              console.log(err);
              res.send(err);
      } else {
              res.json(foundRecords);
      }
    })  
})

router.get("/confirm/:month/:year", (req, res) => {
  const month = req.params.month - 1;
  const year = req.params.year;
  const _date = new Date(`${year}-01-01T00:00:00`);
  const startDate = new Date(_date.setMonth(month));
  const endDate = new Date(_date.setMonth(month+1));
  //console.log({status: "confirmed", deliveryDate:{$gt: startDate, $lte: endDate} });
  Order.find({status: "confirm", deliveryDate:{$gt: startDate, $lte: endDate} })
  .populate(
    {path: "purchasedItems.product", model: "product"})
    .exec( (err, foundRecords) => {
      if (err) {
        console.log(err);
        res.send(err);
      } else {
        //(foundRecords.length > 0)?res.json(foundRecords):res.send("No record found!");
        res.json(foundRecords);
      }
    });
});

module.exports = router;