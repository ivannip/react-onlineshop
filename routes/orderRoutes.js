const express = require("express");
const {createOrder, updateOrder, deleteAllOrder, showAllOrder, showConfirmedOrder} = require("../controls/orderService");
const logger = require("../logger");
const router = express.Router();
const setupProxy = require("./setupProxy");


//setup proxy for server client connection with diff ports, added for deployment in local nginx
router.use(setupProxy);

router.post("/new", async (req, res) => {
        try {
            const {customer, contact, createDate, deliveryDate, deliveryAddress, purchasedItems} = req.body;
            const order = await createOrder({customer, contact, createDate, deliveryDate, deliveryAddress, purchasedItems})
            res.status(200).json({message: "New order created.", order: order})
        } catch (err) {
            logger.error(err)
            res.status(500).json({message: err});
        }   
    }    
);

router.post("/status/:status", async (req, res) => {
        const {_id} = req.body;
        try {
            const order = await updateOrder({_id, status: req.params.status});
            res.status(200).json({message: "order amended!", order: order});
        } catch (err) {
            logger.error(err)
            res.status(500).json({message: err})
        }
    }
);

router.delete("/deleteAll", async (req, res) => {
    try {
        await deleteAllOrder();
        res.status(200).json({message: "Delete All Success"});
    } catch (err) {
        logger.error(err);
        res.status(500).json({message: "Delete all Failed"})
    }
});

router.get("/all", async (req, res) => {
    try {
        const orders = await showAllOrder();
        res.status(200).json({message: "orders find!", orders:orders});
    } catch (err) {
        logger.error(err);
        res.status(500).json({message: err, orders: []})
    }    
});

router.get("/confirm/:month/:year", async (req, res) => {
    try {
        const orders = await showConfirmedOrder({year: req.params.year, month: req.params.month});
        res.status(200).json({message: "confirmed orders found", orders:orders});
    } catch (err) {
        logger.error(err);
        res.status(500).json({message: err, orders: []})
    }
});

module.exports = router;