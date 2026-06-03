//imports
const express = require("express");
const { createProduct, getAllProducts, deleteProduct, updateProduct, getProduct } = require("../controllers/productController");
const { authMiddleware } = require("../middlewares/auth.middleware");
const { roleMiddleware } = require("../middlewares/role.middleware");

//Internal Imports

const router = express.Router();


//Create product
router.post("/create",authMiddleware,roleMiddleware("admin","super_admin"),createProduct)

//get All Products
router.get("/",getAllProducts)
//get single product
router.get("/:id",getProduct)

//update product
router.put("/update/:id",authMiddleware,roleMiddleware("admin","super_admin"),updateProduct);
//delete Product
router.delete("/delete/:id",authMiddleware,roleMiddleware("admin","super_admin"),deleteProduct)



module.exports = router;
