const {expect} = require("chai");
const {createProduct} = require("../controls/productService");
const data = require("./data.json")
const {connectDB} = require("../models/connection");

(
  async () => {
    try {
      await connectDB();

    } catch (err) {
      console.log(err);
    }
  } 

) ();

describe("Product Service Unit Tests", () => {
  describe("Save Product functionality", () => {
    it("should successfully add product in the data", async () => {
        var product = await createProduct(data["test case 1"])
        console.log(product)
        expect(product.name).to.equal(data["test case 1"].name)
    });
  });
});



