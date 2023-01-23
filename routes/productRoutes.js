const express = require("express");
const router = express.Router();
const {createProduct, showAllProduct, showOneProduct, updateProduct, resetInventory, updateInventoryByPurchasedItems} = require("../controls/productService");
const logger = require("../logger");
const setupProxy = require("./setupProxy");

//setup proxy for server client connection with diff ports, added for deployment in local nginx
router.use(setupProxy);

//add new product
router.post("/new", async (req, res) => {
    const {name, description, price, inventory, image, unitOfPackage} = req.body;
    logger.debug({name, description, price, inventory, image, unitOfPackage})
    try {
        const product = await createProduct({name, description, price, inventory, image, unitOfPackage})
        res.status(200).json({message: "record created.", product:product});
    } catch (err) {
        logger.error(err);
        res.status(500).json({message: err});
    }   
});

//retreive all product
router.get("/all", async (req, res) => {
    try {
        const products = await showAllProduct();
        logger.debug({message: "records found!", products: products});
        res.status(200).json({message: "records found!", products: products});
    } catch (err) {
        logger.error(err);
        res.status(500).json({err:err, products: []});
    }
});

//find product by id
router.get("/one/:id", async (req, res) => {
    try {
        const product = await showOneProduct({_id: req.params.id});
        res.status(200).json({message:"record found.", product:product});
    } catch (err) {
        logger.error(err);
        res.status(500).json({message: err});
    }
})

//update product by id
router.patch("/update", async (req, res) => {
    const {_id, name, description, price, inventory, image, unitOfPackage} = req.body;
    logger.debug({_id, name, description, price, inventory, image, unitOfPackage});
    try {
        const product = await updateProduct({_id, name, description, price, inventory, image, unitOfPackage});
        res.status(200).json({message: "record updated.", product:product});
    } catch (err) {
        logger.error(err);
        res.status(500).json({message: err});
    }
});

//reset inventory
router.patch("/resetInventory", async (req, res) => {
    try {
        await resetInventory();
        res.status(200).json({message: "inventory reset"});
    } catch (err) {
        logger.error(err);
        res.status(500).json({message: err});
    }
})

router.post("/amends" , async (req, res) => {
    const {purchasedItems} = req.body;
    try {
        const products = await updateInventoryByPurchasedItems({purchasedItems});
        res.status(200).json({message: "Records are amended.", products: products});
    } catch (err) {
        logger.error(err);
        res.status(500).json({message: err});
    }
    
})

module.exports = router;