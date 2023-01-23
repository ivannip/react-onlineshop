const Product = require("../models/product");
//const conn = require("../models/connection");
const { createSession } = require("../models/connection");
const logger = require("../logger");
const initData = require("../models/initData.json")

exports.createProduct = async ({name, description, price, inventory, image, unitOfPackage}) => {
    const product = new Product({name, description, price, inventory, image, unitOfPackage});
    try {
        const saveRecord = product.save()
        return saveRecord;
    } catch (err) {
        throw err
    }
}

exports.showAllProduct =  async () => {
    const foundRecords = await Product.find({});
    if (!foundRecords) {
        throw new Error("No record found!");
    } else {
        return foundRecords;
    }
}

exports.showOneProduct = async ({_id}) => {
    try {
        const foundRec = await Product.findById(_id);
        if (foundRecord) {
            return foundRecord
        } else {
            throw new Error("No record found!")
        }
    }
    catch (err) {
        throw err;
    }
}

exports.updateProduct = async ({_id, name, description, price, inventory, image, unitOfPackage}) => {
    try {
        const updateRec = await Product.findByIdAndUpdate(_id, {name, description, price, inventory, image, unitOfPackage}, {new: true})
        return updateRec;
   
    } catch (err) {
        throw err;
    }
}    

exports.resetInventory = async () => {
    try {
        await Product.deleteMany({});
        const products = initData.products;
        const savedProducts = Product.insertMany(products);
        return savedProducts;

    } catch (err) {
        console.log(err);
    }
}

exports.updateInventoryByPurchasedItems = async ({purchasedItems}) => { 
    
    let resultItems = [];
    //const session = await conn.startSession();
    const session = await createSession();
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
        logger.debug(resultItems);
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
   return resultItems; 
         
}
