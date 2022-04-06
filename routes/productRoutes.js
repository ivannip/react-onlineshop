const express = require("express");
const router = express.Router();
const Product = require("../models/product");

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

router.post("/amends" , (req, res) => {
    const {purchasedItems} = req.body;
    const _error = false
    let quantity = 0;
    purchasedItems.forEach(item => {
        quantity = parseInt(item.quantity);
        Product.findByIdAndUpdate(item.product, {$inc: {inventory: -quantity}}, (err, updated) => {
            if (err) {
                _error = true;
            }
        })
    });
    _error?res.send("inventory change failed"):res.send("update success");
})

module.exports = router;