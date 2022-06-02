const express = require("express");
const router = express.Router();
const {createProduct, showAllProduct, showOneProduct, updateProduct, resetInventory, updateInventoryByPurchasedItems} = require("../controls/productControl");
const setupProxy = require("./setupProxy");

//setup proxy for server client connection with diff ports, added for deployment in local nginx
router.use(setupProxy);

//add new product
router.post("/new", createProduct);

//retreive all product
router.get("/all", showAllProduct);

//find product by id
router.get("/one/:id", showOneProduct)

//update product by id
router.patch("/update", updateProduct);

//reset inventory
router.patch("/resetInventory", resetInventory)

router.post("/amends" , updateInventoryByPurchasedItems)

module.exports = router;