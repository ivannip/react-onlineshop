const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const Order = require("../models/order");
const conn = require("../models/connection");
const { update } = require("../models/product");

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

//add new product
router.post("/new", (req, res) => {
    const product = new Product(req.body);
    product.save( (err, saveRecord) => {
        !err?res.json(saveRecord):res.send(err);
    })   
});

//retreive all product
router.get("/all", (req, res) => {
    Product.find({}, (err, foundRecords) => {
        if (err) {
            res.send(err);
        } else {
            (foundRecords.length > 0)?res.json(foundRecords):res.send("No record found!");
        }
    })
});

//find product by id
router.get("/one/:id", (req, res) => {
    const id = req.params.id;
    Product.findById(id, (err, foundRecord) => {
        if (err) {
            res.send(err);
        } else {
            foundRecord?res.json(foundRecord):res.send("No record found!");
        }
    })

})

//update product by id
router.patch("/update", (req, res) => {
    const updateRecord = req.body;
    Product.findByIdAndUpdate(updateRecord._id, updateRecord, {new: true}, (err, updated) => {
        !err?res.json(updated):res.send("Update failed");
    })
});

//reset inventory
router.patch("/resetInventory", (req, res) => {
    Product.updateMany({}, {inventory: 120}, (err, result) => {
        !err?res.send("update success"):res.send("Update failed");
    })
})


router.post("/amends" , async (req, res) => { 
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
             
})

module.exports = router;