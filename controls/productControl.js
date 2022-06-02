const Product = require("../models/product");
const conn = require("../models/connection");

exports.createProduct = (req, res) => {
    const product = new Product(req.body);
    product.save( (err, saveRecord) => {
        !err?res.json(saveRecord):res.send(err);
    })   
}

exports.showAllProduct = (req, res) => {
    Product.find({}, (err, foundRecords) => {
        if (err) {
            res.send(err);
        } else {
            (foundRecords.length > 0)?res.json(foundRecords):res.send("No record found!");
        }
    })
}

exports.showOneProduct = (req, res) => {
    const id = req.params.id;
    Product.findById(id, (err, foundRecord) => {
        if (err) {
            res.send(err);
        } else {
            foundRecord?res.json(foundRecord):res.send("No record found!");
        }
    })
}

exports.updateProduct = (req, res) => {
    const updateRecord = req.body;
    Product.findByIdAndUpdate(updateRecord._id, updateRecord, {new: true}, (err, updated) => {
        !err?res.json(updated):res.send("Update failed");
    })
}

exports.resetInventory = (req, res) => {
    Product.updateMany({}, {inventory: 120}, (err, result) => {
        !err?res.send("update success"):res.send("Update failed");
    })
}

exports.updateInventoryByPurchasedItems = async (req, res) => { 
    const {purchasedItems} = req.body;
    let resultItems = [];
    const session = await conn.startSession();
    let quantity = 0;
    let query = null;
    try {
        session.startTransaction()
        for (const item of purchasedItems) {
            quantity = parseInt(item.quantity);
            query = {_id: item.product, inventory:{$gte:quantity}};
            const doc = await Product.findOneAndUpdate(query, {$inc: {inventory: -quantity}}, {new: true, session});
            (doc !== null)?resultItems.push(doc):"";
        }
        //console.log(resultItems);
        if (resultItems.length === purchasedItems.length) {
            await session.commitTransaction();
        } else {
            await session.abortTransaction();
            resultItems = [];
        }
        session.endSession();      
    } catch (transaction_err) {
        await session.abortTransaction();
        resultItems = [];
        session.endSession();
    }
   res.json(resultItems); 
         
}
