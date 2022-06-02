const Order = require("../models/order")

exports.createOrder = (req, res) => {
    const order = new Order(req.body);
    order.save( (err, saveRecord) => {
          !err?res.json(saveRecord):res.send(err);
    })
}

exports.updateOrder = (req, res) => {
    Order.findByIdAndUpdate(req.body._id, {status: req.params.status}, {new: true}, (err, updatedRec) => {
      !err?res.json(updatedRec):res.send(err);
    })
}

exports.deleteAllOrder = (req, res) => {
    Order.deleteMany({}, (err, result) => {
      !err?res.send("Delete Success"):res.sendStatus(err);
    })
}

exports.showAllOrder = (req,res) => {
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
}

exports.showConfirmedOrder = (req, res) => {
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
  }