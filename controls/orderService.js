const Order = require("../models/order")
const logger = require("../logger")

exports.createOrder = async ({customer, contact, createDate, deliveryDate, deliveryAddress, purchasedItems}) => {
    logger.debug({customer, contact, createDate, deliveryDate, deliveryAddress, purchasedItems})
    const order = Order({customer, contact, createDate, deliveryDate, deliveryAddress, purchasedItems})
    try {
      const saveRecord = await order.save();
      return saveRecord; 
    } catch (err) {
      throw err
    }
}

exports.updateOrder = async ({_id, status}) => {
    logger.debug({_id, status});
    
    try {
      const updatedRec = await Order.findByIdAndUpdate(_id, {status: status}, {new: true})
        return updatedRec;
    } catch (err) {
      throw err
    }
}

exports.deleteAllOrder = async () => {
    try {
      await Order.deleteMany({})
      return "Delete Success"
    } catch (err) {
      throw err;
    }
}

exports.showAllOrder = async() => {
    try {
      const foundRecords = await Order.find({})
      .populate(
        {path: "purchasedItems.product", model: "product"})
      .exec()
      return foundRecords
    } catch (err) {
      throw err
    }

    // Order.find({})
    // .populate(
    //   {path: "purchasedItems.product", model: "product"})
    // .exec( (err, foundRecords) => {
    //   if (err) {
    //     throw err
    //   } else {
    //     return foundRecords;
    //   }
    // })  
}

exports.showConfirmedOrder = async ({month, year}) => {
    month = month - 1;
    const _date = new Date(`${year}-01-01T00:00:00`);
    const startDate = new Date(_date.setMonth(month));
    const endDate = new Date(_date.setMonth(month+1));
    logger.debug({status: "confirmed", deliveryDate:{$gt: startDate, $lte: endDate}, function: "showConfirmedOrder"});
    try {
      const foundRecords = await Order.find({status: "confirm", deliveryDate:{$gt: startDate, $lte: endDate} })
      .populate(
        {path: "purchasedItems.product", model: "product"})
        .exec()
      return foundRecords
    } catch (err) {
      throw err
    }
    // Order.find({status: "confirm", deliveryDate:{$gt: startDate, $lte: endDate} })
    // .populate(
    //   {path: "purchasedItems.product", model: "product"})
    //   .exec( (err, foundRecords) => {
    //     if (err) {
    //       throw err;
    //     } else {
    //       return foundRecords;
    //     }
    //   });
  }