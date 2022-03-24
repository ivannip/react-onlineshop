const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    inventory: Number,
    image: String,
    unitOfPackage: String
});

module.exports = mongoose.model("product", productSchema);

