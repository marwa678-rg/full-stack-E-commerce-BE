//imports
const express = require("express");
//Internal Imports
const upload = require("../utils/uploads");
const {
  createProduct,
  getAllProducts,
  deleteProduct,
  updateProduct,
  getProduct,
} = require("../controllers/productController");
const { authMiddleware } = require("../middlewares/auth.middleware");
const { roleMiddleware } = require("../middlewares/role.middleware");


const router = express.Router();

//Create product
router.post(
  "/create",
  authMiddleware,
  roleMiddleware("admin", "super_admin"),
  upload.fields([
    { name: "imageCover", maxCount: 1 },
    { name: "images", maxCount: 5 },
  ]),
  createProduct
);

//get All Products
router.get("/", getAllProducts);
//get single product
router.get("/:id", getProduct);

//update product
router.put(
  "/update/:id",
  authMiddleware,
  roleMiddleware("admin", "super_admin"),
  upload.fields([
    { name: "imageCover", maxCount: 1 },
    { name: "images", maxCount: 5 },
  ]),
  updateProduct
);
//delete Product
router.delete(
  "/delete/:id",
  authMiddleware,
  roleMiddleware("admin", "super_admin"),
  deleteProduct,
);

module.exports = router;
