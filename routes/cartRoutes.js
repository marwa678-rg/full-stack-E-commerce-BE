//Imports
const express = require("express");
const { authMiddleware } = require("../middlewares/auth.middleware");
const {
  addToCart,
  getMyCart,
  updateItemQuantity,
  removeFromCart,
  clearCart,
} = require("../controllers/cartControllers");
const router = express.Router();

//Add to Cart
router.post("/add", authMiddleware, addToCart);

//Get My Cart
router.get("/my-cart", authMiddleware, getMyCart);

//Update Cart Item Quantity
router.put("/update/:productId", authMiddleware, updateItemQuantity);

//Remove Item From Cart
router.delete("/remove/:productId", authMiddleware, removeFromCart);

//clear cart
router.delete("/clear", authMiddleware, clearCart);



module.exports = router;
