//Imports
const express = require("express");

//Internal Imports
const { authMiddleware } = require("../middlewares/auth.middleware");
const { roleMiddleware } = require("../middlewares/role.middleware");

//Internal Imports
const {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  createOrder,
  getMyOrders,
  getMyOrderById,
  cancelOrder,
} = require("../controllers/orderControllers");

const router = express.Router();
//________________________user Routes___________________
//Create Order
router.post("/create", authMiddleware, createOrder);

//Get My Orders
router.get("/my-orders", authMiddleware, getMyOrders);

// get order by Id
router.get("/my-orders/:orderId", authMiddleware, getMyOrderById);

//CancelOrder
router.put("/cancel-order/:orderId", authMiddleware, cancelOrder);
//__________________________Admin Routes__________________

//get Orders
router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin", "super_admin"),
  getAllOrders,
);

//get one order
router.get(
  "/:orderId",
  authMiddleware,
  roleMiddleware("admin", "super_admin"),
  getOrderById,
);

//update status
router.put(
  "/:orderId",
  authMiddleware,
  roleMiddleware("admin", "super_admin"),
  updateOrderStatus,
);

module.exports = router;
