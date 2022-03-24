const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    quantity: Number,
    purchaseDate: Date,
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product"
    },
    createDate: Date
})


const orderSchema = new mongoose.Schema({
    customer: String,
    contact: String,
    createDate: Date,
    deliveryDate: Date,
    deliveryAddress: String,
    purchasedItems: [transactionSchema]
})



module.exports = mongoose.model("order", orderSchema);